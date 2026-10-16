/**
 * Client-facing content: what can be built, and what working together looks
 * like.
 *
 * Every capability below points at a project that already exists in games.ts.
 * That link is the whole point. A client scanning this section is asking
 * "have you done this before?", and a list of skills with nothing behind it
 * doesn't answer that. Keep the `proof` field honest: if a capability loses its
 * example, take it off the list rather than let it float free.
 */

export interface Capability {
  id: string;
  title: string;
  desc: string;
  /** Where this actually shipped. Rendered as the receipt under each card. */
  proof: string;
  proofProject: string;
}

export const capabilities: Capability[] = [
  {
    id: 'combat',
    title: 'Combat & game feel',
    desc: 'Hit reactions, weapon physics, enemy state machines, hit-stop, screen shake. The layer that decides whether a fight feels good or just resolves.',
    proof: '9 enemy types, 5 weapons',
    proofProject: 'Obsidio',
  },
  {
    id: 'inventory',
    title: 'Inventory & item systems',
    desc: 'Grid inventories, equipment slots, hotbars, drag and drop, world pickups. Built as a reusable plugin, not code welded to one project.',
    proof: 'Godot 4 plugin, built to spec',
    proofProject: 'Grid Inventory',
  },
  {
    id: 'economy',
    title: 'Economy & progression',
    desc: 'Currency sinks, upgrade trees, wave scaling, risk and reward loops. Tuned so spending stays a decision instead of a formality.',
    proof: 'Coins, upgrades, wave events',
    proofProject: 'Obsidio',
  },
  {
    id: 'turnbased',
    title: 'Turn-based & tactics',
    desc: 'Turn order, ability resolution, grid movement, opponents that behave differently from each other. Rules kept away from presentation so they stay testable.',
    proof: 'Ability select, battlefield flow',
    proofProject: 'Turn-Based Combat',
  },
  {
    id: 'tooling',
    title: 'Tools & VFX',
    desc: 'Editor tooling and effects your designers can retune themselves, at 2am, without finding a programmer first.',
    proof: '12 live parameters, 5 palettes',
    proofProject: 'Flamethrower VFX',
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer',
    desc: 'Host-authoritative turn-based netcode in Godot 4. Clients send intents; the host broadcasts redacted views so the opponent hand never rides the wire. Join codes over Ezcha Network, LAN over ENet.',
    proof: 'Two-player table, Ezcha + LAN',
    proofProject: 'The Last Wager',
  },
  {
    id: 'native',
    title: 'Native extensions',
    desc: 'C++ GDExtensions for the calls GDScript cannot make. PC/SC, WinSCard, and a small API the game can pack its own data into.',
    proof: 'NTAG215 read/write, verified on hardware',
    proofProject: 'NFC Windows',
  },
];

/** Unity-page equivalents. Same rule as above: every one points at shipped work. */
export const unityCapabilities: Capability[] = [
  {
    id: 'rules',
    title: 'Rules-first gameplay code',
    desc: 'Game rules in plain C# with no UnityEngine reference, so the same code runs in the game, in console tests, and in offline tools. Presentation stays a thin layer on top.',
    proof: 'Engine-free core, two .NET test suites',
    proofProject: 'Last Case',
  },
  {
    id: 'solver',
    title: 'Solvers & level tooling',
    desc: 'An exact solver that scores every level against its optimum, plus a search tool that picks hard levels where greedy play fails. Content you can verify, not just playtest.',
    proof: '20 levels, 5 picked by search',
    proofProject: 'Last Case',
  },
  {
    id: 'data',
    title: 'Data-driven design',
    desc: 'Items, levels and messages as ScriptableObjects, so designers add content without touching code.',
    proof: 'Items, rules and levels as assets',
    proofProject: 'Last Case',
  },
  {
    id: 'systems',
    title: 'Scoring & narrative systems',
    desc: 'Hidden scores, consequence queues and branching endings, built as isolated managers that talk through one data object.',
    proof: '3 hidden scores, 4 endings',
    proofProject: 'SIGNALS',
  },
  {
    id: 'pipeline',
    title: 'Build & release pipeline',
    desc: 'One-click Windows, WebGL and Android builds from editor menu items, with a scripted upload to itch.io.',
    proof: 'Three platforms from one project',
    proofProject: 'Last Case',
  },
];

export interface ProcessStep {
  id: string;
  title: string;
  desc: string;
}

/**
 * The risk-reversal section. Someone hiring a contractor is mostly worried
 * about being ghosted, watching scope drift, and inheriting code nobody can
 * maintain. Naming those out loud does more work than another adjective about
 * quality.
 */
export const processSteps: ProcessStep[] = [
  {
    id: 'scope',
    title: 'Scope in writing',
    desc: 'Before any code: what I am building, what I am not, and what finished means. You sign off on it, and it is the thing we both point at later.',
  },
  {
    id: 'playable',
    title: 'Playable first',
    desc: 'The first milestone is something you can run, not a document. Playing a system beats reading about one when you are deciding whether it is right.',
  },
  {
    id: 'weekly',
    title: 'Weekly builds',
    desc: 'A build and a short written update every week. You will never wonder where things are, and nothing turns into a surprise at the end of a milestone.',
  },
  {
    id: 'handover',
    title: 'Handover you can keep',
    desc: 'Commented GDScript or C# that fits your project structure, plus notes on how the pieces connect. If you never speak to me again, it should still be maintainable.',
  },
];

export interface Fact {
  k: string;
  v: string;
}

export const facts: Fact[] = [
  { k: 'Engines', v: 'Unity 6 and C#. Godot 4 with GDScript and C++ GDExtension' },
  { k: 'Focus', v: 'Combat, economy, inventory, UI, persistence, netcode, and Windows-native extensions' },
  { k: 'Working with', v: 'Solo devs, small studios, jam teams' },
  { k: 'Engagements', v: 'Fixed-scope systems, plugins, playable prototypes' },
  { k: 'Based', v: 'Remote, and used to working across time zones' },
];

/** What to put in a first email, so my reply can be useful instead of a form. */
export const briefChecklist: string[] = [
  'What the game is, in a sentence or two',
  'The system you need built, and where it sits',
  'Engine and version, and whether there is a codebase already',
  'Rough timeline and budget range',
  'A build or repo I can look at, if one exists',
];

export interface Testimonial {
  /** Quoted verbatim. Only the channel's "+rep" prefix token is trimmed. */
  quote: string;
  author: string;
  source: string;
  date: string;
  /** Project id this relates to, so the right page can surface it. */
  project?: string;
}

/**
 * Client vouches.
 *
 * The most persuasive thing on a freelance site is someone who is not you
 * saying you were good to work with. Everything else here is a claim; this is
 * evidence. Keep it verbatim, keep the attribution real, and never write one.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      'Big vouch for Mazen. I needed some custom VFX work done, and he delivered top-notch results that fit perfectly with my project’s vision. He was professional, quick to respond, and easy to work with from start to finish. Would definitely collaborate again!',
    author: 'Phantom Byte',
    source: 'Game Dev League Discord',
    date: 'August 2026',
    project: 'flamethrower-vfx',
  },
  {
    quote:
      'Works really efficiently, with good communication and the end result worked as intended. Would commission again',
    author: 'Algodón',
    source: 'Godot Café Discord',
    date: 'September 2026',
    project: 'nfc-windows',
  },
];
