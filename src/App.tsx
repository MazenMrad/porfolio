import { useEffect, useRef, useState } from 'react';
import { AmberIcosahedron } from './components/AmberIcosahedron';
import { SkillSpheres } from './components/SkillSpheres';
import { LedOrb } from './components/LedOrb';
import { Mail, ExternalLink, ArrowRight, FileCode, CheckCircle, Briefcase, Menu, X } from 'lucide-react';

/* ─── Data Types ─── */
interface ProjectDetail {
  about: string;
  process?: string;
  deliverables?: string[];
  results: string;
  testimonial?: string;
}

interface ProjectData {
  id: string;
  name: string;
  desc: string;
  impact: string;
  status: 'live' | 'legacy';
  year: string;
  image?: string;
  gallery?: string[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  detail: ProjectDetail;
}

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Track scroll position for header
  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeLightbox = () => setLightboxImage(null);

  // Lock body scroll & handle Escape key when modal is open
  useEffect(() => {
    if (selectedProject) {
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
  }, [selectedProject]);

  // Handle Escape for lightbox
  useEffect(() => {
    if (lightboxImage) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [lightboxImage]);

  const projects: ProjectData[] = [
    {
      id: 'tiebreak',
      name: 'Tiebreak — Sports Booking Platform',
      desc: 'Multi-tenant booking platform for sports clubs with dashboards, player portals, QR check-ins, payments, and event analytics.',
      impact: 'Live production platform processing real bookings with QR check-in and payment flows',
      status: 'live',
      year: '2025',
      image: '/projects/tiebreak-dashboard.png',
      gallery: ['/projects/tiebreak-register.png'],
      stack: ['Next.js 14', 'TypeScript', 'Tailwind', 'Supabase', 'Payments', 'Analytics'],
      liveUrl: 'https://tie-break.vercel.app/',
      detail: {
        about: 'Tiebreak is a multi-tenant sports booking platform designed for sports clubs to manage courts, memberships, and events. The goal was to eliminate manual booking workflows and provide real-time availability, QR check-ins, and integrated payment processing.',
        process: 'Built with Next.js 14 and Supabase for real-time data sync. Designed a role-based system for admins, club staff, and players. Integrated Stripe payments, QR code generation for check-in validation, and an event analytics dashboard.',
        deliverables: [
          'Player portal with real-time court availability',
          'Admin dashboard for booking management',
          'QR check-in system for entry validation',
          'Payment processing with Stripe integration',
          'Event analytics and reporting'
        ],
        results: 'Live production platform processing real bookings with automated QR check-in and seamless payment flows for multiple sports clubs.',
        testimonial: undefined
      }
    },
    {
      id: 'spendflow',
      name: 'SpendFlow — Finance Automation',
      desc: 'Personal expense tracker with Gmail-to-expense pipeline via n8n automation, Gemini AI parsing, and Tesseract.js invoice OCR.',
      impact: 'GitHub starred · Full dashboard analytics · Email-to-expense pipeline automates invoice processing',
      status: 'live',
      year: '2025',
      image: '/projects/spendflow-dashboard.png',
      gallery: ['/projects/spendflow-calendar.png', '/projects/spendflow-payments.png'],
      stack: ['Next.js 16', 'Prisma', 'MongoDB', 'n8n Automation', 'Gemini AI', 'OCR'],
      githubUrl: 'https://github.com/MazenMrad/SpendFlow',
      detail: {
        about: 'SpendFlow is a personal expense tracking and budget management application. The goal was to automate expense entry from Gmail receipts using n8n workflows and Gemini AI, eliminating manual data entry.',
        process: 'Architected a Gmail → n8n → Gemini AI → API pipeline that automatically parses email receipts and creates expense entries. Built the frontend with Next.js 16 App Router and Prisma/MongoDB for data persistence. Added Tesseract.js OCR for offline invoice image uploads.',
        deliverables: [
          'Dashboard with spending charts and budget tracking (Recharts)',
          'Invoice OCR with auto-fill from uploaded images',
          'Calendar view for upcoming bills (FullCalendar)',
          'n8n automation workflow for Gmail-to-expense pipeline',
          'Gemini AI integration for receipt data extraction'
        ],
        results: 'Fully functional expense tracker with automated email-to-expense pipeline. Dashboard provides monthly/weekly spending trends, category breakdowns, and real-time budget tracking.',
        testimonial: undefined
      }
    },
    {
      id: 'eumenes',
      name: 'Eumenes — Discord Auto-Fulfillment Bot',
      desc: 'Discord bot for digital sales — receipt OCR in Arabic, French, and English with auto-delivery, trust scoring, and C2PA fraud detection across 23 slash commands.',
      impact: 'Auto-confirm at trust \u2265 70 · C2PA/AI fraud detection · 0 external AI APIs — fully offline OCR',
      status: 'live',
      year: '2025',
      image: '/projects/eumenes-artwork.png',
      stack: ['Discord.js', 'Tesseract OCR', 'SQLite', 'Cloudflare Workers', 'C2PA Detection', 'FIFO Vault'],
      githubUrl: 'https://github.com/MazenMrad/Eumenes',
      detail: {
        about: 'Eumenes is a Discord auto-fulfillment bot for digital product sales. Buyers upload payment receipts, the bot extracts transaction data via offline OCR, and auto-delivers product codes — all without any external AI APIs. The goal was to create a fully self-contained, trust-based digital storefront inside Discord.',
        process: 'Built with Python and Discord.py, using Tesseract OCR for tri-lingual receipt parsing (Arabic, French, English). Implemented a buyer trust scoring system with local/global/weighted modes. Added C2PA marker detection for AI-generated receipt fraud prevention. Deployed on Hugging Face Spaces with Cloudflare Worker reverse proxy to bypass HF outbound restrictions.',
        deliverables: [
          'Receipt OCR in Arabic, French, and English',
          'Auto-delivery system with configurable trust threshold (\u2265 70)',
          'C2PA/AI fraud detection on uploaded images',
          'FIFO product vault with restock and import/export',
          '23 slash commands for merchants, admins, and buyers',
          'HF Dataset auto-backup and Cloudflare keepalive'
        ],
        results: 'Fully offline OCR pipeline with zero external AI API dependencies. Trust scoring system with auto-confirm at \u2265 70. Duplicate prevention via transaction ref tracking. Rates: Fraud flag accuracy via C2PA scanning.',
        testimonial: undefined
      }
    },
    {
      id: 'huggingmes',
      name: 'HuggingMes (Hermes) — AI Agent Gateway',
      desc: 'Self-hosted Hermes AI agent gateway on Hugging Face Spaces — 20+ LLM providers, Telegram bot, Cloudflare proxy, real-time dashboard, and auto-backup to HF Dataset.',
      impact: '30 commits · 20+ LLM providers · Multi-turn agent with tool use, memory, and Telegram deployment',
      status: 'live',
      year: '2025',
      stack: ['Hermes Agent', 'Telegram Bot API', 'Hugging Face Spaces', 'Cloudflare Workers', 'Docker', '20+ LLM Providers'],
      githubUrl: 'https://github.com/MazenMrad',
      detail: {
        about: 'HuggingMes is a self-hosted Hermes AI agent gateway that runs on Hugging Face Spaces. The goal was to create a deploy-and-forget AI assistant with Telegram integration, multi-provider LLM support, and automatic persistence — all behind a single gateway token.',
        process: 'Wrapped Nous Research Hermes Agent in a Dockerized HF Space with a management dashboard and health server. Added Cloudflare Worker auto-provisioning for outbound proxy (Telegram API) and keepalive cron. Built a sync engine for persistent HF Dataset backup of chat history and config.',
        deliverables: [
          'Hermes Agent with multi-turn chat, tool use, and memory',
          '20+ LLM provider support (OpenRouter, OpenAI, Anthropic, Gemini, etc.)',
          'Telegram bot integration with webhook/polling modes',
          'Real-time dashboard with uptime and sync health monitoring',
          'Automatic Cloudflare proxy + keepalive worker provisioning',
          'HF Dataset backup every 600 seconds'
        ],
        results: '30 commits across initial build and refinements. Supports the widest range of LLM providers of any HF Space agent gateway. Automatic Cloudflare proxying solves HF outbound blocking for Telegram and API traffic.',
        testimonial: undefined
      }
    }
  ];

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'What I Do' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = () => setMobileNavOpen(false);
  const handleProjectClick = (proj: ProjectData) => setSelectedProject(proj);
  const handleCloseModal = () => setSelectedProject(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ═══ Header ═══ */}
      <header className={`site-header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="portfolio-container header-inner">
          <a href="#" className="header-logo">
            mazen<span className="logo-dot">.</span>mrad
          </a>
          <nav className="header-nav">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}>{link.label}</a>
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

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px 28px 20px',
            borderTop: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.95)',
          }}>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  padding: '8px 0',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* ═══ Hero Section ═══ */}
      <section id="hero" className="hero-section" style={{ borderTop: 'none' }}>
        <div className="portfolio-container hero-grid">
          <div>
            <FadeIn>
              <span className="section-label">&gt; backend // automation // devops</span>
            </FadeIn>
            <FadeIn delay={1}>
              <h1 style={{ marginBottom: '20px' }}>
                Building automation systems that scale — so you don't have to do it manually.
              </h1>
            </FadeIn>
            <FadeIn delay={2}>
              <p className="hero-tagline">
                Full-stack developer specializing in AI workflows, backend automation, and cloud-native applications.
              </p>
            </FadeIn>
            <FadeIn delay={3}>
              <div className="hero-actions">
                <a href="#projects" className="cta-button">
                  Explore Projects <ArrowRight size={14} />
                </a>
                <a href="#contact" className="btn-outline">
                  Get in touch
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Ambient 3D Decoration */}
          <FadeIn delay={2}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AmberIcosahedron />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ About Section ═══ */}
      <section id="about" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'start' }}>
          <FadeIn>
            <div>
              <span className="section-label">About</span>
              <h2>Systems & Orchestration</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.75' }}>
                Full-stack developer and game maker — from <strong>n8n + Gemini AI</strong> pipelines to pixel-art games on Unity and Godot. I treat code like infrastructure.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                Completing a B.Sc. in <strong>Computer Systems Development</strong> at ISET Nabeul, with experience across web, automation, game development, and IT operations.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                <strong>Languages:</strong> TypeScript, Python, Java, PHP, GDScript, HTML/CSS &middot; <strong>Tools:</strong> Godot, Angular, Git, Figma, n8n
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={2}>
            <div className="info-card">
              <div className="info-card-header">Experience & Education</div>

              <div className="info-item">
                <div className="info-item-icon amber"><Briefcase size={18} /></div>
                <div>
                  <strong>Orange Tech Club ISETN — Graphic Designer</strong>
                  <span>Jan 2025 – Present · 20+ event promos, workshops for 30+ members</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon amber"><FileCode size={18} /></div>
                <div>
                  <strong>Tekno Island — Intern</strong>
                  <span>Full-Stack Developer · Jan – Feb 2026</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon amber"><Briefcase size={18} /></div>
                <div>
                  <strong>Arab Tunisian Bank — IT Intern</strong>
                  <span>Hardware & software support · Jan – Feb 2025</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon amber"><FileCode size={18} /></div>
                <div>
                  <strong>Biome Games — Game Artist</strong>
                  <span>Pixel artist for Throne & Arrows & Sword of Lumina · Jun – Jul 2024</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon green"><CheckCircle size={18} /></div>
                <div>
                  <strong>B.Sc. Computer Systems Development</strong>
                  <span>ISET Nabeul · Expected June 2027</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ What I Do Section ═══ */}
      <section id="services" style={{ background: 'var(--bg-white)' }}>
        <div className="portfolio-container">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="section-label">Services</span>
              <h2>What I Do</h2>
              <p className="subtitle" style={{ margin: '0 auto' }}>
                Delivering high-reliability software architectures, secure database pipelines, and customized business automations.
              </p>
            </div>
          </FadeIn>

          <div className="services-grid">
            {[
              { title: 'Full-Stack Development', color: 'var(--amber)', desc: 'Type-safe web apps with Next.js, TypeScript, Tailwind, and Supabase — from prototype to production.' },
              { title: 'Workflow Automation', color: 'var(--green)', desc: 'Custom n8n workflows, Gemini AI integrations, Tesseract OCR, and autonomous bot systems.' },
              { title: 'Game Development', color: 'var(--amber)', desc: 'Pixel art and game design with Godot, Unity, and GDScript — from concept to playable builds.' },
              { title: 'Bot & Agent Development', color: 'var(--green)', desc: 'Autonomous Discord and Telegram bots with payments, trust scoring, and AI fraud detection.' },
            ].map((service, i) => (
              <FadeIn key={service.title} delay={i + 1 as 1 | 2 | 3 | 4}>
                <div className="service-card">
                  <h4>
                    <span className="service-card-indicator" style={{ backgroundColor: service.color }} />
                    {service.title}
                  </h4>
                  <p>{service.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Skills Section ═══ */}
      <section id="skills" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container" style={{ textAlign: 'center' }}>
          <FadeIn>
            <span className="section-label">Stack</span>
            <h2>Engineering Competencies</h2>
            <p className="subtitle" style={{ margin: '0 auto 40px auto' }}>
              Automated tools, container runtimes, declarative system provisioning, and backend stacks.
            </p>
          </FadeIn>

          <FadeIn delay={2}>
            <div style={{ margin: '40px 0' }}>
              <SkillSpheres />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Projects Section ═══ */}
      <section id="projects" style={{ background: 'var(--bg-white)' }}>
        <div className="portfolio-container">
          <FadeIn>
            <span className="section-label">Portfolio</span>
            <h2>Cool Projects I've Done</h2>
            <p className="subtitle" style={{ marginBottom: '40px' }}>
              A look at real-world systems I've built — from AI automation bots to multi-tenant booking platforms.
            </p>
          </FadeIn>

          <div className="projects-grid">
            {projects.map((proj, i) => (
              <FadeIn key={proj.id} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="project-card" onClick={() => handleProjectClick(proj)} style={{ cursor: 'pointer' }}>
                  <div className="project-card-content">
                    <div className="project-card-top-row">
                      <h3>{proj.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="project-year">{proj.year}</span>
                        <LedOrb status={proj.status} />
                      </div>
                    </div>

                    <p className="project-desc">{proj.desc}</p>

                    <div className="project-impact">
                      <span className="project-impact-icon">&#9654;</span>
                      {proj.impact}
                    </div>

                    <div className="tech-tags">
                      {proj.stack.map(tag => (
                        <span key={tag} className="tech-tag">{tag}</span>
                      ))}
                    </div>

                    <span className="project-click-hint">Click for full details &rarr;</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Secondary CTA */}
          <FadeIn>
            <div className="cta-bridge">
              <p className="cta-bridge-text">Like what you see? Let's build something together.</p>
              <a href="#contact" className="cta-button">
                Get in touch <ArrowRight size={14} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Contact Section ═══ */}
      <section id="contact" style={{ background: 'var(--bg)' }}>
        <div className="portfolio-container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <FadeIn>
            <span className="section-label">Contact</span>
            <h2>Let's Work Together</h2>
            <p className="subtitle" style={{ margin: '0 auto 36px auto' }}>
              Interested in scaling services, automating deployment pipelines, or backend operations? Let's talk.
            </p>
          </FadeIn>

          <FadeIn delay={1}>
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}
              onSubmit={(e) => {
                e.preventDefault();
                const nameInput = document.getElementById('contact-name') as HTMLInputElement;
                const emailInput = document.getElementById('contact-email') as HTMLInputElement;
                const msgInput = document.getElementById('contact-message') as HTMLTextAreaElement;
                const name = nameInput?.value || '';
                const email = emailInput?.value || '';
                const message = msgInput?.value || '';
                const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                navigator.clipboard.writeText(body).catch(() => {});
                window.open(`mailto:mazenmrad.123.ma@gmail.com?subject=Portfolio Contact&body=${encodeURIComponent(body)}`);
                setFormSubmitted(true);
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input type="text" placeholder="Name" className="form-input" required id="contact-name" />
                <input type="email" placeholder="Email" className="form-input" required id="contact-email" />
              </div>
              <textarea
                placeholder="Tell me about your project..."
                className="form-input"
                style={{ minHeight: '130px', resize: 'vertical' }}
                required
                id="contact-message"
              />
              <button type="submit" className="cta-button" style={{ justifyContent: 'center' }}>
                Send Message <ArrowRight size={14} />
              </button>
              {formSubmitted && (
                <div className="form-success">
                  Message copied! Your email client should open. If not, paste from clipboard and send to mazenmrad.123.ma@gmail.com
                </div>
              )}
            </form>
          </FadeIn>

          {/* Social Links */}
          <FadeIn delay={2}>
            <div className="social-links" style={{ marginTop: '36px' }}>
              <a href="mailto:mazenmrad.123.ma@gmail.com" className="social-link" title="Email" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="https://linkedin.com/in/mazen-mrad" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://github.com/MazenMrad" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Project Detail Modal ═══ */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Close">
              <X size={18} />
            </button>

            <div className="modal-layout">
              <div className="modal-main">
                <div className="modal-header-row">
                  <h2 className="modal-title">{selectedProject.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span className="project-year">{selectedProject.year}</span>
                    <LedOrb status={selectedProject.status} />
                  </div>
                </div>

                <div className="tech-tags" style={{ marginBottom: '18px' }}>
                  {selectedProject.stack.map(tag => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <section className="modal-section">
                  <h3 className="modal-section-title">About the Project</h3>
                  <p className="modal-text">{selectedProject.detail.about}</p>
                </section>

                {selectedProject.detail.process && (
                  <section className="modal-section">
                    <h3 className="modal-section-title">Our Process</h3>
                    <p className="modal-text">{selectedProject.detail.process}</p>
                  </section>
                )}

                {selectedProject.detail.deliverables && selectedProject.detail.deliverables.length > 0 && (
                  <section className="modal-section">
                    <h3 className="modal-section-title">Deliverables</h3>
                    <ul className="modal-list">
                      {selectedProject.detail.deliverables.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="modal-section">
                  <h3 className="modal-section-title">Results</h3>
                  <p className="modal-text modal-text-highlight">{selectedProject.detail.results}</p>
                </section>

                {selectedProject.detail.testimonial && (
                  <section className="modal-section">
                    <h3 className="modal-section-title">What the Client Said</h3>
                    <blockquote className="modal-quote">{selectedProject.detail.testimonial}</blockquote>
                  </section>
                )}

                <div className="modal-links">
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="cta-button" style={{ fontSize: '13px' }}>
                      View Source <ExternalLink size={13} />
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '13px' }}>
                      Live Demo <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

              {(selectedProject.image || (selectedProject.gallery && selectedProject.gallery.length > 0)) && (
                <div className="modal-sidebar">
                  {selectedProject.image && (
                    <div className="modal-sidebar-link" onClick={() => setLightboxImage(selectedProject.image!)}>
                      <div className="modal-sidebar-img" style={{ backgroundImage: `url(${selectedProject.image})` }} />
                    </div>
                  )}
                  {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                    <div className="modal-sidebar-gallery">
                      {selectedProject.gallery.map((img, idx) => (
                        <div key={idx} className="modal-sidebar-link" onClick={() => setLightboxImage(img)}>
                          <div className="modal-sidebar-img modal-sidebar-img-sm" style={{ backgroundImage: `url(${img})` }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
            <img src={lightboxImage} alt="Project screenshot" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* ═══ Footer ═══ */}
      <footer className="site-footer" style={{ marginTop: 'auto' }}>
        <div className="portfolio-container footer-inner">
          <span>© {new Date().getFullYear()} Mazen Mrad. All rights reserved.</span>
          <span className="mono">Built with React + Three.js</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
