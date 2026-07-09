## 1. Data Model & Content

- [x] 1.1 Expand `GameData` interface in `src/data/games.ts` with `category`, `status`, `repoUrl?`, `xPost?`, `video: string[]`, `team?: { members, myRole }`, and `postmortem: { thought, mechanics, systems, architecture, lessons? }`.
- [x] 1.2 Add Obsidio entry (`category: 'solo'`) seeded from Mazen's Obsidio status + architecture docs (thought: drag-aim skill TD; mechanics: 8 enemies/weapons; systems: waves/economy; architecture: signal flow/autoloads).
- [x] 1.3 Add The Last Wager entry (`category: 'solo'`) seeded from Mazen's Last Wager context + architecture (thought: Kaiji E-Card reimagined; mechanics: card triangle/betting; systems: heartbeat bluff/debt mode; architecture: scene tree/scripts; lessons: known bugs + commercial-viability Q's).
- [x] 1.4 Add Spectra / SIGNALS entry (`category: 'experiment'`, engine Unity) seeded from Mazen's story bible + architecture (thought: Cold War moral mystery; mechanics: tune/classify; systems: 3 hidden scores; architecture: manager singletons/ScriptableObject; lessons: MVP gaps).
- [x] 1.5 Add Pawn's Gambit entry (`category: 'jam'`, team of 4) with `team.myRole` = "2D pixel artist (UI/assets/art) + Godot programmer (move mechanics, bug fixes)" and `repoUrl` to queble-jam.
- [x] 1.6 Add Biscuit Zone entry (`category: 'jam'`, team of 3) with `team.myRole` = "most art + some bug fixes" and `repoUrl` to BrackeysGameJam2026.1.
- [x] 1.7 Keep `getGame(slug)` helper; ensure all five entries import cleanly.

## 2. Visual Retheme (CSS Tokens)

- [x] 2.1 In `src/index.css`, change `--accent` to `#478cbf` and remove purple/cyan neon glow usage (flatten `--shadow-*` and glow box-shadows).
- [x] 2.2 Add monospace label treatment and flat-border styling for editorial/engine-brand feel.
- [x] 2.3 Add CSS for post-mortem sections (thought/mechanics/systems/architecture/lessons), team-role block, media gallery grid, and video embed container.
- [x] 2.4 Add CSS for the three home-grid category group headers (Solo / Jam & Team / Experiments).

## 3. 3D & Skill Components Recolor

- [x] 3.1 In `AmberIcosahedron.tsx`, set wireframe color to Godot blue `#478cbf` and remove glow/emissive styling (both Canvas material and SVG fallback).
- [x] 3.2 In `SkillSpheres.tsx`, recolor skill badges to flat Godot-blue palette (no neon glow); keep game-dev stack.

## 4. Home Page Restructure (App.tsx)

- [x] 4.1 Remove the standalone "Pixel Art" section and its `artPacks` data from `App.tsx`.
- [x] 4.2 Group the games grid by `category` into three labeled sections (Solo / Jam & Team / Experiments).
- [x] 4.3 Update game card to show category-appropriate badge and keep the quick-preview modal on card-body click; title/CTA link to `/games/:slug`.
- [x] 4.4 Update hero copy, about section, and nav to reflect "Godot game developer" identity (remove pixel-art framing).
- [x] 4.5 Retheme any remaining class usage to the new token system.

## 5. Game Detail Page (GamePage.tsx)

- [x] 5.1 Rewrite `GamePage` to render the 8-section post-mortem: Hero (primary "Play on itch.io" CTA), Thought, Mechanics, Systems, Architecture, My Role (team only), Lessons (optional), Media (video + gallery), Play/Status.
- [x] 5.2 Render `controls` table when present; render `devlog` if added later.
- [x] 5.3 Wire gallery images and video embeds (URL or local) with lightbox reuse from existing modal.
- [x] 5.4 Ensure back-link to home (`/`) and section anchors work.

## 6. Verification

- [x] 6.1 Run `npm run build` and confirm no TypeScript errors.
- [x] 6.2 Run `npm run lint` and resolve any new errors (only pre-existing WebGL-effect warnings in 3D components remain).
- [ ] 6.3 Manually verify `/`, `/games/obsidio`, `/games/the-last-wager`, `/games/spectra-signal`, `/games/pawns-gambit`, `/games/biscuit-zone` routes render with grouped grid and post-mortems.

## 7. Follow-up (Mazen-supplied, non-blocking)

- [ ] 7.1 Insert Pawn's Gambit / Biscuit Zone contribution sentences + screenshots when provided.
- [ ] 7.2 Add per-game videos/screenshots to `public/` or as remote URLs.
- [ ] 7.3 Optionally download itch CDN images into `public/` to avoid hotlink reliance.
