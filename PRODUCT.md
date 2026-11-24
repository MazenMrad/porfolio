# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: indie studios and solo developers hiring a freelance gameplay programmer (Unity or Godot) for contract work. They skim, judge in seconds whether the person can ship, and want proof they can play or read, plus a clear way to start a project. Secondary audiences (recruiters) are not confirmed.

## Product Purpose

Personal portfolio of Mazen, a freelance gameplay programmer. It exists to turn a visiting client into a project enquiry. Success: a client finds the right engine framing (/unity or /godot), opens a case study or plays a build, and contacts him.

## Positioning

Systems programmer, not an all-round "game dev": combat, inventory, puzzle rules, economy, UI, netcode, native extensions. Work is scoped in writing, delivered playable, documented. Every project is playable or has a written "how it was built".

## Operating Context

Static React/Vite site, prerendered (SSR build) and deployed on Vercel with Vercel Analytics. Routes: `/`, `/unity`, `/godot`, plus one page per game. Engine switch reframes lead copy and featured work.

## Capabilities and Constraints

- Keep routes, project content and media in `src/data` and `public/media`.
- Keep the All / Unity / Godot engine switch and the prerender/SEO pipeline (`scripts/prerender.mjs`, `src/seo.ts`).
- Contact: email, itch.io, X, Discord handles as currently in `src/App.tsx`.
- Dependencies available: React 19, react-router, framer-motion, three, lucide-react.

## Brand Commitments

Name: Mazen (mazicore). Voice: plain, specific, no hype. Project titles, taglines and write-ups are factual and stay as written unless the owner edits them.

## Evidence on Hand

Real projects with media in `public/media`: Last Case, Obsidio, The Last Wager, Grid Inventory, Turn-Based Combat, NFC Windows, SIGNALS, Partitio Yellowili, Flamethrower VFX, The Fine Lock, Pawn's Gambit, Biscuit Zone. CV PDFs in repo root. No testimonials are confirmed; do not fabricate client quotes or logos.

## Product Principles

1. Proof over claims: show playable builds and real systems before any self-description.
2. One clear action: start a project.
3. Engine-aware: a Unity client and a Godot client each see their own work first.
4. Fast and static: the page must load quickly and prerender.

## Accessibility & Inclusion

Not specified by the owner; hold to WCAG AA contrast, keyboard operation, visible focus, reduced-motion support.
