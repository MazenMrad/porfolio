import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Preview server that behaves like the production host.
 *
 * `vite preview` serves dist/ as plain files, which is not what Vercel does:
 * with `cleanUrls` enabled, /games/obsidio resolves to games/obsidio.html and
 * the .html URL redirects to the clean one. Without modelling that, previewing
 * a prerendered build gives misleading results -- you either hit the SPA
 * fallback or you land on the .html path, where the router reads the slug as
 * "obsidio.html" and hydration mismatches against markup built for "obsidio".
 *
 *   node scripts/serve-static.mjs [port]
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] ?? 4318);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function fileAt(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? path : null;
  } catch {
    return null;
  }
}

function send(res, status, path) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(url.pathname);

  // cleanUrls: /games/obsidio.html permanently redirects to /games/obsidio.
  if (pathname.endsWith('.html') && pathname !== '/index.html') {
    res.writeHead(308, { Location: pathname.slice(0, -'.html'.length) + url.search });
    res.end();
    return;
  }

  const direct = await fileAt(join(root, pathname));
  if (direct) return send(res, 200, direct);

  const asHtml = await fileAt(join(root, `${pathname.replace(/\/$/, '')}.html`));
  if (asHtml) return send(res, 200, asHtml);

  const index = await fileAt(join(root, pathname, 'index.html'));
  if (index) return send(res, 200, index);

  // SPA fallback, same as the rewrite in vercel.json.
  send(res, 200, join(root, 'index.html'));
}).listen(port, () => {
  console.log(`serving dist/ with cleanUrls at http://localhost:${port}`);
});
