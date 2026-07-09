import React from 'react';

interface LedOrbProps {
  status: 'live' | 'prototype' | 'wip' | 'released';
}

const STATUS_COLOR: Record<LedOrbProps['status'], string> = {
  live: '#478cbf',
  released: '#478cbf',
  prototype: '#f59e0b',
  wip: '#a78bfa',
};

const STATUS_LABEL: Record<LedOrbProps['status'], string> = {
  live: 'Live',
  released: 'Released',
  prototype: 'Prototype',
  wip: 'In progress',
};

export const LedOrb: React.FC<LedOrbProps> = ({ status }) => {
  const color = STATUS_COLOR[status];
  return (
    <span
      className="led-dot"
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: 'led-pulse 2s ease-in-out infinite',
      }}
      title={STATUS_LABEL[status]}
      aria-label={STATUS_LABEL[status]}
    />
  );
};
