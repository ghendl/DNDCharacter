
import {
  ABILITIES, ABILITY_LABELS, ARMOR, BACKGROUNDS, CLASSES, EQUIPMENT_PACKS, FEATS,
  LANGUAGES, ORIGIN_FEATS, SKILLS, SPECIES, SPELLS, TOOLS, WEAPONS
} from './data/gameData.js';
import { CLASS_ICONS, SPECIES_ICONS, SUBCLASS_LIBRARY } from './data/subclassLibrary.js';
import { hasSupabaseConfig, supabase } from './lib/supabase.js';
import {
  abilityOptions, classFeaturesUntil, clamp, computeBonuses, defaultCharacter, deriveAbilities,
  escapeHtml, featureText, maxSpellLevel, mod, signed, skillAbility, skillLabel, slugify,
  summarize, totalPointBuy, uid
} from './lib/utils.js';

const app = document.querySelector('#app');
const state = {
  session: null,
  characters: [],
  currentId: null,
  currentTab: 'builder',
  form: defaultCharacter(),
  filters: { search: '', spellSearch: '', equipmentSearch: '', weaponSearch: '', subclassSearch: '' },
  loading: true,
  toast: '',
  publicView: null,
  mobileMenuOpen: false,
  currentSection: 'identity',
  mode: 'home',
  authEmail: '',
};

const PUBLIC_ID = new URLSearchParams(window.location.search).get('public');

const focusKeys = ['id','data-field','data-base','data-priority','data-array','data-pick-field'];

function captureFocusState() {
  const active = document.activeElement;
  if (!active || !app.contains(active)) return null;
  const state = {
    tag: active.tagName,
    value: active.value,
    selectionStart: typeof active.selectionStart === 'number' ? active.selectionStart : null,
    selectionEnd: typeof active.selectionEnd === 'number' ? active.selectionEnd : null,
  };
  for (const key of focusKeys) {
    const attr = key === 'id' ? active.id : active.getAttribute(key);
    if (attr) {
      state.selector = key === 'id' ? `#${attr}` : `[${key}="${attr}"]`;
      break;
    }
  }
  return state.selector ? state : null;
}

function restoreFocusState(focusState) {
  if (!focusState?.selector) return;
  const next = app.querySelector(focusState.selector);
  if (!next) return;
  next.focus({ preventScroll: true });
  if (focusState.selectionStart != null && typeof next.setSelectionRange === 'function') {
    next.setSelectionRange(focusState.selectionStart, focusState.selectionEnd ?? focusState.selectionStart);
  }
}

const BUILDER_SECTIONS = [
  ['identity', 'Identidad', '🧙'],
  ['origin', 'Origen', '🌟'],
  ['abilities', 'Stats', '📊'],
  ['training', 'Skills', '🎓'],
  ['combat', 'Combate', '⚔️'],
  ['magic', 'Magia', '✨'],
  ['review', 'Revisión', '📜'],
];

const RANDOM_NAME_PARTS = {
  first: ['Aelar', 'Kael', 'Mira', 'Thoren', 'Liora', 'Vex', 'Seren', 'Dorian', 'Nyx', 'Brom', 'Ilya', 'Cassian'],
  last: ['Stormborn', 'Valewood', 'Ironroot', 'Nightbloom', 'Ashfall', 'Ravencrest', 'Dawnriver', 'Blackthorn', 'Embermark', 'Silverfen'],
};

function randomChoice(list = []) {
  return list[Math.floor(Math.random() * list.length)];
}
function randomSubset(list = [], count = 1) {
  const pool = [...list];
  const out = [];
  while (pool.length && out.length < count) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}
function randomName() {
  return `${randomChoice(RANDOM_NAME_PARTS.first)} ${randomChoice(RANDOM_NAME_PARTS.last)}`;
}
function randomAbilityMethod() {
  return Math.random() > 0.55 ? 'standard' : 'manual';
}
function randomAbilities() {
  const values = [15,14,13,12,10,8].sort(() => Math.random() - 0.5);
  return { str: values[0], dex: values[1], con: values[2], int: values[3], wis: values[4], cha: values[5] };
}
function generateRandomCharacter() {
  const cls = randomChoice(CLASSES);
  const species = randomChoice(SPECIES);
  const bg = randomChoice(BACKGROUNDS);
  const method = randomAbilityMethod();
  const baseAbilities = method === 'manual' ? randomAbilities() : defaultCharacter().baseAbilities;
  const pattern = Math.random() > 0.5 ? '+2/+1' : '+1/+1/+1';
  const priorities = randomSubset(bg.abilities, pattern === '+1/+1/+1' ? 3 : 2);
  const bonusAbilities = computeBonuses(pattern, priorities);
  const derivedAbilities = deriveAbilities(baseAbilities, bonusAbilities);
  const subclass = randomChoice(cls.subclasses)?.name || cls.subclasses?.[0]?.name || '';
  const classSkills = randomSubset(cls.skillChoices.from.filter(s => !(bg.skills || []).includes(s)), cls.skillChoices.count);
  const weapons = randomSubset(WEAPONS.filter(w => cls.weaponProficiencies.includes(w.category) || cls.weaponProficiencies.includes('Simple') || cls.weaponProficiencies.includes('Martial')).map(w => w.name), Math.min(3, cls.weaponMastery ? 3 : 2));
  const weaponMasteries = randomSubset(Array.from(new Set(weapons.map(name => WEAPONS.find(w => w.name === name)?.mastery).filter(Boolean))), Math.max(1, cls.weaponMastery || 1)).slice(0, cls.weaponMastery || 0);
  const spells = cls.casterType === 'none' ? [] : randomSubset(SPELLS.filter(sp => sp.classes.includes(cls.id) && sp.level <= Math.max(1, maxSpellLevel(cls, 3))).map(sp => sp.name), 6);
  const armorOptions = ARMOR.filter(a => !a.shield);
  const armor = randomChoice(armorOptions.filter(a => {
    if (cls.armorProficiencies.includes('Heavy')) return true;
    if (cls.armorProficiencies.includes('Medium')) return ['Light','Medium','None'].includes(a.type);
    if (cls.armorProficiencies.includes('Light')) return ['Light','None'].includes(a.type);
    return a.type === 'None';
  }))?.name || 'Leather Armor';

  state.currentId = null;
  state.currentSection = 'identity';
  state.form = defaultCharacter({
    name: randomName(),
    playerName: '',
    campaign: '',
    level: Math.ceil(Math.random() * 5),
    speciesId: species.id,
    classId: cls.id,
    subclass,
    backgroundId: bg.id,
    abilityMethod: method,
    originPattern: pattern,
    asiPriority: priorities,
    baseAbilities,
    bonusAbilities,
    derivedAbilities,
    feat: bg.feat,
    languages: Array.from(new Set([...(species.languages || []), ...randomSubset(LANGUAGES, 1)])).slice(0, 4),
    skills: [...new Set([...(bg.skills || []), ...classSkills])],
    tools: [...new Set([...(bg.tools || []), ...randomSubset(TOOLS, 1)])],
    armor,
    hasShield: cls.armorProficiencies.includes('Shield') && Math.random() > 0.5,
    weapons,
    weaponMasteries,
    equipment: [...new Set([...(cls.equipment || []), ...(bg.equipment || []), ...randomSubset(EQUIPMENT_PACKS, 1)])],
    spells,
    notes: 'Generado aleatoriamente. Ajustalo y terminalo a tu gusto.',
  });
  recalcForm();
  state.mode = 'wizard';
  state.currentTab = 'summary';
  render();
}


function currentClass() {
  return CLASSES.find(c => c.id === state.form.classId) || CLASSES[0];
}
function currentBackground() {
  return BACKGROUNDS.find(b => b.id === state.form.backgroundId) || BACKGROUNDS[0];
}
function currentSpecies() {
  return SPECIES.find(s => s.id === state.form.speciesId) || SPECIES[0];
}
function currentArmorDef() {
  return ARMOR.find(a => a.name === state.form.armor) || ARMOR[0];
}
function currentSummary() {
  return summarize(state.form, {
    classDef: currentClass(),
    species: currentSpecies(),
    background: currentBackground(),
    armorDef: currentArmorDef(),
  });
}
function selectedSubclass() {
  return SUBCLASS_LIBRARY[state.form.subclass] || clsSubclasses().find(s => s.name === state.form.subclass) || null;
}
function clsSubclasses() {
  return currentClass().subclasses || [];
}
function classIcon(classId = state.form.classId) { return CLASS_ICONS[classId] || '⚔️'; }
function speciesIcon(speciesId = state.form.speciesId) { return SPECIES_ICONS[speciesId] || '🧬'; }
function currentSectionIndex() { return Math.max(0, BUILDER_SECTIONS.findIndex(([id]) => id === state.currentSection)); }
function setSection(sectionId) { state.currentSection = sectionId; render(); }
function toast(message) {
  state.toast = message;
  render();
  setTimeout(() => { if (state.toast === message) { state.toast = ''; render(); } }, 2200);
}


function authStatus() {
  if (!hasSupabaseConfig) {
    return {
      kind: 'warn',
      title: 'Configurá Supabase',
      text: 'Falta conectar Project URL + Publishable Key para guardar online.',
      cta: 'Configuración requerida',
    };
  }
  if (!state.session) {
    return {
      kind: 'info',
      title: 'Iniciá sesión',
      text: 'El login por magic link ya está listo. Entrá para sincronizar y compartir personajes.',
      cta: 'Listo para login',
    };
  }
  return {
    kind: 'ok',
    title: 'Sincronización activa',
    text: 'Tus personajes se guardan online y podés abrirlos desde cualquier dispositivo.',
    cta: 'Cloud OK',
  };
}

function recalcForm() {
  const bg = currentBackground();
  const classDef = currentClass();
  const priorities = state.form.originPattern === '+1/+1/+1'
    ? [...new Set(state.form.asiPriority.filter(a => bg.abilities.includes(a)))].slice(0, 3)
    : [...new Set(state.form.asiPriority.filter(a => bg.abilities.includes(a)))].slice(0, 2);

  if (priorities.length < 2) priorities.push(...bg.abilities.filter(a => !priorities.includes(a)));
  if (state.form.originPattern === '+1/+1/+1' && priorities.length < 3) priorities.push(...bg.abilities.filter(a => !priorities.includes(a)));

  state.form.asiPriority = priorities;
  state.form.bonusAbilities = computeBonuses(state.form.originPattern, priorities);
  state.form.derivedAbilities = deriveAbilities(state.form.baseAbilities, state.form.bonusAbilities);
  state.form.subclass = classDef.subclasses.some(s => s.name === state.form.subclass) ? state.form.subclass : classDef.subclasses[0].name;
  state.form.feat = state.form.feat || bg.feat;
  state.form.languages = Array.from(new Set([...(currentSpecies().languages || []), ...(state.form.languages || [])])).slice(0, 3);
  const allowedMasteries = uniqueMasteries();
  state.form.weaponMasteries = state.form.weaponMasteries.filter(m => allowedMasteries.includes(m)).slice(0, classDef.weaponMastery);
}

function uniqueMasteries() {
  return Array.from(new Set(state.form.weapons
    .map(name => WEAPONS.find(w => w.name === name)?.mastery)
    .filter(Boolean)));
}

async function boot() {
  if (PUBLIC_ID && hasSupabaseConfig) {
    await loadPublicCharacter(PUBLIC_ID);
  }
  if (hasSupabaseConfig) {
    const { data } = await supabase.auth.getSession();
    state.session = data.session;
    supabase.auth.onAuthStateChange((_event, session) => {
      state.session = session;
      if (session) loadCharacters();
      render();
    });
    if (state.session) await loadCharacters();
  }
  state.loading = false;
  render();
}

async function loadPublicCharacter(publicId) {
  const { data, error } = await supabase.from('characters_public')
    .select('*')
    .eq('public_id', publicId)
    .maybeSingle();
  if (!error && data) {
    state.publicView = { ...data.data, name: data.name, public_id: data.public_id };
  }
}

async function loadCharacters() {
  if (!state.session || !hasSupabaseConfig) return;
  const { data, error } = await supabase
    .from('characters')
    .select('id, public_id, is_public, name, data, updated_at')
    .order('updated_at', { ascending: false });
  if (error) {
    toast('No pude cargar tus personajes');
    return;
  }
  state.characters = (data || []).map(row => ({
    id: row.id,
    public_id: row.public_id,
    is_public: row.is_public,
    name: row.name,
    updated_at: row.updated_at,
    ...row.data,
  }));
  if (!state.currentId && state.characters[0]) openCharacter(state.characters[0].id);
  if (!state.characters.length) {
    state.form = defaultCharacter();
    state.currentId = null;
  }
  render();
}

function openCharacter(id) {
  state.mobileMenuOpen = false;
  const found = state.characters.find(c => c.id === id);
  if (!found) return;
  state.currentId = id;
  state.currentSection = 'identity';
  state.mode = 'sheet';
  state.form = defaultCharacter(found);
  recalcForm();
  render();
}

function copyCharacter() {
  state.mobileMenuOpen = false;
  state.currentSection = 'identity';
  state.mode = 'wizard';
  const duplicate = defaultCharacter({
    ...structuredClone(state.form),
    id: null,
    public_id: '',
    name: `${state.form.name} copia`,
  });
  state.form = duplicate;
  state.currentId = null;
  render();
}

async function saveCharacter() {
  if (!hasSupabaseConfig) {
    toast('Falta configurar Supabase');
    return;
  }
  if (!state.session) {
    toast('Iniciá sesión para guardar online');
    return;
  }
  recalcForm();
  const payload = structuredClone(state.form);
  const publicId = payload.public_id || `${slugify(payload.name)}-${uid()}`;
  const row = {
    user_id: state.session.user.id,
    public_id: publicId,
    is_public: Boolean(payload.is_public),
    name: payload.name || 'Sin nombre',
    data: payload,
  };
  let query;
  if (state.currentId) {
    query = supabase.from('characters').update(row).eq('id', state.currentId).select('id').single();
  } else {
    query = supabase.from('characters').insert(row).select('id').single();
  }
  const { data, error } = await query;
  if (error) {
    toast('No se pudo guardar');
    return;
  }
  if (!state.currentId) state.currentId = data.id;
  state.form.public_id = publicId;
  state.mode = 'sheet';
  toast('Guardado');
  await loadCharacters();
}

async function deleteCharacter() {
  if (!state.currentId || !hasSupabaseConfig) return;
  const ok = window.confirm(`¿Borrar ${state.form.name}?`);
  if (!ok) return;
  const { error } = await supabase.from('characters').delete().eq('id', state.currentId);
  if (error) return toast('No se pudo borrar');
  state.currentId = null;
  state.mode = 'home';
  state.form = defaultCharacter();
  await loadCharacters();
  toast('Borrado');
}

async function sendMagicLink(email) {
  if (!email || !hasSupabaseConfig) return;
  const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);
  const safeOrigin = isLocal ? '' : `${window.location.origin}${window.location.pathname}`;
  const envSite = window.__DND_ENV__?.SITE_URL || '';
  const redirectTo = safeOrigin || envSite || undefined;
  const { error } = await supabase.auth.signInWithOtp({ email, options: redirectTo ? { emailRedirectTo: redirectTo } : {} });
  toast(error ? 'No pude enviar el link' : 'Magic link enviado');
}

async function logout() {
  await supabase.auth.signOut();
  state.characters = [];
  state.currentId = null;
  state.mode = 'home';
  state.form = defaultCharacter();
  render();
}

function updateField(id, value) {
  if (id === 'level') value = clamp(value, 1, 20);
  if (id === 'speciesId') {
    state.form.speciesId = value;
    state.form.languages = Array.from(new Set([...(SPECIES.find(s => s.id === value)?.languages || []), ...state.form.languages])).slice(0, 3);
  } else if (id in state.form) {
    state.form[id] = value;
  }
  recalcForm();
  render();
}

function toggleFromArray(field, value, checked, limit = Infinity) {
  const current = new Set(state.form[field] || []);
  if (checked) current.add(value);
  else current.delete(value);
  let next = Array.from(current);
  if (next.length > limit) next = next.slice(0, limit);
  state.form[field] = next;
  recalcForm();
  render();
}

function activeSkillLimit() {
  return currentClass().skillChoices.count;
}

function activeSkillPool() {
  const cls = currentClass();
  const bgSkills = currentBackground().skills || [];
  const base = new Set(bgSkills);
  const classSkillChoices = cls.skillChoices.from.filter(s => !base.has(s));
  return { classSkillChoices, bgSkills };
}

function applySuggestedSkills() {
  const { bgSkills, classSkillChoices } = activeSkillPool();
  state.form.skills = [...new Set([...bgSkills, ...classSkillChoices.slice(0, activeSkillLimit())])];
  render();
}

function filteredSpells() {
  const cls = currentClass();
  const maxLevel = maxSpellLevel(cls, state.form.level);
  if (cls.casterType === 'none') return [];
  const search = (state.filters.spellSearch || '').toLowerCase();
  return SPELLS.filter(spell => spell.classes.includes(cls.id) && spell.level <= maxLevel)
    .filter(spell => !search || `${spell.name} ${spell.school} ${spell.level}`.toLowerCase().includes(search));
}
function filteredWeapons() {
  const search = (state.filters.weaponSearch || '').toLowerCase();
  return WEAPONS.filter(w => !search || `${w.name} ${w.damage} ${w.mastery} ${w.properties}`.toLowerCase().includes(search));
}
function filteredEquipment() {
  const search = (state.filters.equipmentSearch || '').toLowerCase();
  return EQUIPMENT_PACKS.concat(currentBackground().equipment || [], currentClass().equipment || [])
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .filter(item => !search || item.toLowerCase().includes(search));
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state.form, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${slugify(state.form.name || 'personaje')}.json`; a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state.form = defaultCharacter(parsed);
      state.currentId = parsed.id || null;
      state.mode = 'sheet';
      recalcForm();
      render();
      toast('Importado');
    } catch {
      toast('JSON inválido');
    }
  };
  reader.readAsText(file);
}

function printSheet() {
  window.print();
}

async function shareLink() {
  if (!state.form.public_id) {
    await saveCharacter();
  }
  if (!state.form.is_public) {
    state.form.is_public = true;
    await saveCharacter();
  }
  const url = `${window.location.origin}${window.location.pathname}?public=${state.form.public_id}`;
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copiado');
  } catch {
    window.prompt('Copiá este link', url);
  }
}

function abilityCell(key) {
  return `<label class="mini-field">
    <span>${ABILITY_LABELS[key]}</span>
    <input data-base="${key}" type="number" min="8" max="15" value="${state.form.baseAbilities[key]}" />
  </label>`;
}

function selectField(id, label, options, value, useId = true) {
  return `<label>${label}
    <select data-field="${id}">
      ${options.map(option => {
        const val = useId ? option.id : option;
        const text = useId ? option.name : option;
        return `<option value="${escapeHtml(val)}" ${val === value ? 'selected' : ''}>${escapeHtml(text)}</option>`;
      }).join('')}
    </select>
  </label>`;
}

function checkboxGroup(field, label, values, selected, limit = Infinity, hint = '') {
  return `<div class="chooser">
    <div class="chooser-head">
      <strong>${label}</strong>
      ${hint ? `<span class="muted">${hint}</span>` : ''}
    </div>
    <div class="check-grid">
      ${values.map(item => {
        const value = item.value ?? item;
        const text = item.label ?? item;
        return `<label class="check-pill">
          <input type="checkbox" data-array="${field}" value="${escapeHtml(value)}" ${selected.includes(value) ? 'checked' : ''} data-limit="${limit}" />
          <span>${escapeHtml(text)}</span>
        </label>`;
      }).join('')}
    </div>
  </div>`;
}

function abilityPrioritySelect(index, allowed, value) {
  return `<select data-priority="${index}">
    ${allowed.map(key => `<option value="${key}" ${key === value ? 'selected' : ''}>${ABILITY_LABELS[key]}</option>`).join('')}
  </select>`;
}

function renderBuilder() {
  const cls = currentClass();
  const bg = currentBackground();
  const species = currentSpecies();
  const summary = currentSummary();
  const subclassData = selectedSubclass();
  const { bgSkills, classSkillChoices } = activeSkillPool();
  const classSkillSelected = state.form.skills.filter(s => classSkillChoices.includes(s));
  const maxMasteries = cls.weaponMastery;
  const masteryChoices = uniqueMasteries();
  const spells = filteredSpells();
  const weapons = filteredWeapons();
  const equipment = filteredEquipment();
  const currentStep = currentSectionIndex();
  const totalSteps = BUILDER_SECTIONS.length;
  const subclassOptions = cls.subclasses.filter(s => {
    const search = (state.filters.subclassSearch || '').toLowerCase();
    if (!search) return true;
    return `${s.name} ${s.summary || ''}`.toLowerCase().includes(search);
  });

  function renderStepInner() {
    switch (state.currentSection) {
      case 'identity':
        return `
          <section class="card parchment wizard-cover">
            <div class="cover-art">${classIcon()}${speciesIcon()}</div>
            <div>
              <div class="eyebrow">${escapeHtml(species.name)} · ${escapeHtml(cls.name)} · ${escapeHtml(bg.name)}</div>
              <h2>${escapeHtml(state.form.name || 'Nuevo personaje')}</h2>
              <p class="muted">${escapeHtml(species.summary)}</p>
              <div class="pill-row wizard-pills">
                <span class="pill">CA ${summary.ac}</span>
                <span class="pill">HP ${summary.hp}</span>
                <span class="pill">PB +${summary.pb}</span>
                <span class="pill">Ini ${signed(summary.initiative)}</span>
                <span class="pill">PP ${summary.passivePerception}</span>
                ${summary.spellcasting ? `<span class="pill">DC ${summary.spellcasting.saveDC}</span>` : ''}
              </div>
            </div>
          </section>
          <section class="card stack wizard-step-card">
            <div class="wizard-headline">
              <div>
                <div class="eyebrow">Paso 1</div>
                <h3>Identidad del aventurero</h3>
              </div>
              <span class="status-chip info">Base del personaje</span>
            </div>
            <div class="grid-3">
              <label>Nombre<input data-field="name" value="${escapeHtml(state.form.name)}" /></label>
              <label>Jugador<input data-field="playerName" value="${escapeHtml(state.form.playerName)}" /></label>
              <label>Campaña<input data-field="campaign" value="${escapeHtml(state.form.campaign)}" /></label>
              <label>Nivel<input data-field="level" type="number" min="1" max="20" value="${state.form.level}" /></label>
              ${selectField('speciesId', 'Species', SPECIES, state.form.speciesId)}
              ${selectField('classId', 'Clase', CLASSES, state.form.classId)}
              ${selectField('backgroundId', 'Background', BACKGROUNDS, state.form.backgroundId)}
              <label>Alineamiento<input data-field="alignment" value="${escapeHtml(state.form.alignment)}" /></label>
              <label>Retrato URL<input data-field="portraitUrl" placeholder="https://..." value="${escapeHtml(state.form.portraitUrl || '')}" /></label>
            </div>
            <div class="icon-picks-grid">
              ${SPECIES.map(s => `<button type="button" class="choice-tile ${state.form.speciesId === s.id ? 'active' : ''}" data-pick-field="speciesId" data-pick-value="${escapeHtml(s.id)}"><span>${speciesIcon(s.id)}</span><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.summary)}</small></button>`).join('')}
            </div>
            <div class="icon-picks-grid compact">
              ${CLASSES.map(c => `<button type="button" class="choice-tile ${state.form.classId === c.id ? 'active' : ''}" data-pick-field="classId" data-pick-value="${escapeHtml(c.id)}"><span>${classIcon(c.id)}</span><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml((c.subclasses || []).slice(0,2).map(s => s.name).join(' · '))}</small></button>`).join('')}
            </div>
            <label>Notas<textarea data-field="notes">${escapeHtml(state.form.notes)}</textarea></label>
            <div class="wizard-headline push-top">
              <div>
                <div class="eyebrow">Subclase</div>
                <h3>Elegila visualmente</h3>
              </div>
              <span class="status-chip ok">${cls.subclasses.length} opciones</span>
            </div>
            <input id="subclass-search" placeholder="Buscar subclase" value="${escapeHtml(state.filters.subclassSearch)}" />
            <div class="subclass-grid">
              ${subclassOptions.map(s => `<button type="button" class="subclass-card ${state.form.subclass === s.name ? 'active' : ''}" data-pick-field="subclass" data-pick-value="${escapeHtml(s.name)}"><div class="subclass-icon">${classIcon()}</div><div><strong>${escapeHtml(s.name)}</strong><p>${escapeHtml((SUBCLASS_LIBRARY[s.name]?.summary || s.summary || ''))}</p></div></button>`).join('') || '<p class="muted">No hay subclases que coincidan.</p>'}
            </div>
            ${subclassData ? `<div class="callout info"><strong>${escapeHtml(subclassData.name || state.form.subclass)}</strong><p>${escapeHtml(subclassData.summary || 'Subclase activa.')}</p></div>` : ''}
          </section>`;
      case 'origin':
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 2</div><h3>Origen, species y feat</h3></div><span class="status-chip ok">Regla 2024</span></div>
            <div class="grid-2">
              <div class="callout">
                <strong>${escapeHtml(bg.name)}</strong>
                <p>${escapeHtml(bg.summary)}</p>
                <p><strong>Feat de origen:</strong> ${escapeHtml(bg.feat)}</p>
                <p><strong>Skills:</strong> ${bg.skills.map(s => skillLabel[s] || s).join(', ')}</p>
                <p><strong>Tools:</strong> ${bg.tools.join(', ')}</p>
              </div>
              <div class="callout">
                <strong>${speciesIcon()} ${escapeHtml(species.name)}</strong>
                <p><strong>Tamaño:</strong> ${species.size} · <strong>Velocidad:</strong> ${species.speed} ft</p>
                <p><strong>Idiomas:</strong> ${species.languages.join(', ')}</p>
                <p><strong>Rasgos:</strong> ${species.traits.join(', ')}</p>
              </div>
            </div>
            <div class="grid-3">
              <label>Patrón ASI
                <select data-field="originPattern">
                  <option value="+2/+1" ${state.form.originPattern === '+2/+1' ? 'selected' : ''}>+2 / +1</option>
                  <option value="+1/+1/+1" ${state.form.originPattern === '+1/+1/+1' ? 'selected' : ''}>+1 / +1 / +1</option>
                </select>
              </label>
              <label>Prioridad 1 ${abilityPrioritySelect(0, bg.abilities, state.form.asiPriority[0] || bg.abilities[0])}</label>
              <label>Prioridad 2 ${abilityPrioritySelect(1, bg.abilities, state.form.asiPriority[1] || bg.abilities[1])}</label>
              ${state.form.originPattern === '+1/+1/+1' ? `<label>Prioridad 3 ${abilityPrioritySelect(2, bg.abilities, state.form.asiPriority[2] || bg.abilities[2])}</label>` : ''}
              <label>Feat actual
                <select data-field="feat">
                  ${FEATS.map(feat => `<option value="${escapeHtml(feat)}" ${feat === state.form.feat ? 'selected' : ''}>${escapeHtml(feat)}</option>`).join('')}
                </select>
              </label>
            </div>
            <div class="banner ok">El background define los aumentos de característica. Las species aportan rasgos, idiomas y movimiento.</div>
          </section>`;
      case 'abilities':
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 3</div><h3>Atributos y saves</h3></div><span class="status-chip info">${totalPointBuy(state.form.baseAbilities)}/27 PB</span></div>
            <div class="row wrap gap-sm">
              ${['standard', 'manual'].map(method => `
                <label class="radio-pill">
                  <input type="radio" name="abilityMethod" value="${method}" ${state.form.abilityMethod === method ? 'checked' : ''} />
                  <span>${method === 'standard' ? 'Standard Array' : 'Manual'}</span>
                </label>`).join('')}
            </div>
            <div class="abilities-grid wizard-abilities-grid">${ABILITIES.map(a => abilityCell(a.key)).join('')}</div>
            <div class="summary-grid compact-summary-grid">
              ${ABILITIES.map(a => `<div class="summary-stat"><span>${a.label}</span><strong>${state.form.derivedAbilities[a.key]}</strong><small>${signed(mod(state.form.derivedAbilities[a.key]))} · Save ${signed(summary.saves[a.key])}</small></div>`).join('')}
            </div>
            <div class="table-wrap">
              <table class="sheet-table"><thead><tr><th>Atributo</th><th>Base</th><th>Bonus</th><th>Total</th><th>Mod</th><th>Save</th></tr></thead><tbody>
                ${ABILITIES.map(a => `<tr><td data-label="Atributo">${a.label}</td><td data-label="Base">${state.form.baseAbilities[a.key]}</td><td data-label="Bonus">${signed(state.form.bonusAbilities[a.key])}</td><td data-label="Total">${state.form.derivedAbilities[a.key]}</td><td data-label="Mod">${signed(mod(state.form.derivedAbilities[a.key]))}</td><td data-label="Save">${signed(summary.saves[a.key])}</td></tr>`).join('')}
              </tbody></table>
            </div>
          </section>`;
      case 'training':
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 4</div><h3>Skills, tools e idiomas</h3></div><button data-action="suggest-skills" class="ghost">Autocompletar</button></div>
            <div class="grid-2">
              <div class="callout"><strong>Skills del background</strong><p>${bgSkills.map(s => skillLabel[s] || s).join(', ')}</p></div>
              <div class="callout"><strong>Skills de clase</strong><p>Elegí ${cls.skillChoices.count} de ${cls.skillChoices.from.map(s => skillLabel[s] || s).join(', ')}</p></div>
            </div>
            ${checkboxGroup('skills', `Skills de clase (${classSkillSelected.length}/${cls.skillChoices.count})`, classSkillChoices.map(s => ({ value: s, label: skillLabel[s] || s })), classSkillSelected, cls.skillChoices.count)}
            ${checkboxGroup('tools', 'Tools', Array.from(new Set([...bg.tools, ...TOOLS])).map(t => ({ value: t, label: t })), state.form.tools, 8)}
            ${checkboxGroup('languages', 'Idiomas adicionales', LANGUAGES, state.form.languages, 4, 'La species ya aporta idiomas base')}
          </section>`;
      case 'combat':
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 5</div><h3>Armas, armadura y equipo</h3></div><span class="status-chip info">Masteries ${state.form.weaponMasteries.length}/${maxMasteries}</span></div>
            <div class="grid-3">
              <label>Armadura
                <select data-field="armor">${ARMOR.filter(a => !a.shield).map(a => `<option value="${escapeHtml(a.name)}" ${a.name === state.form.armor ? 'selected' : ''}>${escapeHtml(a.name)} (${a.baseAC})</option>`).join('')}</select>
              </label>
              <label class="toggle"><input id="hasShield" type="checkbox" ${state.form.hasShield ? 'checked' : ''} /> Escudo equipado</label>
              <div class="callout compact"><strong>Weapon Mastery</strong><p>${cls.weaponMastery ? `Podés preparar ${cls.weaponMastery}` : 'Esta clase no gana mastery inicial.'}</p></div>
            </div>
            <input id="weapon-search" placeholder="Buscar armas por nombre, daño o mastery" value="${escapeHtml(state.filters.weaponSearch)}" />
            ${checkboxGroup('weapons', 'Armas', weapons.map(w => ({ value: w.name, label: `${w.name} · ${w.damage} · ${w.mastery}` })), state.form.weapons, 8)}
            ${checkboxGroup('weaponMasteries', `Masteries activas (${state.form.weaponMasteries.length}/${maxMasteries})`, masteryChoices, state.form.weaponMasteries, maxMasteries)}
            <input id="equipment-search" placeholder="Buscar equipo" value="${escapeHtml(state.filters.equipmentSearch)}" />
            ${checkboxGroup('equipment', 'Equipo', equipment.map(e => ({ value: e, label: e })), state.form.equipment, 12)}
          </section>`;
      case 'magic':
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 6</div><h3>Magia y preparación</h3></div>${currentClass().casterType === 'none' ? '<span class="status-chip warn">No caster</span>' : `<span class="status-chip ok">Caster ${ABILITY_LABELS[currentClass().spellAbility]}</span>`}</div>
            ${currentClass().casterType === 'none' ? `<div class="callout"><strong>${escapeHtml(cls.name)}</strong><p>Esta clase no usa spellcasting base. Podés seguir con Combate o Revisión.</p></div>` : `
              <div class="grid-3">
                <div class="callout compact"><strong>Habilidad</strong><p>${ABILITY_LABELS[currentClass().spellAbility]}</p></div>
                <div class="callout compact"><strong>Spell Attack</strong><p>${signed(summary.spellcasting.attackBonus)}</p></div>
                <div class="callout compact"><strong>Spell Save DC</strong><p>${summary.spellcasting.saveDC}</p></div>
              </div>
              ${summary.spellcasting.pactSlots ? `<div class="banner ok">Pact Magic: ${summary.spellcasting.pactSlots} slot(s) de nivel ${summary.spellcasting.pactLevel}</div>` : `<div class="banner ok">Slots: ${summary.spellcasting.slots.map((count, i) => count ? `${i + 1}º:${count}` : '').filter(Boolean).join(' · ') || 'Sin slots'}</div>`}
              <p class="muted">Preparación: ${escapeHtml(summary.spellcasting.prepared)}</p>
              <input id="spell-search" placeholder="Buscar conjuros por nombre, escuela o nivel" value="${escapeHtml(state.filters.spellSearch)}" />
              ${checkboxGroup('spells', `Spells disponibles hasta nivel ${maxSpellLevel(currentClass(), state.form.level)}`, spells.map(sp => ({ value: sp.name, label: `${sp.name} · lvl ${sp.level} · ${sp.school}` })), state.form.spells, 24)}
            `}
          </section>`;
      case 'review':
      default:
        return `
          <section class="card stack wizard-step-card">
            <div class="wizard-headline"><div><div class="eyebrow">Paso 7</div><h3>Revisión final</h3></div><span class="status-chip ok">Listo para guardar</span></div>
            <div class="summary-grid">${ABILITIES.map(a => `<div class="summary-stat"><span>${a.label}</span><strong>${state.form.derivedAbilities[a.key]}</strong><small>${signed(mod(state.form.derivedAbilities[a.key]))}</small></div>`).join('')}</div>
            <div class="grid-2">
              <div class="callout"><p><strong>Species:</strong> ${species.name}</p><p><strong>Clase:</strong> ${cls.name} ${state.form.level}</p><p><strong>Subclase:</strong> ${state.form.subclass}</p><p><strong>Background:</strong> ${bg.name}</p><p><strong>Feat:</strong> ${state.form.feat}</p><p><strong>Idiomas:</strong> ${state.form.languages.join(', ') || '—'}</p></div>
              <div class="callout"><p><strong>CA:</strong> ${summary.ac}</p><p><strong>HP:</strong> ${summary.hp}</p><p><strong>Iniciativa:</strong> ${signed(summary.initiative)}</p><p><strong>Passive Perception:</strong> ${summary.passivePerception}</p>${summary.spellcasting ? `<p><strong>Spell Save DC:</strong> ${summary.spellcasting.saveDC}</p>` : ''}${summary.spellcasting ? `<p><strong>Spell Attack:</strong> ${signed(summary.spellcasting.attackBonus)}</p>` : ''}</div>
            </div>
            ${subclassData ? `<div class="callout info"><strong>${escapeHtml(state.form.subclass)}</strong><p>${escapeHtml(subclassData.summary || '')}</p><div class="feature-timeline">${(subclassData.features || []).map(feature => `<div class="feature-card"><span>Nivel ${feature.level}</span><strong>${escapeHtml(feature.name)}</strong><p>${escapeHtml(feature.desc)}</p></div>`).join('')}</div></div>` : ''}
          </section>`;
    }
  }

  return `
    <section class="wizard-shell">
      <section class="card parchment wizard-hero">
        <div class="wizard-hero-main">
          <div class="hero-emblem">${classIcon()}${speciesIcon()}</div>
          <div>
            <div class="eyebrow">Builder PRO · Mobile App</div>
            <h2>${escapeHtml(state.form.name || 'Nuevo personaje')}</h2>
            <p class="muted">Creación paso a paso, subclases expandidas y buscadores rápidos para magia y equipo.</p>
          </div>
        </div>
        <div class="wizard-progress"><strong>Paso ${currentStep + 1}/${totalSteps}</strong><span>${BUILDER_SECTIONS[currentStep][1]}</span></div>
      </section>
      <nav class="wizard-stepper">
        ${BUILDER_SECTIONS.map(([id, label, icon], index) => `<button class="${state.currentSection === id ? 'active' : ''}" data-section-tab="${id}"><span>${icon}</span><small>${label}</small><b>${index + 1}</b></button>`).join('')}
      </nav>
      ${renderStepInner()}
      <section class="wizard-footer-nav">
        <button class="ghost" data-action="prev-section" ${currentStep === 0 ? 'disabled' : ''}>← Paso anterior</button>
        <button data-action="next-section" ${currentStep === totalSteps - 1 ? 'disabled' : ''}>Siguiente paso →</button>
      </section>
    </section>`;
}

function renderProgression() {
  const cls = currentClass();
  const summary = currentSummary();
  const rows = classFeaturesUntil(cls, Number(state.form.level || 1));
  const subclassData = selectedSubclass() || cls.subclasses.find(s => s.name === state.form.subclass);
  return `
  <section class="section-grid">
    <section class="card stack">
      <h3>Progresión de clase</h3>
      <div class="grid-3">
        <div class="callout compact"><strong>Dado de golpe</strong><p>d${cls.hitDie}</p></div>
        <div class="callout compact"><strong>Saving Throws</strong><p>${cls.savingThrows.map(a => ABILITY_LABELS[a]).join(', ')}</p></div>
        <div class="callout compact"><strong>Prof. Bonus</strong><p>+${summary.pb}</p></div>
      </div>
      <div class="table-wrap">
        <table class="sheet-table">
          <thead><tr><th>Nivel</th><th>Rasgos</th></tr></thead>
          <tbody>
            ${rows.map(row => `<tr><td data-label="Nivel">${row.level}</td><td data-label="Rasgos">${escapeHtml(featureText(row.features))}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>
    <section class="card stack">
      <h3>Subclase</h3>
      <div class="callout info">
        <strong>${escapeHtml(state.form.subclass)}</strong>
        <p>${escapeHtml(subclassData?.summary || 'Subclase activa.')}</p>
        ${(subclassData?.features || []).length ? `<div class="feature-timeline">${subclassData.features.map(feature => `<div class="feature-card"><span>Nivel ${feature.level}</span><strong>${escapeHtml(feature.name)}</strong><p>${escapeHtml(feature.desc)}</p></div>`).join('')}</div>` : ''}
      </div>
      <div class="callout">
        <strong>Competencias</strong>
        <p><strong>Armaduras:</strong> ${cls.armorProficiencies.join(', ') || '—'}</p>
        <p><strong>Armas:</strong> ${cls.weaponProficiencies.join(', ') || '—'}</p>
        <p><strong>Herramientas:</strong> ${cls.toolProficiencies.join(', ') || '—'}</p>
      </div>
      <div class="callout">
        <strong>Equipo sugerido</strong>
        <p>${cls.equipment.join(', ')}</p>
      </div>
    </section>
  </section>`;
}

function renderSummary() {
  const cls = currentClass();
  const bg = currentBackground();
  const species = currentSpecies();
  const summary = currentSummary();
  return `
  <section class="section-grid">
    <section class="card stack">
      <h3>Resumen de ficha</h3>
      <div class="summary-grid">
        ${ABILITIES.map(a => `<div class="summary-stat">
          <span>${a.label}</span>
          <strong>${state.form.derivedAbilities[a.key]}</strong>
          <small>${signed(mod(state.form.derivedAbilities[a.key]))}</small>
        </div>`).join('')}
      </div>
      <div class="grid-2">
        <div class="callout">
          <p><strong>Species:</strong> ${species.name}</p>
          <p><strong>Clase:</strong> ${cls.name} ${state.form.level}</p>
          <p><strong>Subclase:</strong> ${state.form.subclass}</p>
          <p><strong>Background:</strong> ${bg.name}</p>
          <p><strong>Feat:</strong> ${state.form.feat}</p>
          <p><strong>Idiomas:</strong> ${state.form.languages.join(', ') || '—'}</p>
        </div>
        <div class="callout">
          <p><strong>CA:</strong> ${summary.ac}</p>
          <p><strong>HP:</strong> ${summary.hp}</p>
          <p><strong>Iniciativa:</strong> ${signed(summary.initiative)}</p>
          <p><strong>Passive Perception:</strong> ${summary.passivePerception}</p>
          ${summary.spellcasting ? `<p><strong>Spell Save DC:</strong> ${summary.spellcasting.saveDC}</p>` : ''}
          ${summary.spellcasting ? `<p><strong>Spell Attack:</strong> ${signed(summary.spellcasting.attackBonus)}</p>` : ''}
        </div>
      </div>
    </section>

    <section class="card stack">
      <h3>Skills</h3>
      <div class="table-wrap">
        <table class="sheet-table">
          <thead><tr><th>Skill</th><th>Atributo</th><th>Total</th><th>Prof.</th></tr></thead>
          <tbody>
            ${summary.skillRows.map(row => `<tr>
              <td data-label="Skill">${skillLabel[row.name] || row.name}</td>
              <td data-label="Atributo">${ABILITY_LABELS[row.ability]}</td>
              <td data-label="Total">${signed(row.total)}</td>
              <td data-label="Prof.">${row.proficient ? 'Sí' : '—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card stack">
      <h3>Rasgos activos</h3>
      <div class="callout">
        <strong>${species.name}</strong>
        <p>${species.traits.join(', ')}</p>
      </div>
      <div class="callout">
        <strong>${bg.name}</strong>
        <p>${bg.summary}</p>
      </div>
      <div class="callout">
        <strong>${cls.name}</strong>
        <p>${(cls.progression[Number(state.form.level)] || []).join(', ') || 'Sin rasgos especiales a este nivel.'}</p>
      </div>
      ${selectedSubclass() ? `<div class="callout info"><strong>${escapeHtml(state.form.subclass)}</strong><p>${escapeHtml(selectedSubclass().summary || '')}</p></div>` : ''}
      ${state.form.notes ? `<div class="callout"><strong>Notas</strong><p>${escapeHtml(state.form.notes)}</p></div>` : ''}
    </section>
  </section>`;
}


function renderHome() {
  const status = authStatus();
  const recent = [...state.characters].slice(0, 6);
  return `
    <main class="app-home">
      <section class="home-hero card parchment">
        <div class="home-hero-copy">
          <div class="eyebrow">DnD Forge PRO</div>
          <h1>Forjá tu personaje como si fuera una app.</h1>
          <p class="muted">Creación separada del resto, wizard full-screen, subclases visuales y guardado online con Supabase.</p>
          <div class="home-actions">
            <button data-action="new-wizard">Crear personaje</button>
            <button data-action="random-character" class="ghost">Generar random</button>
            ${state.currentId ? '<button data-action="resume-sheet" class="ghost">Seguir último</button>' : ''}
          </div>
        </div>
        <div class="home-status card ${status.kind}">
          <div class="eyebrow">Estado</div>
          <strong>${escapeHtml(status.title)}</strong>
          <p>${escapeHtml(status.text)}</p>
          <span class="status-chip ${status.kind}">${escapeHtml(status.cta)}</span>
        </div>
      </section>

      <section class="home-grid">
        <section class="card stack">
          <div class="row between center"><h3>Cuenta</h3>${state.session ? '<button data-action="logout" class="ghost">Cerrar sesión</button>' : ''}</div>
          ${!hasSupabaseConfig ? saveEnvHint() : ''}
          ${state.session ? `<div class="callout ok"><strong>${escapeHtml(state.session.user.email || 'Usuario')}</strong><p>Sincronización activa para guardar, duplicar y compartir.</p></div>` : `
            <label>Email<input id="email-login" type="email" placeholder="tu@email.com" value="${escapeHtml(state.authEmail || '')}" /></label>
            <button data-action="login">Entrar con magic link</button>
          `}
        </section>

        <section class="card stack">
          <div class="row between center"><h3>Biblioteca</h3><span class="pill">${state.characters.length} personaje/s</span></div>
          <input id="search-character" placeholder="Buscar personaje" value="${escapeHtml(state.filters.search)}" />
          <div class="home-character-list">
            ${recent.filter(c => (c.name || '').toLowerCase().includes(state.filters.search.toLowerCase())).map(c => `
              <button class="character-row" data-open="${c.id}">
                <span class="character-row-icon">${CLASS_ICONS[c.classId] || '⚔️'}</span>
                <span><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml((CLASSES.find(x => x.id === c.classId)?.name) || c.classId)} · lvl ${c.level}</small></span>
                <span class="chev">→</span>
              </button>`).join('') || '<p class="muted">Todavía no guardaste personajes. Podés empezar desde cero o generar uno random.</p>'}
          </div>
        </section>
      </section>
    </main>`;
}

function renderSheetView() {
  const cls = currentClass();
  const species = currentSpecies();
  const bg = currentBackground();
  const summary = currentSummary();
  return `
    <main class="sheet-screen">
      <section class="sheet-topbar card parchment">
        <button data-action="go-home" class="ghost">← Inicio</button>
        <div class="sheet-topbar-main">
          <div class="eyebrow">${escapeHtml(species.name)} · ${escapeHtml(cls.name)} · ${escapeHtml(bg.name)}</div>
          <h2>${classIcon()} ${escapeHtml(state.form.name || 'Nuevo personaje')}</h2>
        </div>
        <div class="sheet-topbar-actions">
          <button data-action="edit-character" class="ghost">Editar</button>
          <button data-action="save">Guardar</button>
        </div>
      </section>
      <section class="sheet-kpis">
        <div class="sheet-kpi card"><span>CA</span><strong>${summary.ac}</strong></div>
        <div class="sheet-kpi card"><span>HP</span><strong>${summary.hp}</strong></div>
        <div class="sheet-kpi card"><span>PB</span><strong>+${summary.pb}</strong></div>
        <div class="sheet-kpi card"><span>Ini</span><strong>${signed(summary.initiative)}</strong></div>
      </section>
      <section class="tabs desktop-tabs sheet-tabs">
        ${[
          ['summary', 'Ficha'],
          ['progression', 'Progresión'],
          ['builder', 'Editar'],
        ].map(([id, label]) => `<button class="${state.currentTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}
      </section>
      ${state.currentTab === 'summary' ? renderSummary() : ''}
      ${state.currentTab === 'progression' ? renderProgression() : ''}
      ${state.currentTab === 'builder' ? renderBuilder() : ''}
      <nav class="mobile-bottom-nav mobile-only sheet-bottom-nav">
        ${[
          ['summary', 'Ficha'],
          ['progression', 'Nivel'],
          ['builder', 'Editar'],
        ].map(([id, label]) => `<button class="${state.currentTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}
      </nav>
    </main>`;
}

function renderPublic() {
  const ch = state.publicView;
  const classDef = CLASSES.find(c => c.id === ch.classId) || CLASSES[0];
  const species = SPECIES.find(s => s.id === ch.speciesId) || SPECIES[0];
  const background = BACKGROUNDS.find(b => b.id === ch.backgroundId) || BACKGROUNDS[0];
  const armorDef = ARMOR.find(a => a.name === ch.armor) || ARMOR[0];
  const summary = summarize(ch, { classDef, species, background, armorDef });
  app.innerHTML = `
    <main class="public-page">
      <section class="card parchment hero-card builder-card section-identity">
        <div>
          <div class="eyebrow">Ficha pública</div>
          <h1>${escapeHtml(ch.name)}</h1>
          <p>${species.name} · ${classDef.name} ${ch.level} · ${escapeHtml(ch.subclass)}</p>
        </div>
        <a class="ghost button-link" href="./">Abrir editor</a>
      </section>
      <section class="section-grid">
        <section class="card stack">
          <h3>Resumen</h3>
          <div class="summary-grid">
            ${ABILITIES.map(a => `<div class="summary-stat"><span>${a.label}</span><strong>${ch.derivedAbilities[a.key]}</strong><small>${signed(mod(ch.derivedAbilities[a.key]))}</small></div>`).join('')}
          </div>
          <div class="grid-2">
            <div class="callout">
              <p><strong>CA:</strong> ${summary.ac}</p>
              <p><strong>HP:</strong> ${summary.hp}</p>
              <p><strong>Iniciativa:</strong> ${signed(summary.initiative)}</p>
              <p><strong>Feat:</strong> ${escapeHtml(ch.feat)}</p>
            </div>
            <div class="callout">
              <p><strong>Skills:</strong> ${(ch.skills || []).map(s => skillLabel[s] || s).join(', ') || '—'}</p>
              <p><strong>Armas:</strong> ${(ch.weapons || []).join(', ') || '—'}</p>
              <p><strong>Conjuros:</strong> ${(ch.spells || []).join(', ') || '—'}</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  `;
}

function saveEnvHint() {
  if (hasSupabaseConfig) return '';
  return `<div class="banner warn">
    Falta <code>env.js</code>. Copiá <code>env.js.example</code>, completá tu Project URL y Publishable Key, y si querés evitar redirects raros agregá también <code>SITE_URL</code> con tu dominio de Netlify.
  </div>`;
}

function render() {
  const focusState = captureFocusState();
  recalcForm();
  if (state.publicView) return renderPublic();
  if (state.loading) {
    app.innerHTML = `<div class="loading-screen"><div class="spinner"></div><p>Cargando DnD Forge PRO…</p></div>`;
    return;
  }

  let html = '';
  if (state.mode === 'home') html = renderHome();
  else if (state.mode === 'wizard') html = `
    <main class="wizard-screen">
      <section class="wizard-screen-topbar card parchment">
        <button data-action="go-home" class="ghost">← Inicio</button>
        <div class="wizard-screen-title"><div class="eyebrow">Creación de personaje</div><strong>${escapeHtml(state.form.name || 'Nuevo personaje')}</strong></div>
        <div class="wizard-screen-actions"><button data-action="random-character" class="ghost">Random</button><button data-action="save">Guardar</button></div>
      </section>
      ${renderBuilder()}
    </main>`;
  else html = renderSheetView();

  app.innerHTML = `${state.toast ? `<div class="floating-toast">${escapeHtml(state.toast)}</div>` : ''}${html}`;
  bindEvents();
  restoreFocusState(focusState);
}

function bindEvents() {
  app.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', () => openCharacter(el.dataset.open));
  });
  app.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', () => { state.currentTab = el.dataset.tab; render(); });
  });
  app.querySelectorAll('[data-section-tab]').forEach(el => {
    el.addEventListener('click', () => {
      state.currentSection = el.dataset.sectionTab;
      render();
    });
  });
  app.querySelectorAll('[data-pick-field]').forEach(el => {
    el.addEventListener('click', () => {
      updateField(el.dataset.pickField, el.dataset.pickValue);
    });
  });
  app.querySelectorAll('[data-scroll]').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  app.querySelectorAll('[data-field]').forEach(el => {
    const commit = () => updateField(el.dataset.field, el.type === 'number' ? Number(el.value) : el.value);
    el.addEventListener('change', commit);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.addEventListener('blur', commit);
    }
  });
  app.querySelectorAll('[data-base]').forEach(el => {
    el.addEventListener('change', () => {
      state.form.baseAbilities[el.dataset.base] = clamp(el.value, 8, 15);
      recalcForm();
      render();
    });
  });
  app.querySelectorAll('input[name="abilityMethod"]').forEach(el => {
    el.addEventListener('change', () => {
      state.form.abilityMethod = el.value;
      render();
    });
  });
  app.querySelectorAll('[data-priority]').forEach(el => {
    el.addEventListener('change', () => {
      state.form.asiPriority[Number(el.dataset.priority)] = el.value;
      recalcForm();
      render();
    });
  });
  app.querySelectorAll('[data-array]').forEach(el => {
    el.addEventListener('change', () => {
      const field = el.dataset.array;
      const limit = Number(el.dataset.limit || 999);
      if (field === 'skills') {
        const { bgSkills } = activeSkillPool();
        const classSkills = state.form.skills.filter(s => !bgSkills.includes(s));
        let next = new Set(classSkills);
        if (el.checked) next.add(el.value); else next.delete(el.value);
        state.form.skills = [...bgSkills, ...Array.from(next).slice(0, activeSkillLimit())];
        recalcForm();
        render();
        return;
      }
      toggleFromArray(field, el.value, el.checked, limit);
    });
  });

  app.querySelector('#subclass-search')?.addEventListener('input', (e) => { state.filters.subclassSearch = e.target.value; render(); });
  app.querySelector('#spell-search')?.addEventListener('input', (e) => { state.filters.spellSearch = e.target.value; render(); });
  app.querySelector('#weapon-search')?.addEventListener('input', (e) => { state.filters.weaponSearch = e.target.value; render(); });
  app.querySelector('#equipment-search')?.addEventListener('input', (e) => { state.filters.equipmentSearch = e.target.value; render(); });
  app.querySelector('#email-login')?.addEventListener('input', (e) => {
    state.authEmail = e.target.value;
  });
  app.querySelector('#search-character')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    render();
  });
  app.querySelector('#hasShield')?.addEventListener('change', (e) => {
    state.form.hasShield = e.target.checked;
    render();
  });
  app.querySelector('#public-toggle')?.addEventListener('change', (e) => {
    state.form.is_public = e.target.checked;
  });
  app.querySelector('#import-json')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) importJson(file);
  });

  app.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', async () => {
      switch (el.dataset.action) {
        case 'login':
          await sendMagicLink((document.querySelector('#email-login')?.value || state.authEmail).trim());
          break;
        case 'logout':
          await logout();
          break;
        case 'new':
        case 'new-wizard':
          state.currentId = null;
          state.currentSection = 'identity';
          state.mode = 'wizard';
          state.form = defaultCharacter();
          state.mobileMenuOpen = false;
          render();
          break;
        case 'toggle-menu':
          state.mobileMenuOpen = true;
          render();
          break;
        case 'go-home':
          state.mode = 'home';
          state.mobileMenuOpen = false;
          render();
          break;
        case 'resume-sheet':
          if (state.currentId) state.mode = 'sheet';
          else if (state.characters[0]) openCharacter(state.characters[0].id);
          render();
          break;
        case 'edit-character':
          state.mode = 'wizard';
          state.currentTab = 'builder';
          render();
          break;
        case 'random-character':
          generateRandomCharacter();
          break;
        case 'close-menu':
          state.mobileMenuOpen = false;
          render();
          break;
        case 'save':
          await saveCharacter();
          break;
        case 'duplicate':
          copyCharacter();
          break;
        case 'delete':
          await deleteCharacter();
          break;
        case 'export':
          exportJson();
          break;
        case 'import':
          document.querySelector('#import-json')?.click();
          break;
        case 'pdf':
          printSheet();
          break;
        case 'share':
          await shareLink();
          break;
        case 'suggest-skills':
          applySuggestedSkills();
          break;
        case 'prev-section': {
          const next = Math.max(0, currentSectionIndex() - 1);
          state.currentSection = BUILDER_SECTIONS[next][0];
          render();
          break;
        }
        case 'next-section': {
          const next = Math.min(BUILDER_SECTIONS.length - 1, currentSectionIndex() + 1);
          state.currentSection = BUILDER_SECTIONS[next][0];
          render();
          break;
        }
      }
    });
  });
}

boot();
