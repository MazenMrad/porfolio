import { games } from './data/games';

/**
 * Per-route metadata for the prerenderer.
 *
 * These tags are the half of the crawlability problem that JavaScript cannot
 * solve after the fact. Googlebot will eventually run the bundle and see the
 * rendered page, but the crawlers that matter for a job application mostly do
 * not: LinkedIn, Slack, Discord and X read the HTML as served and never
 * execute a line of it. Whatever is in the markup at response time *is* the
 * link preview.
 *
 * The site URL is passed in rather than read from the environment so this file
 * stays free of Node globals; it is part of the app's own type-checked source.
 */

export const DEFAULT_SITE_URL = 'https://porfolio-woad-alpha.vercel.app';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
}

const DEFAULT_IMAGE = '/media/obsidio/editor-capture.gif';

function absolute(siteUrl: string, url: string): string {
  if (url.startsWith('http')) return url;
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Trim to a length that survives the preview cards without mid-word cuts. */
function clamp(text: string, max = 165): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.lastIndexOf(' ', max - 1);
  return `${flat.slice(0, cut > 0 ? cut : max - 1)}…`;
}

export function routeMeta(siteUrl: string = DEFAULT_SITE_URL): RouteMeta[] {
  const base = siteUrl.replace(/\/$/, '');

  const home: RouteMeta = {
    path: '/',
    title: 'Mazen — Godot Game Programmer',
    description:
      'Godot game programmer (Mazicore). I write the systems you feel in play. Shipped tower defense, turn-based combat, inventory tooling, host-authoritative multiplayer, and a Windows NFC GDExtension.',
    image: absolute(base, DEFAULT_IMAGE),
    type: 'website',
  };

  const gamePages: RouteMeta[] = games.map((game) => ({
    path: `/games/${game.id}`,
    title: `${game.title} — ${game.tagline.replace(/\s+/g, ' ')} · Mazen`,
    description: clamp(`${game.role}. ${game.desc}`),
    image: absolute(base, game.cover),
    type: 'article',
  }));

  return [home, ...gamePages];
}

/** Escape for insertion into a double-quoted HTML attribute. */
export function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function metaTags(meta: RouteMeta, siteUrl: string = DEFAULT_SITE_URL): string {
  const url = absolute(siteUrl.replace(/\/$/, ''), meta.path);
  const rows: [string, string][] = [
    ['description', meta.description],
    ['og:title', meta.title],
    ['og:description', meta.description],
    ['og:image', meta.image],
    ['og:url', url],
    ['og:type', meta.type],
    ['og:site_name', 'Mazen — Godot Game Programmer'],
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', meta.title],
    ['twitter:description', meta.description],
    ['twitter:image', meta.image],
  ];

  const tags = rows.map(([key, value]) => {
    const attr = key.startsWith('og:') ? 'property' : 'name';
    return `    <meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
  });
  tags.push(`    <link rel="canonical" href="${escapeAttr(url)}" />`);
  return tags.join('\n');
}
