import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Premium background 3D particle constellation structure
const ParticleConstellation: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  // Generate a premium sphere-constellation network of particles
  const [particleCoords, lineIndices] = useMemo(() => {
    const count = 120;
    const coords = new Float32Array(count * 3);
    const indices: number[] = [];

    // Distribute points spherically
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 5 + Math.random() * 2.5; // radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      coords[i * 3] = x;
      coords[i * 3 + 1] = y;
      coords[i * 3 + 2] = z;

      // Connect points close to each other
      for (let j = 0; j < i; j++) {
        const dx = coords[i * 3] - coords[j * 3];
        const dy = coords[i * 3 + 1] - coords[j * 3 + 1];
        const dz = coords[i * 3 + 2] - coords[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Connect if close
        if (dist < 2.5 && Math.random() > 0.45) {
          indices.push(i, j);
        }
      }
    }

    return [coords, new Uint16Array(indices)];
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.4;

    if (pointsRef.current && lineRef.current) {
      // Smooth orbit rotations with subtle mouse tracking parallax
      const targetRotY = elapsed * 0.04 + mouseX * 0.2;
      const targetRotX = elapsed * 0.02 + mouseY * 0.2;

      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.05);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.05);
      
      lineRef.current.rotation.y = pointsRef.current.rotation.y;
      lineRef.current.rotation.x = pointsRef.current.rotation.x;
    }
  });

  return (
    <group>
      {/* Stars/Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleCoords, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f59e0b"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>

      {/* Network Lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleCoords, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[lineIndices, 1]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#64748b"
          transparent
          opacity={0.15}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};

export const NocCanvas: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1, backgroundColor: '#0a0e17' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0e17');
        }}
      >
        <fog attach="fog" args={['#0a0e17', 4, 12]} />
        <ParticleConstellation />
      </Canvas>
    </div>
  );
};
