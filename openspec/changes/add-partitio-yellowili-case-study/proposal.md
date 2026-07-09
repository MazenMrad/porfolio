## Why

The portfolio currently showcases only from-scratch Godot/Unity games. Adding the Partitio Yellowili YOMIH mod, built by ramping on an unfamiliar engine from zero, demonstrates a different and more hireable skill: extending and debugging a third-party real-time engine. It also proves animation ability (an under-sold strength) and shows active, honest work-in-progress development.

## What Changes

- Add a new case study entry `partitio-yellowili` to the games data (`src/data/games.ts`).
- Slot it into the existing `experiment` category with `status: 'wip'` and `playable: false` (no Play button, consistent with the recently removed "Play in browser" buttons).
- Use an expanded section structure: Thought, Mechanics, Systems, Under the Hood, Lessons. "Under the Hood" is a new section unique to this entry (documents the engine bugs solved).
- Wire two media assets already placed in `public/media/partitio-yellowili/`: `boost-multihit.gif` (gallery image) and `npc-spawn.mp4` (video).
- Add a small `GamePage` tweak so local `.mp4` files in `game.video` render via a `<video>` tag instead of an `<iframe>`, so the NPC-spawn clip plays inline.

## Capabilities

### New Capabilities
- `game-case-study`: The data shape and rendering for a portfolio game/project case study, including optional media (images via `gallery`, video via `video`) and an optional extended "Under the Hood" section for engine/debugging write-ups.

### Modified Capabilities
<!-- No existing spec-level requirements change. -->

## Impact

- `src/data/games.ts`: one new `GameData` object.
- `src/components/GamePage.tsx`: Media section updated to render local `.mp4` with `<video>` when no embeddable URL is present.
- `public/media/partitio-yellowili/`: already contains `boost-multihit.gif` and `npc-spawn.mp4`.
- No changes to routing, styles beyond existing classes, or other case studies.
- No new dependencies.
