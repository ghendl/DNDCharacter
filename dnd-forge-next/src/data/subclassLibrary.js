export const CLASS_ICONS = {
  'barbarian': '🪓',
  'bard': '🎼',
  'cleric': '☀️',
  'druid': '🌿',
  'fighter': '🛡️',
  'monk': '👊',
  'paladin': '✨',
  'ranger': '🏹',
  'rogue': '🗡️',
  'sorcerer': '🩸',
  'warlock': '🌙',
  'wizard': '📘',
};

export const SPECIES_ICONS = {
  'aasimar': '😇',
  'dragonborn': '🐉',
  'dwarf': '⛰️',
  'elf': '🌙',
  'gnome': '⚙️',
  'goliath': '🗿',
  'halfling': '🍀',
  'human': '🧭',
  'orc': '💥',
  'tiefling': '🔥',
};

export const SUBCLASS_LIBRARY = {
  "Path of the Berserker": {
    classId: "barbarian",
    summary: "Canaliza la violencia pura; ataques adicionales en Rage.",
    features: [
      { level: 3, name: "Frenzy", desc: "Durante Rage: al hacer tu BA de unarmed/arma, podés atacar de nuevo como parte de esa misma BA (sin costo extra)." },
      { level: 6, name: "Mindless Rage", desc: "No podés ser Charmed ni Frightened durante Rage. Si estás Charmed/Frightened, el efecto se suspende durante la Rage." },
      { level: 10, name: "Retaliation", desc: "Cuando recibís daño de una criatura en 5 pies, podés atacarla con Melee Weapon como Reacción." },
      { level: 14, name: "Intimidating Presence", desc: "Acción: 1 criatura en 30 ft que puedas ver hace ST WIS (DC 8+PB+CHA) o queda Frightened de vos hasta el fin de tu próximo turno. Recuperás en SR." },
    ],
  },
  "Path of the Totem Warrior": {
    classId: "barbarian",
    summary: "Vínculo espiritual con un animal totem.",
    features: [
      { level: 3, name: "Spirit Seeker / Totem Spirit", desc: "Ritual de Speak with Animals y Beast Sense 1/LR. Elegís totem (Bear: resistencia a todo daño en Rage; Eagle: Dash sin OA en Rage; Wolf: aliados ventaja en melee contra enemigos en tu rango)." },
      { level: 6, name: "Aspect of the Beast", desc: "Bear: capacidad de carga ×2 y ventaja en STR checks. Eagle: ves 1 milla con claridad, ignoras oscuridad leve. Wolf: podés rastrear a ritmo rápido y en sigilo." },
      { level: 10, name: "Spirit Walker", desc: "Podés lanzar Commune with Nature como ritual." },
      { level: 14, name: "Totemic Attunement", desc: "Bear: criaturas en Rage que te ataquen tienen desventaja si hay aliado adyacente. Eagle: en Rage podés volar a tu speed. Wolf: en Rage, al derribar una criatura grande o más pequeña, podés usar BA para atacar a otra." },
    ],
  },
  "Path of the Wild Heart": {
    classId: "barbarian",
    summary: "Conexión profunda con la bestia interior.",
    features: [
      { level: 3, name: "Animal Speaker / Rage of the Wilds", desc: "Hablas con bestias; Speak with Animals a voluntad. Elegís Rage: Bear (resist. todo daño), Eagle (Dash libre en Rage sin OA), Wolf (aliados ventaja melee contra tus objetivos)." },
      { level: 6, name: "Aspect of the Wilds", desc: "Elegís Elephant (STR checks ventaja, carga extra), Owl (sin desventaja oscuridad en percepción, ves 60 ft en darkness), Tiger (movimiento en Dash sin OA, salto 30 ft)." },
      { level: 10, name: "Nature Speaker", desc: "Podés lanzar Commune with Nature sin gastar slot 1/LR." },
      { level: 14, name: "Power of the Wilds", desc: "Cada vez que entrás en Rage, elegís un poder de la lista de Rage of the Wilds (pueden variar)." },
    ],
  },
  "Path of the World Tree": {
    classId: "barbarian",
    summary: "Conectado al Yggdrasil, eje de todos los planos.",
    features: [
      { level: 3, name: "Vitality of the Tree", desc: "Al entrar en Rage ganás PB × d10 Temporary HP. Al hacer un melee attack en Rage, podés usar BA para dar THP = 1d10 + CON mod a un aliado visible." },
      { level: 6, name: "Branches of the Tree", desc: "Cuando una criatura a 30 ft de vos ataca a alguien que no sos vos, podés usar Reacción para teleportar al atacante a 5 pies tuyo (ST STR para resistir)." },
      { level: 10, name: "Battering Roots", desc: "Al atacar con arma en Rage, si golpeás, podés empujar a la criatura hasta 15 ft o tirarla Prone (sin usar BA)." },
      { level: 14, name: "Travel along the Tree", desc: "Al entrar en Rage o como BA en Rage: podés teleportarte (con aliados willing en 5 ft) a un punto visible en 60 ft. 1/LR podés hacerlo a cualquier distancia (sin límite de rango)." },
    ],
  },
  "Path of the Zealot": {
    classId: "barbarian",
    summary: "Guerrero sagrado imbuido de poder divino.",
    features: [
      { level: 3, name: "Divine Fury / Warrior of the Gods", desc: "En Rage, primer hit por turno agrega 1d6 Radiant o Necrotic (según deidad) + la mitad de nivel Barbarian. Warrior: si morís, un conjuro de resurrección sobre vos no requiere componentes materiales costosos." },
      { level: 6, name: "Fanatical Focus", desc: "1 vez en cada Rage, si fallás una ST, podés retirarla." },
      { level: 10, name: "Zealous Presence", desc: "BA: hasta 10 criaturas en 60 ft que puedas ver ganan ventaja en ataques y ST por 1 minuto. 1/LR." },
      { level: 14, name: "Rage Beyond Death", desc: "En Rage: no morís aunque tus HP lleguen a 0 (podés actuar normalmente). Morís si terminás tu turno en 0 HP o si tu Rage termina." },
    ],
  },
  "College of Lore": {
    classId: "bard",
    summary: "Recolector de conocimiento; domina habilidades y magia.",
    features: [
      { level: 3, name: "Bonus Proficiencies / Cutting Words", desc: "Competencia en 3 skills adicionales. Cutting Words: reacción al tirar de ataque/habilidad/daño en 60 ft, gastás Bardic Inspiration para restar el dado de ese resultado." },
      { level: 6, name: "Magical Discoveries", desc: "Aprendés 2 conjuros de cualquier lista. Cuentan como conjuros de Bard para vos." },
      { level: 14, name: "Peerless Skill", desc: "Al hacer un ability check podés gastar Bardic Inspiration y añadir el resultado al check. Podés hacerlo después de tirar pero antes del resultado." },
    ],
  },
  "College of Valor": {
    classId: "bard",
    summary: "Bardo guerrero que inspira en el campo de batalla.",
    features: [
      { level: 3, name: "Bonus Proficiencies / Combat Inspiration", desc: "Medium Armor, Shields y Martial Weapons. Combat Inspiration: el dado de Bardic Inspiration puede usarse para agregar al daño de arma o a la CA (como reacción)." },
      { level: 6, name: "Extra Attack", desc: "Dos ataques por Action Attack." },
      { level: 14, name: "Battle Magic", desc: "Al lanzar un conjuro de Bard como acción, podés hacer un Weapon Attack como BA." },
    ],
  },
  "College of Dance": {
    classId: "bard",
    summary: "El combate como danza; gracia y movimiento fluidos.",
    features: [
      { level: 3, name: "Dazzling Footwork", desc: "Unarmed Strikes usan d6 (d8 en nivel 10). Cuando usás Unarmed Strike o las Bardic Inspiration dance moves, añadís DEX al daño. Bardic Inspiration agrega nuevas Flourishes de movimiento." },
      { level: 6, name: "Inspiring Movement / Tandem Footwork", desc: "Al moverte, hasta PB aliados en 5 ft pueden moverse la misma distancia sin gastar su movimiento (1/turno). Al tirar Iniciativa sin Bardic Inspiration: todos los aliados en 60 ft que podás ver ganan ventaja en la tirada." },
      { level: 14, name: "Leading Evasion", desc: "Evasion personal + si un aliado en 5 ft fallara la ST de DEX contra el mismo efecto, puede usar tu resultado de ST en cambio." },
    ],
  },
  "College of Glamour": {
    classId: "bard",
    summary: "Magia feérica de encantamiento y presencia mágica.",
    features: [
      { level: 3, name: "Mantle of Inspiration / Enthralling Performance", desc: "BA: gastás Bardic Inspiration para dar THP = tu dado BI + CHA mod a PB aliados en 60 ft, que también se mueven su speed como reacción. Tras actuar, criaturas que puedan verte/oírte (hasta CHA mod) quedan Charmed 1 hora (ST WIS tu DC para resistir)." },
      { level: 6, name: "Mantle of Majesty", desc: "1/LR: 1 minuto de concentración, lanzás Command como BA cada turno sin gastar slot. Criaturas Charmed por Enthralling Performance auto-fallan el ST." },
      { level: 14, name: "Unbreakable Majesty", desc: "1/LR: tomaís apariencia de criatura feérica por 1 min. Las criaturas que te ataquen primero hacen ST CHA (tu DC) o eligen otro objetivo. Si tienen éxito, quedan inmunes a este efecto 24h." },
    ],
  },
  "College of Shadows": {
    classId: "bard",
    summary: "Bardo de lo oscuro; ilusiones y terror.",
    features: [
      { level: 3, name: "Shadow Lore / Spells of the College", desc: "Conjuros adicionales: Dissonant Whispers, Shadow Blade, Fear, Hypnotic Pattern, Mislead, Eyebite. Shadow Lore: 1/LR: acción, una criatura en 30 ft ST WIS (tu DC) o revela su secreto más oscuro ante vos y queda Frightened 8 horas." },
      { level: 6, name: "Shadow Step", desc: "BA: podés teleportarte entre dos áreas de dim light u oscuridad en 60 ft. Hasta el fin de tu turno tenés ventaja en el próximo Melee Attack." },
      { level: 14, name: "Shadow Soul", desc: "1/LR (reacción al recibir daño): ignorás ese daño y te volvés Invisible hasta el inicio de tu próximo turno." },
    ],
  },
  "College of Swords": {
    classId: "bard",
    summary: "Bardo espadachín que combina arte y combate.",
    features: [
      { level: 3, name: "Bonus Proficiencies / Blade Flourish", desc: "Medium Armor y Martial Weapons. Blade Flourish: cuando atacás con un arma (y el movimiento del turno > 0), ganás +10 ft de movimiento en ese turno y usás Bardic Inspiration en un Flourish: Defensive (añade al CA), Slashing (daño extra a otro enemigo adyacente), Mobile (+5 ft de movimiento después del ataque sin OA)." },
      { level: 6, name: "Extra Attack", desc: "Dos ataques por Action Attack." },
      { level: 14, name: "Master's Flourish", desc: "Al usar Blade Flourish, podés tirar un d6 en lugar de gastar Bardic Inspiration (usás el d6 en lugar de tu dado BI)." },
    ],
  },
  "Life Domain": {
    classId: "cleric",
    summary: "Sanador y protector; maximiza la curación.",
    features: [
      { level: 3, name: "Disciple of Life / Life Domain Spells", desc: "Cuando lanzás un conjuro de curación de nivel 1+, la criatura recupera HP adicionales = 2 + el nivel del slot. Conjuros adicionales: Bless, Cure Wounds, Aid, Lesser Restoration, Mass Healing Word, Revivify, Death Ward, Guardian of Faith." },
      { level: 6, name: "Preserve Life", desc: "Channel Divinity: repartís hasta 5 × nivel Clérigo HP entre criaturas en 30 ft (no más de la mitad de sus HP máximos por criatura). No afecta a undead ni constructs." },
      { level: 10, name: "Blessed Healer", desc: "Cuando lanzás un spell de curación de nivel 1+ en otra criatura, también recuperás 2 + nivel del slot de HP." },
      { level: 14, name: "Supreme Healing", desc: "Al tirar dados de curación, tratás cualquier resultado igual o menor a la mitad del máximo del dado como ese máximo (ej: d8 → 4 se trata como 8)." },
    ],
  },
  "Light Domain": {
    classId: "cleric",
    summary: "Guardián de la luz; daño radiante y anti-oscuridad.",
    features: [
      { level: 3, name: "Warding Flare / Light Domain Spells", desc: "PB/LR usos: reacción cuando una criatura en 30 ft te ataca, imponés desventaja en ese ataque. Conjuros: Burning Hands, Faerie Fire, Scorching Ray, See Invisibility, Daylight, Fireball, Guardian of Faith, Wall of Fire." },
      { level: 6, name: "Radiance of the Dawn", desc: "Channel Divinity: all criaturas en 30 ft que no sean detrás de full cover hacen ST CON (tu DC) → éxito: mitad de 2d10+nivel Clérigo Radiant; fallo: total. Magical darkness en el área se disipa." },
      { level: 10, name: "Improved Warding Flare", desc: "Warding Flare también funciona en criaturas en 30 ft (no solo ataques contra vos). Si la criatura atacante tiene éxito en su ataque, el objetivo pierde las desventajas." },
      { level: 14, name: "Corona of Light", desc: "1/LR: por 1 min (concentración) emanás Bright Light 60 ft y Dim Light 30 ft adicionales. Criaturas en el Bright Light tienen desventaja en ST contra conjuros de Fire o Radiant." },
    ],
  },
  "Trickery Domain": {
    classId: "cleric",
    summary: "Dios del engaño; ilusiones y sombras.",
    features: [
      { level: 3, name: "Blessing of the Trickster / Trickery Spells", desc: "Acción: das a una criatura willing ventaja en Stealth checks por 1 hora (1/LR). Conjuros: Charm Person, Disguise Self, Invisibility, Pass Without Trace, Hypnotic Pattern, Nondetection, Dimension Door, Polymorph." },
      { level: 6, name: "Invoke Duplicity", desc: "Channel Divinity: 1 min (concentración) creás ilusión de vos mismo en 30 ft. Como BA la movés 30 ft. Ventaja en ataques si el objetivo está adyacente a la ilusión. Podés lanzar conjuros como si fueras desde la ilusión." },
      { level: 10, name: "Divine Strike", desc: "1/turno +1d8 (sube a 2d8 a nivel 14) de daño Poison al golpear con arma." },
      { level: 14, name: "Improved Duplicity", desc: "En Invoke Duplicity: podés crear hasta 4 copias en lugar de 1. Podés mover cada copia como BA." },
    ],
  },
  "War Domain": {
    classId: "cleric",
    summary: "Guerrero divino; ataques adicionales en combate.",
    features: [
      { level: 3, name: "War Priest / War Domain Spells", desc: "PB/LR: al hacer un Weapon Attack como Action, podés hacer un ataque adicional como BA. Conjuros: Divine Favor, Shield of Faith, Magic Weapon, Spiritual Weapon, Crusader's Mantle, Spirit Guardians, Freedom of Movement, Stoneskin." },
      { level: 6, name: "Guided Strike", desc: "Channel Divinity: cuando fallás un ataque, podés añadir +10 al resultado (puede convertir el fallo en éxito)." },
      { level: 10, name: "Divine Strike", desc: "1/turno: +1d8 (sube a 2d8 a nivel 14) de daño del tipo de tu arma al golpear." },
      { level: 14, name: "Avatar of Battle", desc: "Resistencia a Bludgeoning, Piercing y Slashing de armas no mágicas." },
    ],
  },
  "Nature Domain": {
    classId: "cleric",
    summary: "Druida divino; control de naturaleza y bestias.",
    features: [
      { level: 3, name: "Acolyte of Nature / Nature Spells", desc: "Aprendés 1 cantrip de Druid. Competencia en Heavy Armor. Conjuros: Animal Friendship, Speak with Animals, Barkskin, Spike Growth, Plant Growth, Wind Wall, Dominate Beast, Grasping Vine." },
      { level: 6, name: "Charm Animals and Plants", desc: "Channel Divinity: cada bestia o planta en 30 ft que puedas ver hace ST WIS (tu DC) o queda Charmed de vos por 1 minuto." },
      { level: 10, name: "Divine Strike", desc: "1/turno: +1d8 (sube a 2d8 a nivel 14) de daño Cold, Fire o Lightning (elegís) al golpear con arma." },
      { level: 14, name: "Master of Nature", desc: "BA: podés comandar criaturas Charmed por Charm Animals and Plants." },
    ],
  },
  "Tempest Domain": {
    classId: "cleric",
    summary: "Poder de las tormentas; Lightning y Thunder.",
    features: [
      { level: 3, name: "Wrath of the Storm / Tempest Spells", desc: "PB/LR: reacción al ser golpeado, infligís 2d8 Lightning o Thunder al atacante (ST DEX mitad). Competencia en Heavy Armor y Martial Weapons. Conjuros: Thunderwave, Fog Cloud, Shatter, Gust of Wind, Call Lightning, Sleet Storm, Ice Storm, Control Water." },
      { level: 6, name: "Destructive Wrath", desc: "Channel Divinity: al tirar dados de Lightning o Thunder, podés reemplazar todos los dados por el máximo posible." },
      { level: 10, name: "Divine Strike", desc: "1/turno: +1d8 (sube a 2d8 a nivel 14) de daño Thunder al golpear con arma." },
      { level: 14, name: "Stormborn", desc: "Velocidad de vuelo = tu speed mientras estés en exterior." },
    ],
  },
  "Circle of the Land": {
    classId: "druid",
    summary: "Guardián de un tipo de terreno; magic from the land.",
    features: [
      { level: 2, name: "Circle Spells / Land's Aid", desc: "Elegís un tipo de terreno (Arid, Polar, Temperate, Tropical) y obtenés conjuros adicionales. Land's Aid: Channel Nature (= CD de Clérigo), elige 2 efectos: Poison/Heals bestias+plants en 10ft, Thorn Wall (restrained)." },
      { level: 6, name: "Natural Recovery", desc: "1/LR (fuera de combate): recuperás spell slots cuyo nivel total ≤ mitad nivel Druid. También podés recuperar Wild Shape usos." },
      { level: 10, name: "Nature's Ward", desc: "Inmune a Charmed y Frightened de elementals y fey. Inmune a veneno y enfermedad." },
      { level: 14, name: "Nature's Sanctuary", desc: "Bestiaa y plantas hacen ST WIS (tu DC) al intentar atacarte; si fallan, deben elegir otro objetivo. Podés usar Wild Shape como reacción al recibir daño." },
    ],
  },
  "Circle of the Moon": {
    classId: "druid",
    summary: "Transforma en bestias poderosas; el shapeshifter definitivo.",
    features: [
      { level: 2, name: "Circle Forms / Circle of the Moon Combat Wild Shape", desc: "Wild Shape en combat (BA en lugar de Acción). Podés transformarte en bestias de CR ≤ tu nivel Druid / 3 (mínimo 1). Gastás Wild Shape para recuperar 1d8 × PB HP en Wild Shape." },
      { level: 6, name: "Improved Circle Forms", desc: "Podés transformarte en Elementals (Air, Earth, Fire, Water) además de Beasts." },
      { level: 10, name: "Moonlight Step", desc: "BA: podés teleportarte a un punto visible en 30 ft (fuera o dentro de Wild Shape). Hasta el fin de tu turno tenés ventaja en el próximo ataque. PB/LR." },
      { level: 14, name: "Lunar Form", desc: "Incremento permanente de +4 a CR máximo de Wild Shape. En Wild Shape, cuando atacás ganás un dado de Moonlight adicional de daño Radiant (igual a tu Martial Arts / Monk die)." },
    ],
  },
  "Circle of the Sea": {
    classId: "druid",
    summary: "Poder oceánico; Lightning, Thunder y control del agua.",
    features: [
      { level: 2, name: "Wrath of the Sea", desc: "Channel Nature: en 10 ft de vos se forma una zona de tormenta por 10 minutos. Criaturas en ella al inicio de su turno hacen ST STR (tu DC) o son empujadas 15 ft y reciben 1d6 Cold + 1d6 Lightning + 1d6 Thunder." },
      { level: 6, name: "Aquatic Affinity", desc: "Velocidad de nado = speed; respirás bajo el agua. Wild Shape: también podés transformarte en criaturas con velocidad de nado." },
      { level: 10, name: "Stormborn", desc: "Velocidad de vuelo (solo exterior) = speed mientras Wrath of the Sea esté activo." },
      { level: 14, name: "Oceanic Gift", desc: "Podés dar el beneficio de Aquatic Affinity + 10 ft de nado a PB aliados en 30 ft por 24 horas (1/LR)." },
    ],
  },
  "Circle of the Stars": {
    classId: "druid",
    summary: "Poderes estelares; forma de constelación.",
    features: [
      { level: 2, name: "Star Map / Starry Form", desc: "Star Map: siempre tenés Guidance y Guiding Bolt preparados; 1/LR podés castear Guiding Bolt sin gastar slot. Starry Form: BA gastás Wild Shape para transformarte en forma estelar (sin perder forma, duración 10 min): Archer (BA: 1d8+WIS Radiant), Chalice (lanzás healing spell: vos o aliado en 30 ft también recupera 1d8+WIS), Dragon (Concentration: cuando tirás Concentration check, tirada mínima = 10)." },
      { level: 6, name: "Cosmic Omen", desc: "Tras LR: tirás 1d6. Impar = Weal (BA: aliado en 30 ft puede añadir 1d6 a un ataque/check/ST). Par = Woe (BA: criatura en 30 ft tiene -1d6 en un ataque/check/ST). PB usos por LR." },
      { level: 10, name: "Twinkling Constellations", desc: "Las Starry Form options mejoran: Archer (BA 2d8+WIS); Chalice (curación se duplica); Dragon (vuelo 20 ft)." },
      { level: 14, name: "Full of Stars", desc: "En Starry Form: resistencia a Bludgeoning, Piercing y Slashing." },
    ],
  },
  "Circle of Wildfire": {
    classId: "druid",
    summary: "Fuego del renacimiento; destrucción y sanación ardiente.",
    features: [
      { level: 2, name: "Wildfire Spirit / Enhanced Bond", desc: "BA: invocás un Wildfire Spirit (como Wild Shape, pero inmune a fuego, resistencia a Fire, puede transportarte mágicamente a él en 15 ft). Enhanced Bond: conjuros de fuego o curación tienen +1d8 de daño o curación mientras el Spirit esté activo." },
      { level: 6, name: "Cauterizing Flames", desc: "Cuando una criatura en 30 ft muere, podés reaccionar para crear una llama: la próxima criatura que se mueva allí recibe 2d10 Fire o es curada por 2d10 HP (elegís). PB usos/LR." },
      { level: 10, name: "Blazing Revival", desc: "1/LR: cuando caés a 0 HP, el Wildfire Spirit vuela hacia vos y te cura por la mitad de tu HP máximo, y luego el Spirit desaparece." },
      { level: 14, name: "Firestorm", desc: "BA: podés teleportarte al Wildfire Spirit (sin importar distancia). Criaturas en 5 ft del punto de llegada hacen ST DEX (tu DC) o reciben 2d10 Fire." },
    ],
  },
  "Champion": {
    classId: "fighter",
    summary: "Maestro marcial clásico; críticos mejorados y atletismo.",
    features: [
      { level: 3, name: "Improved Critical", desc: "Crítico en 19-20 (luego 18-20 a nivel 15)." },
      { level: 7, name: "Remarkable Athlete", desc: "Añadís la mitad de PB (redondeado arriba) a STR/DEX/CON checks donde no tengas competencia. Distancia de salto largo aumenta STR modifier pies." },
      { level: 10, name: "Additional Fighting Style", desc: "Aprendés un Fighting Style adicional." },
      { level: 15, name: "Superior Critical", desc: "Ahora el crítico ocurre en 18-20." },
      { level: 18, name: "Survivor", desc: "A principio de cada turno (si tenés entre 1 y la mitad de tus HP máximos), recuperás 5 + CON mod de HP." },
    ],
  },
  "Battle Master": {
    classId: "fighter",
    summary: "Táctico de combate; maniobras y superiority dice.",
    features: [
      { level: 3, name: "Combat Superiority / Student of War", desc: "Superiority Dice = 4 d8 (escalan d10/d12 y +1 dado con el nivel). 3 maniobras elegidas de una lista de 16+ opciones (Commander's Strike, Disarming Attack, Distracting Strike, Evasive Footwork, Feinting Attack, Goading Attack, Lunging Attack, Maneuvering Attack, Menacing Attack, Parry, Precision Attack, Pushing Attack, Rally, Riposte, Sweeping Attack, Trip Attack). Recuperás dados en SR. Student of War: competencia en 1 Artisan's Tool." },
      { level: 7, name: "Know Your Enemy", desc: "Gastás 1 min observando a una criatura: sabrás 2 de las siguientes comparadas a vos: STR, DEX, CON, AC, HP actuales, clase totales, Fighter levels." },
      { level: 10, name: "Improved Combat Superiority", desc: "Superiority Dice pasan a d10." },
      { level: 15, name: "Relentless", desc: "Si comenzás el combate sin Superiority Dice, recuperás 1." },
      { level: 18, name: "Ultimate Combat Superiority", desc: "Superiority Dice pasan a d12." },
    ],
  },
  "Eldritch Knight": {
    classId: "fighter",
    summary: "Guerrero mago; conjuros de abjuración y evocación.",
    features: [
      { level: 3, name: "Spellcasting (Eldritch Knight) / Weapon Bond", desc: "Lanzás conjuros de Wizard (principalmente Abjuration y Evocation). Ritual: vinculás 2 armas; podés invocarlas a tu mano como BA; no podés ser Disarmed de ellas." },
      { level: 7, name: "War Magic", desc: "Al lanzar un cantrip como acción, podés atacar con un arma como BA." },
      { level: 10, name: "Eldritch Strike", desc: "Al golpear a una criatura, tiene desventaja en el próximo ST contra tu próximo conjuro antes del fin de tu próximo turno." },
      { level: 15, name: "Arcane Charge", desc: "Al usar Action Surge, podés teleportarte hasta 30 ft a un espacio visible como parte de esa acción extra." },
      { level: 18, name: "Improved War Magic", desc: "Ahora War Magic funciona con cualquier conjuro (no solo cantrips)." },
    ],
  },
  "Psi Warrior": {
    classId: "fighter",
    summary: "Guerrero psiónico; empuja, protege y vuela con la mente.",
    features: [
      { level: 3, name: "Psionic Power", desc: "Psionic Energy Dice = 2 × PB d6. Podés usar: Protective Field (reacción: gastás 1 die para reducir daño a vos o aliado en 30 ft), Psionic Strike (después de golpear con arma: gastás 1 die para agregar ese dado + INT mod de daño Force y forzar ST STR o ser empujado 10 ft), Mind Thrust (BA: ST INT o 1d6 Force + gastan BA). Recuperás 1 die en SR, todos en LR." },
      { level: 7, name: "Telekinetic Adept", desc: "Telekinetic Movement: BA: movés objeto/criatura (large o más pequeño) hasta 30 ft (ST STR si no es willing). Psionic Adept: podés gastar 2 Psionic dice para doblar la velocidad de un die usado." },
      { level: 10, name: "Guarded Mind", desc: "Gastás 1 die para terminar uno de los siguientes efectos sobre vos: Charmed, Frightened." },
      { level: 15, name: "Bulwark of Force", desc: "1 vez/LR: acción para dar a PB criaturas en 30 ft (elegís) mitad de cobertura por 1 min (concentración)." },
      { level: 18, name: "Telekinetic Master", desc: "1/LR podés lanzar Telekinesis. Concentración. Al lanzarlo, podés atacar con arma como BA." },
    ],
  },
  "Rune Knight": {
    classId: "fighter",
    summary: "Grabador de runas de gigantes; poderes mágicos y crecimiento.",
    features: [
      { level: 3, name: "Bonus Proficiencies / Rune Carving / Giant's Might", desc: "Smith's Tools + Giant language. Grabás 2 runas elegidas (Cloud, Fire, Frost, Hill, Stone, Storm) en objetos. BA: Giant's Might (1 min): crecés a Large (si cabe), ventaja en STR checks y ST, 1d6 de daño extra en Weapon Attacks. PB/LR." },
      { level: 7, name: "Runic Shield", desc: "Reacción: cuando un aliado visible es golpeado, forzás al atacante a retitrar el ataque y usar el nuevo resultado. PB/LR." },
      { level: 10, name: "Great Stature / Rune Carving +1", desc: "Crecer permanentemente 3d4 pulgadas. Daño extra de Giant's Might sube a 1d8. Aprendés 1 runa adicional." },
      { level: 15, name: "Master of Runes", desc: "Ahora podés activar cada runa dos veces entre SR (antes era 1/LR)." },
      { level: 18, name: "Runic Juggernaut", desc: "Giant's Might ahora te permite crecer a Huge (si cabe); el daño extra sube a 1d10. Tus ataques de arma tienen alcance +5 ft en Huge form." },
    ],
  },
  "Arcane Archer": {
    classId: "fighter",
    summary: "Arquero mágico que imbúye sus flechas con poder arcano.",
    features: [
      { level: 3, name: "Arcane Archer Lore / Arcane Shot", desc: "Competencia en Arcana o Nature. Arcane Shot: 2 usos/SR. Elegís 2 opciones de 8 (Banishing, Beguiling, Bursting, Enfeebling, Grasping, Piercing, Seeking, Shadow). Cada una tiene efectos de daño o condición adicionales al golpear." },
      { level: 7, name: "Magic Arrow / Curving Shot", desc: "Tus ataques con arco cuentan como mágicos. Curving Shot: cuando fallás un ataque, podés usar BA para redirigir la flecha a otra criatura en 60 ft del objetivo original." },
      { level: 10, name: "Ever-Ready Shot", desc: "Si no tenés usos de Arcane Shot al inicio del combate, recuperás 1." },
      { level: 15, name: "Improved Arcane Shot", desc: "Las opciones de Arcane Shot mejoran (el DC aumenta y los efectos son más poderosos)." },
      { level: 18, name: "Arcane Shot Master", desc: "Podés elegir 2 opciones adicionales de Arcane Shot (total 6)." },
    ],
  },
  "Warrior of the Open Hand": {
    classId: "monk",
    summary: "Maestro del combate desarmado; manipula y controla.",
    features: [
      { level: 3, name: "Open Hand Technique", desc: "Al golpear con Flurry of Blows podés aplicar uno: Prone (ST DEX), Push 15 ft (ST STR), o impedir la Reaction hasta inicio de tu próximo turno." },
      { level: 6, name: "Wholeness of Body", desc: "BA: te curás a vos mismo por 3 × nivel Monk HP. 1/LR." },
      { level: 11, name: "Fleet Step", desc: "Cuando usás una Focus-costing ability de Monk (excepto Step of the Wind), podés también usar Step of the Wind gratuitamente." },
      { level: 17, name: "Quivering Palm", desc: "Gastás 4 Focus: colocás vibraciones en una criatura golpeada. 1/LR. Podés activarlas luego (acción): ST CON (tu DC) o cae a 0 HP; con éxito toma 10d10 Necrotic." },
    ],
  },
  "Warrior of Mercy": {
    classId: "monk",
    summary: "Curandero y ejecutor; sanación y muerte con las manos.",
    features: [
      { level: 3, name: "Implements of Mercy / Hand of Harm / Hand of Healing", desc: "Medicine skill + Herbalism Kit. Hand of Harm: cuando golpeás con Unarmed, gastás 1 Focus para agregar 1d6+WIS Necrotic. Hand of Healing: BA gastás 1 Focus para curar a una criatura en 5 ft por 1d6+WIS mod HP." },
      { level: 6, name: "Physician's Touch", desc: "Hand of Harm agrega Poisoned (hasta fin del próximo turno tuyo). Hand of Healing también puede remover 1 condición." },
      { level: 11, name: "Flurry of Healing and Harm", desc: "Cuando usás Flurry of Blows: reemplazás hasta 2 golpes por Hand of Healing gratuitas (sin gastar Focus extra). Golpes que hits pueden aplicar Hand of Harm sin Focus adicional." },
      { level: 17, name: "Hand of Ultimate Mercy", desc: "1/LR: gastás 5 Focus: tocás una criatura muerta hace ≤ 24h y la revivís con 4d10+WIS HP (como Raise Dead sin req. de componentes). No restaura piezas del cuerpo perdidas." },
    ],
  },
  "Warrior of the Shadow": {
    classId: "monk",
    summary: "Asesino de las sombras; invisibilidad y teleportación.",
    features: [
      { level: 3, name: "Shadow Arts", desc: "Gastás 1 Focus: Minor Illusion cantrip. Conocés Darkness, Darkvision, Pass Without Trace y Silence. Podés lanzarlos gastando Focus equivalente al nivel." },
      { level: 6, name: "Shadow Step", desc: "BA: en dim light u oscuridad, teleportarte hasta 60 ft a otra zona de dim light u oscuridad. Ventaja en el próximo Melee Attack hasta fin de turno." },
      { level: 11, name: "Cloak of Shadows", desc: "BA: gastás 3 Focus para volverte Invisible hasta el inicio de tu próximo turno." },
      { level: 17, name: "Opportunist", desc: "Reacción: cuando una criatura adyacente es golpeada por otro, podés atacarla sin gastar Reaction normal." },
    ],
  },
  "Warrior of the Elements": {
    classId: "monk",
    summary: "Conjura los elementos del Cuatro Vientos.",
    features: [
      { level: 3, name: "Elemental Attunement / Manipulate Elements", desc: "Conocés Elementalism cantrip. Elegís 2 opciones de Elemental Burst (Fist of Unbroken Air: 2d10 dmg + push + prone; Fangs of the Fire Snake: 1d10 fuego reach; Fist of Four Thunders: 2d6 thunder cone; Rush of Gale Spirits: empuja criaturas en línea)." },
      { level: 6, name: "Environmental Burst", desc: "Cuando usás Elemental Burst, podés gastar Focus adicional para agrandar el efecto (más daño, más área o más empuje)." },
      { level: 11, name: "Stride of the Elements", desc: "Al usar Step of the Wind, ganás velocidad de vuelo y nado igual a tu speed hasta el fin de tu turno." },
      { level: 17, name: "Elemental Epitome", desc: "1/LR: al inicio de tu turno podés volverte Elemental Form (1 min): resistencia a Acid, Cold, Fire, Lightning o Thunder (elegís) + bonus de daño del mismo tipo en ataques." },
    ],
  },
  "Warrior of the Astral Self": {
    classId: "monk",
    summary: "Proyecta su cuerpo astral; poder sobrenatural.",
    features: [
      { level: 3, name: "Arms of the Astral Self", desc: "Gastás 2 Focus (BA): invocás brazos astrales por 10 min. Usás WIS en lugar de STR en checks y ST. Los brazos tienen alcance de 5 ft extra. Unarmed Strikes con ellos usan WIS en vez de STR/DEX y hacen Force damage." },
      { level: 6, name: "Visage of the Astral Self", desc: "Gastás 1 Focus adicional con Arms: añadís visaje astral. Darkvision 120 ft; ventaja en Insight y Intimidation; criaturas en 600 ft que te hablen podés entenderlas y ellas te entienden." },
      { level: 11, name: "Body of the Astral Self", desc: "Mientras Arms estén activos: reacción al recibir daño, reducís daño en 1d10 + WIS mod. Además, cuando uses Flurry of Blows, tus brazos agregan 2 ataques adicionales con daño Force." },
      { level: 17, name: "Awakened Astral Self", desc: "Gastás 5 Focus: forma completa (arms + visage + body). Armor Class = 13 + WIS mod (si es mayor que AC actual). Tus ataques con brazos astrales hacen 2d10 Force + WIS mod." },
    ],
  },
  "Oath of Devotion": {
    classId: "paladin",
    summary: "Paladín clásico; honor, santidad y protección.",
    features: [
      { level: 3, name: "Oath Spells / Sacred Weapon / Turn the Unholy", desc: "Conjuros: Protection from Evil and Good, Shield of Faith, Aid, Zone of Truth, Beacon of Hope, Dispel Magic, Freedom of Movement, Guardian of Faith. Sacred Weapon (Channel): 1 min imbúís arma con +CHA mod a hits y emite luz. Turn the Unholy: fiends y undead en 30 ft ST WIS o huyen 1 min." },
      { level: 7, name: "Aura of Devotion", desc: "Vos y aliados en 10 ft (30 ft a nivel 18) no pueden ser Charmed mientras estés consciente." },
      { level: 15, name: "Purity of Spirit", desc: "Permanentemente bajo el efecto de Protection from Evil and Good." },
      { level: 20, name: "Holy Nimbus", desc: "1/LR: 1 min, irradiás Bright Light 30 ft. Los fiends y undead en esa luz toman 10 Radiant al inicio de sus turnos. ST CON contra tus conjuros con desventaja para fiends y undead." },
    ],
  },
  "Oath of the Ancients": {
    classId: "paladin",
    summary: "Paladín feérico; protege la naturaleza y la luz.",
    features: [
      { level: 3, name: "Oath Spells / Nature's Wrath / Turn the Faithless", desc: "Conjuros: Ensnaring Strike, Speak with Animals, Moonbeam, Misty Step, Plant Growth, Protection from Energy, Ice Storm, Stoneskin. Nature's Wrath: Tendrils de plantas atrapan a 1 criatura en 10 ft (ST DEX o STR o Restrained 1 min). Turn the Faithless: fey y fiends en 30 ft ST WIS o huyen." },
      { level: 7, name: "Aura of Warding", desc: "Vos y aliados en 10 ft (30 ft a nivel 18) tenéis resistencia a daño de conjuros." },
      { level: 15, name: "Undying Sentinel", desc: "1/LR: cuando caés a 0 HP, quedás en 1 HP en cambio." },
      { level: 20, name: "Elder Champion", desc: "1/LR: 1 min, te transformás (apariencia de naturaleza antigua). Recuperás 10 HP al inicio de cada turno. Lanzás conjuros de Oath como BA. Criaturas en 10 ft tienen desventaja en ST contra tus conjuros." },
    ],
  },
  "Oath of Glory": {
    classId: "paladin",
    summary: "Campeón inspirador; velocidad y gloria.",
    features: [
      { level: 3, name: "Oath Spells / Inspiring Smite / Peerless Athlete", desc: "Conjuros: Guiding Bolt, Heroism, Enhance Ability, Magic Weapon, Haste, Protection from Energy, Compulsion, Freedom of Movement. Inspiring Smite (Channel): tras Paladin's Smite, distribuís THP entre criaturas en 30 ft. Peerless Athlete (Channel): 10 min ventaja en Athletics y Acrobatics; carrying capacity ×2; salto largo ×2." },
      { level: 7, name: "Aura of Alacrity", desc: "Tu speed aumenta 10 ft. Aliados en 10 ft (30 ft a nivel 18) ganan tu bonus de speed al inicio de su primer turno de combate." },
      { level: 15, name: "Glorious Defense", desc: "Reacción cuando aliado en 10 ft es golpeado: añadís CHA mod a la CA del aliado. Si el ataque falla, podés atacar al atacante (CHA/LR usos)." },
      { level: 20, name: "Living Legend", desc: "1/LR: 1 min. +CHA mod a Attack Rolls. 1/turno si fallás un ataque podés retirarlo. Conjuros de Charm que fallen pueden reintentarse 1 vez con ventaja." },
    ],
  },
  "Oath of Vengeance": {
    classId: "paladin",
    summary: "Cazador implacable; persecución y castigo.",
    features: [
      { level: 3, name: "Oath Spells / Vow of Enmity / Abjure Enemy", desc: "Conjuros: Bane, Hunter's Mark, Hold Person, Misty Step, Haste, Protection from Energy, Banishment, Dimension Door. Vow of Enmity (Channel): ventaja en ataques contra 1 criatura en 10 ft por 1 min. Abjure Enemy (Channel): 1 criatura en 60 ft ST WIS o Frightened + Speed 0 por 1 min." },
      { level: 7, name: "Relentless Avenger", desc: "Al dar con OA, podés moverte hasta la mitad de tu speed hacia el objetivo como parte de esa Reaction sin provocar OA." },
      { level: 15, name: "Soul of Vengeance", desc: "Cuando la criatura bajo Vow of Enmity ataca (aunque sea a otro), podés atacarla como Reacción." },
      { level: 20, name: "Avenging Angel", desc: "1/LR: 1 min. Apariencia de ángel vengativo con velocidad de vuelo 60 ft. Aura de miedo en 30 ft (ST WIS o Frightened)." },
    ],
  },
  "Oathbreaker": {
    classId: "paladin",
    summary: "Paladín caído; poder oscuro y non-muertos bajo control.",
    features: [
      { level: 3, name: "Oath Spells / Channel Divinity", desc: "Conjuros: Hellish Rebuke, Inflict Wounds, Crown of Madness, Darkness, Animate Dead, Bestow Curse, Blight, Confusion. Dreadful Aspect (Channel): criaturas en 30 ft ST WIS o Frightened 1 min. Control Undead (Channel): undead en 30 ft ST WIS o bajo tu control 24h." },
      { level: 7, name: "Aura of Hate", desc: "Vos, fiends y undead en 10 ft (30 ft a nivel 18) añadís CHA mod a daño de Melee Weapon." },
      { level: 15, name: "Supernatural Resistance", desc: "Resistencia a daño no mágico." },
      { level: 20, name: "Dread Lord", desc: "1/LR: 1 min, aura de oscuridad 30 ft. Bright Light se convierte en dim, dim en darkness. Criaturas en aura asustadas por vos toman 4d10 Psychic al inicio de su turno. Tus ataques hacen 3d10 extra Necrotic." },
    ],
  },
  "Beast Master": {
    classId: "ranger",
    summary: "Compañero animal mejorado; combate en tándem.",
    features: [
      { level: 3, name: "Primal Companion", desc: "Invocás una Beast of the Land, Sea o Sky (CR = PB/4). Actúa en tu iniciativa. Usás tu BA para comandarlo. Escala con tu nivel Ranger." },
      { level: 7, name: "Exceptional Training", desc: "Como BA, podés comandar al Companion sin usar tu propia acción. El companion puede usar su acción para Dash, Disengage, Dodge o Help." },
      { level: 11, name: "Bestial Fury", desc: "El Beast Companion puede hacer 2 ataques (Multiattack) cuando lo comandás." },
      { level: 15, name: "Share Spells", desc: "Al lanzar conjuros de target \"self\", podés elegir que también afecten al Beast Companion (si está en 30 ft)." },
    ],
  },
  "Fey Wanderer": {
    classId: "ranger",
    summary: "Trotamundos feérico; encantamiento y presencia mágica.",
    features: [
      { level: 3, name: "Dreadful Strikes / Fey Wanderer Magic / Otherworldly Glamour", desc: "Tus Weapon Attacks infligen +1d4 Psychic 1/turno. Conjuros adicionales: Charm Person, Misty Step, Summon Fey, Dimension Door, Mislead. Glamour: añadís WIS mod a Persuasion checks." },
      { level: 7, name: "Beguiling Twist", desc: "Reacción cuando aliado en 120 ft tiene éxito en ST Charmed/Frightened: podés redirigir el efecto a otra criatura en 120 ft (nueva ST WIS)." },
      { level: 11, name: "Fey Reinforcements", desc: "1/LR: podés lanzar Summon Fey sin gastar slot. Casteas el conjuro sin concentración si el hechizo dura ≤ 1 min." },
      { level: 15, name: "Misty Wanderer", desc: "Podés lanzar Misty Step sin gastar slot PB/LR; llevás a un aliado willing." },
    ],
  },
  "Gloom Stalker": {
    classId: "ranger",
    summary: "Cazador de las sombras; devastador en el primer round.",
    features: [
      { level: 3, name: "Dread Ambusher / Stalker's Flurry / Gloom Stalker Magic", desc: "Dread Ambusher: +PB a Iniciativa. En el primer round del combate, tu speed +10 ft y un ataque extra (1d8 extra). Stalker's Flurry: 1/turno al fallar un ataque, podés atacar de nuevo. Conjuros: Disguise Self, Rope Trick, Fear, Rope Trick, Greater Invisibility, Seeming. Umbral Sight: invisible ante Darkvision." },
      { level: 7, name: "Iron Mind", desc: "Competencia en ST WIS. Si ya la tenés, en INT o CHA." },
      { level: 11, name: "Stalker's Fury", desc: "Cuando Stalker's Flurry extra ataque también falla, la criatura toma 1d8 + WIS mod Psychic." },
      { level: 15, name: "Shadowy Dodge", desc: "Reacción al ser atacado: imponés desventaja al ataque (si no tenés desventaja vos). Luego podés moverte 5 ft sin OA." },
    ],
  },
  "Hunter": {
    classId: "ranger",
    summary: "Cazador versátil; adaptable a cualquier enemigo.",
    features: [
      { level: 3, name: "Hunter's Prey / Defensive Tactics", desc: "A nivel 3 elegís: Colossus Slayer (1d8 extra 1/turno a criaturas bajo HP máximos), Giant Killer (reacción al ser atacado: atacar back), Horde Breaker (ataque extra a otra criatura adyacente al objetivo 1/turno). A nivel 7 elegís: Escape the Horde (OA sobre vos tienen desventaja), Multiattack Defense (+4 CA luego del primer hit en el turno), Steel Will (ventaja en ST Frightened)." },
      { level: 11, name: "Multiattack (Hunter)", desc: "Elegís: Volley (acción: ataques a rango contra toda criatura en 10 ft radio) o Whirlwind Attack (acción: melee contra toda criatura en 5 ft)." },
      { level: 15, name: "Superior Hunter's Defense", desc: "Elegís: Evasion, Stand Against the Tide (cuando criatura falla melee attack, podés redirigirlo a otro adyacente), Uncanny Dodge (reacción: mitad daño)." },
    ],
  },
  "Swarmkeeper": {
    classId: "ranger",
    summary: "Rodeado de un enjambre de criaturas feéricas.",
    features: [
      { level: 3, name: "Gathered Swarm / Swarmkeeper Magic", desc: "Un enjambre te rodea (30 ft de ti). 1/turno al dar con ataque: el enjambre actúa (1d6 Piercing extra, empuja 15 ft, o vos te movés 5 ft sin OA). Conjuros adicionales: Faerie Fire, Mage Hand, Web, Gaseous Form, Arcane Eye, Giant Insect, Insect Plague." },
      { level: 7, name: "Writhing Tide", desc: "BA: el enjambre te lleva (vuelo 10 ft 1 min sin concentración). PB/LR." },
      { level: 11, name: "Mighty Swarm", desc: "Tus Gathered Swarm options mejoran: 1d6→1d8, el empuje sube a 30 ft, o tu movimiento gratis sube a 10 ft. Además podés imposer Prone en lugar de Push." },
      { level: 15, name: "Swarming Dispersal", desc: "Reacción al recibir daño: te volvés Invisible y teleportás 30 ft. Reaparecés al inicio de tu próximo turno. PB/LR." },
    ],
  },
  "Thief": {
    classId: "rogue",
    summary: "Ladrón ágil; Fast Hands y acceso a objetos mágicos.",
    features: [
      { level: 3, name: "Fast Hands / Second-Story Work", desc: "Fast Hands: Sleight of Hand, disarm trap o abrir cerradura como BA. Second-Story Work: escalar = speed normal, salto largo += DEX mod pies." },
      { level: 9, name: "Supreme Sneak", desc: "Ventaja en Stealth checks si no te movés más de la mitad de tu speed en ese turno." },
      { level: 13, name: "Use Magic Device", desc: "Podés usar cualquier objeto mágico ignorando requisitos de clase, raza o nivel." },
      { level: 17, name: "Thief's Reflexes", desc: "En el primer round de combate podés tomar dos turnos (en tu iniciativa normal y en tu iniciativa -10)." },
    ],
  },
  "Assassin": {
    classId: "rogue",
    summary: "Asesino letal; sorpresa y venenos.",
    features: [
      { level: 3, name: "Assassinate / Assassin's Tools", desc: "Ventaja en ataques contra criaturas que no hayan actuado aún. En Surprise: tus hits son Críticos. Competencia en Disguise Kit y Poisoner's Kit." },
      { level: 9, name: "Infiltration Expertise", desc: "25 días de trabajo: creás una identidad falsa perfecta (documentos, historia, apariencia). Con Disguise Kit: una criatura solo puede detectar el disfraz con Insight vs tu Deception." },
      { level: 13, name: "Impostor", desc: "Podés mimetizar habla, escritura y comportamiento de una criatura luego de 3h de estudio." },
      { level: 17, name: "Death Strike", desc: "En Surprise: criatura golpeada hace ST CON (tu DC) o el daño se duplica." },
    ],
  },
  "Arcane Trickster": {
    classId: "rogue",
    summary: "Ladrón mago; ilusiones y encantamiento.",
    features: [
      { level: 3, name: "Spellcasting (Arcane Trickster) / Mage Hand Legerdemain", desc: "Lanzás conjuros de Wizard (Illusion y Enchantment principalmente). Tu Mage Hand es invisible y puede: robar objetos, abrir cerraduras, colocar objetos y más, como BA." },
      { level: 9, name: "Magical Ambush", desc: "Al lanzar un conjuro mientras estás Oculto, criaturas tienen desventaja en su ST contra ese conjuro." },
      { level: 13, name: "Versatile Trickster", desc: "BA: usás Mage Hand para distraer a una criatura: ventaja en tus ataques contra ella hasta el fin del turno." },
      { level: 17, name: "Spell Thief", desc: "1/LR: reacción al ser objetivo de un conjuro. El lanzador hace ST con su spellcasting ability (tu DC) o perdés el conjuro de su memoria y vos lo memorizás por 8 horas." },
    ],
  },
  "Soulknife": {
    classId: "rogue",
    summary: "Asesino psicrístico; cuchillas de energía mental.",
    features: [
      { level: 3, name: "Psionic Power / Psychic Blades", desc: "Psionic Energy Dice = 2×PB d6. Psychic Blades: podés manifestar 2 Psychic Blades (1d6+DEX Psychic, Finesse, Light, Thrown 60/120 ft). Podés lanzar 2 sin acción en Two-Weapon Fighting. Recuperás 1 die en SR, todos en LR." },
      { level: 9, name: "Soul Blades", desc: "Homing Strikes: gastás 1 die al fallar un ataque de Psychic Blade para añadir el dado + INT o WIS al ataque. Psychic Teleportation: BA: gastás 1 die para teleportarte el resultado × 10 ft." },
      { level: 13, name: "Psychic Veil", desc: "1/LR: volverte Invisible 1h (se rompe si atacás o lanzás un conjuro)." },
      { level: 17, name: "Rend Mind", desc: "Al golpear con Psychic Blade, gastás 3 die: ST WIS (tu DC) o Stunned 1 min (repite cada turno)." },
    ],
  },
  "Phantom": {
    classId: "rogue",
    summary: "Ladrón que toca la muerte; poder necróptico.",
    features: [
      { level: 3, name: "Whispers of the Dead / Wails from the Grave", desc: "Whispers: al terminar un SR, podés tomar 1 competencia de skill o tool de una criatura muerta cercana hasta el próximo SR. Wails: tras usar Sneak Attack, podés agregar la mitad de los dados de Sneak Attack (redondeado arriba) de daño Necrotic a otra criatura en 30 ft. PB/LR." },
      { level: 9, name: "Tokens of the Departed", desc: "Cuando una criatura muere en 30 ft, podés capturar su alma en un Trinket (tienes hasta PB trinkets). Tenés ventaja en Death ST y contra creatures si usás el trinket, y podés usarlos para info." },
      { level: 13, name: "Ghost Walk", desc: "1/LR: BA para volverte espectral 10 min. Velocidad de vuelo 10 ft (hover), traversás objetos/criaturas (termina si en objeto sólido)." },
      { level: 17, name: "Death's Friend", desc: "Wails from the Grave ya no cuesta usos. También podés usarlo en la misma criatura del Sneak Attack." },
    ],
  },
  "Draconic Sorcery": {
    classId: "sorcerer",
    summary: "Magia de sangre de dragón; resistencia y vuelo.",
    features: [
      { level: 1, name: "Draconic Resilience", desc: "HP adicional = nivel Sorcerer (retroactivo). Sin armadura: CA = 13 + DEX mod." },
      { level: 6, name: "Elemental Affinity", desc: "Al lanzar conjuro del tipo de daño de tu dragón, añadís CHA mod al daño. Podés gastar 1 SP para tener resistencia a ese tipo de daño por 1h." },
      { level: 14, name: "Dragon Wings", desc: "BA: manifestás alas de dragón → velocidad de vuelo igual a speed (mientras no uses armadura)." },
      { level: 18, name: "Draconic Presence", desc: "5 SP: 1 min (concentración) aura de 60 ft. Criaturas en ella ST WIS (tu DC) o Charmed o Frightened (elegís por turno) durante la duración." },
    ],
  },
  "Wild Magic Surge": {
    classId: "sorcerer",
    summary: "Magia caótica e impredecible; surges random.",
    features: [
      { level: 1, name: "Wild Magic Surge / Tides of Chaos", desc: "Cada vez que lanzás un conjuro de nivel 1+, el DM puede pedir una tirada de Wild Magic Surge (d100, tabla de 50 efectos). Tides of Chaos: 1/LR ganás ventaja en 1 ataque, habilidad o ST." },
      { level: 6, name: "Bend Luck", desc: "Reacción: gastás 2 SP para añadir o restar 1d4 al ataque, check o ST de una criatura en 120 ft." },
      { level: 14, name: "Controlled Chaos", desc: "Al hacer Wild Magic Surge, podés tirar dos veces en la tabla y elegir el resultado." },
      { level: 18, name: "Spell Bombardment", desc: "1/turno: cuando tirás dados de daño de un conjuro y el resultado máximo posible en algún dado, podés añadir ese dado de daño una vez más." },
    ],
  },
  "Clockwork Soul": {
    classId: "sorcerer",
    summary: "Orden del plano mecánico; restauración de la ley.",
    features: [
      { level: 1, name: "Clockwork Magic / Restore Balance", desc: "Conjuros adicionales: Alarm, Protection from Evil/Good, Aid, Lesser Restoration, Dispel Magic, Protection from Energy, Freedom of Movement, Summon Construct. Restore Balance: reacción cuando una criatura tira con ventaja o desventaja: cancelas ese beneficio/penalidad. PB/LR." },
      { level: 6, name: "Bastion of Law", desc: "Gastás 1-5 SP: 1 criatura en 30 ft gana Ward = el gasto × d8. El Ward absorbe daño hasta que se agote (dura hasta LR)." },
      { level: 14, name: "Trance of Order", desc: "1/LR: BA para entrar en trance 1 min. Tus ataques: el mínimo de d20 es 10. Criaturas no pueden tener ventaja en ataques contra vos." },
      { level: 18, name: "Clockwork Cavalcade", desc: "1/LR: invocás espíritus mecánicos en cubo de 30 ft: curación = 1d10 × nivel Sorcerer distribuida entre criaturas amistosas; neutralizás conjuros de nivel 6 o menor activos en el área." },
    ],
  },
  "Aberrant Mind": {
    classId: "sorcerer",
    summary: "Magia del lejano exterior; telepatía y transformación.",
    features: [
      { level: 1, name: "Telepathic Speech / Psionic Spells", desc: "Podés hablar telepáticamente con una criatura en 30 ft. Conjuros adicionales: Arms of Hadar, Dissonant Whispers, Calm Emotions, Detect Thoughts, Hunger of Hadar, Sending, Evard's Black Tentacles, Summon Aberration." },
      { level: 6, name: "Psionic Sorcery", desc: "Al lanzar los conjuros adicionales del subclase, podés gastar SP iguales al nivel del conjuro en lugar del slot (y sin componentes verbal ni somatic)." },
      { level: 14, name: "Revelation in Flesh", desc: "Gastás 1+ SP como BA: por 10 min podés activar 1 o más por SP: Blindsight 60 ft; velocidad de nado = speed y respirás agua; velocidad de vuelo = speed (hover); podés moverte a través de objetos (1d10 Force si terminás en uno)." },
      { level: 18, name: "Warping Implosion", desc: "1/LR: acción, elegís punto en 120 ft. Criaturas en 90 ft hacen ST STR (tu DC) o son jaladas al punto y toman 3d10 Force; con éxito, mitad de daño y no se mueven." },
    ],
  },
  "Shadow Magic": {
    classId: "sorcerer",
    summary: "Poder de la oscuridad del Shadowfell.",
    features: [
      { level: 1, name: "Eyes of the Dark / Strength of the Grave", desc: "Darkvision 120 ft. A nivel 3 aprendés Darkness (2 SP para lanzarla sin requerir concentración, solo vos ves a través). Strength of the Grave: cuando el daño te llevaría a 0, podés hacer ST CHA (DC 5+daño recibido) para quedar en 1 HP. No funciona con daño Radiant o de Critical. 1 uso entre éxitos." },
      { level: 6, name: "Hound of Ill Omen", desc: "3 SP: manifestás un perro espectral de sombras (como Dire Wolf) en 30 ft que ataca al objetivo de tu elección. El objetivo tiene desventaja en ST contra tus conjuros mientras el perro esté adyacente." },
      { level: 14, name: "Shadow Walk", desc: "BA cuando estés en dim light u oscuridad: teleportarte hasta 120 ft a otra zona de dim light u oscuridad." },
      { level: 18, name: "Umbral Form", desc: "6 SP: BA para transformarte en forma de sombra 1 min. Resistencia a todos los tipos de daño excepto Radiant y Force. Podés moverte a través de objetos y criaturas (1d10 Force si terminás en uno)." },
    ],
  },
  "The Fiend Patron": {
    classId: "warlock",
    summary: "Patrón demoníaco; daño y THP al matar.",
    features: [
      { level: 1, name: "Dark One's Blessing / Fiend Spells", desc: "Al reducir a 0 HP a una criatura, ganás THP = CHA mod + nivel Warlock. Conjuros adicionales: Burning Hands, Command, Blindness/Deafness, Scorching Ray, Fireball, Stinking Cloud, Fire Shield, Wall of Fire." },
      { level: 6, name: "Dark One's Own Luck", desc: "Cuando hacés ability check o ST: podés añadir 1d10. PB/LR." },
      { level: 10, name: "Fiendish Resilience", desc: "Tras SR, elegís un tipo de daño (no Magical Bludgeoning/Piercing/Slashing): resistencia a ese tipo hasta el próximo SR." },
      { level: 14, name: "Hurl Through Hell", desc: "1/LR: tras golpear a una criatura, la enviás a través de los Nine Hells: desaparece, toma 8d10 Psychic y regresa al inicio de tu próximo turno (no aplica a Undead y Celestials)." },
    ],
  },
  "The Great Old One": {
    classId: "warlock",
    summary: "Entidad incomprensible; telepatía y conocimiento.",
    features: [
      { level: 1, name: "Awakened Mind / Great Old One Spells", desc: "Telepatía en 30 ft (hablar, no leer mente) con cualquier criatura inteligente. Conjuros: Dissonant Whispers, Hideous Laughter, Phantasmal Force, Detect Thoughts, Clairvoyance, Sending, Dominate Beast, Evard's Black Tentacles." },
      { level: 6, name: "Entropic Ward", desc: "Reacción cuando te atacan: imponés desventaja al ataque. Si el atacante falla, podés hacer el próximo ataque contra él con ventaja. 1/SR." },
      { level: 10, name: "Thought Shield", desc: "Nadie puede leer tu mente sin tu consentimiento. Resistencia a daño Psychic. Cuando una criatura te inflige Psychic, también recibe esa cantidad." },
      { level: 14, name: "Create Thrall", desc: "Gastas Acción e tocás a una criatura Incapacitated: queda Charmed por vos hasta una remoción de maldición. Una criatura Charmed así comparte telepatía con vos a distancia ilimitada." },
    ],
  },
  "The Archfey": {
    classId: "warlock",
    summary: "Lord feérico; glamour, miedo y teleportación.",
    features: [
      { level: 1, name: "Fey Presence / Archfey Spells", desc: "Acción: criaturas en 10 ft ST WIS (tu DC) o Charmed o Frightened hasta el fin de tu próximo turno. 1/SR. Conjuros: Faerie Fire, Sleep, Calm Emotions, Phantasmal Force, Blink, Plant Growth, Dominate Beast, Greater Invisibility." },
      { level: 6, name: "Misty Escape", desc: "Reacción al recibir daño: volverte Invisible y teleportarte hasta 60 ft. La Invisibility termina al inicio de tu próximo turno o si atacás/lanzás. 1/SR." },
      { level: 10, name: "Beguiling Defenses", desc: "Inmune a Charmed. Cuando algo intenta Charmar a vos, podés usar Reacción: reenvías el efecto al lanzador (ST WIS tu DC o Charmed 1 min)." },
      { level: 14, name: "Dark Delirium", desc: "1/SR: acción, 1 criatura en 60 ft ST WIS (tu DC) o Charmed o Frightened (elegís) por 1 min con alucinaciones (pierde percepción del entorno real). Se rompe si recibe daño." },
    ],
  },
  "The Celestial": {
    classId: "warlock",
    summary: "Patrón celestial; curación y luz sagrada.",
    features: [
      { level: 1, name: "Healing Light / Celestial Spells", desc: "Pool de d6 = 1 + nivel Warlock. BA: gastás 1+ dados para curar a una criatura en 60 ft (esa cantidad de d6 HP). Recuperás todos en LR. Conjuros: Cure Wounds, Guiding Bolt, Flaming Sphere, Lesser Restoration, Daylight, Revivify, Guardian of Faith, Wall of Fire." },
      { level: 6, name: "Radiant Soul", desc: "Resistencia a Radiant. Cuando lanzás conjuro de Fire o Radiant, añadís CHA mod al daño de 1 tirada por casting." },
      { level: 10, name: "Celestial Resistance", desc: "Al inicio de cada turno en combate, podés dar THP a 5 criaturas en 30 ft iguales a 1d6 + CHA mod (durán hasta inicio de tu próximo turno)." },
      { level: 14, name: "Searing Vengeance", desc: "Al tirar Death Saving Throw: si el resultado es 20+, te levantás con mitad HP, émitís Bright Light 30 ft y las criaturas en el rango hacen ST CON (tu DC) o reciben 2d8 Radiant y quedan Blinded hasta fin de tu próximo turno. 1/LR." },
    ],
  },
  "The Hexblade": {
    classId: "warlock",
    summary: "Guerrero maldito; spellcasting y combate cuerpo a cuerpo.",
    features: [
      { level: 1, name: "Hexblade's Curse / Hex Warrior", desc: "Hexblade's Curse: BA: maldecís a una criatura en 30 ft. Ganás PB a daño contra ella; crítico en 19-20; al matar recuperás HP = nivel Warlock + CHA mod. 1/SR. Hex Warrior: Medium Armor + Shields + Martial Weapons. 1 arma a la vez: usás CHA en lugar de STR o DEX para Attack y Damage Rolls." },
      { level: 6, name: "Accursed Specter", desc: "Al matar a un Humanoid, podés invocar su espectro (como Specter de D&D). Actúa el turno siguiente al tuyo. Dura hasta LR. 1/LR." },
      { level: 10, name: "Armor of Hexes", desc: "Si el objetivo de Hexblade's Curse te ataca: podés tirar d6. En 4+, el ataque te falla automáticamente." },
      { level: 14, name: "Master of Hexes", desc: "Cuando el objetivo de Hexblade's Curse muere, podés transferir la maldición a una nueva criatura en 30 ft (sin gastar usos de SR)." },
    ],
  },
  "Abjurer": {
    classId: "wizard",
    summary: "Maestro de protección y contrahechizos.",
    features: [
      { level: 3, name: "Abjuration Savant / Arcane Ward", desc: "Copias de Abjuration spells cuestan la mitad. Arcane Ward: al lanzar un conjuro de Abjuration, creás o recargás un Ward con 2× nivel del spell de HP. El Ward absorbe daño antes que vos. No recupera con SR/LR (solo recargando)." },
      { level: 6, name: "Projected Ward", desc: "Reacción: cuando aliado en 30 ft recibe daño, el Arcane Ward absorbe el daño en su lugar." },
      { level: 10, name: "Improved Abjuration", desc: "Al lanzar conjuro que requiera ability check (como Counterspell/Dispel Magic), añadís tu PB a ese check." },
      { level: 14, name: "Spell Resistance", desc: "Ventaja en ST contra conjuros. Resistencia al daño de conjuros." },
    ],
  },
  "Diviner": {
    classId: "wizard",
    summary: "Oracle del futuro; predice y manipula la suerte.",
    features: [
      { level: 3, name: "Divination Savant / Portent", desc: "Copias de Divination spells cuestan la mitad. Portent: tras LR, tirás 2d20 (3d20 a nivel 14) y los guardás. Podés reemplazar cualquier d20 roll de una criatura (tuya o ajena) por uno de tus dados de Portent (antes del resultado)." },
      { level: 6, name: "Expert Divination", desc: "Cuando lanzás un conjuro de Divination de nivel 2+, recuperás un slot de nivel igual a la mitad (redondeado abajo) sin exceder el nivel del spell." },
      { level: 10, name: "The Third Eye", desc: "1/SR: acción para obtener 1 de: Darkvision 60 ft, See Invisibility, lectura de escritura, o Ethereal Sight (ves en el Ethereal Plane) hasta tu próximo LR." },
      { level: 14, name: "Greater Portent", desc: "Ahora Portent tira 3d20 en vez de 2d20." },
    ],
  },
  "Evoker": {
    classId: "wizard",
    summary: "Maestro de la destrucción pura; daño maximizado.",
    features: [
      { level: 3, name: "Evocation Savant / Sculpt Spells", desc: "Copias de Evocation spells cuestan la mitad. Sculpt Spells: al lanzar un conjuro de Evocation con área: elegís hasta 1 + nivel del slot criaturas; esas criaturas tienen éxito automático en el ST y no reciben daño (si éxito = no daño)." },
      { level: 6, name: "Potent Cantrip", desc: "En tus cantrips de daño: si la criatura tiene éxito en la ST, igual recibe la mitad del daño." },
      { level: 10, name: "Empowered Evocation", desc: "Añadís INT mod al daño de cualquier conjuro de Evocation de Wizard (1 vez por casting)." },
      { level: 14, name: "Overchannel", desc: "Al lanzar un conjuro de Evocation de Wizard de nivel 1-5: podés maximizar el daño (sin tirar dados). La segunda vez en un LR: tomás 2d12 Necrotic; la tercera vez: 4d12; etc." },
    ],
  },
  "Illusionist": {
    classId: "wizard",
    summary: "Maestro de la ilusión; manipula la realidad percibida.",
    features: [
      { level: 3, name: "Illusion Savant / Improved Minor Illusion", desc: "Copias de Illusion spells cuestan la mitad. Minor Illusion mejorado: podés crear un sonido Y una imagen a la vez con la misma acción." },
      { level: 6, name: "Malleable Illusions", desc: "Mientras una ilusión con duración > 1 acción esté activa, podés usar una acción para cambiarla con la misma naturaleza del conjuro." },
      { level: 10, name: "Illusory Self", desc: "Reacción al ser golpeado: el ataque en cambio golpea a tu Illusory Duplicate y falla. Recuperás en SR." },
      { level: 14, name: "Illusory Reality", desc: "Cuando lanzás un conjuro de Ilusión de nivel 1+: podés hacer 1 objeto inanimado no mágico en el conjuro ser real por 1 minuto (no armas ni criaturas)." },
    ],
  },
  "Necromancer": {
    classId: "wizard",
    summary: "Maestro de la muerte; ejércitos de no-muertos.",
    features: [
      { level: 3, name: "Necromancy Savant / Grim Harvest", desc: "Copias de Necromancy spells cuestan la mitad. Grim Harvest: cuando matás una criatura con un conjuro, recuperás HP = 2 × nivel del slot (o 3 × para conjuros de Necromancy). No aplica a Undead y Constructs." },
      { level: 6, name: "Undead Thralls", desc: "Animate Dead agrega 1 criatura adicional. Tus undead ganán HP adicional = tu nivel Wizard, y usan tu PB en sus tiradas de daño." },
      { level: 10, name: "Inured to Undeath", desc: "Resistencia a Necrotic. Inmune a reducción de HP máximos." },
      { level: 14, name: "Command Undead", desc: "BA: un Undead en 60 ft hace ST CHA (tu DC) o queda bajo tu control 24h (Intelligent Undead con ventaja). Podés controlar hasta PB undead al mismo tiempo." },
    ],
  },
  "Transmuter": {
    classId: "wizard",
    summary: "Maestro del cambio; transforma materiales y cuerpos.",
    features: [
      { level: 3, name: "Transmutation Savant / Minor Alchemy", desc: "Copias de Transmutation spells cuestan la mitad. Minor Alchemy: en 10 min, podés transformar 1 pie cúbico de material (madera↔piedra↔metal↔arcilla↔cristal) temporalmente por hasta 1h." },
      { level: 6, name: "Transmuter's Stone", desc: "Podés gastar 8h para crear una piedra mágica que otorga 1 beneficio: Darkvision 60 ft; +10 ft speed; proficiency en CON ST; resistencia a Acid/Cold/Fire/Lightning/Thunder (elegís). La piedra dura hasta crear otra; podés transferirla." },
      { level: 10, name: "Shapechanger", desc: "Podés lanzar Polymorph sin gastar slot (en vos mismo). 1/SR." },
      { level: 14, name: "Master Transmuter", desc: "Acción: destruís la Transmuter's Stone para uno de: Polymorph (criatura en 10 ft → bestia de CR ≤ nivel/4); restaurar a Full HP y eliminar todas las condiciones negativas (criatura en 10 ft); curar una persona maldita/enfermedad/veneno; Touch of Rejuvenation (revivir a alguien muerto menos de 1 min)." },
    ],
  },
  "Conjurer": {
    classId: "wizard",
    summary: "Maestro de la invocación; conjuros y viaje entre planos.",
    features: [
      { level: 3, name: "Conjuration Savant / Minor Conjuration", desc: "Copias de Conjuration spells cuestan la mitad. Minor Conjuration: acción: conjurás un objeto de hasta 3 pies en un lado y 10 lbs, no mágico, de valor ≤ 1 gp (dura 1h, desaparece si sale de 10 ft)." },
      { level: 6, name: "Benign Transposition", desc: "1/LR (o cada vez que lanzás un Conjuration spell de nivel 1+): BA: teleportarte hasta 30 ft a un espacio desocupado, o intercambiar lugar con una criatura Willing en 30 ft." },
      { level: 10, name: "Focused Conjuration", desc: "Mientras concentrés en un conjuro de Conjuration, la concentración no puede ser rota por daño." },
      { level: 14, name: "Durable Summons", desc: "Criaturas invocadas por tus conjuros de Conjuration ganan 30 THP al ser invocadas." },
    ],
  },
  "Enchanter": {
    classId: "wizard",
    summary: "Maestro del encantamiento; controla mentes y aliados.",
    features: [
      { level: 3, name: "Enchantment Savant / Hypnotic Gaze", desc: "Copias de Enchantment spells cuestan la mitad. Hypnotic Gaze: acción: 1 criatura en 5 ft ST WIS (tu DC) o queda Charmed y Incapacitated (Speed 0) hasta el fin de tu próximo turno. Podés mantenerlo usando acción cada turno. 1 vez/criatura hasta LR." },
      { level: 6, name: "Instinctive Charm", desc: "Reacción al ser atacado por criatura en 30 ft: ST WIS (tu DC) o el atacante elige otro objetivo más cercano (si no hay, ataca igual). 1 vez/criatura hasta LR." },
      { level: 10, name: "Split Enchantment", desc: "Al lanzar un conjuro de Enchantment que target a 1 criatura, podés elegir 1 criatura adicional como segundo objetivo (sin gastar slot mayor)." },
      { level: 14, name: "Alter Memories", desc: "Cuando una criatura bajo un conjuro tuyo de Enchantment está Charmed: podés hacer que no recuerde haber sido Charmed (ST INT tu DC). Si falla: borrás hasta 1h de recuerdos desde un punto que designes." },
    ],
  },
};
