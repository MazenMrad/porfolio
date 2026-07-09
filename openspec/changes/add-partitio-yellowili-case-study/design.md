## Context

The portfolio is a React + Vite + TypeScript SPA. Case studies are driven entirely by the `games` array in `src/data/games.ts` (typed by `GameData`), and rendered by `GamePage.tsx` (full case study route) and the modal in `App.tsx`. Each entry already supports `gallery: string[]` (rendered as CSS background images) and an optional `video?: string[]` (currently rendered via `<iframe>`).

The Partitio Yellowili mod is a work-in-progress YOMIH (Godot 3) character with three systems: Boost Points, a leaves economy (Rags to Riches), and NPC summons (Hired Help, still incomplete). Two media files already exist in `public/media/partitio-yellowili/`: `boost-multihit.gif` and `npc-spawn.mp4`. The `.gif` works in the existing gallery; the `.mp4` does not, because the Media section only handles embeddable `<iframe>` URLs.

## Goals / Non-Goals

**Goals:**
- Add a `partitio-yellowili` entry to `games.ts` using the agreed copy (Thought, Mechanics, Systems, Under the Hood, Lessons).
- Place it in the `experiment` category with `status: 'wip'` and `playable: false`, so no Play button renders.
- Render the boost-multihit gif in the gallery and the npc-spawn mp4 inline via a `<video>` element.
- Keep the entry honest about WIP state (NPC spawns but does not act yet; shop/costs not tuned).

**Non-Goals:**
- No changes to routing, hero/about copy, or other case studies.
- No new build dependencies.
- No rework of the Obsidio/Last Wager/SIGNALS entries.
- Not releasing or hosting the mod itself.

## Decisions

**D1: Category = `experiment`, status = `wip`.**
Rationale: the mod is unfinished and not released, matching the existing SIGNALS `experiment` entry. A new top-level "Mods" category is premature for a single entry and would look like padding.

**D2: Add "Under the Hood" as inline content in `postmortem.lessons` region via a new optional field rather than a schema change.**
The cleanest path with the existing `GameData` shape is to place the engine-debug narrative in a new optional field `postmortem.underTheHood?: string`. GamePage already conditionally renders sections based on optional fields, so this requires no type restructuring beyond adding one optional property. Alternative considered: folding it into `systems` — rejected because the bug-log is the differentiator and deserves its own labeled section.

**D3: Render local `.mp4` with `<video>`, not `<iframe`.**
GamePage's Media section currently maps `game.video` items to `<iframe>`. For local files (`/media/...`) an `<iframe>` cannot play them. Decision: detect non-embeddable URLs (those starting with `/` or ending in `.mp4`/`.webm`) and render a `<video controls>` instead. This keeps `itch.io`/YouTube-style embeds working while supporting local clips.

**D4: Media placement.**
`boost-multihit.gif` → `gallery` (CSS background, already supported). `npc-spawn.mp4` → `video` array. No conversion needed.

**D5: Em-dash-free, stakes-led copy.**
All copy follows the writing rules already applied to other entries: no em dashes, Thought leads with stakes not diary, Lessons are forward-looking not confessions.

## Risks / Trade-offs

- [Risk] `<video>` autoplay/codec support varies; local mp4 (H.264) is broadly safe in browsers. → Mitigation: add `controls` and `playsInline` so the user controls playback; no autoplay.
- [Risk] The `video` array is typed `string[]` and currently expected to be iframe URLs elsewhere. → Mitigation: the only consumer is the Media section in GamePage; scoped change there, no other references.
- [Risk] Overclaiming WIP state. → Mitigation: copy explicitly states NPC "spawns but does not act yet" and shop/costs are untuned.
- [Trade-off] Adding `underTheHood` to the type is a minor schema extension, but it is optional and backward compatible with all existing entries.

## Migration Plan

1. Add optional `underTheHood?: string` to `GameData.postmortem` in `src/data/games.ts`.
2. Append the `partitio-yellowili` object with `category: 'experiment'`, `status: 'wip'`, `playable: false`, `gallery: ['/media/partitio-yellowili/boost-multihit.gif']`, `video: ['/media/partitio-yellowili/npc-spawn.mp4']`, and the agreed copy.
3. Update GamePage Media section to render `<video>` for local/non-embeddable sources.
4. `npm run build` to verify typecheck and bundle.

Rollback: revert the `games.ts` entry and the GamePage Media tweak; media files can remain in `public/` unused.

## Open Questions

- Should the NPC-spawn clip carry an on-page label ("spawns, not yet acting")? Recommended yes, via a small caption under the video.
- Are additional animation stills wanted in `gallery`? Currently only the boost-multihit gif is included; more can be added later without code changes.
