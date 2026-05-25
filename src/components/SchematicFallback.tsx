import { Terminal, Database, Server, Shield, RefreshCw } from 'lucide-react';

interface SchematicFallbackProps {
  onToggle3D: () => void;
  metrics: {
    apisOrchestrated: number;
    testsAutomated: number;
    downtimePrevented: number;
    uptime: string;
  };
}

export const SchematicFallback: React.FC<SchematicFallbackProps> = ({ onToggle3D, metrics }) => {
  return (
    <div className="blueprint-layout font-mono">
      {/* Top Header info */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px double var(--steel)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <h1 className="text-glow-steel" style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 800 }}>
              SYS_SCHEMATIC: CONTROL_ROOM.NOC
            </h1>
            <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
              REDUCED_MOTION // 2D COMPATIBILITY LAYOUT v2.6.5
            </p>
          </div>
          <button 
            onClick={onToggle3D}
            style={{
              background: 'transparent',
              border: '1px solid var(--steel)',
              color: 'var(--steel)',
              padding: '8px 16px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--steel-dim)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--steel)';
            }}
          >
            <RefreshCw size={14} /> INITIALIZE_3D_NOC
          </button>
        </div>

        {/* Blueprint Diagram Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* Section 1: Data Pipeline diagram */}
          <div className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
            <div style={{ borderBottom: '1px solid var(--steel-dim)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-glow-steel">&gt; CORE_PIPELINE.map()</span>
              <span style={{ fontSize: '10px', color: 'var(--amber)' }}>[LIVE_FLOW]</span>
            </div>
            
            {/* SVG diagram mimicking the 3D pipeline */}
            <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
                {/* Connecting lines */}
                <path d="M 50,100 C 120,50 180,50 250,100" fill="none" stroke="var(--steel)" strokeWidth="1.5" strokeDasharray="5,5" />
                <path d="M 50,100 C 120,150 180,150 250,100" fill="none" stroke="var(--green)" strokeWidth="2" strokeDasharray="3,3" />
                <path d="M 250,100 L 350,50" fill="none" stroke="var(--steel)" strokeWidth="1" />
                <path d="M 250,100 L 350,150" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Skill Nodes */}
                <g>
                  <circle cx="50" cy="100" r="15" fill="#030a16" stroke="var(--green)" strokeWidth="2" />
                  <text x="50" y="125" fill="var(--green)" fontSize="10" textAnchor="middle">CI/CD</text>
                  <circle cx="50" cy="100" r="4" fill="var(--green)" />
                </g>

                <g>
                  <circle cx="150" cy="50" r="15" fill="#030a16" stroke="var(--steel)" strokeWidth="2" />
                  <text x="150" y="75" fill="var(--steel)" fontSize="10" textAnchor="middle">K8s / Infra</text>
                  <circle cx="150" cy="50" r="4" fill="var(--steel)" />
                </g>

                <g>
                  <circle cx="250" cy="100" r="18" fill="#030a16" stroke="var(--amber)" strokeWidth="2" />
                  <text x="250" y="128" fill="var(--amber)" fontSize="10" textAnchor="middle">Orchestration</text>
                  <circle cx="250" cy="100" r="5" fill="var(--amber)" />
                </g>

                <g>
                  <circle cx="350" cy="50" r="15" fill="#030a16" stroke="var(--steel)" strokeWidth="1.5" />
                  <text x="350" y="75" fill="var(--steel)" fontSize="10" textAnchor="middle">API Design</text>
                </g>

                <g>
                  <circle cx="350" cy="150" r="15" fill="#030a16" stroke="var(--steel)" strokeWidth="1.5" />
                  <text x="350" y="175" fill="var(--steel)" fontSize="10" textAnchor="middle">DB Optimization</text>
                </g>
              </svg>
            </div>

            <div style={{ fontSize: '11px', lineHeight: '1.6', color: 'rgba(95, 158, 160, 0.8)' }}>
              <span className="text-glow-green" style={{ fontWeight: 'bold' }}>INFO:</span> Automated pipeline systems continuously sync services and ingest telemetry. Hover and explore these fields in 3D mode.
            </div>
          </div>

          {/* Section 2: Systems Stats / Bento Grid */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid var(--steel-dim)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-glow-steel">&gt; TELEMETRY_METRICS</span>
              <span className="blink-dot blink-green"></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>APIS ORCHESTRATED // YEAR</span>
                <div style={{ fontSize: '24px', color: 'var(--green)', fontWeight: 'bold', textShadow: '0 0 6px var(--green-glow)' }}>
                  {metrics.apisOrchestrated.toLocaleString()}+
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>TESTS AUTOMATED // COVERAGE</span>
                <div style={{ fontSize: '24px', color: 'var(--steel)', fontWeight: 'bold' }}>
                  {metrics.testsAutomated}%
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>DOWNTIME PREVENTED // AUTO-HEAL</span>
                <div style={{ fontSize: '24px', color: 'var(--amber)', fontWeight: 'bold', textShadow: '0 0 6px var(--amber-glow)' }}>
                  {metrics.downtimePrevented} HOURS
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed var(--steel-dim)', paddingTop: '12px', marginTop: '16px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              <span>SYSTEM UPTIME: <span className="text-glow-green">{metrics.uptime}</span></span>
              <span>PING: <span className="text-glow-green">14ms</span></span>
            </div>
          </div>

          {/* Section 3: Tech Stack */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--steel-dim)', paddingBottom: '8px', marginBottom: '16px' }}>
              <span className="text-glow-steel">&gt; SYSTEM_STACK</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--steel-dim)', padding: '8px' }}>
                <Terminal size={14} style={{ color: 'var(--green)' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>Languages</div>
                  <span style={{ fontSize: '10px' }}>TS / Python / Go</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--steel-dim)', padding: '8px' }}>
                <Database size={14} style={{ color: 'var(--amber)' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>Databases</div>
                  <span style={{ fontSize: '10px' }}>Postgres / SQLite</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--steel-dim)', padding: '8px' }}>
                <Server size={14} style={{ color: 'var(--green)' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>Infrastructure</div>
                  <span style={{ fontSize: '10px' }}>AWS / K8s / Terraform</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--steel-dim)', padding: '8px' }}>
                <Shield size={14} style={{ color: 'var(--steel)' }} />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>SecOps</div>
                  <span style={{ fontSize: '10px' }}>Vault / OAuth2 / C2PA</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', border: '1px dashed var(--amber-dim)', padding: '8px', background: 'rgba(255, 176, 0, 0.03)' }}>
              <span className="text-glow-amber" style={{ fontWeight: 'bold' }}>SYSTEM WARNING:</span> High performance automation bots and OCR parsing scripts are active on these hosts.
            </div>
          </div>
        </div>

        {/* Projects List with status */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ borderBottom: '1px solid var(--steel-dim)', paddingBottom: '8px', marginBottom: '16px' }}>
            <span className="text-glow-steel">&gt; CORE_PROJECTS_REGISTRY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ border: '1px solid var(--steel-dim)', padding: '15px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="text-glow-green" style={{ fontSize: '16px' }}>SpendFlow</h3>
                <span style={{ fontSize: '11px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="blink-dot blink-green"></span> ACTIVE_LIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(95, 158, 160, 0.9)', marginBottom: '8px' }}>
                Personal finance orchestration engine. Leverages automated sync triggers, secure API bindings, and complex flow analytics.
              </p>
              <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>TypeScript</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>Next.js</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>PostgreSQL</span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--steel-dim)', padding: '15px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="text-glow-green" style={{ fontSize: '16px' }}>Eumenes</h3>
                <span style={{ fontSize: '11px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="blink-dot blink-green"></span> ACTIVE_LIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(95, 158, 160, 0.9)', marginBottom: '8px' }}>
                Discord auto-fulfillment digital sales bot. Powered by offline Tesseract OCR (Receipt scanning), AI duplicate/C2PA spoofing scanner, and stateful buyer trust pipelines with SQLite datasets.
              </p>
              <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>Node.js</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>Tesseract.js</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>SQLite</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>C2PA scan</span>
              </div>
            </div>

            <div style={{ border: '1px solid var(--steel-dim)', padding: '15px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="text-glow-amber" style={{ fontSize: '16px' }}>Tie-Break</h3>
                <span style={{ fontSize: '11px', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="blink-dot blink-amber"></span> COMPAT_LEGACY
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(95, 158, 160, 0.9)', marginBottom: '8px' }}>
                Tennis scheduling, live tournament coordinator, and score-matching web system. Built for speed and high-precision timeline syncing.
              </p>
              <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>React</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>Tailwind</span>
                <span style={{ border: '1px solid var(--steel-dim)', padding: '2px 6px' }}>Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
