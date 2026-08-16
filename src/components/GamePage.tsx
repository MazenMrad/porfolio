import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGame, type GameData } from '../data/games';
import { LedOrb } from './LedOrb';
import { ExternalLink, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeIn();
  const delayClass = delay > 0 ? ` fade-in-delay-${delay}` : '';
  return (
    <div ref={ref} className={`fade-in${delayClass} ${className}`}>
      {children}
    </div>
  );
}

function padIndex(n: number) {
  return String(n).padStart(2, '0');
}

function GameMedia({
  game,
  index,
  onPick,
}: {
  game: GameData;
  index: string;
  onPick: (src: string) => void;
}) {
  const hasVideo = Boolean(game.video && game.video.length > 0);
  const hasGallery = Boolean(game.gallery && game.gallery.length > 0);
  if (!hasVideo && !hasGallery) return null;

  return (
    <FadeIn>
      <section id="media" className="modal-section pm-section">
        <span className="pm-index">{index}</span>
        <h3 className="modal-section-title">See it first</h3>
        {hasVideo && (
          <div className="game-page-video">
            {game.video!.map((src, idx) => {
              const isLocal = src.startsWith('/') || /\.(mp4|webm)$/i.test(src);
              if (isLocal) {
                const note = game.videoNotes?.[idx] ?? (/npc-spawn/i.test(src) ? 'Spawns, but does not act yet.' : undefined);
                return (
                  <div key={idx} className="video-block">
                    <div className="video-embed">
                      <video
                        src={src}
                        controls
                        playsInline
                        title={`${game.title} video ${idx + 1}`}
                        className="game-page-video-el"
                      />
                    </div>
                    {note && <p className="video-caption">{note}</p>}
                  </div>
                );
              }
              return (
                <div key={idx} className="video-embed">
                  <iframe
                    src={src}
                    title={`${game.title} video ${idx + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            })}
          </div>
        )}
        {hasGallery && (
          <div className="game-page-gallery">
            {game.gallery.map((img, idx) => (
              <div
                key={idx}
                className="game-page-gallery-item"
                style={{ backgroundImage: `url(${img})` }}
                onClick={() => onPick(img)}
              />
            ))}
          </div>
        )}
      </section>
    </FadeIn>
  );
}

export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const game = slug ? getGame(slug) : undefined;
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (lightboxImage) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setLightboxImage(null);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [lightboxImage]);

  if (!game) {
    return (
      <div className="game-page-missing">
        <h1>Game not found</h1>
        <p className="subtitle">That project doesn't exist (yet).</p>
        <Link to="/" className="cta-button">Back to portfolio <ArrowLeft size={14} /></Link>
      </div>
    );
  }

  let section = 0;
  const nextIndex = () => padIndex(++section);

  return (
    <div className="game-page">
      <div className="game-page-hero">
        <div className="game-page-hero-glow" />
        <div className="portfolio-container">
          <Link to="/#games" className="game-page-back">
            <ArrowLeft size={14} /> All games
          </Link>

          <div className="game-page-hero-grid">
            <FadeIn>
              <div className="game-page-cover">
                {game.video && game.video.some((v) => /(\.mp4|\.webm)$/i.test(v)) ? (
                  <video
                    className="game-page-cover-video"
                    src={game.video.find((v) => /(\.mp4|\.webm)$/i.test(v))}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="game-page-cover-img" style={{ backgroundImage: `url(${game.cover})` }} />
                )}
                <LedOrb status={game.status} />
              </div>
            </FadeIn>

            <FadeIn delay={1}>
              <span className="case-study-kicker">
                {game.category === 'client'
                  ? (game.client?.name ? `For ${game.client.name}` : 'Client project')
                  : game.playable
                    ? 'Playable on itch.io'
                    : game.status === 'wip'
                      ? 'Work in progress'
                      : 'Prototype'}
              </span>
              <span className="section-label">&gt; {game.engine} // {game.role}</span>
              <h1 className="game-page-title">{game.title}</h1>
              <p className="game-page-tagline">{game.hook ?? game.tagline}</p>

              <div className="tech-tags" style={{ marginBottom: '20px' }}>
                {game.genre.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
                {game.client?.name && (
                  <span className="tech-tag">{game.client.name}</span>
                )}
                <span className="tech-tag tech-tag-engine">{game.engine}</span>
              </div>

              {game.stats && (
                <p className="case-study-stats">
                  {game.stats.plays} plays · {game.stats.views} views on itch.io
                </p>
              )}

              <div className="game-page-actions">
                {game.itchUrl && (
                  <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                    Play on itch.io <ExternalLink size={14} />
                  </a>
                )}
                {game.xPost && !game.itchUrl && (
                  <a href={game.xPost} target="_blank" rel="noopener noreferrer" className="cta-button">
                    <MessageCircle size={14} /> Dev post
                  </a>
                )}
                {game.summary && game.summary.length > 0 && (
                  <button
                    type="button"
                    className="btn-outline summary-toggle"
                    onClick={() => setShowSummary((v) => !v)}
                    aria-expanded={showSummary}
                  >
                    {showSummary ? 'Full study ▲' : '60-second summary ▾'}
                  </button>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="portfolio-container game-page-body">
        <FadeIn>
          <p className="modal-text modal-text-highlight">{game.desc}</p>
        </FadeIn>

        {showSummary && game.summary && game.summary.length > 0 && (
          <div className="case-study-summary">
            <ul className="case-study-summary-list">
              {game.summary.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {!showSummary && (
          <div className="pm-rail">
            {(game.video?.length || game.gallery?.length) ? (
              <GameMedia game={game} index={nextIndex()} onPick={setLightboxImage} />
            ) : null}

            {game.features.length > 0 && (
              <FadeIn>
                <section id="features" className="modal-section pm-section">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">What it does</h3>
                  <ul className="modal-list">
                    {game.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            )}

            {game.controls && game.controls.length > 0 && (
              <FadeIn>
                <section id="controls" className="modal-section pm-section">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">Controls</h3>
                  <div className="controls-table">
                    {game.controls.map((c) => (
                      <div key={c.action} className="controls-row">
                        <span>{c.action}</span>
                        <span className="controls-input">{c.input}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {game.client && (
              <FadeIn>
                <section id="client" className="modal-section pm-section team-role">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">
                    {game.client.name ? `For ${game.client.name}` : 'For a client'}
                  </h3>
                  <p className="team-role-myrole">{game.client.myRole}</p>
                  <div className="team-role-members" style={{ marginTop: '12px' }}>
                    <span className="team-member-chip">{game.client.name ?? 'Client'}</span>
                    <span className="team-member-chip me">Mazen (Mazicore)</span>
                  </div>
                </section>
              </FadeIn>
            )}

            <FadeIn>
              <section id="thought" className="modal-section pm-section">
                <span className="pm-index">{nextIndex()}</span>
                <h3 className="modal-section-title">The Thought</h3>
                <p className="modal-text">{game.postmortem.thought}</p>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="mechanics" className="modal-section pm-section">
                <span className="pm-index">{nextIndex()}</span>
                <h3 className="modal-section-title">Mechanics</h3>
                <p className="modal-text">{game.postmortem.mechanics}</p>
              </section>
            </FadeIn>

            <FadeIn>
              <section id="systems" className="modal-section pm-section">
                <span className="pm-index">{nextIndex()}</span>
                <h3 className="modal-section-title">Systems</h3>
                <p className="modal-text">{game.postmortem.systems}</p>
              </section>
            </FadeIn>

            {(game.postmortem.architecture || game.postmortem.underTheHood) && (
              <FadeIn>
                <section id="architecture" className="modal-section pm-section">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">Under the Hood</h3>
                  <p className="modal-text">{game.postmortem.underTheHood ?? game.postmortem.architecture}</p>
                </section>
              </FadeIn>
            )}

            {game.timeline && game.timeline.length > 0 && (
              <FadeIn>
                <section id="timeline" className="modal-section pm-section">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">Timeline</h3>
                  <div className="pm-timeline">
                    {game.timeline.map((entry, idx) => (
                      <div key={idx} className="pm-timeline-item">
                        <div className="pm-timeline-marker" />
                        <div className="pm-timeline-content">
                          <span className="pm-timeline-date">{entry.date}</span>
                          <h4 className="pm-timeline-title">{entry.title}</h4>
                          <p className="pm-timeline-body">{entry.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {game.team && (
              <FadeIn>
                <section id="role" className="modal-section pm-section team-role">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">My Role</h3>
                  <p className="team-role-myrole">{game.team.myRole}</p>
                  <div className="team-role-members" style={{ marginTop: '12px' }}>
                    {game.team.members.map((m, idx) => (
                      <span key={idx} className={`team-member-chip${m.includes('Mazen') ? ' me' : ''}`}>{m}</span>
                    ))}
                  </div>
                </section>
              </FadeIn>
            )}

            {game.postmortem.lessons && (
              <FadeIn>
                <section id="lessons" className="modal-section pm-section">
                  <span className="pm-index">{nextIndex()}</span>
                  <h3 className="modal-section-title">Lessons</h3>
                  <p className="modal-text">{game.postmortem.lessons}</p>
                </section>
              </FadeIn>
            )}

            <FadeIn>
              <section className="modal-section pm-section">
                <span className="pm-index">{nextIndex()}</span>
                <h3 className="modal-section-title">Play & Status</h3>
                <div className="tech-tags" style={{ marginBottom: '16px' }}>
                  <span className="tech-tag tech-tag-engine">{game.status}</span>
                  <span className="tech-tag">{game.engine}</span>
                  <span className="tech-tag">{game.year}</span>
                </div>
                <div className="game-page-actions">
                  {game.itchUrl && (
                    <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                      Play on itch.io <ExternalLink size={14} />
                    </a>
                  )}
                  {game.xPost && (
                    <a href={game.xPost} target="_blank" rel="noopener noreferrer" className="btn-outline">
                      <MessageCircle size={14} /> Dev post
                    </a>
                  )}
                </div>
              </section>
            </FadeIn>
          </div>
        )}

        <FadeIn>
          <div className="cta-bridge">
            <p className="cta-bridge-text">
              {game.itchUrl ? 'Play it. Then decide if the systems hold up.' : 'No public build yet. Ask me for a local walkthrough.'}
            </p>
            {game.itchUrl && (
              <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                Play {game.title} on itch.io <ExternalLink size={14} />
              </a>
            )}
            {!game.itchUrl && game.xPost && (
              <a href={game.xPost} target="_blank" rel="noopener noreferrer" className="cta-button">
                <MessageCircle size={14} /> Dev post
              </a>
            )}
          </div>
        </FadeIn>
      </div>

      {lightboxImage && (
        <div className="modal-backdrop lightbox-backdrop" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setLightboxImage(null)} aria-label="Close">
              <ArrowRight size={18} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <img src={lightboxImage} alt="Game screenshot" className="lightbox-img" />
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="portfolio-container footer-inner">
          <span>© {new Date().getFullYear()} Mazen (Mazicore). All rights reserved.</span>
          <span className="mono">Built with React + Three.js</span>
        </div>
      </footer>
    </div>
  );
}
