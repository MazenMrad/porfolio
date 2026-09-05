import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/dossier.css'
import { AppRoutes } from './routes'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)

// The prerenderer leaves markup inside #root. Hydrating it keeps the already
// visible page and just attaches handlers; calling createRoot instead would
// throw that HTML away and re-render from scratch, which is the flash of blank
// content that makes people assume prerendering "did not work".
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
