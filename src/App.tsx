import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, Menu, MessageCircle, Play, X } from 'lucide-react';
import { games, type GameData } from './data/games';
import { briefChecklist, capabilities, facts, processSteps, testimonials } from './data/practice';
import { ProjectMedia } from './components/ProjectMedia';
import { Showreel } from './components/Showreel';
import { SystemsObject } from './components/SystemsObject';

const EMAIL = 'mazicore78@gmail.com';
const ITCH = 'https://mazicore.itch.io/';
const X_URL = 'https://x.com/CoreMazi27888';
const DISCORD = 'mazen24';

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#build', label: 'What I build' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
];

/* ─── Reveal on scroll ───────────────────────────────────────────
   Applied to below-the-fold content only. The hero is deliberately not
   wrapped in this: gating the first screen behind an observer is what
   made the old page read as empty on arrival. */
function Reveal({
  children,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'li';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    // Already on screen at mount? Show it now. Waiting for the observer's first
    // callback costs a frame of blank content for everything above the fold.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 240 && rect.bottom > -240) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Fire before the element reaches the viewport, not after. Revealing on
      // entry means a fast scroll lands on content that is still at opacity 0,
      // which is exactly the "page looks empty" problem the animation was
      // supposed to be decorating around.
      { threshold: 0, rootMargin: '240px 0px 240px' }
    );
    observer.observe(el);

    // Failsafe. Observers can be throttled or never delivered (background
    // tabs, some privacy browsers), and the failure mode here is content that
    // stays invisible permanently. A decoration is never worth that, so give
    // up on the animation and just show the content.
    const failsafe = window.setTimeout(() => {
      setShown(true);
      observer.disconnect();
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag ref={ref as never} className={`dx-reveal${shown ? ' is-in' : ''} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

function Slug({ no, label }: { no: string; label: string }) {
  return (
    <div className="dx-slug">
      <span className="dx-meta dx-slug__no">{no}</span>
      <span className="dx-slug__rule" />
      <span className="dx-meta">{label}</span>
    </div>
  );
}

/* ─── Work row ───────────────────────────────────────────────────
   Projects are full-width rows rather than cards in a grid. A grid forces
   the media down to thumbnail size, which is the worst possible size for
   demonstrating that a game feels good to play. */
function WorkRow({ game, index, flip }: { game: GameData; index: number; flip: boolean }) {
  const clip = game.video?.find((v) => /\.(mp4|webm)$/i.test(v));
  const flag =
    game.category === 'client'
      ? 'Client work'
      : game.featured
        ? 'Start here'
        : game.status === 'live'
          ? 'Playable'
          : undefined;

  return (
    <Reveal as="article" className={`dx-row${flip ? ' dx-row--flip' : ''}`}>
      <div className="dx-row__media">
        <Link to={`/games/${game.id}`} aria-label={`${game.title} — read how it was built`}>
          <ProjectMedia
            poster={game.cover}
            video={clip}
            alt={`${game.title} gameplay`}
            flag={flag}
            flagQuiet={game.category !== 'client' && !game.featured}
          />
        </Link>
      </div>

      <div className="dx-row__text">
        <span className="dx-row__no">
          {String(index).padStart(2, '0')} / {game.year}
        </span>

        <Link to={`/games/${game.id}`}>
          <h3 className="dx-display dx-h3 dx-row__title">{game.title}</h3>
        </Link>

        <p className="dx-row__role">{game.role}</p>
        <p className="dx-row__hook">{game.hook ?? game.tagline}</p>

        <ul className="dx-row__tags">
          {game.genre.slice(0, 4).map((tag) => (
            <li key={tag} className="dx-tag">
              {tag}
            </li>
          ))}
          <li className="dx-tag dx-tag--engine">{game.engine}</li>
        </ul>

        <div className="dx-row__actions">
          <Link to={`/games/${game.id}`} className="dx-link">
            How it was built <ArrowRight size={13} />
          </Link>
          {game.playable && game.itchUrl && (
            <a className="dx-link" href={game.itchUrl} target="_blank" rel="noopener noreferrer">
              Play it <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reads the router's location, not window.location. The dependency array here
  // used to be [window.location.pathname, window.location.hash], which is
  // evaluated during render — it crashed the prerender, and it never re-fired on
  // navigation either, since window.location is not state React can compare.
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  const featured = games.find((g) => g.featured) ?? games[0];
  const featuredClip = featured.video?.find((v) => /\.(mp4|webm)$/i.test(v));

  // Work stays grouped by how it came about, because "who paid for this and
  // what was my role" is the first thing a prospective client wants sorted.
  // Client work leads the order: it is the strongest evidence available, since
  // somebody else already paid for it and got what they asked for.
  const clientWork = games.filter((g) => g.category === 'client');
  const soloWork = games.filter((g) => g.category === 'solo');
  const jamWork = games.filter((g) => g.category === 'jam');
  const labWork = games.filter((g) => g.category === 'experiment');

  const groups = [
    {
      key: 'client',
      label: 'Client',
      sub: 'Built to someone else’s spec, on someone else’s deadline.',
      items: clientWork,
    },
    {
      key: 'solo',
      label: 'Solo',
      sub: 'Mine start to finish. Design, code, ship, and whatever breaks after.',
      items: soloWork,
    },
    {
      key: 'jam',
      label: 'Jam & team',
      sub: 'Godot work under jam pressure, with other people counting on it.',
      items: jamWork,
    },
    {
      key: 'lab',
      label: 'Experiments',
      sub: 'Built to answer a question rather than to ship anything.',
      items: labWork,
    },
  ].filter((group) => group.items.length > 0);

  const liveCount = games.filter((g) => g.status === 'live').length;
  const plays = games.reduce((sum, g) => sum + (g.stats?.plays ?? 0), 0);

  return (
    <>
      <header className={`dx-header${scrolled ? ' dx-header--scrolled' : ''}`}>
        <div className="dx-shell dx-header__inner">
          <Link to="/" className="dx-logo">
            <b>mazicore</b>
            <span>.</span>
            <i> godot systems</i>
          </Link>

          <nav className="dx-nav">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href="#contact" className="dx-nav__cta">
              Start a project
            </a>
          </nav>

          <button
            className="dx-burger"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
          >
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {navOpen && (
          <nav className="dx-mobilenav">
            {[...NAV, { href: '#contact', label: 'Start a project' }].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        {/* ═══ Hero ═══ */}
        <section className="dx-hero">
          <div className="dx-shell dx-hero__grid">
            <div>
              <span className="dx-status">
                <span className="dx-status__dot" />
                Available for contract work
              </span>

              <h1 className="dx-display dx-h1 dx-hero__title">
                I build the systems
                <br />
                your game <em className="dx-italic">runs on</em>.
              </h1>

              <p className="dx-lede dx-hero__lede">
                Freelance Godot programmer. Combat, inventory, economy, UI, netcode. Scoped in
                writing, delivered playable, and documented well enough that you don't
                need me afterwards.
              </p>

              <div className="dx-hero__actions">
                <a href="#contact" className="dx-btn">
                  Start a project <ArrowRight size={14} />
                </a>
                <a href="#work" className="dx-btn dx-btn--ghost">
                  See the work
                </a>
              </div>

              <div className="dx-proof">
                <div className="dx-proof__item">
                  <span className="dx-proof__n">{clientWork.length}</span>
                  <span className="dx-proof__l">Client projects</span>
                </div>
                <div className="dx-proof__item">
                  <span className="dx-proof__n">{liveCount}</span>
                  <span className="dx-proof__l">Titles shipped</span>
                </div>
                <div className="dx-proof__item">
                  <span className="dx-proof__n">{plays}</span>
                  <span className="dx-proof__l">Plays on itch</span>
                </div>
                <div className="dx-proof__item">
                  <span className="dx-proof__n">Godot&nbsp;4</span>
                  <span className="dx-proof__l">Primary engine</span>
                </div>
              </div>
            </div>

            <a
              href={featured.itchUrl ?? ITCH}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Play ${featured.title} on itch.io`}
            >
              <ProjectMedia
                poster={featured.cover}
                video={featuredClip}
                alt={`${featured.title} gameplay`}
                caption={`${featured.title} — ${featured.tagline}`}
                flag="Play it"
                tall
              />
            </a>
          </div>
        </section>

        {/* ═══ Showreel banner ═══ */}
        <Showreel />

        {/* ═══ Work ═══ */}
        <section id="work" className="dx-band">
          <div className="dx-shell">
            <Slug no="01" label="Selected work" />
            <div className="dx-head">
              <h2 className="dx-display dx-h2">
                Every project here is <em className="dx-italic">playable</em> or readable.
              </h2>
              <p className="dx-lede">
                Client work first. Every one of these opens into a proper write-up of how
                it was built, not just a row of screenshots.
              </p>
            </div>

            {groups.map((group) => {
              let n = 0;
              return (
                <div key={group.key} className="dx-group">
                  <Reveal>
                    <div className="dx-group__head">
                      <span className="dx-group__title">{group.label}</span>
                      <span className="dx-group__rule" />
                      <span className="dx-group__count">
                        {group.items.length} project{group.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="dx-group__sub">{group.sub}</p>
                  </Reveal>

                  <div className="dx-worklist">
                    {group.items.map((game) => {
                      const i = n++;
                      return (
                        <WorkRow key={game.id} game={game} index={i + 1} flip={i % 2 === 1} />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ Capabilities ═══ */}
        <section id="build" className="dx-band dx-band--sunk">
          <div className="dx-shell">
            <Slug no="02" label="What I build" />
            <div className="dx-head">
              <h2 className="dx-display dx-h2">
                Systems, not <em className="dx-italic">screenshots</em>.
              </h2>
              <p className="dx-lede">
                Everything here has shipped in something real. The project it came from
                is listed underneath.
              </p>
            </div>

            {/* One reveal around the whole grid, not one per cell. The 1px
                gaps are the container's background showing through, so fading
                cells in individually left a bare slab of rule colour sitting
                where the cards were about to appear. */}
            <Reveal>
              <div className="dx-caps">
                {capabilities.map((cap, i) => (
                  <div key={cap.id} className="dx-cap">
                    <span className="dx-cap__no">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="dx-cap__t">{cap.title}</h3>
                    <p className="dx-cap__d">{cap.desc}</p>
                    <p className="dx-cap__proof">
                      {cap.proof} — <b>{cap.proofProject}</b>
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ Process ═══ */}
        <section id="process" className="dx-band dx-band--well">
          <div className="dx-shell">
            <Slug no="03" label="How it works" />
            <div className="dx-head">
              <h2 className="dx-display dx-h2">
                No month-long <em className="dx-italic">silences</em>.
              </h2>
              <p className="dx-lede">
                Hiring a contractor usually means worrying about three things: scope creep,
                someone going quiet, and being left with code nobody can maintain. Here's
                what I do about each.
              </p>
            </div>

            <Reveal>
              <div className="dx-steps">
                {processSteps.map((step, i) => (
                  <div key={step.id} className="dx-step dx-step--done">
                    <span className="dx-step__n">Step {String(i + 1).padStart(2, '0')}</span>
                    <h3 className="dx-step__t">{step.title}</h3>
                    <p className="dx-step__d">{step.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ Vouch ═══
            Placed directly after Process on purpose. Process claims I am quick
            to respond and easy to work with; this is a client saying it, which
            is worth more than the claim. */}
        {testimonials.length > 0 && (
          <section className="dx-band">
            <div className="dx-shell">
              <Slug no="04" label="What it's like to work with me" />
              {testimonials.map((t) => (
                <Reveal key={t.author}>
                  <figure className="dx-vouch" style={{ margin: 0 }}>
                    <span className="dx-vouch__mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    <div>
                      <blockquote className="dx-vouch__quote" style={{ margin: 0 }}>
                        {t.quote}
                      </blockquote>
                      <figcaption className="dx-vouch__by">
                        <span className="dx-vouch__name">{t.author}</span>
                        <span className="dx-vouch__src">
                          {t.source}, {t.date}
                        </span>
                        {t.project && (
                          <Link to={`/games/${t.project}`} className="dx-link dx-vouch__link">
                            See the work <ArrowRight size={13} />
                          </Link>
                        )}
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ═══ About ═══ */}
        <section id="about" className="dx-band">
          <div className="dx-shell dx-about">
            <div>
              <Slug no="05" label="About" />
              <h2 className="dx-display dx-h2">
                Mazen — Godot programmer,
                <br />
                CS student.
              </h2>
              <p className="dx-lede" style={{ marginTop: 22 }}>
                I build 2D game systems in Godot: combat feel, economy loops, signal-driven
                UI, persistence, netcode. If a feature doesn't change how a run feels, it doesn't
                ship.
              </p>
              <p className="dx-body" style={{ marginTop: 18 }}>
                Most of what I do is the unglamorous half of a game: the part that still
                has to work a month after the deadline. I write a postmortem for every
                project, partly because the reasoning matters more than the result, and
                partly so you can see how I think before you hire me.
              </p>

              <ul className="dx-about__facts">
                {facts.map((fact) => (
                  <li key={fact.k}>
                    <span className="dx-about__k">{fact.k}</span>
                    <span>{fact.v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Reveal>
              <SystemsObject />
            </Reveal>
          </div>
        </section>

        {/* ═══ Contact ═══ */}
        <section id="contact" className="dx-band dx-band--well">
          <div className="dx-shell dx-contact">
            <div>
              <Slug no="06" label="Start a project" />
              <h2 className="dx-display dx-h2">
                Tell me what you need <em className="dx-italic">built</em>.
              </h2>
              <p className="dx-lede" style={{ marginTop: 20 }}>
                Email or Discord, whichever's easier. I answer every real message, and
                I'll tell you straight if it's not something I should be taking on.
              </p>

              <a href={`mailto:${EMAIL}`} className="dx-contact__mail" style={{ marginTop: 28 }}>
                {EMAIL}
              </a>

              <p className="dx-handle">
                <span className="dx-meta">Discord</span>
                <button
                  className="dx-handle__copy"
                  onClick={() => navigator.clipboard?.writeText(DISCORD)}
                  title="Copy Discord handle"
                >
                  {DISCORD}
                </button>
              </p>

              <div className="dx-socials">
                <a className="dx-social" href={`mailto:${EMAIL}`} aria-label="Email">
                  <Mail size={17} />
                </a>
                <a
                  className="dx-social"
                  href={ITCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="itch.io"
                >
                  <Play size={17} />
                </a>
                <a
                  className="dx-social"
                  href={X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  X
                </a>
                <button
                  className="dx-social"
                  onClick={() => navigator.clipboard?.writeText(DISCORD)}
                  aria-label={`Copy Discord handle ${DISCORD}`}
                  title={`Discord — ${DISCORD}`}
                >
                  <MessageCircle size={17} />
                </button>
              </div>
            </div>

            <div>
              <p className="dx-meta" style={{ marginBottom: 14 }}>
                Helpful to include
              </p>
              <ul className="dx-checklist">
                {briefChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="dx-shell dx-footer">
          <span className="dx-meta">Mazen — Mazicore · Godot systems programming</span>
          <span className="dx-meta">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
