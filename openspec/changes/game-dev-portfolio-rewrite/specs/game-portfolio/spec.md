## ADDED Requirements

### Requirement: Game data model supports craft-first post-mortems
The system SHALL define a `GameData` model that captures, per game: identity (id, title, tagline, year, cover, engine, status), categorization (`solo` | `jam` | `experiment`), external links (itchUrl, repoUrl, xPost), optional team metadata (members, myRole), media (gallery, video), a feature list, optional controls, and a `postmortem` object with `thought`, `mechanics`, `systems`, `architecture`, and optional `lessons` string fields.

#### Scenario: Model holds all required post-mortem fields
- **WHEN** a game entry is defined in `src/data/games.ts`
- **THEN** it SHALL include `category`, `postmortem.thought`, `postmortem.mechanics`, `postmortem.systems`, and `postmortem.architecture` as required fields

#### Scenario: Team games carry contribution metadata
- **WHEN** a game has `category` of `jam`
- **THEN** it SHALL include a `team` object with `members` and `myRole` describing the contributor's specific work

### Requirement: Games grouped by category on home grid
The home page SHALL render games grouped under three labeled sections — "Solo", "Jam & Team", and "Experiments" — derived from each game's `category` field, instead of a single flat list.

#### Scenario: Solo games appear under Solo section
- **WHEN** the home page renders the games section
- **THEN** games with `category: 'solo'` SHALL appear under a "Solo" heading

#### Scenario: Jam games appear under Jam & Team section
- **WHEN** the home page renders the games section
- **THEN** games with `category: 'jam'` SHALL appear under a "Jam & Team" heading

#### Scenario: Experiment games appear under Experiments section
- **WHEN** the home page renders the games section
- **THEN** games with `category: 'experiment'` SHALL appear under an "Experiments" heading

### Requirement: Game detail page presents an 8-section post-mortem
The `/games/:slug` route SHALL render a page with sections in order: Hero (with primary "Play on itch.io" CTA), Thought Process, Mechanics, Systems, Architecture, My Role (team games only), Lessons / Honest Notes (optional), Media (video + gallery), and Play/Status.

#### Scenario: Visiting a valid game slug renders the post-mortem
- **WHEN** a user navigates to `/games/obsidio`
- **THEN** the page SHALL render Thought, Mechanics, Systems, and Architecture sections populated from that game's `postmortem` data

#### Scenario: Team game shows My Role section
- **WHEN** a user navigates to a game with a `team` object
- **THEN** the page SHALL render a "My Role" section using `team.members` and `team.myRole`

#### Scenario: Invalid slug shows not-found state
- **WHEN** a user navigates to `/games/nonexistent`
- **THEN** the page SHALL display a "Game not found" message with a link back to the portfolio

### Requirement: Primary CTA links to itch.io
Every game page and game card SHALL provide a prominent "Play on itch.io" (or equivalent) action linking to the game's `itchUrl` in a new tab.

#### Scenario: Game page CTA opens itch page
- **WHEN** a user clicks the primary CTA on a game page
- **THEN** the browser SHALL open the game's `itchUrl` in a new tab

### Requirement: Visual identity uses clean-dev Godot-engine brand
The site SHALL use a clean, editorial dark theme with Godot blue (`#478cbf`) as the primary accent, flat borders, monospace labels, and NO neon glow. The 3D icosahedron and skill badges SHALL use Godot blue without glow.

#### Scenario: Accent color is Godot blue
- **WHEN** the site renders
- **THEN** the `--accent` design token SHALL be `#478cbf` and no purple/cyan glow shadows SHALL be applied to primary surfaces

#### Scenario: Icosahedron uses Godot blue without glow
- **WHEN** the hero 3D icosahedron renders
- **THEN** its wireframe color SHALL be Godot blue and its material SHALL NOT use glow/emissive styling

### Requirement: Pixel Art standalone section removed
The site SHALL NOT include a standalone "Pixel Art" section. Game art contributions SHALL instead be represented through team `myRole` descriptions and tags.

#### Scenario: No pixel-art section in DOM
- **WHEN** the home page renders
- **THEN** there SHALL be no section, heading, or route element labeled "Pixel Art"

### Requirement: Media supports local and remote sources
The `gallery` and `video` fields SHALL accept both remote URLs (e.g., itch CDN, YouTube embeds) and local `/public` paths without code changes.

#### Scenario: Remote gallery URL renders
- **WHEN** a game's `gallery` contains a remote image URL
- **THEN** the Media section SHALL display that image

#### Scenario: Local gallery path renders
- **WHEN** a game's `gallery` contains a path under `/public`
- **THEN** the Media section SHALL display that image

### Requirement: Home grid keeps a quick-preview modal
The home games grid SHALL retain a quick-preview modal (click card body) that shows condensed game info, alongside the deep post-mortem page linked from the title/CTA.

#### Scenario: Clicking a card opens quick preview
- **WHEN** a user clicks a game card body on the home page
- **THEN** a modal SHALL open with condensed game details and a link to the full post-mortem
