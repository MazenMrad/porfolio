export interface GameData {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  role: string;
  category: 'solo' | 'jam' | 'experiment';
  status: 'live' | 'prototype' | 'wip';
  year: string;
  cover: string;
  gallery: string[];
  video?: string[];
  genre: string[];
  engine: string;
  itchUrl?: string;
  xPost?: string;
  playable: boolean;
  features: string[];
  controls?: { action: string; input: string }[];
  team?: { members: string[]; myRole: string };
  timeline?: { date: string; title: string; body: string }[];
  summary?: string[];
  stats?: { plays: number; views: number };
  postmortem: {
    thought: string;
    mechanics: string;
    systems: string;
    architecture?: string;
    underTheHood?: string;
    lessons?: string;
  };
}

export const games: GameData[] = [
  /* ───────────────────────── SOLO ───────────────────────── */
  {
    id: 'obsidio',
    title: 'Obsidio',
    tagline: 'Skill-based tower defense, drag, aim, survive.',
    desc: 'Forget placing towers and watching them fight. In Obsidio you manually aim and fire every projectile with a satisfying drag-to-aim mechanic. Your aim matters more than tower placement. You are the weapon.',
    role: 'Solo Developer · 3-month build',
    category: 'solo',
    status: 'live',
    year: '2025',
    cover: '/media/obsidio/editor-capture.gif',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTM5NS5wbmc=/original/oyM2gz.png',
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTQwNS5wbmc=/original/q8BYG8.png',
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTQxOC5wbmc=/original/%2FhOWLS.png',
      '/media/obsidio/editor-capture.gif',
    ],
    genre: ['Tower Defense', 'Arcade', 'Strategy', 'Pixel Art'],
    engine: 'Godot 4.6',
    itchUrl: 'https://mazicore.itch.io/obsidio',
    playable: true,
    video: ['/media/obsidio/water-shader.mp4'],
    features: [
      'Drag-to-aim combat, feel the weight of every throw',
      '9 enemy types: Grunt, Knight, Runner, Shield Bearer, Archer, Bomber, Healer, Splitter, Giant',
      '5 unlockable weapons: Rock, Bow, Knife, Axe, Spear, each with unique physics',
      'Economy-driven ammo: every arrow costs coins, tension between spending and saving',
      '15 scaling waves, wave events (Double Coins / Armored / Fast), hold-to-buy upgrades',
    ],
    controls: [
      { action: 'Aim & Shoot', input: 'Left Mouse, drag to aim, release to fire' },
      { action: 'Switch Weapon', input: 'Q' },
      { action: 'Buy Arrows', input: 'B' },
      { action: 'Pause / Upgrade map', input: 'Escape / TAB' },
    ],
    stats: { plays: 113, views: 346 },
    timeline: [
      { date: '2025 · Q1', title: 'Prototype', body: 'First drag-to-aim throw in Godot, a single bouncing rock and a dummy target. The "you are the weapon" fantasy clicked.' },
      { date: '2025 · Q2', title: 'Core combat', body: 'Enemy base state machine, trajectory preview, and the 5-weapon physics set. Hit-stop and pooled damage numbers landed feel.' },
      { date: '2025 · Q2', title: 'Economy loop', body: 'Coins as a universal sink, arrows, upgrades, wall repair. Constant spend-vs-save tension replaced free firing.' },
      { date: '2025 · Q3', title: 'Campaign & waves', body: '15-wave curve, weighted spawn groups, and wave events (Double Coins / Armored / Fast) after wave 9.' },
      { date: '2025 · Q3', title: 'Polish & ship', body: 'Signal-architected HUD, ConfigFile save/load, circular-wipe transitions. Shipped live on itch.io with an active devlog.' },
    ],
    summary: [
      'Built solo in Godot 4.6 over ~3 months — a skill-based tower defense where you ARE the weapon.',
      'Drag-to-aim combat: every shot has weight and a real trajectory, not auto-fired towers.',
      'Economy loop makes every action a sink — spending coins on arrows vs. saving is the core tension.',
      'Signal-decoupled HUD: removing a node never crashes the game; enemies share one enemy_base.',
      'Honest gap: all enemies still use a placeholder sprite — art hurts first impressions more than systems.',
      'Live and playable on itch.io.',
    ],
    postmortem: {
      thought:
        'What if tower defense rewarded player skill instead of tower placement? In Obsidio you manually aim and fire every projectile, so the arc, the weight, and the cost of each shot matter. The fantasy is simple: you are the weapon, not a manager watching a battlefield.',
      mechanics:
        'You don\'t place towers, you are the tower. Drag to aim a projectile, watch the dotted trajectory preview, then release to fire.\n\nFive weapons, each with its own physics: the Rock bounces freely, the Bow costs coins and eases into its draw, and the Knife, Axe, and Spear are direct throws. Fire Arrows (unlockable) add a burn damage-over-time effect.\n\nEnemies are introduced gradually and each behaves differently: Shield Bearers block frontal hits (forcing arc shots), Healers buff nearby allies, Splitters divide on death, and Giants take three wall hits.',
      systems:
        'The run is a 15-wave campaign. Break times shrink as you progress (15s → 5s), spawns are weighted-random with per-type caps, and groups enter in staggered waves (frontline → mid → back → vanguard).\n\nAn economy loop drives the tension: kills and wave clears pay coins, and everything is a sink, wall repair, upgrades, arrows, weapon unlocks. You are always choosing whether to spend now or save for later.\n\nAfter wave 9, wave events kick in (Double Coins / Armored / Fast). Best wave, kills, and bonus arrows are saved via ConfigFile, and a seed system is already wired for a future daily-challenge mode.',
      architecture:
        'I kept the codebase decoupled so a feature can be ripped out without taking the game down. The HUD is pure signals, buttons.gd owns all HUD logic and emits typed events (upgrade_wall_pressed, buy_arrow_pressed, button_hover_changed) that main.gd and player.gd subscribe to, so removing a node never crashes the game.\n\nThree autoloads carry the infrastructure: global_var (game state, economy constants, seeds, save/load), PersistentScene (circular-wipe transitions), and ObjectPool (recycles projectiles and coins to avoid spawn spikes).\n\nEnemies share an enemy_base.gd, movement, attack state machine, death pipeline, armor, coin drops, health bars, and override behavior per type. Projectiles extend ProjectileBase, adding Line2D trails, ground-sticking, hit-stop (Engine.time_scale = 0 for 0.05s), and pooled damage numbers.',
      lessons:
        'Next up: unique enemy sprites to replace the current placeholders, boss waves at 5/10/15, and a meta-progression campsite between runs. The presentation-layer split (UI and audio as siblings of the game world) is the pattern I would carry into every future project.',
    },
  },
  {
    id: 'the-last-wager',
    title: 'The Last Wager',
    tagline: 'A short, atmospheric card game of psychological warfare.',
    desc: 'Outwit your opponent in a high-stakes gambling duel where nerve beats luck. Watch the AI heartbeat monitor to read their hand, then survive Debt Mode if your chips hit zero.',
    role: 'Solo Developer · Design, Code, Art',
    category: 'solo',
    status: 'live',
    year: '2025',
    cover: 'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg4OC5wbmc=/347x500/OVuFGb.png',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg4OC5wbmc=/original/vqmxgE.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg2My5wbmc=/original/kT6MwR.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg2NS5wbmc=/original/Ay8qka.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg5Ny5wbmc=/original/up4OoI.png',
    ],
    genre: ['Card Game', 'Pixel Art', 'Psychological', 'Singleplayer'],
    engine: 'Godot 4.6',
    itchUrl: 'https://mazicore.itch.io/the-last-wager',
    playable: true,
    video: ['/media/the-last-wager/editor-capture.mp4'],
    features: [
      'Emperor > Citizen > Slave > Emperor card triangle (rock-paper-scissors circle)',
      'Asymmetric betting: Slave role pays X, AI pays X×5; Emperor role reversed',
      'Heartbeat Monitor bluff system, AI BPM can lie, pot size raises the stakes',
      'Debt Mode, sign a wax-sealed contract, multi-sensory pressure, permadeath if you lose',
      '3-opponent gauntlet (The Crook, The Right Hand, The Boss) with side-switching every 3 rounds',
    ],
    controls: [
      { action: 'Drag cards & place bets', input: 'Mouse' },
      { action: 'Bet / Lock In', input: 'Mouse' },
    ],
    summary: [
      'Solo Godot card game reimagining Kaiji\'s "E-Card" duel as a top-down, Balatro-style prototype.',
      'Tension comes from reading the opponent, not luck — a heartbeat monitor is your only window into a lying AI.',
      'Asymmetric betting (Slave pays X, AI pays 5X) plus Debt Mode permadeath raise the stakes.',
      'All card logic lives in one readable core file (ui.gd); 44 shaders carry the mood.',
      'Honest gaps: no tutorial, heartbeat is currently decorative, known comparison/draw-loop bugs documented.',
      'Live and playable on itch.io.',
    ],
    stats: { plays: 55, views: 131 },
    postmortem: {
      thought:
        'The Last Wager reimagines Kaiji\'s "E-Card" duel from Kaiji: Ultimate Survivor as a top-down, Balatro-style prototype. I wanted a gambling duel where the tension comes from reading your opponent, not from luck, a game of nerve where a single heartbeat monitor is your only window into a lying AI.',
      mechanics:
        'You play twelve rounds against the Emperor using three card types in a Citizen > Slave > Emperor > Citizen circle (rock-paper-scissors).\n\nEach turn: drag a card from your hand into the slot, place a bet (1 / 5 / All-In), then Lock In. Cards flip and compare, the loser explodes. Every three matches you swap sides (Slave ↔ Emperor), which flips the bet multipliers. If you run out of chips mid-match, you take a loan and drop into Debt Mode.',
      systems:
        'Betting is asymmetric. As the Slave you pay X and the AI pays 5X; as the Emperor those roles reverse. You face a gauntlet of three opponents, each with its own risk, bluff, and accuracy profile.\n\nThe signature system is the Heartbeat Monitor. BPM maps to card type (Emperor = 40 calm, Citizen = 65, Slave = 100), but accuracy varies per opponent, so the AI can fake a calm Emperor or a nervous Citizen. Bigger pots raise the anxiety.\n\nDebt Mode is the fail state: a Shepard tone, tinnitus, chromatic aberration, and hit-distortion pile on the pressure. You must win a round to escape, or face permadeath.',
      architecture:
        'The card logic lives in one honest core file (ui.gd, ~1058 lines) that owns betting, comparison, payout, debt, and round flow, I resisted splitting it prematurely, so the rules stay in one place you can actually read. Around it, main.tscn is the scene root: CardManager routes audio, playerhand/opponenthand hold the two hands, and a Control-based ui node carries the overlays (slave_win, emperor_wins, accept_loan_screen, heartbeatmonitor).\n\nCards move through a clear drag-and-drop state machine (IN_HAND → PLACING → PLACED → EXPLODING) with wobble, peek, and flip tweens. 44 shader files carry the mood, foil, chromatic aberration, CRT, heartbeat, hurt, spotlight, and a MusicManager autoload keeps the BGM playing across scene reloads.',
      lessons:
        'To make this commercial I would give the Heartbeat Monitor a real mechanical hook, letting the player Call a bluff or Fold instead of only watching it. I would also add a short tutorial and a post-campaign mode or branch so beating the three opponents is not a dead end. The hover-lock during the Lock In window is the one fix I would port forward first.',
    },
  },

  /* ─────────────────────── JAM & TEAM ─────────────────────── */
  {
    id: 'pawns-gambit',
    title: "Pawn's Gambit",
    tagline: 'Turn-based chess-inspired strategy, built in a game jam.',
      desc: 'A turn-based strategy game inspired by chess, but not actual chess. Build a small team of Attackers and Supporters, clear waves of enemies, and grow stronger each round. Made for Queble Jam 2026.',
    role: 'Team (4) · 2D Artist + Godot Programmer',
    category: 'jam',
    status: 'live',
    year: '2026',
    cover: 'https://img.itch.zone/aW1hZ2UvNDI3NDIyMi8yNTQ3ODA5MS5wbmc=/347x500/3Q9xve.png',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvNDI3NDIyMi8yNTQ3ODA5MS5wbmc=/original/y4h6aH.png',
      'https://img.itch.zone/aW1hZ2UvNDI3NDIyMi8yNTQ3ODA4OS5wbmc=/original/EK8CFZ.png',
      'https://img.itch.zone/aW1hZ2UvNDI3NDIyMi8yNTQ3ODA5MC5wbmc=/original/wrBt8A.png',
      'https://img.itch.zone/aW1hZ2UvNDI3NDIyMi8yNTQ3ODE4MC5wbmc=/original/gNrZ7Y.png',
    ],
    genre: ['Strategy', 'Turn-Based', 'Singleplayer'],
    engine: 'Godot',
    itchUrl: 'https://chen-alterwho.itch.io/pawns-gambit',
    playable: true,
    features: [
      'Turn-based combat on a board with Attackers and Supporters',
      'Each piece has unique roles and abilities',
      'Waves grant a new ability after clearing, opening new strategies',
      'Built in 1 week for Queble Jam 2026 by a team of 4',
    ],
    team: {
      members: ['Chen_Alter<WHO>', 'Mazen (Mazicore)', 'Taylor Kirkwood', 'Dev Wizlo'],
      myRole:
        '2D pixel artist, created the UI, game assets, and character/Environment art, and a Godot programmer implementing move mechanics, fixing bugs, and helping the combat feel correct under jam crunch.',
    },
    summary: [
      'Chess-inspired turn-based tactics built in 1 week for Queble Jam 2026 by a team of 4.',
      'My role: 2D pixel artist (UI, assets, character/environment art) + Godot programmer on move mechanics.',
      'Pieces split into Attackers and Supporters; clearing a wave unlocks new abilities.',
      'Clean art/code split let the team ship a playable build under jam crunch.',
      'Lesson: scope discipline and clear art direction beat feature count in a week.',
      'Released on itch.io.',
    ],
    postmortem: {
      thought:
        'Pawn\'s Gambit asks a simple question: what if a chess-inspired tactics game played nothing like chess? The pitch is "you are a pawn who defies fate" - small teams of pieces with distinct abilities clear waves, and the challenge is making that readable and characterful under a one-week jam deadline.',
      mechanics:
        'Turn-based on a board. Left-click-drag to aim a move, right-click to cancel, and click End Turn to pass. Each piece acts once per turn: one attack and one ability.\n\nPieces come in two classes, Attackers and Supporters, each with its own role. Clearing a wave grants a new ability, so your team grows stronger as the run goes on.',
      systems:
        'Encounters are wave-based: each cleared wave unlocks new options, and the first turn alternates every wave so neither side gets a permanent edge. Hovering a piece shows its stats and role.\n\nA debug shortcut (Backspace destroys the hovered piece) was left in on purpose so judges could skip to the ending.',
      architecture:
        'Built in Godot by a 4-person team in one week, with a clean split between art and code. My programming work focused on the move-mechanics layer in GDScript, making piece movement and ability resolution resolve correctly under jam crunch, plus general bug fixing to keep the build stable. All art and UI were drawn in Aseprite and wired into the Godot scenes.',
      lessons:
        'The takeaway from the week: a clear art direction plus correct core mechanics beat a long feature list, and the art-plus-code split across four people is exactly the pipeline I want to keep working in. Next time I would scope tighter to ship a finished build rather than an ambitious but broken one.',
    },
  },
  {
    id: 'biscuit-zone',
    title: 'Biscuit Zone',
    tagline: 'A platformer with skips, speedrun mechanics, and shooting.',
    desc: 'A platformer built for Brackeys Game Jam 2025.2 with skips, speedrun mechanics, and a little bit of shooting. Made by a team of 3.',
    role: 'Team (3) · Art + Bug Fixes',
    category: 'jam',
    status: 'prototype',
    year: '2025',
    cover: 'https://img.itch.zone/aW1hZ2UvMzg1MTI4Ni8yMjk4MTUxNC5wbmc=/347x500/WwxqOQ.png',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvMzg1MTI4Ni8yMjk4MTUxNC5wbmc=/original/WiT1N%2B.png',
    ],
    genre: ['Platformer', 'Shooter', 'Speedrun'],
    engine: 'Godot + Aseprite',
    itchUrl: 'https://sanskalm0.itch.io/biscuitzone',
    playable: true,
    features: [
      'Platforming with skip and speedrun mechanics',
      'Light shooting gameplay',
      'Built for Brackeys Game Jam 2025.2 by a team of 3',
    ],
    team: {
      members: ['sanskalm0', 'Mazen (Mazicore)', 'X1lex'],
      myRole:
        'Produced most of the game\'s art and handled miscellaneous bug fixes throughout the jam to keep the build stable.',
    },
    summary: [
      'Fast, skip-heavy platformer with light shooting, built for Brackeys Game Jam 2025.2 by a team of 3.',
      'My role: produced most of the game\'s art and handled bug fixes to keep the prototype stable.',
        'Movement is momentum-based and responsive.',
      'Lesson: nailing one system (here, platforming feel) matters more than breadth in a 1-week jam.',
      'Playable on itch.io.',
    ],
    postmortem: {
      thought:
        'Biscuit Zone is a fast, skip-heavy platformer with a bit of shooting, built for Brackeys Game Jam 2025.2. The bet was that nailing one system, movement feel, would carry the whole jam entry.',
      mechanics:
        'Movement-first platforming built around skips and speedrun tech, responsive and momentum-based, with a little shooting on top. The goal was feel.',
      systems:
        'A compact jam-scale loop: hand-built levels, a skip/shoot toolkit, and just enough feedback (timing, hits, flow) to make speedrunning legible.',
      architecture:
        'A Godot project with art authored in Aseprite, built by a 3-person team. My role was mostly art production, with supporting bug fixes throughout the jam to keep the prototype standing.',
      lessons:
        'Nailing one system, here platforming responsiveness, matters more than breadth in a one-week jam, and strong art direction early is what makes that system land. I would protect movement feel first and trim scope everywhere else.',
    },
  },

  /* ─────────────────────── EXPERIMENTS ─────────────────────── */
  {
    id: 'spectra-signals',
    title: 'SIGNALS',
    tagline: 'A Cold War radio-operator mystery where every transmission has consequences.',
      desc: 'A solo-developed narrative mystery in Unity. Across 5 shifts you intercept radio transmissions and classify them as REPORT or DISCARD, and every choice weighs Loyalty, Morals, and Competence. A learning project that grew into a complete MVP.',
    role: 'Solo Developer · Unity',
    category: 'experiment',
    status: 'prototype',
    year: '2026',
    cover: '/media/spectra-signals/gameplay.gif',
    gallery: [
      '/media/spectra-signals/gameplay.gif',
      '/media/spectra-signals/extra-1.gif',
      '/media/spectra-signals/extra-2.gif',
    ],
    genre: ['Narrative', 'Mystery', 'Social Deduction', 'Singleplayer'],
    engine: 'Unity 2022.3',
    xPost: 'https://x.com/CoreMazi27888/status/2031676118676210104',
    playable: false,
    video: ['/media/spectra-signals/gameplay.mp4'],
    features: [
      '5 shifts × 3 transmissions (15 total) with branching consequences',
      '3 hidden scores: Loyalty, Moral, Competence (all start at 50)',
      '4 outcomes: The Loyal Operator, The Saboteur, The Broken, The Failed Operator',
      'A propaganda field manual that hides the previous operator\'s warnings',
      'Newspaper clippings that mirror your choices and hint at the November 3rd mystery',
    ],
    controls: [
      { action: 'Tune radio / classify', input: 'Mouse' },
      { action: 'REPORT / DISCARD stamp', input: 'Mouse' },
    ],
    summary: [
      'Solo Unity narrative mystery: a Cold War radio operator classifying transmissions as REPORT or DISCARD.',
      'Every choice trades three hidden scores — Loyalty, Moral, Competence — across 4 endings.',
      'The field manual is propaganda; the only moral path is reading the previous operator\'s hidden notes.',
      'Architected around isolated singleton managers; clean controller chain via one ScriptableObject.',
      'Honest gaps: MVP unverified end-to-end, no store page, some fragile auto-finding.',
      'Built in Unity as a learning project; no executable yet — dev post on X.',
    ],
    postmortem: {
      thought:
        'SIGNALS asks: you intercept a transmission that doesn\'t match any authorized frequency. Do you REPORT it, or DISCARD it? It is a Cold War radio-operator mystery built around moral ambiguity, with no clear heroes and every choice trading loyalty, conscience, and competence.',
      mechanics:
        'The core loop is a single shift: tune the radio → listen to a transmission → read the typewriter transcription → stamp it REPORT or DISCARD → take the consequence → next shift.\n\nThere are four message types (Routine, Dissident, Disinformation, Loyalty Test), each with one correct call. The twist: the field manual is propaganda built to push you toward reporting. The only moral path is reading the previous operator\'s hidden notes.',
      systems:
        'Three hidden scores, Loyalty, Morals, Competence (0–100), track every decision and decide one of four endings. A consequence queue gives in-shift feedback, and end-of-shift newspaper clippings mirror your choices while advancing the November 3rd mystery.\n\nThe MVP also ships fade transitions, an options menu (volume / sensitivity sliders), and a manual with unlockable NOTES tabs.',
      architecture:
        'I structured SIGNALS around a spine of singleton managers so each concern stays isolated: ShiftManager drives shift/scene/message flow, ShiftOutcomeTracker records decisions and the hidden scores, ShiftNarrativeBuilder generates headlines and bulletins, and AudioManager persists BGM via DontDestroyOnLoad.\n\nGameplay reads as a clean chain, RadioDialController → TranscriptionController → StampController, all pulling from one RadioMessage ScriptableObject (frequency, type, transcription, correct action, score deltas, consequences). An InteractionManager toggles Free-Look / Interaction modes, and interactables (radio, paper, manual) open their UI. Progress saves to PlayerPrefs and auto-saves after every shift.',
      lessons:
        'The MVP is feature-complete but untested end-to-end and not yet built to an executable, so the next step is a full playthrough pass and a store page. The bigger win: building SIGNALS in Unity taught me event-driven scoring, ScriptableObject data modeling, and narrative system design that I now carry into my Godot work.',
    },
  },

  /* ─────────────────── YOMIH MOD / EXPERIMENT ─────────────────── */
  {
    id: 'partitio-yellowili',
    title: 'Partitio Yellowili',
    tagline: 'A resource-economy fighter built inside YOMIH, learned from zero.',
    desc: 'A custom character mod for YOMIH (Your Only Move Is Hustle), a Steam game. It adds three original systems: Boost Points that empower attacks on a timer, a leaves economy earned by every hit, and NPC allies you can summon. Built by ramping on an engine I had never opened. Still in progress.',
    role: 'Solo Modder · YOMIH (Godot 3)',
    category: 'experiment',
    status: 'wip',
    year: '2026',
    cover: '/media/partitio-yellowili/boost-multihit.gif',
    gallery: [
      '/media/partitio-yellowili/partitio-still.png',
      '/media/partitio-yellowili/boost-multihit.gif',
    ],
    video: [
      '/media/partitio-yellowili/latest-showcase.mp4',
      '/media/partitio-yellowili/npc-spawn.mp4',
    ],
    genre: ['Fighting', 'Mod', 'Godot', 'Systems'],
    engine: 'YOMIH (Steam, Godot 3)',
    playable: false,
    features: [
      'Boost Points: a 0 to 5 resource that builds on a timer and empowers attacks',
      'Rags to Riches: every connecting hit pays leaves equal to half the damage dealt',
      'Hired Help: spend leaves to summon an NPC ally for the round',
      'Custom animations authored from scratch for the character',
    ],
    postmortem: {
      thought:
        'YOMIH (Your Only Move Is Hustle) is a Steam game with a real-time fighting engine I had never touched. The challenge was not drawing a fighter, it was shipping a resource economy inside an engine with a tick architecture I had to learn from scratch. Three systems in, the interesting part became reading someone else\'s engine well enough to extend it without breaking it.',
      mechanics:
        'Boost Points are a 0 to 5 resource that builds on a timer (about 1 BP every 1.67 seconds). Spend them to make a normal hit multiple times, or to add a damage multiplier to a skill.\n\nRags to Riches pays leaves on every connecting hit, equal to half the damage dealt. Spend leaves to buff an attack to 1.5x damage, or to summon help.\n\nHired Help lets you spend leaves to summon an NPC ally for the round. The summon spawns correctly, but the ally does not act yet. Tier, cost, and roster are still in progress.',
      systems:
        'Boost Points tick up inside tick_before and auto-consume when you enter an attack or skill state, so the resource spends itself the moment you commit.\n\nLeaves are earned on the attacker side through _on_hit_something, which avoids the defender-side wiring trap, and they gate both attack buffs and summons.\n\nNPC summon spawns an inherited scene rather than swapping scripts at runtime, which removes a class of vtable bugs.',
      underTheHood:
        'Working inside YOMIH meant debugging its three-layer tick loop: _physics_process to process_tick to game.tick. The standout was the IOOT race condition: a boosted multi-hit could hand the opponent a turn mid-combo because state_interruptable re-enabled between loop cycles. The fix suppresses the opponent\'s interrupt flag on hit and every tick after, so the combo resolves on your turn.\n\nOther fixes covered projectile direction double-flips when facing left, a missing sub_resource that crashed the scene parser, and a stale hitbox_start_frames dictionary that made unboosted normals whiff. The NPC now spawns without the old vtable crash, but its in-match behavior is the remaining unsolved piece.',
      lessons:
        'Two economy systems are working and the animation set is growing. The open piece is NPC behavior: the ally now spawns through the inherited-scene path, but its state machine is not driving yet, so it stands idle. Next: wire the NPC\'s combat logic, tune the leaves cost table, and ship the shop that gates tiers. The bigger takeaway is that ramping on an unfamiliar engine taught me to read tick architecture before writing a line, and that habit is what let the systems ship.',
    },
  },
];

export const getGame = (slug: string): GameData | undefined =>
  games.find((g) => g.id === slug);
