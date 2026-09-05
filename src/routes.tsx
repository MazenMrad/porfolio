import { Routes, Route } from 'react-router-dom';
import App from './App';
import { GamePage } from './components/GamePage';

/**
 * One route tree, imported by both the browser entry and the prerenderer.
 *
 * Keeping this in a single file is what stops the two from drifting: a route
 * added here is prerendered and hydrated, a route added in only one place is
 * the classic way a static build starts serving stale or blank pages.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/games/:slug" element={<GamePage />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
}
