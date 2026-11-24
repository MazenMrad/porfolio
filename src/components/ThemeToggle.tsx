import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const KEY = 'mazicore-theme';

function paint(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f7f5' : '#161616');
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode */
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(current);
  }, []);

  const light = theme === 'light';

  return (
    <button
      type="button"
      className="dx-theme"
      aria-pressed={light}
      aria-label={light ? 'Switch to dark mode' : 'Switch to white mode'}
      onClick={() => {
        const next = light ? 'dark' : 'light';
        paint(next);
        setTheme(next);
      }}
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
