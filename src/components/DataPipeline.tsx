import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillNode {
  id: string;
  name: string;
  level: string;
  metric: string;
  position: [number, number, number];
  color: string;
}

interface DataPipelineProps {
  onHoverSkill: (skill: { name: string; level: string; metric: string } | null) => void;
  active: boolean;
}

export const DataPipeline: React.FC<DataPipelineProps> = ({ onHoverSkill, active }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Skill items mapping
  const skills: SkillNode[] = useMemo(() => [
    {
      id: 'cicd',
      name: 'CI/CD Pipelines',
      level: '98%',
      metric: 'Reduced deploy time by 74%',
      position: [-3, 2, 0],
      color: '#33ff00' // green
    },
    {
      id: 'infra',
      name: 'Cloud Infrastructure',
      level: '95%',
      metric: 'Provisioned 200+ AWS hosts via TF',
      position: [-1, 0, 1],
      color: '#5f9ea0' // steel
    },
    {
      id: 'orchestration',
      name: 'K8s Orchestration',
      level: '92%',
      metric: 'Automated cluster scaling & failover',
      position: [1, 2, -1],
      color: '#ffb000' // amber
    },
    {
      id: 'db',
      name: 'Database Tuning',
      level: '89%',
      metric: 'Optimized index queries by 45%',
      position: [3, 0, 0],
      color: '#5f9ea0' // steel
    },
    {
      id: 'secops',
      name: 'SecOps & Automation',
      level: '94%',
      metric: 'Integrated local C2PA receipt check',
      position: [0, -2, -0.5],
      color: '#ffb000' // amber
    }
  ], []);

  // Connect paths between nodes
  const paths = useMemo(() => {
    return [
      { start: skills[0].position, end: skills[1].position },
      { start: skills[1].position, end: skills[2].position },
      { start: skills[2].position, end: skills[3].position },
      { start: skills[3].position, end: skills[4].position },
      { start: skills[4].position, end: skills[0].position },
      { start: skills[1].position, end: skills[4].position }
    ];
  }, [skills]);

  // Particle instances traversing paths
  const particleCount = paths.length * 2;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, idx) => {
      const pathIdx = idx % paths.length;
      return {
        pathIdx,
        speed: 0.2 + Math.random() * 0.3,
        progress: Math.random(),
        color: idx % 3 === 0 ? '#33ff00' : idx % 3 === 1 ? '#ffb000' : '#5f9ea0'
      };
    });
  }, [paths, particleCount]);

  const particleRefs = useRef<THREE.Mesh[]>([]);

  // Slow global pipeline rotation and particle motion updates
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (groupRef.current && active) {
      groupRef.current.rotation.y = elapsed * 0.05;
    }

    // Animate flow particles traversing the bezier curves
    particleRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const p = particles[idx];
      p.progress += state.clock.getDelta() * p.speed;
      if (p.progress > 1) p.progress = 0;

      const path = paths[p.pathIdx];
      // Interpolate along straight line paths for speed
      const x = THREE.MathUtils.lerp(path.start[0], path.end[0], p.progress);
      const y = THREE.MathUtils.lerp(path.start[1], path.end[1], p.progress);
      const z = THREE.MathUtils.lerp(path.start[2], path.end[2], p.progress);
      mesh.position.set(x, y, z);
    });
  });

  return (
    <group ref={groupRef}>
      {/* 3D Connecting Pipes */}
      {paths.map((path, idx) => {
        const startVec = new THREE.Vector3(...path.start);
        const endVec = new THREE.Vector3(...path.end);
        const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
        const distance = startVec.distanceTo(endVec);
        
        // Calculate orientation cylinder rotation
        const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
        const alignAxis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(alignAxis, direction);

        return (
          <mesh
            key={`pipe-${idx}`}
            position={midVec}
            quaternion={quaternion}
          >
            <cylinderGeometry args={[0.02, 0.02, distance, 6]} />
            <meshBasicMaterial
              color="#5f9ea0"
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
        );
      })}

      {/* Skills Cylindrical Nodes */}
      {skills.map((node) => (
        <NodeItem
          key={node.id}
          node={node}
          onHoverSkill={onHoverSkill}
        />
      ))}

      {/* Pulsing Flow Particles */}
      {particles.map((p, idx) => (
        <mesh
          key={`part-${idx}`}
          ref={(el) => { if (el) particleRefs.current[idx] = el; }}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};

// Isolated individual node component for hover states
const NodeItem: React.FC<{
  node: SkillNode;
  onHoverSkill: (skill: { name: string; level: string; metric: string } | null) => void;
}> = ({ node, onHoverSkill }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hovering breathing scale animation
      const breathing = 1 + Math.sin(state.clock.getElapsedTime() * 3 + node.position[0]) * 0.05;
      const targetScale = hovered ? 1.4 : breathing;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHoverSkill({ name: node.name, level: node.level, metric: node.metric });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverSkill(null);
          document.body.style.cursor = 'default';
        }}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
        <meshBasicMaterial
          color={node.color}
          wireframe={!hovered}
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>
      
      {/* Outer bounding scanning wire rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.47, 8]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
