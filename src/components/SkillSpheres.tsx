import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillItem {
  id: string;
  name: string;
  badgeText: string;
  bgFill: string;
  textFill: string;
}

const skills: SkillItem[] = [
  { id: 'godot', name: 'Godot', badgeText: 'GD', bgFill: '#478cbf', textFill: '#ffffff' },
  { id: 'gdscript', name: 'GDScript', badgeText: 'GS', bgFill: '#3a6f99', textFill: '#ffffff' },
  { id: 'pixelart', name: 'Pixel Art', badgeText: 'PX', bgFill: '#5a7a99', textFill: '#ffffff' },
  { id: 'aseprite', name: 'Aseprite', badgeText: 'AS', bgFill: '#5a7a99', textFill: '#ffffff' },
  { id: 'unity', name: 'Unity', badgeText: 'UN', bgFill: '#3a6f99', textFill: '#ffffff' },
  { id: 'csharp', name: 'C#', badgeText: 'C#', bgFill: '#4a6b85', textFill: '#ffffff' },
  { id: 'git', name: 'Git', badgeText: 'GT', bgFill: '#3a6f99', textFill: '#ffffff' },
  { id: 'itchio', name: 'itch.io', badgeText: 'IO', bgFill: '#478cbf', textFill: '#ffffff' },
  { id: 'steam', name: 'Steam', badgeText: 'ST', bgFill: '#3a6f99', textFill: '#ffffff' },
];

function hexCorners(cx: number, cy: number, r: number, rot = 0) {
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + rot;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function drawHex(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot = 0) {
  const pts = hexCorners(cx, cy, r, rot);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < 6; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

// Single interactive hex badge
const SphereArtifact: React.FC<{ skill: SkillItem; isHovered: boolean }> = ({ skill, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const R = 128;

    // Background hex
    drawHex(ctx, 128, 128, R);
    ctx.fillStyle = skill.bgFill;
    ctx.fill();

    // Subtle border
    drawHex(ctx, 128, 128, R - 3);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const logo = logoRef.current;
    if (logo) {
      ctx.save();
      drawHex(ctx, 128, 128, R - 4);
      ctx.clip();
      const s = 180;
      const o = (256 - s) / 2;
      ctx.drawImage(logo, o, o, s, s);
      ctx.restore();
    } else {
      ctx.font = 'bold 84px "Inter", "Arial", sans-serif';
      ctx.fillStyle = skill.textFill;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.badgeText, 128, 132);
    }

    return new THREE.CanvasTexture(canvas);
  }, [skill, loaded]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      logoRef.current = img;
      setLoaded(true);
    };
    img.src = `/logos/${skill.id}.svg`;
  }, [skill]);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const id = skill.badgeText.charCodeAt(0);

      // Gentle float + slow spin
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        isHovered ? 0.35 : Math.sin(elapsed * 1.8 + id) * 0.06,
        0.1
      );
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        isHovered ? 1.18 : 1,
        0.1
      ));
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        isHovered ? 0.15 : Math.sin(elapsed * 0.5 + id) * 0.06,
        0.08
      );
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <circleGeometry args={[1.5, 6]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export const SkillSpheres: React.FC = () => {
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {skills.map((skill) => {
        const isHovered = hoveredId === skill.id;

        return (
          <div
            key={skill.id}
            onMouseEnter={() => setHoveredId(skill.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '88px',
              cursor: 'pointer'
            }}
          >
            {/* 3D sphere Canvas or 2D Fallback */}
            <div style={{ width: '72px', height: '72px', position: 'relative' }}>
              {webGlSupported ? (
                <Canvas camera={{ position: [0, 0, 3.8] }} gl={{ alpha: true }}>
                  <SphereArtifact skill={skill} isHovered={isHovered} />
                </Canvas>
              ) : (
                // 2D fallback
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: skill.bgFill,
                    color: skill.textFill,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    margin: '8px auto',
                    clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                    transform: isHovered ? 'translateY(-8px) scale(1.12)' : 'translateY(0) scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <img
                    src={`/logos/${skill.id}.svg`}
                    alt={skill.name}
                    style={{ width: '65%', height: '65%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; (e.target as HTMLElement).parentElement!.textContent = skill.badgeText; }}
                  />
                </div>
              )}
            </div>

            {/* Tech Label */}
            <span
              style={{
                fontSize: '11px',
                color: isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isHovered ? 600 : 500,
                marginTop: '6px',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s ease',
                letterSpacing: '-0.01em',
              }}
            >
              {skill.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};