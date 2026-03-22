
import { ABILITIES, ABILITY_LABELS, SPELL_SLOTS, SKILLS, STANDARD_ARRAY } from '../data/gameData.js';

export const slugify = (value) => (value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export const uid = () => Math.random().toString(36).slice(2, 10);

export const clamp = (n, min, max) => Math.min(Math.max(Number(n) || 0, min), max);
export const mod = (score) => Math.floor((Number(score || 10) - 10) / 2);
export const signed = (value) => `${value >= 0 ? '+' : ''}${value}`;
export const pbByLevel = (level) => 2 + Math.floor((Math.max(1, Number(level || 1)) - 1) / 4);
export const escapeHtml = (str = '') => String(str)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

export const skillAbility = Object.fromEntries(SKILLS.map(s => [s.name, s.ability]));
export const skillLabel = Object.fromEntries(SKILLS.map(s => [s.name, s.label]));

export function pointBuyCost(score) {
  const map = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };
  return map[score] ?? 99;
}

export function totalPointBuy(baseAbilities) {
  return Object.values(baseAbilities || {}).reduce((sum, value) => sum + pointBuyCost(Number(value || 8)), 0);
}

export function arrayToAbilities(arr = STANDARD_ARRAY) {
  return {
    str: arr[0], dex: arr[1], con: arr[2], int: arr[3], wis: arr[4], cha: arr[5],
  };
}

export function computeBonuses(pattern, priorities) {
  const bonus = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
  const unique = [...new Set(priorities.filter(Boolean))];
  if (pattern === '+1/+1/+1') {
    unique.slice(0, 3).forEach(key => { bonus[key] += 1; });
  } else {
    if (unique[0]) bonus[unique[0]] += 2;
    if (unique[1]) bonus[unique[1]] += 1;
  }
  return bonus;
}

export function deriveAbilities(baseAbilities, bonusAbilities) {
  const out = {};
  ABILITIES.forEach(a => {
    out[a.key] = Number(baseAbilities[a.key] || 8) + Number(bonusAbilities[a.key] || 0);
  });
  return out;
}

export function computeAC(form) {
  const dexMod = mod(form.derivedAbilities.dex);
  const armor = form._armorDef || { baseAC: 10, dexCap: null, type: 'None' };
  let ac = armor.baseAC;
  if (armor.type === 'None') {
    ac += dexMod;
    if (form.classId === 'barbarian') ac = 10 + dexMod + mod(form.derivedAbilities.con);
    if (form.classId === 'monk') ac = 10 + dexMod + mod(form.derivedAbilities.wis);
  } else {
    if (armor.dexCap === null) ac += dexMod;
    else ac += Math.min(dexMod, armor.dexCap);
  }
  if (form.hasShield) ac += 2;
  return ac;
}

export function spellcastingSummary(classDef, level, derived) {
  if (!classDef || classDef.casterType === 'none') return null;
  const abilityKey = classDef.spellAbility;
  const abilityMod = mod(derived[abilityKey]);
  const attackBonus = pbByLevel(level) + abilityMod;
  const saveDC = 8 + pbByLevel(level) + abilityMod;
  if (classDef.casterType === 'warlock') {
    const pact = SPELL_SLOTS.warlock[level] || [0,0];
    return {
      attackBonus,
      saveDC,
      slots: pact,
      prepared: classDef.preparedFormula,
      pactLevel: pact[0],
      pactSlots: pact[1],
    };
  }
  const slots = SPELL_SLOTS[classDef.casterType]?.[level] || [];
  return { attackBonus, saveDC, slots, prepared: classDef.preparedFormula };
}

export function maxSpellLevel(classDef, level) {
  if (!classDef || classDef.casterType === 'none') return 0;
  if (classDef.casterType === 'warlock') {
    const pact = SPELL_SLOTS.warlock[level] || [0, 0];
    return pact[0] || 0;
  }
  const slots = SPELL_SLOTS[classDef.casterType]?.[level] || [];
  let max = 0;
  slots.forEach((count, index) => { if (count > 0) max = index + 1; });
  return max;
}

export function classFeaturesUntil(classDef, level) {
  const rows = [];
  if (!classDef) return rows;
  for (let i = 1; i <= level; i++) {
    rows.push({ level: i, features: classDef.progression[i] || [] });
  }
  return rows;
}

export function summarize(form, refs) {
  const { classDef, species, background, armorDef } = refs;
  form._armorDef = armorDef;
  const level = Number(form.level || 1);
  const pb = pbByLevel(level);
  const conMod = mod(form.derivedAbilities.con);
  const hp = classDef.hitDie + conMod + (level - 1) * Math.max(1, Math.floor(classDef.hitDie / 2) + 1 + conMod);
  const ac = computeAC(form);
  const initiative = mod(form.derivedAbilities.dex);
  const passivePerception = 10 + mod(form.derivedAbilities.wis) + (form.skills.includes('Perception') ? pb : 0);
  const spellcasting = spellcastingSummary(classDef, level, form.derivedAbilities);
  const saves = Object.fromEntries(ABILITIES.map(a => [
    a.key,
    mod(form.derivedAbilities[a.key]) + (classDef.savingThrows.includes(a.key) ? pb : 0),
  ]));
  const skillRows = SKILLS.map(skill => ({
    ...skill,
    total: mod(form.derivedAbilities[skill.ability]) + (form.skills.includes(skill.name) ? pb : 0),
    proficient: form.skills.includes(skill.name),
  }));
  return {
    ac, hp, initiative, passivePerception, pb, saves, spellcasting, skillRows,
    speciesSummary: species.summary,
    backgroundSummary: background.summary,
  };
}

export function defaultCharacter(defaults = {}) {
  const baseAbilities = arrayToAbilities();
  const bonusAbilities = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
  return {
    id: null,
    public_id: '',
    is_public: false,
    name: 'Nuevo personaje',
    playerName: '',
    campaign: '',
    alignment: '',
    notes: '',
    level: 1,
    speciesId: 'human',
    classId: 'fighter',
    subclass: 'Champion',
    backgroundId: 'soldier',
    feat: 'Savage Attacker',
    abilityMethod: 'standard',
    originPattern: '+2/+1',
    asiPriority: ['str', 'con', 'dex'],
    baseAbilities,
    bonusAbilities,
    derivedAbilities: deriveAbilities(baseAbilities, bonusAbilities),
    languages: ['Común'],
    skills: ['Athletics', 'Intimidation'],
    tools: ['Gaming Set'],
    armor: 'Chain Mail',
    hasShield: false,
    weapons: ['Greatsword', 'Longbow'],
    weaponMasteries: ['Graze', 'Slow'],
    equipment: ['Explorer’s Pack'],
    spells: [],
    customFeatNotes: '',
    portraitUrl: '',
    ...defaults,
  };
}

export function featureText(features) {
  return (features || []).join(' · ') || '—';
}

export function abilityOptions(keys) {
  return keys.map(key => `<option value="${key}">${ABILITY_LABELS[key]}</option>`).join('');
}
