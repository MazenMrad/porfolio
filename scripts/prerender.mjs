import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Turn the built SPA into static HTML, one file per route.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle).
 * For each route it renders the React tree to a string, drops it inside
 * <div id="root">, and swaps the generic <title>/<meta> block for that route's
 * own. The client bundle still loads and hydrates, so behaviour is unchanged;
 * the difference is that the page now has content before any JavaScript runs.
 */

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const distDir = join(root, 'dist');
const serverEntry = join(root, 'dist-server', 'entry-server.js');

const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/$/, '');

const { render, routeMeta, metaTags, DEFAULT_SITE_URL } = await import(
  pathToFileURL(serverEntry).href
);

const siteUrl = SITE_URL || DEFAULT_SITE_URL;
const template = await readFile(join(distDir, 'index.html'), 'utf8');

/** Where each route's HTML file goes. Vercel's cleanUrls maps these back to
 *  extension-less paths, so /games/obsidio.html serves at /games/obsidio. */
function outputPath(routePath) {
  if (routePath === '/') return join(distDir, 'index.html');
  return join(distDir, `${routePath.replace(/^\//, '')}.html`);
}

/**
 * Replace the template's static head tags with this route's.
 *
 * The template already carries a <title> and a description, so they are
 * removed before the per-route block is inserted; leaving both in place gives
 * a page two titles and lets the crawler pick whichever it likes.
 */
function buildHtml(appHtml, meta) {
  let html = template;
  html = html.replace(/\s*<title>[\s\S]*?<\/title>/, '');
  html = html.replace(/\s*<meta\s+name="description"[^>]*>/i, '');
  html = html.replace(
    '</head>',
    `    <title>${meta.title.replace(/</g, '&lt;')}</title>\n${metaTags(meta, siteUrl)}\n  </head>`
  );
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function sitemap(routes) {
  const urls = routes
    .map(
      (meta) =>
        `  <url>\n    <loc>${siteUrl}${meta.path === '/' ? '/' : meta.path}</loc>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>${meta.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const routes = routeMeta(siteUrl);
let rendered = 0;

for (const meta of routes) {
  let appHtml;
  try {
    appHtml = render(meta.path);
  } catch (error) {
    // A route that throws during prerender would otherwise ship as a blank
    // page that looks fine in the browser, so fail the build instead.
    console.error(`\n  prerender failed for ${meta.path}`);
    throw error;
  }

  const target = outputPath(meta.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buildHtml(appHtml, meta), 'utf8');
  rendered += 1;
  console.log(`  ${meta.path.padEnd(28)} ${(appHtml.length / 1024).toFixed(1)} kB`);
}

await writeFile(join(distDir, 'sitemap.xml'), sitemap(routes), 'utf8');
await writeFile(
  join(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  'utf8'
);

console.log(`\nprerendered ${rendered} routes + sitemap.xml + robots.txt -> ${siteUrl}\n`);
