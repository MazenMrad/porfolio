import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Low-poly projectile + dotted aim arc — Obsidio's core verb. */
function AimProjectile() {
  const group = useRef<THREE.Group>(null);
  const rock = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientY / window.innerHeight - 0.5) * 0.5,
        y: (e.clientX / window.innerWidth - 0.5) * 0.5,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rock.current) {
      const u = (t * 0.35) % 1;
      const x = -1.6 + u * 3.2;
      const y = 0.15 + Math.sin(u * Math.PI) * 1.35;
      rock.current.position.set(x, y, 0);
      rock.current.rotation.x = t * 2.4;
      rock.current.rotation.z = t * 1.8;
    }
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.current.y, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.current.x, 0.05);
    }
  });

  const dots = Array.from({ length: 9 }, (_, i) => {
    const u = i / 8;
    return {
      x: -1.6 + u * 3.2,
      y: 0.15 + Math.sin(u * Math.PI) * 1.35,
    };
  });

  return (
    <group ref={group}>
      {dots.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial
            color="#7eb6e0"
            emissive="#478cbf"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35 + i * 0.07}
          />
        </mesh>
      ))}
      <mesh ref={rock}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#478cbf" metalness={0.25} roughness={0.45} />
      </mesh>
    </group>
  );
}

export const AmberIcosahedron: React.FC = () => {
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGlSupported(support);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  if (!webGlSupported) return null;

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0.3, 5.2] }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <AimProjectile />
      </Canvas>
    </div>
  );
};
