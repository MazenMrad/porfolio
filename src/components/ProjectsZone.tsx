import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProjectData {
  id: string;
  name: string;
  desc: string;
  status: 'live' | 'legacy';
  metrics: string;
  stack: string[];
}

interface ProjectsZoneProps {
  onSelectProject: (proj: ProjectData | null) => void;
  selectedProject: ProjectData | null;
  active?: boolean;
}

export const ProjectsZone: React.FC<ProjectsZoneProps> = ({
  onSelectProject,
  selectedProject,
  active: _active
}) => {
  const projects: ProjectData[] = [
    {
      id: 'spendflow',
      name: 'SpendFlow',
      desc: 'Personal finance backend syncer & automated flow analytics.',
      status: 'live',
      metrics: 'OCR match: 98% | Latency: <80ms',
      stack: ['TypeScript', 'Next.js', 'Postgres']
    },
    {
      id: 'eumenes',
      name: 'Eumenes Bot',
      desc: 'Auto-fulfillment Discord store engine with offline Tesseract receipt OCR and local C2PA spoofs integrity protection.',
      status: 'live',
      metrics: 'Fraud Flag: 99.8% | DB Sync: 10m',
      stack: ['Node.js', 'Tesseract.js', 'SQLite', 'C2PA Spec']
    },
    {
      id: 'tiebreak',
      name: 'Tie-Break',
      desc: 'Tennis tournaments scheduling pipeline & real-time routing logic.',
      status: 'legacy',
      metrics: 'Uptime: 99.9% | Matches: 2.4k',
      stack: ['React', 'TailwindCSS', 'Supabase']
    }
  ];

  return (
    <group position={[0, -7, 0]}>
      {/* 3D Server Cabinets */}
      {projects.map((proj, idx) => {
        // Arrange horizontally
        const xPos = (idx - 1) * 2.8;
        const isSelected = selectedProject?.id === proj.id;
        
        return (
          <ServerRack
            key={proj.id}
            position={[xPos, 0, 0]}
            project={proj}
            isSelected={isSelected}
            onClick={() => {
              if (isSelected) {
                onSelectProject(null);
              } else {
                onSelectProject(proj);
              }
            }}
          />
        );
      })}
    </group>
  );
};

// Isolated individual server rack component for hinge rotate animation
const ServerRack: React.FC<{
  position: [number, number, number];
  project: ProjectData;
  isSelected: boolean;
  onClick: () => void;
}> = ({ position, project, isSelected, onClick }) => {
  const doorRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const ledRef = useRef<THREE.Mesh>(null);

  // Animate the door hinge open/close and blinking status LEDs
  useFrame((state) => {
    // Blinking status LED
    if (ledRef.current) {
      const freq = project.status === 'live' ? 3 : 1.5;
      const intensity = 0.3 + Math.sin(state.clock.getElapsedTime() * freq * Math.PI) * 0.7;
      (ledRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    }

    // Smooth hinge door opening rotation (Y-axis hinge)
    if (doorRef.current) {
      const targetRotation = isSelected ? -Math.PI * 0.7 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, targetRotation, 0.1);
    }
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 1. Main cabinet rack container box (wireframe base for speed) */}
      <mesh>
        <boxGeometry args={[1.5, 2.2, 1.2]} />
        <meshBasicMaterial
          color={isSelected ? 'var(--green)' : hovered ? 'var(--steel)' : 'var(--steel)'}
          wireframe
          transparent
          opacity={isSelected ? 0.8 : hovered ? 0.5 : 0.3}
        />
      </mesh>

      {/* 2. Inner server chassis nodes (representing blade servers inside cabinet) */}
      <group position={[0, 0, -0.2]}>
        {Array.from({ length: 4 }).map((_, idx) => {
          const yPos = 0.7 - idx * 0.45;
          return (
            <group key={idx} position={[0, yPos, 0.1]}>
              {/* Chassis faceplate */}
              <mesh>
                <boxGeometry args={[1.3, 0.3, 0.8]} />
                <meshBasicMaterial
                  color="#050508"
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Wireframe border chassis */}
              <mesh>
                <boxGeometry args={[1.31, 0.31, 0.81]} />
                <meshBasicMaterial
                  color="var(--steel)"
                  wireframe
                  transparent
                  opacity={0.2}
                />
              </mesh>
              {/* Internal glowing elements representing CPU/RAM load */}
              <mesh position={[0.2, 0, 0.41]}>
                <boxGeometry args={[0.4, 0.08, 0.02]} />
                <meshBasicMaterial color={idx % 2 === 0 ? 'var(--steel)' : 'var(--amber)'} transparent opacity={0.6} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. Blinking Status LED Indicator */}
      <mesh ref={ledRef} position={[0.5, 0.9, 0.61]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial
          color={project.status === 'live' ? '#33ff00' : '#ffb000'}
          transparent
        />
      </mesh>

      {/* 4. Text labels positioned directly in the 3D space above the server */}
      <group position={[0, 1.3, 0]}>
        {/* Simple visual mesh label */}
        <mesh>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#020204" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* 5. Pivoting Cabinet Door Group (Hinge is at X = -0.75, which is left border of door) */}
      <group ref={doorRef} position={[-0.75, 0, 0.6]}>
        {/* Visual offset so the door mesh is centered relative to hinge pivot */}
        <mesh position={[0.75, 0, 0]}>
          <planeGeometry args={[1.5, 2.2]} />
          <meshBasicMaterial
            color={isSelected ? 'var(--green)' : 'var(--steel)'}
            wireframe
            transparent
            opacity={isSelected ? 0.9 : 0.25}
          />
        </mesh>
        {/* Handle / Lock bar */}
        <mesh position={[1.4, 0, 0.02]}>
          <boxGeometry args={[0.05, 0.4, 0.02]} />
          <meshBasicMaterial color="var(--steel)" />
        </mesh>
      </group>
    </group>
  );
};
