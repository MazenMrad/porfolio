import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, Menu, MessageCircle, Play, X } from 'lucide-react';
import { games, type GameData } from './data/games';
import {
  briefChecklist,
  capabilities,
  processSteps,
  testimonials,
  unityCapabilities,
} from './data/practice';
import { ProjectMedia } from './components/ProjectMedia';
import { ThemeToggle } from './components/ThemeToggle';

const EMAIL = 'mazicore78@gmail.com';
const ITCH = 'https://mazicore.itch.io/';
const X_URL = 'https://x.com/CoreMazi27888';
const DISCORD = 'mazen24';

const HEADLINE_IDS = ['last-case', 'obsidio', 'the-fine-lock'];

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#clients', label: 'Clients' },
  { href: '#build', label: 'What I build' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
];

/* ─── Focus ──────────────────────────────────────────────────────
   One page, three framings. A Unity client and a Godot client are looking for
   different things, so /unity and /godot lead with their engine's work and
   copy, and / presents both. Everything below the hero reads from this. */
export type Focus = 'all' | 'unity' | 'godot';

const FOCUS: Record<
  Focus,
  {
    lead: string;
    title: React.ReactNode;
    lede: string;
    engineStat: [string, string];
    stats?: [string, string][];
    featuredId: string;
    match?: string;
  }
> = {
  all: {
    lead: 'Available for contract work',
    title: (
      <>
        I build the systems
        <br />
        your game <em className="dx-italic">runs on</em>.
      </>
    ),
    lede: "Freelance gameplay programmer in Unity and Godot. Combat, inventory, puzzle rules, economy, UI, netcode, native extensions. Scoped in writing, delivered playable, and documented well enough that you don't need me afterwards.",
    engineStat: ['Unity + Godot', 'Engines'],
    featuredId: 'last-case',
  },
  unity: {
    lead: 'Taking Unity contracts',
    title: (
      <>
        Gameplay systems
        <br />
        for your <em className="dx-italic">Unity</em> game.
      </>
    ),
    lede: 'Freelance Unity and C# programmer. Rules-first gameplay code, ScriptableObject data pipelines, level tooling and tested logic that runs outside the editor. Scoped in writing, delivered playable.',
    engineStat: ['Unity 6', 'C# / .NET'],
    stats: [
      ['20', 'Levels, solver-checked'],
      ['3', 'Platforms built'],
    ],
    featuredId: 'last-case',
    match: 'Unity',
  },
  godot: {
    lead: 'Taking Godot contracts',
    title: (
      <>
        I build the systems
        <br />
        your <em className="dx-italic">Godot</em> game runs on.
      </>
    ),
    lede: "Freelance Godot programmer. Combat, inventory, economy, UI, netcode, native extensions. Scoped in writing, delivered playable, and documented well enough that you don't need me afterwards.",
    engineStat: ['Godot 4', 'Primary engine'],
    featuredId: 'obsidio',
    match: 'Godot',
  },
};


const FOCUS_LINKS: { to: string; label: string; focus: Focus }[] = [
  { to: '/', label: 'All', focus: 'all' },
  { to: '/unity', label: 'Unity', focus: 'unity' },
  { to: '/godot', label: 'Godot', focus: 'godot' },
];

function EngineSwitch({ focus, onNavigate }: { focus: Focus; onNavigate?: () => void }) {
  return (
    <div className="dx-switch" role="group" aria-label="Show work by engine">
      {FOCUS_LINKS.map((l) => (
        <Link
          key={l.focus}
          to={l.to}
          onClick={onNavigate}
          className={l.focus === focus ? 'is-on' : undefined}
          aria-current={l.focus === focus ? 'page' : undefined}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

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

/* ─── Work row ───────────────────────────────────────────────────
   Projects are full-width rows rather than cards in a grid. A grid forces
   the media down to thumbnail size, which is the worst possible size for
   demonstrating that a game feels good to play. */
function WorkRow({
  game,
  index,
  flip,
  lead,
}: {
  game: GameData;
  index: number;
  flip: boolean;
  lead: boolean;
}) {
  const clip = game.video?.find((v) => /\.(mp4|webm)$/i.test(v));
  const flag =
    game.category === 'client'
      ? 'Client work'
      : lead
        ? 'Start here'
        : game.status === 'live'
          ? 'Playable'
          : undefined;

  return (
    <article
      className={`dx-row${flip ? ' dx-row--flip' : ''}${lead ? ' dx-row--lead' : ''}`}
      style={game.accent ? ({ '--game': game.accent } as React.CSSProperties) : undefined}
    >
      <div className="dx-row__media">
        <Link to={`/games/${game.id}`} aria-label={`${game.title} — read how it was built`}>
          <ProjectMedia
            poster={game.cover}
            video={clip}
            alt={`${game.title} gameplay`}
            flag={flag}
            flagQuiet={game.category !== 'client' && !lead}
            fit={game.mediaFit}
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
            How it was built
          </Link>
          {game.playable && game.itchUrl && (
            <a className="dx-link" href={game.itchUrl} target="_blank" rel="noopener noreferrer">
              Play it <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* Compact card for the other engine's work on a focused page. It proves the
   same habits carry over without burying the page's own engine under rows. */
function MiniCard({ game }: { game: GameData }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="dx-mini"
      style={game.accent ? ({ '--game': game.accent } as React.CSSProperties) : undefined}
    >
      <ProjectMedia poster={game.cover} alt={`${game.title} gameplay`} fit={game.mediaFit} />
      <span className="dx-mini__meta">{game.year} · {game.engine}</span>
      <span className="dx-mini__title">{game.title}</span>
      <span className="dx-mini__hook">{game.hook ?? game.tagline}</span>
    </Link>
  );
}

export default function App({ focus = 'all' }: { focus?: Focus }) {
  const cfg = FOCUS[focus];
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
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  const featured = games.find((g) => g.id === cfg.featuredId) ?? games[0];
  const featuredClip = featured.video?.find((v) => /\.(mp4|webm)$/i.test(v));

  // Work stays grouped by how it came about, because "who paid for this and
  // what was my role" is the first thing a prospective client wants sorted.
  // Client work leads the order: it is the strongest evidence available, since
  // somebody else already paid for it and got what they asked for.
  const clientWork = games.filter((g) => g.category === 'client');
  const soloWork = games.filter((g) => g.category === 'solo');
  const jamWork = games.filter((g) => g.category === 'jam');
  const labWork = games.filter((g) => g.category === 'experiment');

  const allGroups = [
    {
      key: 'client',
      label: 'Client',
      sub: 'Built to someone else’s spec, on someone else’s deadline.',
      items: clientWork,
    },
    {
      key: 'solo',
      label: 'Solo releases',
      sub: 'Mine start to finish. Design, code, ship, and whatever breaks after.',
      items: soloWork.filter((g) => HEADLINE_IDS.includes(g.id)),
    },
    {
      key: 'more',
      label: 'More work',
      sub: 'Other solo releases, jam games and experiments. Each one has a write-up.',
      items: [...soloWork.filter((g) => !HEADLINE_IDS.includes(g.id)), ...jamWork, ...labWork],
    },
  ].filter((group) => group.items.length > 0);

  // Only the strongest proof gets a full row: client work plus the two
  // flagship releases. Everything else is a small card, so the page stays short.
  const isHeadline = (g: GameData) => g.category === 'client' || HEADLINE_IDS.includes(g.id);

  // On /unity and /godot the page's own engine leads in full, and everything
  // else drops to a compact "also built in" strip.
  const own = cfg.match ? games.filter((g) => g.engine.includes(cfg.match!)) : [];
  const other = cfg.match ? games.filter((g) => !g.engine.includes(cfg.match!)) : [];
  const groups = cfg.match
    ? [
        {
          key: 'own',
          label: `${cfg.match} work`,
          sub:
            focus === 'unity'
              ? 'Shipped in Unity. The Godot client work further down shows how I deliver for someone else.'
              : 'Client work, solo releases and jams, all in Godot.',
          items: [...own].sort(
            (a, b) =>
              Number(b.id === featured.id) - Number(a.id === featured.id) ||
              Number(b.category === 'client') - Number(a.category === 'client')
          ),
        },
      ]
    : allGroups;
  const caps = focus === 'unity' ? unityCapabilities : capabilities;

  const liveCount = games.filter((g) => g.status === 'live').length;

  return (
    <>
      <a className="dx-skip" href="#work">
        Skip to work
      </a>
      <header className={`dx-header${scrolled ? ' dx-header--scrolled' : ''}`}>
        <div className="dx-shell dx-header__inner">
          <Link to="/" className="dx-logo">
            <b>mazicore</b>
            <span>.</span>
            <i> game systems</i>
          </Link>

          <EngineSwitch focus={focus} />

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

          {/* Below the nav breakpoint the action stays one tap away in the header. */}
          <a href="#contact" className="dx-headcta">
            Start a project
          </a>

          <ThemeToggle />

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
            <EngineSwitch focus={focus} onNavigate={() => setNavOpen(false)} />
            {[...NAV, { href: '#contact', label: 'Start a project' }].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setNavOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        {/* ═══ Cover ═══ */}
        <section className="dx-hero">
          <div className="dx-shell dx-hero__grid">
            <div className="dx-hero__body">
              <h1 className="dx-display dx-h1 dx-hero__title">{cfg.title}</h1>
              <p className="dx-lede dx-hero__lede">{cfg.lede}</p>

              <div className="dx-hero__actions">
                <a href="#contact" className="dx-btn">
                  Start a project <ArrowRight size={16} strokeWidth={3} />
                </a>
                <a href="#work" className="dx-link">
                  See the work
                </a>
              </div>

              <p className="dx-record">
                <b>{cfg.lead}.</b>{' '}
                {(cfg.stats ?? [
                  [String(clientWork.length), 'Client projects'],
                  [String(liveCount), 'Titles shipped'],
                ])
                  .map(([n, l]) => `${n} ${l.toLowerCase()}`)
                  .join(', ')}
                , {cfg.engineStat[0]}.
              </p>
            </div>

            {/* The latest job, filed as a ticket: the proof sits beside the pitch. */}
            <article className="dx-ticket" aria-label={`Latest job: ${featured.title}`}>
              <div className="dx-ticket__head">
                <span>Latest job</span>
                <span>{featured.year}</span>
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
                  flag="Play it"
                  priority
                />
              </a>
              <dl className="dx-fields">
                <div className="dx-field">
                  <dt>Job</dt>
                  <dd>
                    <b>{featured.title}</b>, {featured.tagline}
                  </dd>
                </div>
                <div className="dx-field">
                  <dt>Engine</dt>
                  <dd>{featured.engine}</dd>
                </div>
                <div className="dx-field">
                  <dt>Role</dt>
                  <dd>{featured.role}</dd>
                </div>
                <div className="dx-field">
                  <dt>Status</dt>
                  <dd>
                    <span className={`dx-dot dx-dot--${featured.status === 'live' ? 'live' : 'wip'}`}>
                      {featured.status === 'live' ? 'Playable' : 'In progress'}
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="dx-ticket__foot">
                <Link to={`/games/${featured.id}`} className="dx-link">
                  How it was built
                </Link>
                {featured.playable && featured.itchUrl && (
                  <a className="dx-link" href={featured.itchUrl} target="_blank" rel="noopener noreferrer">
                    Play it <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* ═══ Vouch ═══
            Right under the hero: a client saying it beats anything I say about
            myself, so it sits where most visitors still are. */}
        {testimonials.length > 0 && (
          <section className="dx-band">
            <div className="dx-shell">
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

        {/* ═══ Work ═══ */}
        <section id="work" className="dx-band">
          <div className="dx-shell">
            <div className="dx-head">
              <h2 className="dx-display dx-h2">
                {focus === 'all'
                  ? 'Every project here is playable or readable.'
                  : `${cfg.match} work, with the receipts.`}
              </h2>
              <p className="dx-lede">
                {focus === 'all'
                  ? 'Client work first. Every one of these opens into a proper write-up of how it was built, not just a row of screenshots.'
                  : 'Every one of these opens into a write-up of how it was built: what worked, what broke, and what I would change.'}
              </p>
            </div>

            {groups.map((group) => {
              let n = 0;
              return (
                <div key={group.key} id={group.key === 'client' ? 'clients' : undefined} className="dx-group">
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

                  {group.items.some(isHeadline) && (
                    <div className="dx-worklist">
                      {group.items.filter(isHeadline).map((game) => {
                        const i = n++;
                        return (
                          <WorkRow
                            key={game.id}
                            game={game}
                            index={i + 1}
                            flip={i % 2 === 1}
                            lead={game.id === featured.id}
                          />
                        );
                      })}
                    </div>
                  )}
                  {group.items.some((g) => !isHeadline(g)) && (
                    <div className="dx-minis">
                      {group.items
                        .filter((g) => !isHeadline(g))
                        .map((game) => (
                          <MiniCard key={game.id} game={game} />
                        ))}
                    </div>
                  )}
                </div>
              );
            })}

            {cfg.match && other.length > 0 && (
              <div className="dx-group">
                <Reveal>
                  <div className="dx-group__head">
                    <span className="dx-group__title">
                      Also built in {cfg.match === 'Unity' ? 'Godot' : 'Unity'}
                    </span>
                    <span className="dx-group__rule" />
                    <span className="dx-group__count">{other.length} projects</span>
                  </div>
                  <p className="dx-group__sub">
                    Same habits, other engine: rules kept away from presentation, written up
                    afterwards.{' '}
                    <Link to={cfg.match === 'Unity' ? '/godot' : '/unity'} className="dx-link">
                      See the {cfg.match === 'Unity' ? 'Godot' : 'Unity'} page
                    </Link>
                  </p>
                </Reveal>
                {/* Client work is delivery proof on either engine page, so it keeps full rows. */}
                <div className="dx-worklist">
                  {other
                    .filter((g) => g.category === 'client')
                    .map((game, i) => (
                      <WorkRow key={game.id} game={game} index={i + 1} flip={i % 2 === 1} lead={false} />
                    ))}
                </div>
                <div className="dx-minis">
                  {other
                    .filter((g) => g.category !== 'client')
                    .map((game) => (
                      <MiniCard key={game.id} game={game} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ Capabilities ═══ */}
        <section id="build" className="dx-band dx-band--sunk">
          <div className="dx-shell">
            <div className="dx-head">
              <h2 className="dx-display dx-h2">Systems, not screenshots.</h2>
            </div>

            {/* A line-item list, not a card grid: what I build, and where it shipped. */}
            <Reveal>
              <ul className="dx-items">
                {caps.map((cap) => {
                  const source = games.find((g) => g.title === cap.proofProject);
                  return (
                    <li key={cap.id} className="dx-item">
                      <h3 className="dx-item__t">{cap.title}</h3>
                      <p className="dx-item__proof">
                        {cap.proof} ·{' '}
                        {source ? (
                          <Link to={`/games/${source.id}`} className="dx-link">
                            {cap.proofProject}
                          </Link>
                        ) : (
                          <b>{cap.proofProject}</b>
                        )}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ═══ Process ═══ */}
        <section id="process" className="dx-band dx-band--well">
          <div className="dx-shell">
            <div className="dx-head">
              <h2 className="dx-display dx-h2">No month-long silences.</h2>
            </div>

            <Reveal>
              <ol className="dx-steps">
                {processSteps.map((step, i) => (
                  <li key={step.id} className="dx-step">
                    <span className="dx-step__n">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="dx-step__t">{step.title}</h3>
                    <p className="dx-step__d">{step.desc}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>


        {/* ═══ About ═══ */}
        <section id="about" className="dx-band">
          <div className="dx-shell dx-about">
            <div>
              <h2 className="dx-display dx-h2">The unglamorous half of a game.</h2>
              <p className="dx-lede dx-about__lede">
                I'm Mazen, a gameplay programmer studying CS. I build the part of a game that still
                has to work a month after the deadline, and I write a postmortem for every project
                so you can see how I think before you hire me.
              </p>
            </div>

            {/* The contractor card: the facts a client checks before writing. */}
            <article className="dx-ticket" aria-label="Contractor details">
              <div className="dx-ticket__head">
                <span>Contractor</span>
                <span>Mazicore</span>
              </div>
              <dl className="dx-fields">
                <div className="dx-field">
                  <dt>Name</dt>
                  <dd>Mazen</dd>
                </div>
                <div className="dx-field">
                  <dt>Engines</dt>
                  <dd>Unity 6 with C#. Godot 4 with GDScript and C++ GDExtension</dd>
                </div>
                <div className="dx-field">
                  <dt>Works with</dt>
                  <dd>Solo devs, small studios, jam teams</dd>
                </div>
                <div className="dx-field">
                  <dt>Takes on</dt>
                  <dd>Fixed-scope systems, plugins, playable prototypes</dd>
                </div>
                <div className="dx-field">
                  <dt>Based</dt>
                  <dd>Remote, across time zones</dd>
                </div>
                <div className="dx-field">
                  <dt>Status</dt>
                  <dd>
                    <span className="dx-dot dx-dot--live">{cfg.lead}</span>
                  </dd>
                </div>
              </dl>
              <div className="dx-ticket__foot">
                <a href="#contact" className="dx-link">
                  Start a project
                </a>
                <a className="dx-link" href={ITCH} target="_blank" rel="noopener noreferrer">
                  itch.io <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ═══ Contact ═══ */}
        <section id="contact" className="dx-band dx-band--sign">
          <div className="dx-shell dx-contact">
            <div>
              <h2 className="dx-display dx-h2">
                Tell me what you need built.
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
          <span className="dx-meta">Mazen — Mazicore · Unity and Godot game systems</span>
          <span className="dx-meta">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
