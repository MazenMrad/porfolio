## ADDED Requirements

### Requirement: Game case study supports an optional "Under the Hood" section
The system SHALL render an optional `postmortem.underTheHood` string as a dedicated, labeled case-study section when present, separate from Mechanics, Systems, and Lessons. Existing entries without this field MUST render unchanged.

#### Scenario: Entry with underTheHood renders the section
- **WHEN** a game entry provides `postmortem.underTheHood`
- **THEN** the case study page displays a section titled "Under the Hood" containing that text, after the Systems section and before Lessons

#### Scenario: Entry without underTheHood renders unchanged
- **WHEN** a game entry omits `postmortem.underTheHood`
- **THEN** no "Under the Hood" section appears and other sections render as before

### Requirement: Case study media supports local video playback
The system SHALL render `game.video` items that are local or non-embeddable sources (path starting with `/` or filename ending in `.mp4`/`.webm`) using an inline `<video controls playsInline>` element instead of an `<iframe>`.

#### Scenario: Local mp4 renders as inline video
- **WHEN** `game.video` contains `/media/partitio-yellowili/npc-spawn.mp4`
- **THEN** the Media section renders a `<video>` element with `controls` and `playsInline` pointing at that source, not an `<iframe>`

#### Scenario: Embeddable URL still uses iframe
- **WHEN** `game.video` contains an external embeddable URL (e.g. YouTube)
- **THEN** the Media section renders it via `<iframe>` as before

### Requirement: WIP mod case study is presented honestly without a Play button
The system SHALL render a `partitio-yellowili` entry with `category: 'experiment'`, `status: 'wip'`, and `playable: false`, with no "Play in browser" or "Play on itch.io" primary play button derived from `playable`, while still linking to the external itch.io page if `itchUrl` is set.

#### Scenario: WIP entry shows no play-in-browser button
- **WHEN** the `partitio-yellowili` entry is displayed and `playable` is false
- **THEN** no "Play in browser" button is rendered, and the LedOrb indicates `wip` status

#### Scenario: WIP entry still links externally
- **WHEN** the `partitio-yellowili` entry has an `itchUrl`
- **THEN** a "Play on itch.io" link to that URL is rendered
