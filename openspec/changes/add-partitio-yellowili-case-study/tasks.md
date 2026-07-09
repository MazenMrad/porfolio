## 1. Data Model Extension

- [x] 1.1 Add optional `underTheHood?: string` to the `postmortem` interface in `src/data/games.ts` (backward compatible with existing entries).

## 2. Add the Case Study Entry

- [x] 2.1 Append a `partitio-yellowili` object to the `games` array with `category: 'experiment'`, `status: 'wip'`, `playable: false`.
- [x] 2.2 Fill `tagline`, `desc`, `role`, `year`, `engine`, `genre` (e.g. `['Fighting', 'Mod', 'Godot', 'Systems']`), `cover` (a character still from `public/media/partitio-yellowili/`), `itchUrl` if available.
- [x] 2.3 Write `postmortem.thought` (stakes-led: learned YOMIH from zero, resource-economy-fighter challenge), `mechanics`, `systems`, `underTheHood` (engine bugs solved: IOOT race, projectile double-flip, missing sub_resource, stale hitbox_start_frames, NPC now spawns), and `lessons` (forward-looking: finish NPC behavior, tune costs, ship shop).
- [x] 2.4 Set `gallery: ['/media/partitio-yellowili/boost-multihit.gif']` and `video: ['/media/partitio-yellowili/npc-spawn.mp4']`.
- [x] 2.5 Ensure all copy is em-dash-free and follows the agreed writing rules.

## 3. GamePage Media Rendering

- [x] 3.1 Update the Media section in `src/components/GamePage.tsx` to detect local/non-embeddable sources (path starts with `/` or ends in `.mp4`/`.webm`) and render a `<video controls playsInline>` element instead of an `<iframe>`.
- [x] 3.2 Render an optional caption under the NPC-spawn video (e.g. "Spawns, but does not act yet") when appropriate.
- [x] 3.3 Keep existing embeddable-URL (`<iframe>`) behavior intact for external videos.

## 4. Verify

- [x] 4.1 Run `npm run build` and confirm typecheck + bundle succeed with no errors.
- [x] 4.2 Manually verify the `/games/partitio-yellowili` route shows the new sections, the gif in gallery, and the mp4 playing inline, with no Play-in-browser button and a `wip` status orb.
