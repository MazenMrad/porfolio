export interface GameData {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  role: string;
  category: 'solo' | 'jam' | 'experiment' | 'client';
  status: 'live' | 'prototype' | 'wip';
  year: string;
  cover: string;
  gallery: string[];
  video?: string[];
  videoNotes?: string[];
  genre: string[];
  engine: string;
  itchUrl?: string;
  xPost?: string;
  playable: boolean;
  featured?: boolean;
  hook?: string;
  features: string[];
  controls?: { action: string; input: string }[];
  team?: { members: string[]; myRole: string };
  client?: { myRole: string };
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
    tagline: 'You don\'t place towers. You are the weapon.',
    hook: 'Typical tower defense: watch. This one: aim.',
    desc: 'Forget placing towers and watching them fight. In Obsidio you manually aim and fire every projectile with a satisfying drag-to-aim mechanic. Your aim matters more than tower placement. You are the weapon.',
    role: 'Solo programmer · Godot 4.6 · 3-month ship',
    category: 'solo',
    status: 'live',
    featured: true,
    year: '2025',
    cover: '/media/obsidio/editor-capture.gif',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTM5NS5wbmc=/original/oyM2gz.png',
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTQwNS5wbmc=/original/q8BYG8.png',
      'https://img.itch.zone/aW1hZ2UvMzgzMjY3NS8yODA0OTQxOC5wbmc=/original/%2FhOWLS.png',
      '/media/obsidio/editor-capture.gif',
    ],
    genre: ['Tower Defense', 'Arcade', 'Strategy', '2D'],
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
    tagline: 'Read a lying heartbeat. Then bet.',
    hook: 'Luck is the decoy. The real game is reading the other seat.',
    desc: 'A high-stakes E-Card duel where nerve beats luck. Play the original AI gauntlet on itch, or sit a second player at the table: host-authoritative PvP over Ezcha Network join codes or LAN. The Slave reads a heartbeat tell after the Emperor commits. The opponent hand never rides the wire.',
    role: 'Solo programmer · Design + systems + ship',
    category: 'solo',
    status: 'live',
    year: '2025–2026',
    cover: 'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg4OC5wbmc=/347x500/OVuFGb.png',
    gallery: [
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg4OC5wbmc=/original/vqmxgE.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg2My5wbmc=/original/kT6MwR.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg2NS5wbmc=/original/Ay8qka.png',
      'https://img.itch.zone/aW1hZ2UvNDE1MDIwMC8yNDczOTg5Ny5wbmc=/original/up4OoI.png',
    ],
    genre: ['Card Game', 'Psychological', 'Multiplayer', 'Singleplayer', '2D'],
    engine: 'Godot 4.6',
    itchUrl: 'https://mazicore.itch.io/the-last-wager',
    playable: true,
    video: ['/media/the-last-wager/editor-capture.mp4'],
    features: [
      'Two-player table: Ezcha Network join codes on web, ENet LAN on desktop',
      'Host-authoritative intents; redacted views so the opponent hand never leaves the host',
      'Heartbeat tell for the Slave after the Emperor commits (intensity band, not the card)',
      'Rounds rebuild in place so both clients stay on the same table (no scene reload)',
      'Bankrupt knockout after a decisive round, or play out twelve rounds',
      'Emperor > Citizen > Slave > Emperor card triangle (rock-paper-scissors circle)',
      'Asymmetric betting: Slave pays X, Emperor pays X×5',
      'AI gauntlet (The Crook, The Right Hand, The Boss) and Debt Mode on the singleplayer path',
    ],
    controls: [
      { action: 'Drag cards & place bets', input: 'Mouse' },
      { action: 'Bet / Lock In', input: 'Mouse' },
      { action: 'Host LAN or join by code', input: 'Online lobby' },
    ],
    timeline: [
      {
        date: '2025',
        title: 'AI gauntlet ships',
        body: 'Shipped the itch prototype: three-opponent gauntlet, asymmetric betting, Debt Mode, and a table whose tension is supposed to come from reading a heartbeat.',
      },
      {
        date: '2026 · Q3',
        title: 'Two-player table',
        body: 'Sat a second human at the same scene. Host-authoritative intents over Ezcha Network join codes and ENet LAN, redacted views, in-place round rebuild, bankrupt knockout.',
      },
    ],
    summary: [
      'Solo Godot card game reimagining Kaiji\'s "E-Card" duel as a top-down, Balatro-style prototype.',
      'Tension comes from reading the opponent, not luck. Online, the Slave gets a heartbeat tell after the Emperor commits.',
      'Host-authoritative PvP: clients send intents (sit, commit, raise). The host broadcasts events and redacted views.',
      'Ezcha Network relay for join codes; ENet LAN for desktop. Same table, two transports.',
      'The itch page still hosts the original gauntlet. The two-player table lives in the current Godot project.',
      'Honest gaps on the singleplayer path: no tutorial, heartbeat is still more mood than mechanic, known comparison/draw-loop bugs documented.',
    ],
    stats: { plays: 55, views: 131 },
    postmortem: {
      thought:
        'The Last Wager reimagines Kaiji\'s "E-Card" duel from Kaiji: Ultimate Survivor as a top-down, Balatro-style prototype. I wanted a gambling duel where the tension comes from reading your opponent, not from luck. Against the AI that means a heartbeat monitor. Against a person it means sitting two players at the same table without ever putting the hidden hand on the wire.',
      mechanics:
        'You play twelve rounds using three card types in a Citizen > Slave > Emperor > Citizen circle (rock-paper-scissors).\n\nEach turn: drag a card from your hand into the slot, place a bet (1 / 5 / All-In), then Lock In. Cards flip and compare, the loser explodes. Every three matches you swap sides (Slave ↔ Emperor), which flips the bet multipliers. If you run out of chips mid-match on the singleplayer path, you take a loan and drop into Debt Mode.\n\nOnline, two players sit at that same table. The Emperor commits first. The Slave then sees a heartbeat tell (an intensity band, not the card itself) and commits. Raises go through the host; a second raise after you already have chips in is a no-op. Rounds rebuild in place. A bankrupt player is knocked out after a decisive round; otherwise you play out twelve. Win and lose screens return to the menu, not the gauntlet.',
      systems:
        'Betting is asymmetric. As the Slave you pay X and the Emperor pays 5X; those roles reverse when you swap seats. The singleplayer path is a gauntlet of three opponents, each with its own risk, bluff, and accuracy profile.\n\nThe signature system is the Heartbeat Monitor. BPM maps to card type (Emperor = 40 calm, Citizen = 65, Slave = 100). Online, that tell is earned: it fires for the Slave after the Emperor has committed, as an intensity band rather than a leaked card type. The host never broadcasts the opponent hand.\n\nDebt Mode stays on the singleplayer fail state: a Shepard tone, tinnitus, chromatic aberration, and hit-distortion. You must win a round to escape, or face permadeath.',
      architecture:
        'The card logic still lives in one readable core file (ui.gd) that owns betting, comparison, payout, debt, and round flow. Around it, main.tscn is the scene root: CardManager routes audio, playerhand/opponenthand hold the two hands, and a Control-based ui node carries the overlays.\n\nOnline is an overlay on that table, not a second game. A NetManager autoload is the authority: clients send intents (sit, commit, raise, leave); the host validates them, mutates match state, and broadcasts events plus a redacted per-peer view. Ezcha Network is the WebSocket relay for join codes; ENet is the LAN path. Both feed the same peer.\n\nCards still move through a drag-and-drop state machine (IN_HAND → PLACING → PLACED → EXPLODING). 44 shader files carry the mood. Reloading the match scene to start the next round is what used to desync two clients, so rounds now rebuild in place.',
      lessons:
        'The first two-player bugs were all about treating a second client like a second singleplayer: reloading the scene dropped the peer, paying out locally on top of host events doubled coins, and firing round_started before the new view made the joiner play a stale round. Views go out first. The table stays in the scene. The host is the only one who scores.\n\nTo make this commercial I would still give the Heartbeat Monitor a real mechanical hook on the singleplayer path, Call or Fold instead of only watching it, plus a short tutorial so beating the three opponents is not a dead end.',
    },
  },

  /* ─────────────────────── JAM & TEAM ─────────────────────── */
  {
    id: 'pawns-gambit',
    title: "Pawn's Gambit",
    tagline: 'Chess-inspired tactics that play nothing like chess.',
    hook: 'One week. Four people. I owned move mechanics in Godot.',
    desc: 'A turn-based strategy game inspired by chess, but not actual chess. Build a small team of Attackers and Supporters, clear waves of enemies, and grow stronger each round. Made for Queble Jam 2026.',
    role: 'Team (4) · Godot programmer + 2D assets',
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
        'Godot programmer on move mechanics, ability resolution, and combat feel under jam crunch — plus UI and 2D assets so the board read in a week.',
    },
    summary: [
      'Chess-inspired turn-based tactics built in 1 week for Queble Jam 2026 by a team of 4.',
      'My role: Godot programmer on move mechanics, plus UI/2D assets under jam crunch.',
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
    tagline: 'A skip-heavy platformer shipped in a Brackeys jam.',
    hook: 'The bet: nail movement feel, then stop adding systems.',
    desc: 'A platformer built for Brackeys Game Jam 2025.2 with skips, speedrun mechanics, and a little bit of shooting. Made by a team of 3.',
    role: 'Team (3) · Build stability + production',
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
        'Kept the jam prototype standing — bug fixes throughout the week — and produced the bulk of the in-game art so the platforming read at a glance.',
    },
    summary: [
      'Fast, skip-heavy platformer with light shooting, built for Brackeys Game Jam 2025.2 by a team of 3.',
      'My role: keep the build stable (bug fixes) and ship production art so movement feel landed.',
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

  /* ─────────────────────── CLIENT ─────────────────────── */
  {
    id: 'grid-inventory',
    title: 'Grid Inventory',
    tagline: 'Add loot in the editor. Pick it up in 3D. The UI never owns the world.',
    hook: 'A Godot inventory plugin: grid loot, nested bags, equipment.',
    desc: 'A Godot 4 plugin for extraction-style inventory, made for a client. Tab opens Pockets, Stash, equipment slots, and a hotbar. Items occupy cells by shape. Equipping a backpack or chest rig opens that bag as its own grid. A 3D demo lets you walk up to loot, press E, and the world only sends an id.',
    role: 'Client programmer · Godot 4 plugin',
    category: 'client',
    status: 'prototype',
    year: '2026',
    cover: '/media/grid-inventory/cover.png',
    gallery: ['/media/grid-inventory/cover.png'],
    video: [
      '/media/grid-inventory/world-pickup.mp4',
      '/media/grid-inventory/equip-screen.mp4',
      '/media/grid-inventory/belt-hotbar.mp4',
    ],
    videoNotes: [
      '3D demo: look at loot, press E to pick up, Tab for the overlay. The world never talks to the UI except through an id.',
      'Full screen: Pockets, Stash, helmet / vest / belt / backpack / rig, primary and secondary weapons.',
      'Equip a belt and the hotbar grows. Those extra slots live on the belt, so unequip does not spill items.',
    ],
    genre: ['Inventory', 'Plugin', 'UI', '3D'],
    engine: 'Godot 4.6',
    playable: false,
    client: {
      myRole:
        'Made for a client from a written spec: a drop-in Godot inventory plugin. I owned the addon, the designer workflow, and the tests. Nested bags, equipment, belt-backed hotbar, and 3D pickup. Their game talks to it through an id.',
    },
    features: [
      'Tab overlay: Pockets, Stash, equipment, character preview; hotbar stays on screen',
      'Items occupy cells by shape (1x1 through L and T). Rotate with R. Green if it fits, red if not',
      'Equip helmet, vest, belt, backpack, rig, primary and secondary. Occupied slots reject a second drop',
      'Equipping a backpack or chest rig opens that bag’s grid. Unequip keeps the contents inside the bag',
      'Belt grows the hotbar. Extra slots belong to the belt, so taking it off never dumps loot on the floor',
      'Drop into a closed bag without opening it. Nested bags cannot contain themselves (depth cap 8)',
      '3D pickup: WASD, E, Tab, Esc. Raycast reads an id; inventory decides where the item lands',
      'Right-click: Open, Customize (attachments), Use, Combine, Drop. New items are editor data, not scripts',
      '152 unit tests, 549 asserts: placement, save/load, pickup routing, belt storage',
    ],
    controls: [
      { action: 'Move (3D demo)', input: 'WASD' },
      { action: 'Pick up', input: 'E' },
      { action: 'Open / close inventory', input: 'Tab' },
      { action: 'Free cursor', input: 'Esc' },
      { action: 'Drag / drop', input: 'Left Mouse' },
      { action: 'Rotate while dragging', input: 'R' },
      { action: 'Use hotbar', input: '1–4 (grows with belt)' },
      { action: 'Context menu', input: 'Right Mouse' },
    ],
    timeline: [
      { date: '2026 · Jul', title: 'Core grids', body: 'Definition vs instance split, multi-grid drag, rotation, filters, nested bags, silent transfer into closed containers.' },
      { date: '2026 · Jul', title: 'Full screen', body: 'Pockets, Stash, non-grid equip slots, backpack/rig binders, persistent hotbar. Tab overlay on a 3D demo.' },
      { date: '2026 · Jul', title: 'Capability pass', body: 'Save/load, pickup routing, combine recipes, rolled stats, layout profiles. GUT suite brought to 152/152.' },
      { date: '2026 · Aug', title: 'Belt storage', body: 'Belt-granted hotbar slots write into the belt itself, so unequip never spills or deletes items.' },
    ],
    summary: [
      'Godot 4 plugin made for a client: Tarkov-style grid inventory with Pockets, Stash, equipment, nested bags, and a hotbar.',
      'Designers add items in the Inspector. No script required to add a medkit, backpack, or magazine.',
      '3D world only sends an id. Cameras and raycasts stay in the game; inventory stays in the plugin.',
      'Belt is real storage: extra hotbar slots belong to the belt, so unequip does not dump items.',
      '152 unit tests (549 asserts) on placement, persistence, pickup, and belt storage.',
      'Not on the Asset Library yet. Split-stack UI and player-facing tooltips are still open.',
    ],
    postmortem: {
      thought:
        'A client needed a grid inventory a designer can fill without calling a programmer. This plugin is that piece: items on a grid, bags that hold bags, equipment slots, a hotbar backed by the belt, and a 3D pickup demo that never lets the world own the UI.',
      mechanics:
        'Tab opens the overlay. Left column is storage: Pockets on top, Stash below. Equipping a backpack or chest rig adds that bag’s grid under Pockets. Center is equipment: Helmet, Vest, Belt, Backpack, Rig, plus Primary and Secondary weapons. The hotbar stays at the bottom whether the overlay is open or closed. Esc frees the cursor so you can drag without turning the camera.\n\nClick an item to pick it up. It follows the cursor. R rotates 90 degrees. Cells light green if it fits, red if it does not. Type and tag filters block illegal drops. A failed drop goes back where it started. Occupied equip slots reject a second item; you unequip first.\n\nRight-click opens Open / Customize / Use / Combine / Drop. Storage bags open as floating windows. Weapons open an attachments panel instead of a bag. You can still drop into a closed bag: hover shows the footprint, a valid drop inserts without opening the window.\n\nNumber keys use the hotbar. Base size is 4. Equip a belt and extra slots appear. Those slots are the belt’s own cells, so taking the belt off keeps every item inside it.',
      systems:
        'Each item has two layers. The definition is the template in the editor: size, filters, whether it is a bag, attachment mounts, charges, durability. The instance is what exists in play: stack count, rotation, grid cell, rolled stats, and whatever is stored inside it.\n\nA coordinator finds every open grid and slot and hit-tests from the top window down, so a bag on top of the backpack wins the click. Nested bags cannot contain themselves. Depth stops at 8. Closing a parent bag closes the windows inside it.\n\nPickup walks a priority list: top up matching stacks first, then best-fit a free cell, then report no room. Save/load writes a versioned JSON snapshot of the whole graph, including bags sitting in the 3D world.',
      architecture:
        'It ships as a Godot editor plugin. Grids preview live in the Inspector. Sample items, shapes, and loadouts ship with the addon so a team can run the demos without making art first.\n\nThe inventory code never touches cameras or raycasts. In the 3D demo, looking at loot reads an id, an adapter turns that id into the real item, and the coordinator decides which grid it lands in. World code stays world code. UI stays UI.\n\nTests: 152 passing, 549 asserts, across placement, persistence, pickup routing, belt storage, and a parse gate. Still open: split-stack UI, a player-facing tooltip panel, and an Asset Library listing.',
      lessons:
        'If a designer needs a script to add a medkit, the plugin failed. The belt bug was the same lesson: extra hotbar slots that do not belong to an item will spill on unequip. Tests caught rotation and nested-bag cases that playtesting missed. Next step is a clean addon repo, not more demo content.',
    },
  },
  {
    id: 'turn-based-combat',
    title: 'Turn-Based Combat',
    tagline: 'Click a unit. Pick an ability. The rules file decides hit, armor, and morale.',
    hook: 'Tactics combat you can replay from a seed.',
    desc: 'Combat rules for a client\'s isometric tactics game. Click a unit, pick Bolt or Stunbolt, and the rules object resolves hit, crit, armor shields, and daze. Every roll goes through a seeded RNG, so the same fight can be replayed. Between battles, health sticks. Dead units stay off the roster. Art, map, and unit sprites are the client\'s.',
    role: 'Client programmer · combat systems',
    category: 'client',
    status: 'prototype',
    year: '2026',
    cover: '/media/turn-based-combat/cover.png',
    gallery: ['/media/turn-based-combat/cover.png'],
    video: [
      '/media/turn-based-combat/ability-select.mp4',
      '/media/turn-based-combat/battle-field.mp4',
    ],
    videoNotes: [
      'Pick an ability: Bolt, Stunbolt, Skip Turn. Tooltips show range, strength %, and status chance. Grid tile highlights the target.',
      'Wait-for-action: SELECT ABILITY, selected-unit panel, overhead HP and silver shield icons.',
    ],
    genre: ['Tactics', 'Combat'],
    engine: 'Godot 4.6',
    playable: false,
    client: {
      myRole:
        'Made for a client from a written spec: the combat rules layer inside their tactics game. I owned hit/crit/armor/morale math, seeded RNG, the battle state machine, and the tests. Art, units, and the isometric map are theirs.',
    },
    features: [
      'Isometric grid battle: click a unit, pick an ability, resolve the attack',
      'Abilities the client authored (Bolt, Stunbolt, Stab, Axeblade) run through the same rules object',
      'Ability panel shows range, strength %, status, and chance (Stunbolt: 50% daze at range 4)',
      'Overhead HP plus silver shield icons for remaining armor. Selected-unit card shows class and current / max health',
      'Accuracy 1–10 sets hit and crit. A physical hit spends one armor shield, then health',
      'Faster units act first. Speed above 10 always goes before everyone else',
      'End of a real turn: morale check. Fail: -2 speed next round. Morale 10 cannot fail',
      'Between battles, health carries over. Dead units cannot be deployed again',
      'Unit tests prove the same seed produces the same rolls. Combat is not allowed to auto-heal',
    ],
    controls: [
      { action: 'Select unit / tile', input: 'Left Mouse' },
      { action: 'Choose ability', input: 'Bolt / Stunbolt / Stab / Axeblade' },
      { action: 'Skip turn', input: 'Skip Turn' },
    ],
    timeline: [
      { date: '2026 · Jul', title: 'Rules spec', body: 'Six stats, armor shields, accuracy table, morale table, seeded RNG. One autoload owns every threshold.' },
      { date: '2026 · Jul', title: 'Battle loop', body: 'State machine: setup, start turn, wait for action, resolve attack, check victory, end turn + morale.' },
      { date: '2026 · Jul', title: 'Campaign attrition', body: 'Health persists between fights. Dead units leave the roster. Heal only at explicit campaign points.' },
      { date: '2026 · Aug', title: 'Client battle', body: 'Wired into the client\'s isometric map: ability bar, selected-unit panel, HP and shield icons, wait-for-action state.' },
    ],
    summary: [
      'Made for a client. I built the combat rules the battle uses: hit, crit, armor, morale, turn order.',
      'One rules object owns the numbers. Units and abilities do not hide magic values in their scripts.',
      'Seeded random rolls: same seed, same fight. That is what makes the tests possible.',
      'On screen: isometric grid, ability bar, selected-unit card, overhead HP and shield icons.',
      'Campaign layer: health persists, death is permanent until an explicit heal point.',
      'Tests cover RNG, turn order, morale, campaign save, and a check that combat never auto-heals.',
    ],
    postmortem: {
      thought:
        'The client needed combat a designer can tune without opening unit scripts, and that I can re-run in tests. Hit chance, crits, armor, and morale sit in one rules object. Random rolls go through a seeded RNG. Campaign health is attrition: wounded stays wounded, dead stays dead. Their isometric battle is the skin. The rules file is the job.',
      mechanics:
        'Click a unit. The selected-unit panel shows class and health (Tank 14/20, Squire Crossbow 7/11). The ability bar offers that unit\'s attacks plus Skip Turn. Hovering Stunbolt shows range 4, 50% strength, 50% chance to daze. A pink tile marks the target.\n\nAn attack rolls to hit from Accuracy, then rolls to crit. A physical hit spends one armor shield before it touches health. That is the silver icon next to the HP bar. Optional penetration lets a fraction through. Crits double damage after armor. Miss and crit show as on-screen indicators. Magic bypasses armor in this version.\n\nTurn order is speed, including morale buffs. Ties break at random. Speed above 10 always acts before anyone at 10 or below.\n\nAt the end of a real turn (skipped units do not roll), morale is checked against a table. Fail: -2 speed until the next round. Morale 10 cannot fail, and grants +2 speed.',
      systems:
        'A unit has a definition (class, faction, stats, abilities) and live combat state (current health, armor, morale, buffs, effective speed). Health ranges are clamped by class. Strength scales melee. Arcane Might scales mage damage. Accuracy is the only crit stat.\n\nA corpse cannot be killed twice. Speed buffs apply after the queue rebuilds, so a morale fail shows up next round, not mid-turn.\n\nBetween battles a campaign object stores health by unit id, a dead list, and the last seed. Heal only happens at points the campaign chooses. Dead units cannot be deployed.',
      architecture:
        'Three globals: events, random rolls, and the combat tables. A state machine runs the fight: setup, start turn, wait for action, resolve attack, check victory, end turn. Wait-for-action is the SELECT ABILITY panel. Resolve builds an attack, asks the rules object for the result, then plays hit or die.\n\nUnit tests cover roll sequences, the accuracy table, turn-order distribution, morale fail rates, campaign save/load, and a lint that combat must not heal on its own. Design can change numbers without touching resolution.',
      lessons:
        'One rules file beats magic numbers in unit scripts. Seeded rolls are what made the test suite possible. The client\'s map and sprites made the systems readable; the job was keeping every threshold out of those sprites. Next is freeze the tables so design can tune without rewriting resolution.',
    },
  },
  {
    id: 'spectra-signals',
    title: 'SIGNALS',
    tagline: 'Every transmission is a moral trap. Stamp REPORT or DISCARD.',
    hook: 'A Unity systems study: scoring, narrative, and consequence queues.',
    desc: 'A solo-developed narrative mystery in Unity. Across 5 shifts you intercept radio transmissions and classify them as REPORT or DISCARD, and every choice weighs Loyalty, Morals, and Competence. A learning project that grew into a complete MVP.',
    role: 'Solo programmer · Unity systems MVP',
    category: 'experiment',
    status: 'prototype',
    year: '2026',
    cover: '/media/spectra-signals/cover.png',
    gallery: [
      '/media/spectra-signals/cover.png',
      '/media/spectra-signals/extra-1.gif',
      '/media/spectra-signals/extra-2.png',
    ],
    genre: ['Narrative', 'Mystery', 'Social Deduction', 'Singleplayer'],
    engine: 'Unity 2022.3',
    xPost: 'https://x.com/CoreMazi27888/status/2031676118676210104',
    playable: false,
    video: ['/media/spectra-signals/gameplay.mp4', '/media/spectra-signals/extra-2.mp4'],
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
    tagline: 'A resource-economy fighter inside an engine I had never opened.',
    hook: 'The hard part was not the character. It was YOMIH\'s tick loop.',
    desc: 'A custom character mod for YOMIH (Your Only Move Is Hustle), a Steam game. It adds three original systems: Boost Points that empower attacks on a timer, a leaves economy earned by every hit, and NPC allies you can summon. Built by ramping on an engine I had never opened. Still in progress.',
    role: 'Solo programmer · YOMIH (Godot 3) mod',
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

  /* ───────────────────────── CLIENT ───────────────────────── */
  {
    id: 'flamethrower-vfx',
    title: 'Flamethrower VFX',
    tagline: 'A flame effect the designer can retune without opening a script.',
    hook: 'Not an effect. A tool for making the effect.',
    desc: 'A reusable anime-style flamethrower for Godot 4.3, built for a client as a proper editor tool rather than a one-off effect. Twelve parameters, five colour palettes and two custom shaders, all live in the inspector or at runtime through the demo panel.',
    role: 'Client programmer · Godot 4.3 tool + shaders',
    category: 'client',
    status: 'prototype',
    year: '2026',
    cover: '/media/flamethrower-vfx/cover.png',
    gallery: [],
    video: ['/media/flamethrower-vfx/tool-demo.mp4'],
    videoNotes: ['Every slider is live — the effect rebuilds as the values change.'],
    genre: ['VFX', 'Tooling', 'Shaders', '2D'],
    engine: 'Godot 4.3',
    playable: false,
    features: [
      'Twelve live parameters: emission, speed, length, spread, buoyancy, intensity, noise scale, animation FPS, distortion and lash density',
      'Five colour palettes — Classic Fire, Blue Plasma, Toxic Green, Violet Hellfire, White Hot',
      'Two custom shaders: an animated flame stream and a separate heat-haze distortion pass',
      'Marked @tool, so the effect renders and updates live in the Godot editor',
      'Exposed as a Flamethrower node the client can drop into any scene',
    ],
    client: {
      myRole: 'Built to a written brief: an anime-style flamethrower a designer could retune without touching code. Delivered as a self-contained Godot node with exported ranges, palette presets and a demo scene for trying values out quickly.',
    },
    postmortem: {
      thought: 'The brief asked for a flame effect. What a team actually needs is one they can change at 2am without tracking down the programmer, so I built it as a tool from the start.',
      mechanics: 'A fan-shaped jet emitted along the node’s local +X axis with the anime fire treatment drawn over it. Spread, length and buoyancy shape the cone. Noise scale and distortion break up the silhouette so it never reads as a repeating loop, which is the thing that gives most stylised fire away.',
      systems: 'Every exported property runs through a setter that just marks the effect dirty instead of rebuilding straight away, so dragging a slider does not thrash the particle system. Palettes are data rather than branches, which is why adding a sixth colour is a one-line change.',
      architecture: 'Roughly 870 lines across three scripts and two shaders. flamethrower.gd owns the parameters and the dirty flag, flame_palettes.gd is a plain colour table, and demo.gd is nothing but the tuning UI. You can delete demo.gd and the effect still works, which was the point.',
    },
  },
  /* ───────────────────── SOLO — IN DEVELOPMENT ───────────────────── */
  {
    id: 'in-development',
    title: 'Untitled',
    tagline: 'Solo project, in development.',
    hook: 'Solo project, in development.',
    desc: 'An unannounced solo game in Godot 4.6. Not saying much about it yet. The clip below is a short preview.',
    role: 'Solo · Godot 4.6 · in development',
    category: 'solo',
    status: 'wip',
    year: '2026',
    cover: '/media/signal-station/cover.png',
    gallery: [],
    video: ['/media/signal-station/tutorial-preview.mp4'],
    videoNotes: ['Early preview.'],
    genre: ['In development'],
    engine: 'Godot 4.6',
    playable: false,
    features: [],
    postmortem: {
      thought: 'Still in development. More once there is something worth showing.',
      mechanics: '',
      systems: '',
    },
  },
];

export const getGame = (slug: string): GameData | undefined =>
  games.find((g) => g.id === slug);
