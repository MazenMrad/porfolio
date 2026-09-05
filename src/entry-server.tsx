import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import './styles/dossier.css';

export { routeMeta, metaTags, DEFAULT_SITE_URL } from './seo';

/**
 * Render one route to a static HTML string at build time.
 *
 * This is a prerender, not a server: it runs once during `npm run build` and
 * the output is plain files on a CDN. No Node process is needed in production,
 * so the hosting story does not change at all.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>
  );
}
