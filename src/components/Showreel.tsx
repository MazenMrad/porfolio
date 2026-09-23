import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { games, type GameData } from '../data/games';

const SLIDE_MS = 9000;

/**
 * Full-bleed showreel banner.
 *
 * One stage cycling through gameplay clips, with controls that make it feel
 * like a player rather than a slideshow: arrows, keyboard, swipe, a scrubbable
 * rail, and a progress bar that says how long is left on the current clip.
 *
 * It is deliberately not a marquee of ten simultaneous `<video>` elements.
 * That is precisely the arrangement that left six of the old project cards as
 * black rectangles, because Chrome will not concurrently start that many. Here
 * exactly one clip decodes at a time, so it actually plays.
 *
 * Interacting with the reel stops the auto-advance for good. Once someone has
 * chosen a clip, moving them off it on a timer is the reel fighting the reader.
 */

interface Slide {
  game: GameData;
  src: string;
}

export function Showreel() {
  const slides = useMemo<Slide[]>(
    () =>
      games
        .map((game) => {
          const src = game.video?.find((v) => /\.(mp4|webm)$/i.test(v));
          return src ? { game, src } : null;
        })
        .filter((s): s is Slide => s !== null),
    []
  );

  // Open on something other than the hero's clip. The hero panel already plays
  // the featured game, and running the same footage twice on one screen wastes
  // the reel's first and most-watched slide.
  const firstIndex = useMemo(() => {
    const notFeatured = slides.findIndex((s) => !s.game.featured);
    return notFeatured === -1 ? 0 : notFeatured;
  }, [slides]);

  const [index, setIndex] = useState(firstIndex);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [taken, setTaken] = useState(false);

  const bandRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const touchX = useRef<number | null>(null);

  const count = slides.length;
  const running = !reduced && !paused && !taken && onScreen && count > 1;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const go = useCallback(
    (next: number, manual = true) => {
      setIndex(((next % count) + count) % count);
      if (manual) setTaken(true);
    },
    [count]
  );

  useEffect(() => {
    const el = bandRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance, only while genuinely running.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1, false), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, running, go]);

  // Start playback only once the browser reports it can.
  useEffect(() => {
    const el = videoRef.current;
    setReady(false);
    if (!el || !onScreen) return;

    let cancelled = false;
    const start = () => {
      if (cancelled || paused || reduced) return;
      el.play()
        .then(() => !cancelled && setReady(true))
        .catch(() => {
          /* Autoplay refused — the poster stays, which is a fine outcome. */
        });
    };

    if (el.readyState >= 3) start();
    else el.addEventListener('canplay', start, { once: true });

    return () => {
      cancelled = true;
      el.removeEventListener('canplay', start);
    };
  }, [index, onScreen, paused, reduced]);

  // Stop when paused or scrolled away, so a decoder is never busy for a banner
  // nobody is looking at.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused || !onScreen || reduced) el.pause();
    else el.play().catch(() => {});
  }, [paused, onScreen, reduced]);

  // Arrow keys, but only while the reel is the thing on screen.
  useEffect(() => {
    if (!onScreen) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onScreen, index, go]);

  // Keep the active chip in view when the reel advances on its own.
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !chip) return;
    const left = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
    rail.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
  }, [index, reduced]);

  if (count === 0) return null;

  const active = slides[index];

  return (
    <section
      className="dx-reel"
      ref={bandRef}
      aria-roledescription="carousel"
      aria-label="Gameplay showreel"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 46) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="dx-reel__stage">
        {/* Both layers are keyed on the slide so React swaps them together and
            the crossfade never shows one game's poster under another's video. */}
        <img
          className={`dx-reel__poster${active.game.mediaFit === 'contain' ? ' is-fit' : ''}`}
          key={`poster-${active.game.id}`}
          src={active.game.cover}
          alt={`${active.game.title} gameplay`}
        />
        <video
          ref={videoRef}
          key={`video-${active.game.id}`}
          className={`dx-reel__video${ready ? ' is-on' : ''}${active.game.mediaFit === 'contain' ? ' is-fit' : ''}`}
          src={active.src}
          poster={active.game.cover}
          preload="auto"
          muted
          loop
          playsInline
          aria-hidden="true"
        />

        <div className="dx-reel__scrim" />

        <div className="dx-shell dx-reel__caption" key={`cap-${active.game.id}`}>
          <span className="dx-meta dx-reel__kicker">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} — Now playing
          </span>
          <h2 className="dx-display dx-reel__title">{active.game.title}</h2>
          <p className="dx-reel__hook">{active.game.hook ?? active.game.tagline}</p>
          <div className="dx-reel__actions">
            <Link to={`/games/${active.game.id}`} className="dx-btn">
              How it was built
            </Link>
            {active.game.itchUrl && (
              <a
                href={active.game.itchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dx-btn dx-btn--ghost"
              >
                Play it <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="dx-reel__controls">
          <button className="dx-reel__nav" onClick={() => go(index - 1)} aria-label="Previous clip">
            <ChevronLeft size={17} />
          </button>
          <button
            className="dx-reel__nav"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume showreel' : 'Pause showreel'}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button className="dx-reel__nav" onClick={() => go(index + 1)} aria-label="Next clip">
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Progress sits on the stage edge, where a video scrubber would be. */}
        <div className="dx-reel__progress">
          {running && (
            <span
              className="dx-reel__progress-fill"
              key={`p-${index}`}
              style={{ animationDuration: `${SLIDE_MS}ms` }}
            />
          )}
        </div>
      </div>

      <div className="dx-shell dx-reel__railwrap">
        <ul className="dx-reel__rail" ref={railRef}>
          {slides.map((slide, i) => (
            <li key={slide.game.id}>
              <button
                className={`dx-reel__chip${i === index ? ' is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Show ${slide.game.title}`}
                aria-current={i === index}
              >
                <span
                  className="dx-reel__thumb"
                  style={{ backgroundImage: `url(${slide.game.cover})` }}
                />
                <span className="dx-reel__chiptext">
                  <span className="dx-reel__name">{slide.game.title}</span>
                  <span className="dx-reel__engine">{slide.game.engine}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
