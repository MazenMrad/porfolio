import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SkillSpheres } from './components/SkillSpheres';
import { LedOrb } from './components/LedOrb';
import { AboutObject } from './components/AboutObject';
import { games, type GameData } from './data/games';
import { Mail, ExternalLink, ArrowRight, Play, Gamepad2, Menu, X } from 'lucide-react';

/* ─── Scroll-triggered fade-in hook ─── */
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

/* ─── Fade-in wrapper component ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useFadeIn();
  const delayClass = delay > 0 ? ` fade-in-delay-${delay}` : '';
  return (
    <div ref={ref} className={`fade-in${delayClass} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Main App ─── */
function App() {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeLightbox = () => setLightboxImage(null);

  useEffect(() => {
    if (selectedGame) {
      document.body.classList.add('modal-open');
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [selectedGame]);

  useEffect(() => {
    if (lightboxImage) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [lightboxImage]);

  /* ─── Games (imported from data module) ─── */

  const gamesGroups: { key: string; label: string; sub: string; items: GameData[] }[] = [
    { key: 'solo', label: 'Solo', sub: 'I designed, coded, and shipped these end to end.', items: games.filter(g => g.category === 'solo') },
    { key: 'client', label: 'Client', sub: 'Ogre inventory plugin. RoboStark tactics combat.', items: games.filter(g => g.category === 'client') },
    { key: 'jam', label: 'Jam & Team', sub: 'Godot programming under jam deadlines.', items: games.filter(g => g.category === 'jam' && g.id !== 'biscuit-zone') },
    { key: 'experiment', label: 'Experiments', sub: 'Engine work and learning projects.', items: games.filter(g => g.category === 'experiment') },
  ];

  const livePlays = games.reduce((sum, g) => sum + (g.stats?.plays ?? 0), 0);
  const liveTitles = games.filter((g) => g.status === 'live').length;
  const shippedSystems = [
    'Signal-driven HUD',
    'Grid inventory',
    'Replayable combat rolls',
    'Object pools',
    'Economy loops',
    'Enemy state machines',
  ];

  const navLinks = [
    { href: '#games', label: 'Games' },
    { href: '#skills', label: 'Skills' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];


  const handleNavClick = () => setMobileNavOpen(false);
  const handleGameClick = (game: GameData) => navigate(`/games/${game.id}`);
  const handleCloseModal = () => setSelectedGame(null);

  // Scroll to hash target on home navigation (e.g. /#games)
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [window.location.pathname, window.location.hash]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ═══ Header ═══ */}
      <header className={`site-header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="portfolio-container header-inner">
          <Link to="/" className="header-logo">
            mazen<span className="logo-dot">.</span><span className="logo-sub">mazicore</span>
          </Link>
          <nav className="header-nav">
            {navLinks.map(link => (
              <Link key={link.href} to={`/${link.href}`}>{link.label}</Link>
            ))}
          </nav>
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px 28px 20px',
            borderTop: '1px solid var(--border)',
            background: 'rgba(10, 14, 30, 0.96)',
          }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={`/${link.href}`}
                onClick={handleNavClick}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  padding: '8px 0',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* ═══ Hero Section ═══ */}
      <section id="hero" className="hero-section" style={{ borderTop: 'none' }}>
        <div className="hero-glow" />
        <div className="portfolio-container hero-grid">
          <div>
            <FadeIn>
              <span className="section-label">&gt; godot 4.6 // programmer // playable builds</span>
            </FadeIn>
            <FadeIn delay={1}>
              <h1 style={{ marginBottom: '20px' }}>
                I write the systems.<br />
                You feel them in play.
              </h1>
            </FadeIn>
            <FadeIn delay={2}>
              <p className="hero-tagline">
                Godot game programmer. Start with <strong>Obsidio</strong>:
                tower defense that rewards aim, not placement.
              </p>
            </FadeIn>
            <FadeIn delay={3}>
              <div className="hero-actions">
                <a href="https://mazicore.itch.io/obsidio" target="_blank" rel="noopener noreferrer" className="cta-button">
                  Play Obsidio <Play size={14} />
                </a>
                <Link to="/#games" className="btn-outline">
                  See the systems <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={4}>
              <div className="hero-proof">
                <span><strong>{liveTitles}</strong> live Godot titles</span>
                <span><strong>{livePlays}</strong> plays on itch</span>
                <span><strong>Solo + jam</strong></span>
              </div>
              <div className="hero-socials">
                <a href="mailto:mazicore78@gmail.com" className="social-link" title="Email" aria-label="Email">
                  <Mail size={18} />
                </a>
                <a href="https://mazicore.itch.io/" target="_blank" rel="noopener noreferrer" className="social-link" title="itch.io" aria-label="itch.io">
                  <Gamepad2 size={18} />
                </a>
                <a href="https://x.com/CoreMazi27888" target="_blank" rel="noopener noreferrer" className="social-link social-link-x" title="X" aria-label="X">
                  X
                </a>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={2}>
            <a
              className="hero-media"
              href="https://mazicore.itch.io/obsidio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Play Obsidio on itch.io"
            >
              <video
                className="hero-media-video"
                src="/media/obsidio/water-shader.mp4"
                poster="/media/obsidio/editor-capture.gif"
                autoPlay
                muted
                loop
                playsInline
              />
              <span className="hero-media-caption">Tower defense that rewards aim, not placement.</span>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Games Section ═══ */}
      <section id="games" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container">
          <FadeIn>
            <span className="section-label">Shipped work</span>
            <h2>Play it. Then read how it was built.</h2>
              <p className="subtitle" style={{ marginBottom: '40px' }}>
                Start with Obsidio. Every card is a system you can inspect —
                combat, economy, UI — not a mood board.
              </p>
          </FadeIn>

          {gamesGroups.map((group) => (
            <div key={group.key} className="games-group">
              <FadeIn>
                <div className="games-group-header">
                  <span className="games-group-title">{group.label}</span>
                  <span className="games-group-rule" />
                  <span className="games-group-count">{group.items.length} project{group.items.length > 1 ? 's' : ''}</span>
                </div>
                <p className="games-group-sub">{group.sub}</p>
              </FadeIn>
              <div className="games-grid">
                {group.items.map((game, i) => (
                  <FadeIn key={game.id} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                    <div className={`game-card${game.featured ? ' featured' : ''}`} onClick={() => handleGameClick(game)} style={{ cursor: 'pointer' }}>
                      <div className="game-card-cover">
                        {game.video && game.video.some((v) => /(\.mp4|\.webm)$/i.test(v)) ? (
                          <video
                            className="game-card-cover-video"
                            src={game.video.find((v) => /(\.mp4|\.webm)$/i.test(v))}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <div className="game-card-cover-img" style={{ backgroundImage: `url(${game.cover})` }} />
                        )}
                        <div className="game-card-cover-overlay">
                          {game.featured ? (
                            <span className="game-play-badge game-play-badge-featured">Start here</span>
                          ) : game.category === 'client' ? (
                            <span className="game-play-badge">{game.client?.name ?? 'Client work'}</span>
                          ) : (
                            <span className="game-play-badge"><ArrowRight size={13} /> Systems</span>
                          )}
                        </div>
                        <LedOrb status={game.status} />
                      </div>
                      <div className="game-card-content">
                        <div className="game-card-top-row">
                          <h3 className="game-card-title">
                            <Link to={`/games/${game.id}`} onClick={(e) => e.stopPropagation()}>{game.title}</Link>
                          </h3>
                          <span className="project-year">{game.year}</span>
                        </div>
                        <span className={`game-card-badge ${game.category}`}>{game.category}</span>
                        <p className="game-card-tagline">{game.hook ?? game.tagline}</p>
                        <p className="game-desc">{game.tagline}</p>
                        <div className="tech-tags">
                          {game.genre.map(tag => (
                            <span key={tag} className="tech-tag">{tag}</span>
                          ))}
                          {game.client?.name && (
                            <span className="tech-tag">{game.client.name}</span>
                          )}
                          <span className="tech-tag tech-tag-engine">{game.engine}</span>
                        </div>
                        <Link
                          to={`/games/${game.id}`}
                          className="project-click-hint"
                          onClick={(e) => e.stopPropagation()}
                        >
                          See the systems &rarr;
                        </Link>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Skills Section ═══ */}
      <section id="skills" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container" style={{ textAlign: 'center' }}>
          <FadeIn>
            <span className="section-label">Stack</span>
            <h2>What I actually write</h2>
            <p className="subtitle" style={{ margin: '0 auto 40px auto' }}>
              Godot and GDScript first. Unity when the problem needs it.
              The chips below are systems I have shipped, not a tool museum.
            </p>
          </FadeIn>

          <FadeIn delay={2}>
            <div style={{ margin: '40px 0 28px' }}>
              <SkillSpheres />
            </div>
            <ul className="system-chips">
              {shippedSystems.map((item) => (
                <li key={item} className="system-chip">{item}</li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ═══ About Section ═══ */}
      <section id="about" style={{ background: 'var(--bg-white)' }}>
        <div className="portfolio-container">
          <div className="about-layout">
            <div className="about-layout-text">
              <FadeIn>
                <span className="section-label">About</span>
                <h2>Godot programmer. CS student. I ship playable systems.</h2>
              </FadeIn>
              <FadeIn delay={1}>
                <p className="about-bio">
                  I build 2D game systems in Godot: combat feel, economy loops,
                  signal-driven UI, and persistence. If a feature does not change
                  how a run feels, I do not ship it. Open to Godot work —
                  solo systems, jam teams, or a playable prototype.
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={2}>
              <div className="about-object">
                <AboutObject />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ Contact Section ═══ */}
      <section id="contact" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <FadeIn>
            <span className="section-label">Contact</span>
            <h2>Need a Godot programmer?</h2>
            <p className="subtitle" style={{ margin: '0 auto 36px auto' }}>
              Solo systems work, jam collaboration, or a prototype you can play.
              Email is the fastest path.
            </p>
          </FadeIn>

          <FadeIn delay={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
              <a href="mailto:mazicore78@gmail.com" className="cta-button" style={{ justifyContent: 'center' }}>
                Email Mazen <ArrowRight size={14} />
              </a>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                mazicore78@gmail.com
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={2}>
            <div className="social-links" style={{ marginTop: '36px' }}>
              <a href="mailto:mazicore78@gmail.com" className="social-link" title="Email" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="https://mazicore.itch.io/" target="_blank" rel="noopener noreferrer" className="social-link" title="itch.io" aria-label="itch.io">
                <Gamepad2 size={18} />
              </a>
              <a href="https://x.com/CoreMazi27888" target="_blank" rel="noopener noreferrer" className="social-link social-link-x" title="X" aria-label="X">
                X
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Game Detail Modal ═══ */}
      {selectedGame && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
              <X size={18} />
            </button>

            {selectedGame.cover && (
              <div className="modal-hero" onClick={() => setLightboxImage(selectedGame.cover)}>
                <div className="modal-hero-img" style={{ backgroundImage: `url(${selectedGame.cover})` }} />
              </div>
            )}

            <div className="modal-body-inner">
              <div className="modal-layout">
                <div className="modal-main">
                  <div className="modal-header-row">
                    <h2 className="modal-title">{selectedGame.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span className="project-year">{selectedGame.year}</span>
                      <LedOrb status={selectedGame.status} />
                    </div>
                  </div>

                  <div className="tech-tags" style={{ marginBottom: '14px' }}>
                    {selectedGame.genre.map(tag => (
                      <span key={tag} className="tech-tag">{tag}</span>
                    ))}
                    {selectedGame.client?.name && (
                      <span className="tech-tag">{selectedGame.client.name}</span>
                    )}
                    <span className="tech-tag tech-tag-engine">{selectedGame.engine}</span>
                  </div>

                  <p className="modal-text modal-text-highlight">{selectedGame.tagline}</p>

                  <section className="modal-section">
                    <h3 className="modal-section-title">The Thought</h3>
                    <p className="modal-text">{selectedGame.postmortem.thought}</p>
                  </section>

                  <section className="modal-section">
                    <h3 className="modal-section-title">Key Features</h3>
                    <ul className="modal-list">
                      {selectedGame.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="modal-section">
                    <h3 className="modal-section-title">How It Was Built</h3>
                    <p className="modal-text">{selectedGame.postmortem.architecture}</p>
                  </section>

                  <div className="modal-links">
                    {selectedGame.itchUrl && (
                      <a href={selectedGame.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button" style={{ fontSize: '13px' }}>
                        Play on itch.io <ExternalLink size={13} />
                      </a>
                    )}
                    <Link to={`/games/${selectedGame.id}`} className="btn-outline" style={{ fontSize: '13px' }}>
                      See the systems &rarr;
                    </Link>
                  </div>
                </div>

                {selectedGame.gallery && selectedGame.gallery.length > 0 && (
                  <div className="modal-sidebar">
                    {selectedGame.gallery.map((img, idx) => (
                      <div key={idx} className="modal-sidebar-link" onClick={() => setLightboxImage(img)}>
                        <div className="modal-sidebar-img" style={{ backgroundImage: `url(${img})` }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Image Lightbox ═══ */}
      {lightboxImage && (
        <div className="modal-backdrop lightbox-backdrop" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeLightbox} aria-label="Close">
              <X size={18} />
            </button>
            <img src={lightboxImage} alt="Game screenshot" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* ═══ Footer ═══ */}
      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="portfolio-container footer-inner">
          <span>© {new Date().getFullYear()} Mazen (Mazicore). All rights reserved.</span>
          <span className="mono">Built with React + Three.js</span>
        </div>
      </footer>

    </div>
  );
}

export default App;




