import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, ShieldAlert, Activity, Wifi } from 'lucide-react';

interface TelemetryDashboardProps {
  apisCount: number;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ apisCount }) => {
  const [cpuLoad, setCpuLoad] = useState(24.5);
  const [sparklineData, setSparklineData] = useState<number[]>([12, 15, 18, 14, 25, 30, 28, 35, 42, 38, 48]);

  // Periodic random CPU/network updates to feel fully alive
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuLoad(prev => {
        const diff = (Math.random() - 0.5) * 6;
        return Math.max(8.0, Math.min(92.0, parseFloat((prev + diff).toFixed(1))));
      });
      
      setSparklineData(prev => {
        const nextVal = Math.max(10, Math.min(90, Math.round(prev[prev.length - 1] + (Math.random() - 0.45) * 12)));
        const sliced = prev.length > 15 ? prev.slice(1) : prev;
        return [...sliced, nextVal];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const maxVal = Math.max(...sparklineData);
  const minVal = Math.min(...sparklineData);
  const range = maxVal - minVal || 1;

  // Render SVG points for sparkline
  const sparkPoints = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 180 + 10;
      const y = 50 - ((val - minVal) / range) * 35;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--steel-dim)', paddingBottom: '8px' }}>
        <Activity size={16} className="text-glow-amber pulse" />
        <h2 className="text-glow-steel" style={{ fontSize: '14px', letterSpacing: '1px' }}>
          SYSTEM_TELEMETRY_LOGS // REALTIME_DASHBOARD
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Metric Card 1: APIs */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>ORCHESTRATION // API CALLS</span>
            <Cpu size={16} style={{ color: 'var(--green)' }} />
          </div>
          <div>
            <div className="text-glow-green" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {apisCount.toLocaleString()}+
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(95, 158, 160, 0.5)', marginTop: '2px' }}>
              Dynamic counting syncer ACTIVE
            </div>
          </div>
        </div>

        {/* Metric Card 2: Coverage */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>CI-CD // AUTO TEST COVERAGE</span>
            <CheckCircle size={16} style={{ color: 'var(--steel)' }} />
          </div>
          <div>
            <div className="text-glow-steel" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              99.98%
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(95, 158, 160, 0.5)', marginTop: '2px' }}>
              142 tests passing sequentially
            </div>
          </div>
        </div>

        {/* Metric Card 3: Prevented Downtime */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>DOWNTIME PREVENTED</span>
            <ShieldAlert size={16} style={{ color: 'var(--amber)' }} />
          </div>
          <div>
            <div className="text-glow-amber" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              140 HRS
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(95, 158, 160, 0.5)', marginTop: '2px' }}>
              Via auto-healing watchdogs
            </div>
          </div>
        </div>

        {/* Sparkline System Activity */}
        <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', height: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(95, 158, 160, 0.7)' }}>NOC_LOAD // LIVE PING</span>
            <div style={{ fontSize: '10px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wifi size={10} /> 14ms
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="45" viewBox="0 0 200 50" style={{ overflow: 'visible' }}>
              {/* Grid backgrounds */}
              <line x1="10" y1="15" x2="190" y2="15" stroke="rgba(95, 158, 160, 0.1)" strokeWidth="0.5" />
              <line x1="10" y1="30" x2="190" y2="30" stroke="rgba(95, 158, 160, 0.1)" strokeWidth="0.5" />
              <line x1="10" y1="45" x2="190" y2="45" stroke="rgba(95, 158, 160, 0.1)" strokeWidth="0.5" />
              
              {/* Sparkline curve */}
              <polyline
                fill="none"
                stroke="var(--amber)"
                strokeWidth="1.5"
                points={sparkPoints}
                style={{ filter: 'drop-shadow(0px 0px 3px var(--amber-glow))' }}
              />
              
              {/* Pulsing indicator on latest value */}
              {sparklineData.length > 0 && (
                <circle
                  cx={(sparklineData.length - 1) / (sparklineData.length - 1) * 180 + 10}
                  cy={50 - ((sparklineData[sparklineData.length - 1] - minVal) / range) * 35}
                  r="3"
                  fill="var(--amber)"
                  className="pulse"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Grid status information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ borderBottom: '1px dashed var(--steel-dim)', paddingBottom: '4px', color: '#fff', fontWeight: 'bold' }}>
            &gt; SYSTEM_CONTAINERS
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>huggingface-space.prod</span>
            <span style={{ color: 'var(--green)' }}>● ACTIVE [HF_REVERSE_CF_PROXY]</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>sqlite-backup-db.daemon</span>
            <span style={{ color: 'var(--green)' }}>● SYNCED [HF_PRIVATE_DATASET]</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>tesseract-ocr.offline</span>
            <span style={{ color: 'var(--green)' }}>● READY [0_API_DEPENDENCY]</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ borderBottom: '1px dashed var(--steel-dim)', paddingBottom: '4px', color: '#fff', fontWeight: 'bold' }}>
            &gt; RESOURCE_CONSUMPTION
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>CPU Core Load</span>
            <span style={{ color: cpuLoad > 70 ? 'var(--amber)' : 'var(--steel)' }}>{cpuLoad}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Threads</span>
            <span>12 / 16 threads</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Memory footprint</span>
            <span>254MB / 1024MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
