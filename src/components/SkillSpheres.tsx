import { useState } from 'react';

interface SkillItem {
  id: string;
  name: string;
  src: string;
}

const skills: SkillItem[] = [
  { id: 'godot', name: 'Godot', src: '/logos/godot.svg' },
  { id: 'gdscript', name: 'GDScript', src: '/logos/gdscript.svg' },
  { id: 'unity', name: 'Unity', src: '/logos/unity.svg' },
  { id: 'csharp', name: 'C#', src: '/logos/csharp.svg' },
  { id: 'git', name: 'Git', src: '/logos/git.svg' },
];

export const SkillSpheres: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <ul className="skill-icons">
      {skills.map((skill) => {
        const isHovered = hoveredId === skill.id;
        return (
          <li
            key={skill.id}
            className={`skill-icon${isHovered ? ' is-hovered' : ''}`}
            onMouseEnter={() => setHoveredId(skill.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={skill.src} alt={skill.name} width={48} height={48} />
            <span>{skill.name}</span>
          </li>
        );
      })}
    </ul>
  );
};
