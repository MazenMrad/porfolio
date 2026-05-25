import React, { useState, useRef, useEffect } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

interface TerminalOverlayProps {
  onToggleLowPower: () => void;
  lowPowerMode: boolean;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  onToggleLowPower,
  lowPowerMode
}) => {
  const [history, setHistory] = useState<string[]>([
    'SYSTEM CONSOLE ACTIVE // HOST: HF_SPACE',
    'Type "help" for a list of operational triggers.',
    ''
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    const args = trimmed.split(' ');
    const cmd = args[0].toLowerCase();
    
    let response: string[] = [];
    
    switch (cmd) {
      case 'help':
        response = [
          'Directives:',
          '  ls skills      - List core competencies',
          '  cat resume.txt - View CV profile text',
          '  ping availability - Availability metrics check',
          '  reduced-motion - Toggle blueprint mode',
          '  clear          - Flush console logs'
        ];
        break;
      case 'ls':
        if (args[1] === 'skills') {
          response = [
            'CORE VECTORS:',
            '  [+] CI/CD Pipelines (GitHub Actions)',
            '  [+] Infra (Terraform, AWS, Docker, K8s)',
            '  [+] Database (Postgres, SQLite syncs)',
            '  [+] Automation (Go, Python scripting)',
            '  [+] Trust Integrations (C2PA scans)'
          ];
        } else {
          response = ['Usage: ls skills'];
        }
        break;
      case 'cat':
        if (args[1] === 'resume.txt') {
          response = [
            'MAZEN MRAD // DevOps & Backend',
            'Sleek automations, cluster scalability,',
            'secure pipelines, and offline bot architectures.',
            'Projects detailed in registry panel.'
          ];
        } else {
          response = ['Usage: cat resume.txt'];
        }
        break;
      case 'ping':
        if (args[1] === 'availability') {
          response = [
            '64 bytes from mazenmrad.com: seq=1 time=14ms',
            'Status: ACCEPTING_CHALLENGES (Active recruitment)'
          ];
        } else {
          response = ['Usage: ping availability'];
        }
        break;
      case 'reduced-motion':
        onToggleLowPower();
        response = [`Toggled schematic fallback: ${!lowPowerMode ? 'ON' : 'OFF'}`];
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        return;
      default:
        response = [`Command not found: ${cmd}`];
    }

    setHistory(prev => [...prev, `> ${trimmed}`, ...response, '']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div
      style={{
        border: '1px solid rgba(16, 185, 129, 0.25)',
        background: 'rgba(5, 7, 12, 0.9)',
        borderRadius: '6px',
        color: '#10b981',
        display: 'flex',
        flexDirection: 'column',
        height: '240px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 10px rgba(16, 185, 129, 0.05)',
        fontSize: '11px'
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(5, 7, 12, 0.5)',
          color: '#10b981',
          fontWeight: 'bold'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Terminal size={12} className="pulse" />
          <span>CONSOLE_SYSTEM_LOG</span>
        </div>
        <button
          onClick={onToggleLowPower}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#10b981',
            cursor: 'pointer',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Toggle blueprint mode"
        >
          <RefreshCw size={10} /> Mode
        </button>
      </div>

      {/* Output history */}
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          lineHeight: '1.4',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        {history.map((line, idx) => (
          <div key={idx} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(5, 7, 12, 0.8)'
        }}
      >
        <span>&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command (e.g. help)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#10b981',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            outline: 'none'
          }}
        />
      </form>
    </div>
  );
};
