
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
  authEmail: '',
};

const PUBLIC_ID = new URLSearchParams(window.location.search).get('public');

const BUILDER_SECTIONS = [
  ['identity', 'Identidad', '🧙'],
  ['origin', 'Origen', '🌟'],
  ['abilities', 'Stats', '📊'],
  ['training', 'Skills', '🎓'],
  ['combat', 'Combate', '⚔️'],
  ['magic', 'Magia', '✨'],
  ['review', 'Revisión', '📜'],
];


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
  state.form = defaultCharacter(found);
  recalcForm();
  render();
}

function copyCharacter() {
  state.mobileMenuOpen = false;
  state.currentSection = 'identity';
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
  recalcForm();
  if (state.publicView) return renderPublic();
  if (state.loading) {
    app.innerHTML = `<div class="loading-screen"><div class="spinner"></div><p>Cargando DnD Forge PRO…</p></div>`;
    return;
  }
  const cls = currentClass();
  const bg = currentBackground();
  const filtered = state.characters.filter(c => (c.name || '').toLowerCase().includes(state.filters.search.toLowerCase()));
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar ${state.mobileMenuOpen ? 'open' : ''}">
        <div class="sidebar-inner">
          <div class="row between center mobile-sidebar-head">
            <div class="brand">
              <h1>DnD Forge PRO</h1>
              <p class="muted">Builder 2024 online para Netlify + Supabase.</p>
            </div>
            <button data-action="close-menu" class="ghost mobile-only">Cerrar</button>
          </div>

          ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}
          ${saveEnvHint()}

          <section class="card stack auth-card">
            <div class="row between center">
              <h3>Cuenta</h3>
              <span class="status-chip ${authStatus().kind}">${authStatus().cta}</span>
            </div>
            <div class="callout compact ${authStatus().kind}">
              <strong>${authStatus().title}</strong>
              <p>${authStatus().text}</p>
            </div>
            ${state.session ? `
              <div class="callout compact">
                <strong>${escapeHtml(state.session.user.email || 'Usuario')}</strong>
              </div>
              <button data-action="logout" class="ghost">Cerrar sesión</button>
            ` : `
              <label>Email<input id="email-login" type="email" placeholder="tu@email.com" value="${escapeHtml(state.authEmail)}" /></label>
              <button data-action="login">Entrar con magic link</button>
            `}
          </section>

          <section class="card stack">
            <div class="row between center">
              <h3>Personajes</h3>
              <button data-action="new">Nuevo</button>
            </div>
            <input id="search-character" placeholder="Buscar personaje" value="${escapeHtml(state.filters.search)}" />
            <div class="list scroll-y mobile-character-list">
              ${filtered.map(c => `
                <button class="list-item ${c.id === state.currentId ? 'active' : ''}" data-open="${c.id}">
                  <strong>${escapeHtml(c.name)}</strong>
                  <span>${escapeHtml(c.classId)} · lvl ${c.level}</span>
                </button>
              `).join('') || '<p class="muted">No hay personajes todavía.</p>'}
            </div>
          </section>

          <section class="card stack">
            <h3>Acciones</h3>
            <div class="grid-2 mobile-actions">
              <button data-action="save">Guardar</button>
              <button data-action="duplicate" class="ghost">Duplicar</button>
              <button data-action="share" class="ghost">Share link</button>
              <button data-action="pdf" class="ghost">Imprimir/PDF</button>
              <button data-action="export" class="ghost">Export JSON</button>
              <button data-action="import" class="ghost">Import JSON</button>
              <button data-action="delete" class="danger">Borrar</button>
              <input id="import-json" type="file" hidden accept="application/json" />
            </div>
            <label class="toggle"><input id="public-toggle" type="checkbox" ${state.form.is_public ? 'checked' : ''} /> Personaje público</label>
          </section>

          <section class="card stack">
            <h3>Ayuda rápida</h3>
            <div class="callout compact">
              <p><strong>Species:</strong> ${currentSpecies().name}</p>
              <p><strong>Clase:</strong> ${cls.name}</p>
              <p><strong>Background:</strong> ${bg.name}</p>
              <p><strong>Feat:</strong> ${state.form.feat}</p>
            </div>
          </section>
        </div>
      </aside>

      <main class="main">
        <section class="card parchment mobile-topbar">
          <div class="row between center gap-sm">
            <div>
              <div class="eyebrow">${escapeHtml(currentSpecies().name)} · ${escapeHtml(cls.name)}</div>
              <strong>${escapeHtml(state.form.name || 'Nuevo personaje')}</strong>
            </div>
            <div class="row gap-sm">
              <button data-action="toggle-menu" class="ghost">Menú</button>
              <button data-action="save">Guardar</button>
            </div>
          </div>
          <div class="mobile-stat-strip">
            <span>CA ${currentSummary().ac}</span>
            <span>HP ${currentSummary().hp}</span>
            <span>PB +${currentSummary().pb}</span>
            <span>Ini ${signed(currentSummary().initiative)}</span>
          </div>
          <div class="mobile-progress-line">
            <span>${BUILDER_SECTIONS.find(([id]) => id === state.currentSection)?.[2] || '🧙'} ${BUILDER_SECTIONS.find(([id]) => id === state.currentSection)?.[1] || 'Identidad'}</span>
            <small>Paso ${Math.max(1, BUILDER_SECTIONS.findIndex(([id]) => id === state.currentSection) + 1)} / ${BUILDER_SECTIONS.length}</small>
          </div>
        </section>

        <section class="tabs desktop-tabs">
          ${[
            ['builder', 'Builder'],
            ['progression', 'Progresión'],
            ['summary', 'Resumen'],
          ].map(([id, label]) => `<button class="${state.currentTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}
        </section>

        ${state.currentTab === 'builder' ? renderBuilder() : ''}
        ${state.currentTab === 'progression' ? renderProgression() : ''}
        ${state.currentTab === 'summary' ? renderSummary() : ''}

        <nav class="mobile-bottom-nav mobile-only">
          ${[
            ['builder', 'Builder'],
            ['progression', 'Nivel'],
            ['summary', 'Ficha'],
          ].map(([id, label]) => `<button class="${state.currentTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}
        </nav>
      </main>
    </div>
    ${state.mobileMenuOpen ? '<div class="mobile-backdrop mobile-only" data-action="close-menu"></div>' : ''}
  `;
  bindEvents();
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
          state.currentId = null;
          state.currentSection = 'identity';
          state.form = defaultCharacter();
          state.mobileMenuOpen = false;
          render();
          break;
        case 'toggle-menu':
          state.mobileMenuOpen = true;
          render();
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
