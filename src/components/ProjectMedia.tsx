import { useEffect, useRef, useState } from 'react';

/**
 * Media well for a project.
 *
 * The old cards rendered `<video autoPlay muted loop>` with no poster and no
 * preload hint, six of them at once. Chrome refuses to concurrently start that
 * many, so six of eight projects showed as black rectangles: every video sat at
 * readyState 0, paused, with no error to explain it. On a games portfolio that
 * is the entire pitch failing silently.
 *
 * The fix inverts the priority. A poster image is always painted first, so
 * something is visible no matter what. The video is only attached once the well
 * scrolls near the viewport, and it only starts once it can actually play. If
 * it stalls or errors, the poster simply stays — the failure mode is a still
 * frame of the game rather than a void.
 */

interface ProjectMediaProps {
  poster: string;
  video?: string;
  alt: string;
  caption?: string;
  flag?: string;
  flagQuiet?: boolean;
  tall?: boolean;
  fit?: 'cover' | 'contain';
  className?: string;
}

export function ProjectMedia({
  poster,
  video,
  alt,
  caption,
  flag,
  flagQuiet,
  tall,
  fit = 'cover',
  className = '',
}: ProjectMediaProps) {
  const wellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Attach the video only when the well is close to the viewport, so a page
  // with eight projects never asks the browser for eight simultaneous decodes.
  useEffect(() => {
    const el = wellRef.current;
    if (!el || !video) return;

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [video]);

  // Play only after the browser reports it can. Calling play() eagerly is what
  // produces the unhandled rejection and the frozen black frame.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !near) return;

    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      el.play()
        .then(() => !cancelled && setPlaying(true))
        .catch(() => {
          /* Autoplay refused — the poster stays, which is a fine outcome. */
        });
    };

    if (el.readyState >= 3) {
      start();
    } else {
      el.addEventListener('canplay', start, { once: true });
    }

    return () => {
      cancelled = true;
      el.removeEventListener('canplay', start);
    };
  }, [near]);

  return (
    <div
      ref={wellRef}
      className={`dx-well${tall ? ' dx-well--tall' : ''}${fit === 'contain' ? ' dx-well--contain' : ''} ${className}`.trim()}
    >
      {flag && (
        <span className={`dx-well__flag${flagQuiet ? ' dx-well__flag--quiet' : ''}`}>
          {flag}
        </span>
      )}

      <img className="dx-well__poster" src={poster} alt={alt} loading="lazy" decoding="async" />

      {video && near && (
        <video
          ref={videoRef}
          className={`dx-well__media${playing ? ' dx-well__media--on' : ''}`}
          src={video}
          poster={poster}
          preload="metadata"
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setPlaying(false)}
        />
      )}

      {caption && <span className="dx-well__cap">{caption}</span>}
    </div>
  );
}
