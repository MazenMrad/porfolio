import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Icosahedron wireframe component that tilts towards mouse pointer
const FloatingIcosahedron: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Update target rotation based on cursor move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      targetRotation.current = {
        x: y * 0.6,
        y: x * 0.6
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      
      // Floating wave animation on y-axis
      meshRef.current.position.y = Math.sin(elapsed * 1.5) * 0.15;
      
      // Constant slow rotation + lerping towards mouse coordinates
      const currentRotX = elapsed * 0.12 + targetRotation.current.x;
      const currentRotY = elapsed * 0.18 + targetRotation.current.y;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, currentRotX, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, currentRotY, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 0]} />
      {/* Amber glowing wireframe lines */}
      <meshBasicMaterial
        color="#d97706"
        wireframe
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

export const AmberIcosahedron: React.FC = () => {
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
    // 2D Static SVG Fallback representing an icosahedron
    return (
      <svg
        width="300"
        height="300"
        viewBox="0 0 100 100"
        style={{ display: 'block', margin: '0 auto', opacity: 0.8 }}
      >
        {/* Draw stylized icosahedron lines */}
        <polygon points="50,5 95,35 95,65 50,95 5,65 5,35" fill="none" stroke="#d97706" strokeWidth="1" />
        <polygon points="50,25 80,45 80,55 50,75 20,55 20,45" fill="none" stroke="#d97706" strokeWidth="0.8" />
        <line x1="50" y1="5" x2="50" y2="25" stroke="#d97706" strokeWidth="0.8" />
        <line x1="95" y1="35" x2="80" y2="45" stroke="#d97706" strokeWidth="0.8" />
        <line x1="95" y1="65" x2="80" y2="55" stroke="#d97706" strokeWidth="0.8" />
        <line x1="50" y1="95" x2="50" y2="75" stroke="#d97706" strokeWidth="0.8" />
        <line x1="5" y1="65" x2="20" y2="55" stroke="#d97706" strokeWidth="0.8" />
        <line x1="5" y1="35" x2="20" y2="45" stroke="#d97706" strokeWidth="0.8" />
      </svg>
    );
  }

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0, 5.5] }} gl={{ alpha: true }}>
        <FloatingIcosahedron />
      </Canvas>
    </div>
  );
};
