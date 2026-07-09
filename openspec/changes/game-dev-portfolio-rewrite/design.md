## Context

The portfolio is a React 19 + Vite + TypeScript SPA using React Three Fiber for ambient 3D. It already has `react-router-dom` installed and a `/games/:slug` route rendering `GamePage`. The current state is a generic dark/neon theme with a "Pixel Art" section Mazen does not want, and game cards open a short modal. Mazen has written extensive technical post-mortems (architecture, systems, known bugs, commercial-viability self-audits) for Obsidio, The Last Wager, and Spectra — these are the real asset and should be hosted, not summarized away.

The goal is a **craft-first Godot game-dev portfolio**: clean-dev + engine-brand aesthetic, games grouped by solo/jam/experiment, and each game expanded into a deep post-mortem page with a "Play on itch.io" CTA.

## Goals / Non-Goals

**Goals:**
- Re-anchor visual identity to clean-dev + Godot-engine-brand (Godot blue `#478cbf`, flat, monospace, no neon glow).
- Restructure games into Solo / Jam-Team / Experiment buckets on the home grid.
- Expand `GamePage` into an 8-section post-mortem following: Thought → Mechanics → Systems → Architecture → My Role (team) → Lessons → Media → Play/Status.
- Seed Obsidio, The Last Wager, and Spectra post-mortems from Mazen's existing dev docs (condensed, not invented).
- Keep the home-grid quick-preview modal as a lightweight entry point.
- Retheme the 3D icosahedron and skill badges to Godot blue, no glow.

**Non-Goals:**
- No pixel-art / lo-fi visual identity (explicitly rejected).
- No backend, CMS, or build pipeline changes — pure static SPA.
- No new 3D scenes beyond recoloring existing ones.
- No writing of fake architecture/game content — team-game contribution text comes from Mazen.

## Decisions

**D1 — Keep React Router, extend `GamePage` instead of new pages.**
The app already has `/games/:slug` → `GamePage`. Rather than add routes, we deepen the single `GamePage` to render the full post-mortem from a richer `GameData` model. Rationale: one data source, one component, DRY. Alternative (separate components per section) rejected as over-engineering for 5 entries.

**D2 — Expand the `GameData` model with a `postmortem` object + `category`/`team` fields.**
Current model has `detail.{about,howItWasBuilt,results}` which is too shallow. New model adds `category: 'solo'|'jam'|'experiment'`, `team?: {members, myRole}`, `status: 'live'|'prototype'|'wip'`, `repoUrl?`, `xPost?`, `video[]`, `postmortem.{thought,mechanics,systems,architecture,lessons}`. Rationale: directly maps to the requested narrative flow and Mazen's existing docs.

**D3 — Visual retheme via CSS token swap, not component rewrites.**
Change design tokens in `index.css` (`--accent` → `#478cbf`, drop purple `--accent-2` glow usage, flatten shadows). The icosahedron/badges only need color + material-opacity tweaks, not structural change. Rationale: minimal risk, preserves the proven layout.

**D4 — Home grid grouped by category with section headers.**
Render three labeled groups (Solo / Jam & Team / Experiments) instead of one flat list. Rationale: honest track-record shape; shows range to studios.

**D5 — Media field supports both local and remote.**
`video: string[]` and `gallery: string[]` accept URLs (itch CDN, YouTube embeds) or future `/public` local paths. No upload pipeline; Mazen provides URLs/files later. Rationale: avoids blocking on asset delivery.

**D6 — "Lessons / Honest Notes" is a first-class section.**
Last Wager's doc already contains a bug list + "3 hardest questions for commercial viability." Surfacing honest retrospection is the differentiator for a hiring audience. Rationale: craft-first voice; shows systems thinking, not just shipping.

**D7 — Case study audience is hiring devs; rename + simplify the Architecture section.**
Confirmed audience for the post-mortem pages is people who might hire Mazen as a game programmer (not itch players). Therefore the Architecture section is the strongest "can this person be trusted on a codebase" signal and must be KEPT — not cut. Two changes:
- **Rename** the section label from "Architecture" to something hiring-dev-friendly: **"Under the Hood"** (or "How It's Built" / "Engineering"). Chosen: `Under the Hood`.
- **Simplify / principle-first**: cut the inventory-led opening (the 3-item autoload bullet list as the lead). Open with the *decision/principle* (e.g. "I kept the codebase decoupled so a feature can be ripped out without taking the game down — the HUD is pure signals, removing a node never crashes the game"), then let autoloads/inheritance be short supporting detail.
Rationale: the current block reads like a textbook lecture ("blabbering") because it leads with a singleton inventory; reframing to decisions-over-inventory turns it into a hire signal. Applies to all five entries' `postmortem.architecture` copy. Rail node label updates from "Architecture" to "Under the Hood".

**D8 — "Case Study" heading + single full-page Summary toggle.**
Two additions to every case-study page (`GamePage`):
- **Big "Case Study" kicker** above the game title (monospace accent, e.g. `CASE STUDY` as a hero eyebrow). User-facing term is "Case Study" even though the internal data field is `postmortem.*` — display label only, field names unchanged.
- **One "Summary" button** that collapses the *entire* page into a condensed view (not per-section toggles). Behavior:
  - **Full study is the DEFAULT view** (satisfies "want people to read the case study first"); Summary is an opt-down escape hatch for short attention spans.
  - Summary mode renders **one `summary` field per game** as **3–6 tight bullets**, each hitting a hire-signal (what it is / standout mechanic / one engineering decision / one lesson / where to play). Bullets, not prose — faster scan.
  - Button label toggles: "Summary ▾" (full mode) ↔ "Full study ▲" (summary mode).
- **Data:** add `summary: string[]` (bullet array) to `GameData`; Mazen supplies/reviews 5 blocks (one per game). AI drafts them for review; Mazen reviews for accuracy. No auto-truncation of existing prose.
Rationale: addresses the content-volume risk (D-risk #1) with a skimmable alternative that still drives readers to the full study by default.

## Risks / Trade-offs

- **[Risk] Content volume** → A full 8-section post-mortem per game is long. Mitigation: condense Mazen's docs; keep `thought`/`lessons` punchy; lazy below-the-fold sections already scrolled into view via existing fade-in. **Also mitigated by D8 Summary toggle** — skimmable bullets for short attention spans, full study still default.
- **[Risk] Team-game accuracy** → Pawn's Gambit / Biscuit Zone lack Mazen's contribution detail. Mitigation: ship with role summary from known info + a clear TODO for Mazen to fill `myRole`/screenshots; do not fabricate.
- **[Risk] Remote image hotlinking** → itch CDN URLs may change/rate-limit. Mitigation: acceptable for portfolio; note in tasks to optionally download into `public/` later.
- **[Risk] Theme regression** → removing neon could flatten visual interest. Mitigation: keep subtle radial glows in backgrounds, lean on Godot-blue accent + monospace for character.
- **[Trade-off] Modal vs page** → Keeping both adds minor duplication. Acceptable: modal = quick scan, page = deep read; both draw from same `GameData`.

## Migration Plan

1. Update `src/data/games.ts` with expanded model + 5 entries.
2. Retheme `src/index.css` tokens + add post-mortem/team/media styles.
3. Rewrite `src/components/GamePage.tsx` to 8-section post-mortem.
4. Edit `src/App.tsx`: remove Pixel Art section, group grid by category, retheme class usage, keep modal.
5. Recolor `AmberIcosahedron.tsx` + `SkillSpheres.tsx` to Godot blue, drop glow.
6. `npm run build` + `npm run lint` to verify.

Rollback: revert the changed files via git; no data/migration step beyond source.

## Open Questions

- Pawn's Gambit / Biscuit Zone: exact Mazen contribution sentences + screenshots (to be supplied).
- Whether media will arrive as local files (`public/`) or remain remote URLs.
- Final call on Spectra placement: "Experiment" bucket (recommended) vs its own emphasis.
