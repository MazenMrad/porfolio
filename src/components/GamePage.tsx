import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGame } from '../data/games';
import { LedOrb } from './LedOrb';
import { ExternalLink, ArrowRight, Play, ArrowLeft, MessageCircle } from 'lucide-react';

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
              <span className="case-study-kicker">Case Study</span>
              <span className="section-label">&gt; {game.engine} // {game.role}</span>
              <h1 className="game-page-title">{game.title}</h1>
              <p className="game-page-tagline">{game.tagline}</p>

              <div className="tech-tags" style={{ marginBottom: '20px' }}>
                {game.genre.map((tag) => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
                <span className="tech-tag tech-tag-engine">{game.engine}</span>
              </div>

              {game.stats && (
                <p className="case-study-stats">
                  {game.stats.plays} plays · {game.stats.views} views on itch.io
                </p>
              )}

              <div className="game-page-actions">
                <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                  Play on itch.io <ExternalLink size={14} />
                </a>
                {game.playable && (
                  <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    Play in browser <Play size={14} />
                  </a>
                )}
                {game.summary && game.summary.length > 0 && (
                  <button
                    type="button"
                    className="btn-outline summary-toggle"
                    onClick={() => setShowSummary((v) => !v)}
                    aria-expanded={showSummary}
                  >
                    {showSummary ? 'Full study ▲' : 'Summary ▾'}
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
        <FadeIn>
          <section id="thought" className="modal-section pm-section">
            <span className="pm-index">01</span>
            <h3 className="modal-section-title">The Thought</h3>
            <p className="modal-text">{game.postmortem.thought}</p>
          </section>
        </FadeIn>

        <FadeIn>
          <section id="mechanics" className="modal-section pm-section">
            <span className="pm-index">02</span>
            <h3 className="modal-section-title">Mechanics</h3>
            <p className="modal-text">{game.postmortem.mechanics}</p>
          </section>
        </FadeIn>

        <FadeIn>
          <section id="systems" className="modal-section pm-section">
            <span className="pm-index">03</span>
            <h3 className="modal-section-title">Systems</h3>
            <p className="modal-text">{game.postmortem.systems}</p>
          </section>
        </FadeIn>

        {(game.postmortem.architecture || game.postmortem.underTheHood) && (
          <FadeIn>
            <section id="architecture" className="modal-section pm-section">
              <span className="pm-index">04</span>
              <h3 className="modal-section-title">Under the Hood</h3>
              <p className="modal-text">{game.postmortem.underTheHood ?? game.postmortem.architecture}</p>
            </section>
          </FadeIn>
        )}

        {game.timeline && game.timeline.length > 0 && (
          <FadeIn>
            <section id="timeline" className="modal-section pm-section">
              <span className="pm-index">05</span>
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
              <span className="pm-index">06</span>
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
              <span className="pm-index">{game.team ? '07' : '06'}</span>
              <h3 className="modal-section-title">Lessons</h3>
              <p className="modal-text">{game.postmortem.lessons}</p>
            </section>
          </FadeIn>
        )}

        {game.video && game.video.length > 0 && (
          <FadeIn>
            <section id="media" className="modal-section pm-section">
              <span className="pm-index">{game.team ? (game.postmortem.lessons ? '08' : '07') : (game.postmortem.lessons ? '07' : '06')}</span>
              <h3 className="modal-section-title">Media</h3>
              <div className="game-page-video">
                {game.video.map((src, idx) => {
                  const isLocal = src.startsWith('/') || /\.(mp4|webm)$/i.test(src);
                  if (isLocal) {
                    const isNpcSpawn = /npc-spawn/i.test(src);
                    return (
                      <div key={idx} className="video-embed">
                        <video
                          src={src}
                          controls
                          playsInline
                          title={`${game.title} video ${idx + 1}`}
                          className="game-page-video-el"
                        />
                        {isNpcSpawn && (
                          <p className="video-caption">Spawns, but does not act yet.</p>
                        )}
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
              {game.gallery && game.gallery.length > 0 && (
                <div className="game-page-gallery">
                  {game.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="game-page-gallery-item"
                      style={{ backgroundImage: `url(${img})` }}
                      onClick={() => setLightboxImage(img)}
                    />
                  ))}
                </div>
              )}
            </section>
          </FadeIn>
        )}

        {!game.video && game.gallery && game.gallery.length > 0 && (
          <FadeIn>
            <section className="modal-section pm-section">
              <h3 className="modal-section-title">Media</h3>
              <div className="game-page-gallery">
                {game.gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="game-page-gallery-item"
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => setLightboxImage(img)}
                  />
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        <FadeIn>
          <section className="modal-section pm-section">
            <span className="pm-index"><Play size={15} /></span>
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
            <p className="cta-bridge-text">Want to see it in action?</p>
            {game.itchUrl && (
              <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                Play {game.title} on itch.io <ExternalLink size={14} />
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
