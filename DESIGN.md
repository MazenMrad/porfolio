# Design: Job ticket

The portfolio is a contractor's signed work order: white stock, black ink, ruled fields, one red stamp. Tokens live in `src/styles/ticket.css`, loaded after the legacy `dossier.css`, which still supplies layout.

## Colour (strategy: restrained, one stamp colour)

- Stock (default, light): ground `#f7f7f5`, sunk band `#efefeb`, raised field `#ffffff`, ink `#151515`, secondary ink `#33332f`, muted `#5b5b57`, hairline `#d9d9d4`.
- Carbon copy (`data-theme="dark"`): ground `#161616`, ink `#ecebe6`, muted `#a9a8a2`, hairline `#3a3a38`, stamp `#ff5a43`.
- Stamp red `#c4210f`: the primary action, emphasis underlines, the logo dot, hover borders. Never a fill behind body text.
- Media wells stay near-black `#1b1b1a` in both themes.

## Type

- Headings: Archivo 800–900, sentence case, tracking −0.025em.
- Body: Atkinson Hyperlegible Next 17px / 1.6, tabular figures.
- Field labels (ticket fields, spec keys, "Item N", "No. 01"): Archivo 800, 0.72rem, uppercase, tracked 0.08em, muted. Only on form fields, never above headings.

## Components

- Stamp button: 3px red outline, red caps, rotated −1.5°. Hover fills red and straightens. On footage (showreel) it is white.
- Ticket: 1px ink frame, head strip ("Latest job" / year), media, `dl` of Job, Engine, Role and Status fields, a footer with links.
- Record line: the availability and counts as one sentence under a hairline, never a stat row.
- Work rows: project number set as `No. 01 / 2026`, boxed tags, engine tag in ink.
- Capabilities: a ruled table of line items labelled `Item N`.
- Process: steps with red circle stamps rotated −6°.
- Contact: signature block on raised stock; the checklist uses empty tick boxes.

## Motion

One moment: the cover stamp lands once (scale 1.25 → 1, rotation settles, expo ease-out, 0.45s, 0.35s delay). Content is never hidden. Off under `prefers-reduced-motion`.

## Rules

No shadows, no radii above 2px (circles only for step stamps), no gradients on text, no eyebrow labels above headings, no blue.
