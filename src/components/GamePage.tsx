import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageCircle, X } from 'lucide-react';
import { getGame, type GameData } from '../data/games';
import { testimonials } from '../data/practice';
import { ProjectMedia } from './ProjectMedia';

const EMAIL = 'mazicore78@gmail.com';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function statusLabel(status: GameData['status']) {
  if (status === 'live') return 'Live';
  if (status === 'wip') return 'In progress';
  return 'Prototype';
}

/* A numbered article section. The rail of numbers gives a long postmortem a
   spine, so a reader can tell how far in they are and skip to a part. */
function Section({
  no,
  title,
  id,
  children,
}: {
  no: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="dx-sec">
      <span className="dx-sec__no">{no}</span>
      <h2 className="dx-sec__t">{title}</h2>
      {children}
    </section>
  );
}

export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const game = slug ? getGame(slug) : undefined;
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  if (!game) {
    return (
      <div className="dx-shell dx-missing">
        <h1 className="dx-display dx-h2">Project not found.</h1>
        <p className="dx-lede" style={{ margin: '16px auto 28px' }}>
          That one doesn't exist. Or doesn't yet.
        </p>
        <Link to="/" className="dx-btn">
          <ArrowLeft size={14} /> Back to the work
        </Link>
      </div>
    );
  }

  let n = 0;
  const next = () => pad(++n);

  const clip = game.video?.find((v) => /\.(mp4|webm)$/i.test(v));
  const vouch = testimonials.find((t) => t.project === game.id);

  // One continuous two-column layout for every project. The original put the
  // hero in its own grid and started the article below the whole thing, so the
  // prose never lined up under the description and the space beside it sat
  // empty for the length of the write-up. Here the description and the article
  // share a column while the media and spec sheet ride alongside, which also
  // keeps the clip on screen while you read about it.
  const useSidebarLayout = true;

  const sideColumn = (
    <>
      {/* Wide, not 4:3. Gameplay and tool captures are landscape, and a squarer
          well crops the sides. */}
      <ProjectMedia poster={game.cover} video={clip} alt={`${game.title} gameplay`} />

      {/* Spec sheet. A client scans this before reading a word of prose, which
          is also why it is worth keeping on screen while they read. */}
      <div className="dx-spec">
        <div className="dx-spec__row">
          <span className="dx-spec__k">Role</span>
          <span className="dx-spec__v">{game.role}</span>
        </div>
        <div className="dx-spec__row">
          <span className="dx-spec__k">Engine</span>
          <span className="dx-spec__v">{game.engine}</span>
        </div>
        <div className="dx-spec__row">
          <span className="dx-spec__k">Year</span>
          <span className="dx-spec__v">{game.year}</span>
        </div>
        <div className="dx-spec__row">
          <span className="dx-spec__k">Status</span>
          <span className={`dx-spec__v dx-dot dx-dot--${game.status}`}>
            {statusLabel(game.status)}
          </span>
        </div>
        <div className="dx-spec__row">
          <span className="dx-spec__k">Genre</span>
          <span className="dx-spec__v">{game.genre.join(', ')}</span>
        </div>
        {game.stats && (
          <div className="dx-spec__row">
            <span className="dx-spec__k">On itch</span>
            <span className="dx-spec__v">
              {game.stats.plays} plays · {game.stats.views} views
            </span>
          </div>
        )}
      </div>
    </>
  );

  const heroText = (
    <>
      <span className="dx-meta dx-phero__kicker">
        {game.category === 'client'
          ? 'Client project'
          : game.playable
            ? 'Playable on itch.io'
            : statusLabel(game.status)}
      </span>

      <h1
        className="dx-display dx-h1 dx-phero__title"
        style={{ fontSize: 'clamp(2.4rem, 5vw, 3.9rem)' }}
      >
        {game.title}
      </h1>

      <p className="dx-phero__hook">{game.hook ?? game.tagline}</p>
      <p className="dx-body dx-phero__desc">{game.desc}</p>

      <div className="dx-phero__actions">
        {game.itchUrl && (
          <a href={game.itchUrl} target="_blank" rel="noopener noreferrer" className="dx-btn">
            Play it <ArrowUpRight size={14} />
          </a>
        )}
        {game.xPost && (
          <a
            href={game.xPost}
            target="_blank"
            rel="noopener noreferrer"
            className="dx-btn dx-btn--ghost"
          >
            <MessageCircle size={14} /> Dev post
          </a>
        )}
      </div>
    </>
  );
  const localVideos = game.video?.filter((v) => v.startsWith('/') || /\.(mp4|webm)$/i.test(v)) ?? [];
  const embeds = game.video?.filter((v) => !(v.startsWith('/') || /\.(mp4|webm)$/i.test(v))) ?? [];

  return (
    <>
      <header className="dx-header dx-header--scrolled">
        <div className="dx-shell dx-header__inner">
          <Link to="/" className="dx-logo">
            <b>mazicore</b>
            <span>.</span>
            <i> godot systems</i>
          </Link>
          <nav className="dx-nav">
            <Link to="/#work">Work</Link>
            <Link to="/#build">What I build</Link>
            <Link to="/#contact" className="dx-nav__cta">
              Start a project
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="dx-shell">
          <Link to="/#work" className="dx-back">
            <ArrowLeft size={13} /> All work
          </Link>
        </div>

        {/* Three grid children, not a nested main column. DOM order is
            hero -> sidebar -> article, which is exactly the order a phone
            should read them in; on desktop the grid lifts the sidebar into
            column two and spans it across both rows. */}
        <div className={`dx-shell${useSidebarLayout ? ' dx-plate' : ''}`}>
          <section className={`dx-phero${useSidebarLayout ? ' dx-plate__head' : ''}`}>
            {useSidebarLayout ? (
              heroText
            ) : (
              <div className="dx-phero__grid">
                <div>{heroText}</div>
                <div className="dx-phero__side">{sideColumn}</div>
              </div>
            )}
          </section>

          {useSidebarLayout && <aside className="dx-plate__side">{sideColumn}</aside>}

          <article className={`dx-article${useSidebarLayout ? ' dx-plate__body' : ''}`}>
            {(localVideos.length > 0 || embeds.length > 0 || game.gallery?.length > 0) && (
              <Section no={next()} title="See it running" id="media">
                <div className="dx-figs">
                  {localVideos.map((src, i) => (
                    <figure key={src} className="dx-fig" style={{ margin: 0 }}>
                      <video src={src} controls playsInline preload="metadata" poster={game.cover} />
                      {game.videoNotes?.[i] && <figcaption>{game.videoNotes[i]}</figcaption>}
                    </figure>
                  ))}
                  {embeds.map((src) => (
                    <figure key={src} className="dx-fig" style={{ margin: 0 }}>
                      <iframe
                        src={src}
                        title={`${game.title} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </figure>
                  ))}
                </div>

                {game.gallery?.length > 0 && (
                  <div className="dx-shots">
                    {game.gallery.map((img) => (
                      <div
                        key={img}
                        className="dx-shot"
                        style={{ backgroundImage: `url(${img})` }}
                        onClick={() => setLightbox(img)}
                        role="button"
                        tabIndex={0}
                        aria-label="Open screenshot"
                        onKeyDown={(e) => e.key === 'Enter' && setLightbox(img)}
                      />
                    ))}
                  </div>
                )}
              </Section>
            )}

            {game.summary && game.summary.length > 0 && (
              <Section no={next()} title="The short version" id="summary">
                <ul className="dx-list">
                  {game.summary.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Section>
            )}

            {game.features.length > 0 && (
              <Section no={next()} title="What it does" id="features">
                <ul className="dx-list">
                  {game.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Section>
            )}

            {game.client && (
              <Section no={next()} title="Built for a client" id="client">
                <p>{game.client.myRole}</p>
                <div className="dx-chips">
                  <span className="dx-chip">Client brief</span>
                  <span className="dx-chip dx-chip--me">Mazen — implementation</span>
                </div>
              </Section>
            )}

            {game.postmortem.thought && (
              <Section no={next()} title="The thought" id="thought">
                <p>{game.postmortem.thought}</p>
              </Section>
            )}

            {/* A project can be deliberately thin on detail — an unannounced one
                should not render three empty numbered sections. */}
            {game.postmortem.mechanics && (
              <Section no={next()} title="Mechanics" id="mechanics">
                <p>{game.postmortem.mechanics}</p>
              </Section>
            )}

            {game.postmortem.systems && (
              <Section no={next()} title="Systems" id="systems">
                <p>{game.postmortem.systems}</p>
              </Section>
            )}

            {(game.postmortem.underTheHood ?? game.postmortem.architecture) && (
              <Section no={next()} title="Under the hood" id="architecture">
                <p>{game.postmortem.underTheHood ?? game.postmortem.architecture}</p>
              </Section>
            )}

            {game.controls && game.controls.length > 0 && (
              <Section no={next()} title="Controls" id="controls">
                <div className="dx-kv">
                  {game.controls.map((c) => (
                    <div key={c.action} className="dx-kv__row">
                      <span>{c.action}</span>
                      <span className="dx-kv__in">{c.input}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {game.timeline && game.timeline.length > 0 && (
              <Section no={next()} title="How it came together" id="timeline">
                <div className="dx-time">
                  {game.timeline.map((entry) => (
                    <div key={entry.title} className="dx-time__item">
                      <span className="dx-time__d">{entry.date}</span>
                      <h3 className="dx-time__t">{entry.title}</h3>
                      <p>{entry.body}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {game.team && (
              <Section no={next()} title="My role on the team" id="role">
                <p>{game.team.myRole}</p>
                <div className="dx-chips">
                  {game.team.members.map((m) => (
                    <span key={m} className={`dx-chip${m.includes('Mazen') ? ' dx-chip--me' : ''}`}>
                      {m}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {game.postmortem.lessons && (
              <Section no={next()} title="What I would do differently" id="lessons">
                <p>{game.postmortem.lessons}</p>
              </Section>
            )}

            {/* If a client vouched for this specific piece of work, it belongs
                on this page more than anywhere else on the site. */}
            {vouch && (
              <Section no={next()} title="What the client said" id="vouch">
                <figure className="dx-vouch" style={{ margin: 0 }}>
                  <span className="dx-vouch__mark" aria-hidden="true">
                    &ldquo;
                  </span>
                  <div>
                    <blockquote className="dx-vouch__quote" style={{ margin: 0 }}>
                      {vouch.quote}
                    </blockquote>
                    <figcaption className="dx-vouch__by">
                      <span className="dx-vouch__name">{vouch.author}</span>
                      <span className="dx-vouch__src">
                        {vouch.source}, {vouch.date}
                      </span>
                    </figcaption>
                  </div>
                </figure>
              </Section>
            )}
          </article>
        </div>

        {/* ═══ Closing ═══
            A reader who just finished a postmortem is at peak intent. The old
            page ended on "play it", which turns a prospective client into a
            player and then loses them. Ask for the enquiry here. */}
        <div className="dx-shell" style={{ paddingBottom: 'var(--band)' }}>
          <div className="dx-endcta">
            <h2 className="dx-endcta__t">Need something like this built?</h2>
            <p style={{ margin: 0, color: 'var(--ink-2)', maxWidth: '52ch' }}>
              Tell me what the system has to do and where it sits. I'll tell you what that
              takes, or say straight away if it isn't a fit.
            </p>
            <div className="dx-endcta__actions">
              <a href={`mailto:${EMAIL}`} className="dx-btn dx-btn--onwell">
                Start a project <ArrowRight size={14} />
              </a>
              {game.itchUrl && (
                <a
                  href={game.itchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dx-btn"
                  style={{ background: 'transparent', borderColor: 'var(--rule-well)', color: 'var(--ink)' }}
                >
                  Play {game.title} <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="dx-shell dx-footer">
          <span className="dx-meta">Mazen — Mazicore · Godot systems programming</span>
          <Link to="/#work" className="dx-meta">
            All work →
          </Link>
        </div>
      </footer>

      {lightbox && (
        <div className="dx-lightbox" onClick={() => setLightbox(null)}>
          <button className="dx-lightbox__x" aria-label="Close" onClick={() => setLightbox(null)}>
            <X size={18} />
          </button>
          <img src={lightbox} alt="Screenshot" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
