import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AmberIcosahedron } from './components/AmberIcosahedron';
import { SkillSpheres } from './components/SkillSpheres';
import { LedOrb } from './components/LedOrb';
import { AboutObject } from './components/AboutObject';
import { games, type GameData } from './data/games';
import { Mail, ExternalLink, ArrowRight, Play, Gamepad2, Menu, X, MessageCircle } from 'lucide-react';

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
    { key: 'solo', label: 'Solo', sub: 'Games I designed, coded, and shipped end to end.', items: games.filter(g => g.category === 'solo') },
    { key: 'jam', label: 'Jam & Team', sub: 'Built with a crew under game-jam deadlines.', items: games.filter(g => g.category === 'jam') },
    { key: 'experiment', label: 'Experiments', sub: 'Learning builds and prototypes exploring new ideas.', items: games.filter(g => g.category === 'experiment') },
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
              <span className="section-label">&gt; godot // game dev // solo + team</span>
            </FadeIn>
            <FadeIn delay={1}>
              <h1 style={{ marginBottom: '20px' }}>
                I build small games
              </h1>
            </FadeIn>
            <FadeIn delay={2}>
              <p className="hero-tagline">
                Small games, big atmosphere. Built with Godot.
              </p>
            </FadeIn>
            <FadeIn delay={3}>
              <div className="hero-actions">
                <Link to="/#games" className="cta-button">
                  Play my games <Play size={14} />
                </Link>
                <a href="https://mazicore.itch.io/" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  itch.io profile <ExternalLink size={14} />
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={4}>
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AmberIcosahedron />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Games Section ═══ */}
      <section id="games" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container">
          <FadeIn>
            <span className="section-label">Projects</span>
            <h2>Games & Experiments</h2>
              <p className="subtitle" style={{ marginBottom: '40px' }}>
                Solo builds, jam collaborations, and prototypes. Click any card for the full
                dev breakdown, screenshots, and a link to play.
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
                    <div className="game-card" onClick={() => handleGameClick(game)} style={{ cursor: 'pointer' }}>
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
                          <span className="game-play-badge"><ArrowRight size={13} /> Case study</span>
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
                        <p className="game-card-tagline">{game.tagline}</p>
                        <p className="game-desc">{game.desc}</p>
                        <div className="tech-tags">
                          {game.genre.map(tag => (
                            <span key={tag} className="tech-tag">{tag}</span>
                          ))}
                          <span className="tech-tag tech-tag-engine">{game.engine}</span>
                        </div>
                        <Link
                          to={`/games/${game.id}`}
                          className="project-click-hint"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read full case study &rarr;
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
            <h2>Tools of the Trade</h2>
            <p className="subtitle" style={{ margin: '0 auto 40px auto' }}>
              Engines, languages, and craft I use to take a game from prototype to playable build.
            </p>
          </FadeIn>

          <FadeIn delay={2}>
            <div style={{ margin: '40px 0' }}>
              <SkillSpheres />
            </div>
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
                <h2>About Me</h2>
              </FadeIn>
              <FadeIn delay={1}>
                <p className="about-bio">
                  Hi! I'm a Game developer and computer science student working on 2D systems, UI,
                  dialogue and data persistence and a lot of more things using Godot. I focus on
                  building functional, reusable systems for indie and narrative-driven projects.
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
            <h2>Let's Build Something</h2>
            <p className="subtitle" style={{ margin: '0 auto 36px auto' }}>
              Open to collaborations, game jams, commissions, or just talking shop with fellow
              devs and artists. Reach out any time.
            </p>
          </FadeIn>

          <FadeIn delay={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
              <a href="mailto:mazicore78@gmail.com" className="cta-button" style={{ justifyContent: 'center' }}>
                Send me an email <ArrowRight size={14} />
              </a>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                mazicore78@gmail.com
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={2}>
            <div className="social-links" style={{ marginTop: '36px' }}>
              <a href="mailto:mazenmrad.123.ma@gmail.com" className="social-link" title="Email" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="https://mazicore.itch.io/" target="_blank" rel="noopener noreferrer" className="social-link" title="itch.io" aria-label="itch.io">
                <Gamepad2 size={18} />
              </a>
                <a href="https://x.com/CoreMazi27888" target="_blank" rel="noopener noreferrer" className="social-link social-link-x" title="X" aria-label="X">
                  X
                </a>
              <a href="https://mazicore.itch.io/" target="_blank" rel="noopener noreferrer" className="social-link" title="Community" aria-label="Community">
                <MessageCircle size={18} />
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
                    <a href={selectedGame.itchUrl} target="_blank" rel="noopener noreferrer" className="cta-button" style={{ fontSize: '13px' }}>
                      Play on itch.io <ExternalLink size={13} />
                    </a>
                    <Link to={`/games/${selectedGame.id}`} className="btn-outline" style={{ fontSize: '13px' }}>
                      Full case study &rarr;
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




