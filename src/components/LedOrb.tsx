import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LedOrbProps {
  status: 'live' | 'legacy';
}

const ThreeDOrbMesh: React.FC<LedOrbProps> = ({ status }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = status === 'live' ? '#00FF41' : '#f59e0b';

  useFrame((state) => {
    if (meshRef.current) {
      // Sine wave pulse rate
      const freq = status === 'live' ? 4 : 2;
      const pulse = 0.4 + Math.sin(state.clock.getElapsedTime() * freq) * 0.5;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 8, 8]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  );
};

export const LedOrb: React.FC<LedOrbProps> = ({ status }) => {
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setWebGlSupported(support);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  if (!webGlSupported) {
    // Pure CSS blinking dot fallback
    return <span className={`led-dot ${status === 'live' ? 'led-green' : 'led-amber'}`}></span>;
  }

  return (
    <div style={{ width: '16px', height: '16px' }} title={status === 'live' ? 'Production active' : 'Archived project'}>
      <Canvas camera={{ position: [0, 0, 3] }} gl={{ alpha: true }}>
        <ThreeDOrbMesh status={status} />
      </Canvas>
    </div>
  );
};
