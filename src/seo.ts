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
  /** JSON-LD blocks for this page, serialised into the head at prerender. */
  schema: object[];
}

const PERSON_ID = '#mazen';
const ITCH = 'https://mazicore.itch.io/';
const X_URL = 'https://x.com/CoreMazi27888';

/** Search results cut titles around 60 characters, so drop detail until it fits. */
function gameTitle(title: string, genre: string | undefined, engine: string): string {
  const shortEngine = engine.split(' · ')[0];
  const options = [
    genre ? `${title} — ${genre} in ${shortEngine} | Mazen` : '',
    genre ? `${title} — ${genre} | Mazen` : '',
    `${title} | Mazen`,
  ];
  return options.find((t) => t && t.length <= 60) ?? options[2];
}

/** Social cards handle GIFs badly; each GIF cover has a still og.png beside it. */
function shareImage(cover: string): string {
  return cover.endsWith('.gif') ? cover.replace(/[^/]+\.gif$/, 'og.png') : cover;
}

function person(base: string) {
  return {
    '@type': 'Person',
    '@id': `${base}/${PERSON_ID}`,
    name: 'Mazen',
    alternateName: 'Mazicore',
    jobTitle: 'Freelance gameplay programmer',
    url: `${base}/`,
    sameAs: [ITCH, X_URL],
    knowsAbout: ['Unity', 'Godot', 'C#', 'GDScript', 'C++ GDExtension', 'Gameplay programming', 'Multiplayer netcode'],
  };
}

const DEFAULT_IMAGE = '/media/last-case/cover.png';

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
    title: 'Mazen — Freelance Unity & Godot Gameplay Programmer',
    description:
      'Freelance gameplay programmer in Unity and Godot: combat, inventory, puzzle rules, economy, netcode and C++ extensions. Scoped in writing, delivered playable.',
    image: absolute(base, DEFAULT_IMAGE),
    type: 'website',
    schema: [],
  };

  const unity: RouteMeta = {
    path: '/unity',
    title: 'Mazen — Unity Gameplay Programmer (Freelance)',
    description:
      'Freelance Unity and C# programmer: rules-first gameplay code, ScriptableObject pipelines, tested logic. Shipped Last Case, a packing puzzle with an exact solver.',
    image: absolute(base, '/media/last-case/cover.png'),
    type: 'website',
    schema: [],
  };

  const godot: RouteMeta = {
    path: '/godot',
    title: 'Mazen — Godot Game Programmer (Freelance)',
    description:
      'Freelance Godot programmer. Combat, inventory plugins, economy, netcode and C++ GDExtensions. Four client projects and shipped titles on itch.io.',
    image: absolute(base, DEFAULT_IMAGE),
    type: 'website',
    schema: [],
  };

  // The engine pages describe the same person, so each carries the Person
  // block and the site's WebSite block.
  for (const page of [home, unity, godot]) {
    page.schema = [
      person(base),
      { '@type': 'WebSite', name: 'Mazicore', url: `${base}/`, publisher: { '@id': `${base}/${PERSON_ID}` } },
    ];
  }

  const gamePages: RouteMeta[] = games.map((game) => {
    const url = `${base}/games/${game.id}`;
    const description = clamp(`${game.role}. ${game.desc}`, 160);
    const image = absolute(base, shareImage(game.cover));
    return {
      path: `/games/${game.id}`,
      title: gameTitle(game.title, game.genre[0], game.engine),
      description,
      image,
      type: 'article',
      schema: [
        {
          '@type': 'VideoGame',
          name: game.title,
          description,
          image,
          url,
          genre: game.genre,
          gamePlatform: 'PC',
          applicationCategory: 'Game',
          dateCreated: game.year.slice(0, 4),
          author: person(base),
          ...(game.itchUrl ? { sameAs: game.itchUrl } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Work', item: `${base}/` },
            { '@type': 'ListItem', position: 2, name: game.title, item: url },
          ],
        },
      ],
    };
  });

  return [home, unity, godot, ...gamePages];
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
    ['og:site_name', 'Mazicore'],
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
  if (meta.schema.length) {
    // `<` is escaped so a value can never close the script element early.
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.schema }).replace(/</g, '\\u003c');
    tags.push(`    <script type="application/ld+json">${json}</script>`);
  }
  return tags.join('\n');
}
