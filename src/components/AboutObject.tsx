import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GODOT = '#478cbf';
const GODOT_LIGHT = '#7eb6e0';
const VISOR = '#071018';
const EYE = '#22e08a';

function useMouseTilt(strength = 0.45) {
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientY / window.innerHeight - 0.5) * strength,
        y: (e.clientX / window.innerWidth - 0.5) * strength,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength]);
  return target;
}

function NodeDiamond({
  radius,
  speed,
  phase,
}: {
  radius: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + phase;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.35, Math.sin(t) * radius);
    ref.current.rotation.x += 0.012;
    ref.current.rotation.y += 0.018;
  });
  return (
    <mesh ref={ref} scale={0.22}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={GODOT_LIGHT}
        emissive={GODOT}
        emissiveIntensity={0.35}
        metalness={0.25}
        roughness={0.35}
      />
    </mesh>
  );
}

function GodotRobot() {
  const group = useRef<THREE.Group>(null);
  const target = useMouseTilt(0.5);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 1.15) * 0.1 - 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, t * 0.22 + target.current.y, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.current.x, 0.06);
  });

  const body = (
    <meshStandardMaterial color={GODOT} metalness={0.35} roughness={0.4} />
  );
  const dark = (
    <meshStandardMaterial color={VISOR} metalness={0.5} roughness={0.25} />
  );

  return (
    <group ref={group} scale={1.05}>
      {/* Torso */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.15, 1.2, 0.72]} />
        {body}
      </mesh>
      <mesh position={[0, 0.12, 0.38]}>
        <boxGeometry args={[0.55, 0.4, 0.08]} />
        {dark}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.98, 0.72, 0.82]} />
        {body}
      </mesh>
      <mesh position={[0, 1.08, 0.42]}>
        <boxGeometry args={[0.84, 0.28, 0.1]} />
        {dark}
      </mesh>
      <mesh position={[-0.2, 1.08, 0.48]}>
        <boxGeometry args={[0.16, 0.1, 0.06]} />
        <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.2, 1.08, 0.48]}>
        <boxGeometry args={[0.16, 0.1, 0.06]} />
        <meshStandardMaterial color={EYE} emissive={EYE} emissiveIntensity={1.4} />
      </mesh>

      {/* Ear bolts */}
      <mesh position={[-0.58, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 10]} />
        {dark}
      </mesh>
      <mesh position={[0.58, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.22, 10]} />
        {dark}
      </mesh>

      {/* Antenna + plus */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.28, 8]} />
        {dark}
      </mesh>
      <mesh position={[0, 1.74, 0]}>
        <boxGeometry args={[0.34, 0.08, 0.08]} />
        {dark}
      </mesh>
      <mesh position={[0, 1.74, 0]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        {dark}
      </mesh>

      {/* Arms */}
      <mesh position={[-0.78, 0.15, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.14, 0.7, 4, 8]} />
        {body}
      </mesh>
      <mesh position={[0.78, 0.15, 0]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.14, 0.7, 4, 8]} />
        {body}
      </mesh>

      {/* Legs */}
      <mesh position={[-0.32, -0.95, 0]}>
        <capsuleGeometry args={[0.16, 0.55, 4, 8]} />
        {body}
      </mesh>
      <mesh position={[0.32, -0.95, 0]}>
        <capsuleGeometry args={[0.16, 0.55, 4, 8]} />
        {body}
      </mesh>

      <NodeDiamond radius={2.05} speed={0.55} phase={0} />
      <NodeDiamond radius={2.05} speed={0.55} phase={2.1} />
      <NodeDiamond radius={2.05} speed={0.55} phase={4.2} />
    </group>
  );
}

export const AboutObject: React.FC = () => {
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

  if (!webGlSupported) {
    return (
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ display: 'block', margin: '0 auto', opacity: 0.9 }}>
        <rect x="78" y="38" width="84" height="58" rx="6" fill="none" stroke="#478cbf" strokeWidth="2.5" />
        <rect x="92" y="56" width="56" height="16" rx="2" fill="none" stroke="#478cbf" strokeWidth="2" />
        <rect x="100" y="60" width="12" height="8" fill="#22e08a" />
        <rect x="128" y="60" width="12" height="8" fill="#22e08a" />
        <line x1="120" y1="28" x2="120" y2="38" stroke="#478cbf" strokeWidth="2.5" />
        <line x1="108" y1="22" x2="132" y2="22" stroke="#478cbf" strokeWidth="2.5" />
        <line x1="120" y1="10" x2="120" y2="34" stroke="#478cbf" strokeWidth="2.5" />
        <rect x="72" y="102" width="96" height="78" rx="6" fill="none" stroke="#478cbf" strokeWidth="2.5" />
        <rect x="92" y="186" width="18" height="36" rx="4" fill="none" stroke="#478cbf" strokeWidth="2.5" />
        <rect x="130" y="186" width="18" height="36" rx="4" fill="none" stroke="#478cbf" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0.2, 5.6] }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3.2, 4.2, 5]} intensity={1.35} />
        <pointLight position={[-2.4, 1.2, 2.8]} intensity={0.55} color="#7eb6e0" />
        <GodotRobot />
      </Canvas>
    </div>
  );
};
