import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Stylized wireframe game controller that floats and tilts towards the mouse
const FloatingController: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetRotation.current = { x: y * 0.5, y: x * 0.5 };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(elapsed * 1.2) * 0.12;
      const currentRotY = elapsed * 0.25 + targetRotation.current.y;
      const currentRotX = targetRotation.current.x;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, currentRotY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, currentRotX, 0.05);
    }
  });

  const mat = (
    <meshBasicMaterial color="#478cbf" wireframe transparent opacity={0.85} />
  );

  const buttons: [number, number][] = [
    [-0.35, 0.35],
    [0.0, 0.5],
    [0.35, 0.35],
    [0.0, 0.2],
  ];

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[2.6, 1.3, 0.5]} />
        {mat}
      </mesh>
      {/* Grips */}
      <mesh position={[-1.1, -0.85, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.3, 0.42, 1.1, 14]} />
        {mat}
      </mesh>
      <mesh position={[1.1, -0.85, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.3, 0.42, 1.1, 14]} />
        {mat}
      </mesh>
      {/* D-pad (left) */}
      <mesh position={[-0.7, 0.05, 0.3]}>
        <boxGeometry args={[0.18, 0.55, 0.2]} />
        {mat}
      </mesh>
      <mesh position={[-0.7, 0.05, 0.3]}>
        <boxGeometry args={[0.55, 0.18, 0.2]} />
        {mat}
      </mesh>
      {/* Action buttons (right) */}
      {buttons.map(([x, y], i) => (
        <mesh key={i} position={[x + 0.7, y, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 14]} />
          {mat}
        </mesh>
      ))}
      {/* Center hub */}
      <mesh position={[0, -0.12, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.2, 14]} />
        {mat}
      </mesh>
    </group>
  );
};

export const AboutObject: React.FC = () => {
  const [webGlSupported, setWebGlSupported] = useState(true);

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
    return (
      <svg width="240" height="190" viewBox="0 0 240 190" style={{ display: 'block', margin: '0 auto', opacity: 0.85 }}>
        <path
          d="M55 60 Q55 45 80 45 L160 45 Q185 45 185 60 L185 78 Q185 100 162 110 L146 122 Q132 132 116 132 L104 132 Q88 132 74 122 L58 110 Q35 100 35 78 Z"
          fill="none"
          stroke="#478cbf"
          strokeWidth="2.5"
        />
        {/* D-pad */}
        <rect x="68" y="68" width="8" height="26" rx="2" fill="none" stroke="#478cbf" strokeWidth="2" />
        <rect x="57" y="79" width="30" height="8" rx="2" fill="none" stroke="#478cbf" strokeWidth="2" />
        {/* Buttons */}
        <circle cx="150" cy="70" r="5" fill="none" stroke="#478cbf" strokeWidth="2" />
        <circle cx="162" cy="82" r="5" fill="none" stroke="#478cbf" strokeWidth="2" />
        <circle cx="150" cy="94" r="5" fill="none" stroke="#478cbf" strokeWidth="2" />
        <circle cx="138" cy="82" r="5" fill="none" stroke="#478cbf" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0, 5.2] }} gl={{ alpha: true }}>
        <FloatingController />
      </Canvas>
    </div>
  );
};
