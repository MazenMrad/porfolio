## Why

The current portfolio presents as a generic dark/neon tech site with game *content* bolted on — it reads as "developer who happens to make games," not a **Godot game developer**. Mazen has shipped 2 solo Godot titles, contributed art + programming to 2 jam/team Godot games, and built a Unity experiment — and has written deep technical post-mortems (architecture, systems, known bugs) for most of them. The site under-sells this: the standalone Pixel Art section projects an identity he explicitly does *not* want, the visual language is neon/modern (rejected), and each game's rich "thought → mechanics → systems → architecture" story is reduced to a short modal.

## What Changes

- **BREAKING**: Remove the standalone "Pixel Art" section — Mazen does not want to be framed as a pixel artist.
- Re-anchor the site identity as a **Godot game developer** (clean-dev + engine-brand aesthetic), not neon/modern and not pixel/lo-fi.
- Restructure games into three honest buckets: **Solo** (Obsidio, The Last Wager), **Jam/Team** (Pawn's Gambit, Biscuit Zone), and **Experiment** (Spectra / Unity).
- Expand each game into a **deep post-mortem page** following the flow: Thought Process → Mechanics → Systems → Architecture → (My Role for team games) → Lessons/Honest Notes → Media → Play/Status, with a primary "Play on itch.io" CTA.
- Retheme the visual system: Godot blue `#478cbf` accent (drop cyan glow + purple), flat/editorial, monospace labels, no neon glow. Recolor the 3D icosahedron and skill badges to match.
- Seed Obsidio, The Last Wager, and Spectra post-mortems directly from Mazen's existing dev docs.
- Link jam repositories (queble-jam, BrackeysGameJam) and the X/Spectra post from each relevant game.
- Keep the existing quick-preview modal on the home grid as a lightweight entry point alongside the deep page.

## Capabilities

### New Capabilities
- `game-portfolio`: The game-dev portfolio domain — game data model, post-mortem page structure, home-grid grouping (solo/jam/experiment), and craft-first presentation of each title with play/itch CTA.

### Modified Capabilities
<!-- none — no existing openspec specs; this is a greenfield capability for this repo -->

## Impact

- **Code**: `src/data/games.ts` (expand `GameData` model + add 3 entries), `src/App.tsx` (remove pixel-art section, regroup grid, retheme classes), `src/components/GamePage.tsx` (rewrite into 8-section post-mortem), `src/components/AmberIcosahedron.tsx` + `SkillSpheres.tsx` (recolor to Godot blue, drop glow).
- **Styles**: `src/index.css` (retheme tokens from neon to Godot-engine-blue clean; add post-mortem + team-role + media styles).
- **Content**: New copy for hero, about, and per-game post-mortems sourced from Mazen's existing dev docs (Obsidio, The Last Wager, Spectra). Pawn's Gambit / Biscuit Zone need Mazen's contribution sentences + screenshots.
- **Assets**: `public/` will gain per-game videos/screenshots (provided later by Mazen) — media field must support both local paths and remote URLs.
- **Dependencies**: `react-router-dom` already installed; no new deps required.
- **No backend / API changes** — pure static SPA.
