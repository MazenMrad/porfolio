import { useEffect, useRef, useState } from 'react';

/**
 * The object beside the About copy.
 *
 * A wireframe icosahedron with lit vertex nodes and a slow counter-rotating
 * shell — nodes and edges, which is what the rest of the site is about. It
 * borrows the page palette directly (Godot blue on the same near-black as the
 * media wells) so it reads as part of the design rather than a stock demo
 * dropped in.
 *
 * Two constraints shaped the implementation:
 *
 *  - three.js is loaded with a dynamic import inside an effect, so it never
 *    runs during the prerender (there is no WebGL context at build time) and
 *    never lands in the initial bundle. The page ships without it and picks it
 *    up only if this component actually mounts.
 *  - Everything degrades. No WebGL, reduced-motion, or a failed import all
 *    fall back to the static SVG below, which is drawn in the same palette.
 */

function StaticFallback() {
  return (
    <svg viewBox="0 0 320 320" className="dx-object__svg" role="img" aria-label="Wireframe systems diagram">
      <g fill="none" stroke="#478cbf" strokeWidth="1.1" opacity="0.85">
        <circle cx="160" cy="160" r="104" />
        <circle cx="160" cy="160" r="66" opacity="0.5" />
        <path d="M160 56 L250 108 L250 212 L160 264 L70 212 L70 108 Z" />
        <path d="M160 56 L160 264 M70 108 L250 212 M250 108 L70 212" opacity="0.45" />
      </g>
      <g fill="#6fa8dc">
        {[
          [160, 56],
          [250, 108],
          [250, 212],
          [160, 264],
          [70, 212],
          [70, 108],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
        ))}
      </g>
      <circle cx="160" cy="160" r="6" fill="#22e08a" />
    </svg>
  );
}

export function SystemsObject() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Bail before importing if the machine cannot render it anyway.
    try {
      const probe = document.createElement('canvas');
      if (!probe.getContext('webgl') && !probe.getContext('experimental-webgl')) return;
    } catch {
      return;
    }

    let dispose = () => {};
    let cancelled = false;

    import('three')
      .then((THREE) => {
        if (cancelled || !mountRef.current) return;

        const size = () => Math.min(mount.clientWidth || 320, 380);
        let s = size();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 6.2);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.setSize(s, s);
        mount.appendChild(renderer.domElement);

        const ACCENT = 0x478cbf;
        const ACCENT_LIGHT = 0x6fa8dc;
        const LIVE = 0x22e08a;

        const group = new THREE.Group();
        scene.add(group);

        // Outer shell: the wireframe silhouette.
        const shellGeo = new THREE.IcosahedronGeometry(2.05, 1);
        const shell = new THREE.LineSegments(
          new THREE.WireframeGeometry(shellGeo),
          new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.42 })
        );
        group.add(shell);

        // Vertex nodes, so the form reads as a graph rather than a ball.
        const nodes = new THREE.Points(
          new THREE.IcosahedronGeometry(2.05, 1),
          new THREE.PointsMaterial({ color: ACCENT_LIGHT, size: 0.075, transparent: true, opacity: 0.95 })
        );
        group.add(nodes);

        // Inner core, counter-rotating — two systems turning at different rates.
        const core = new THREE.LineSegments(
          new THREE.WireframeGeometry(new THREE.OctahedronGeometry(0.95, 0)),
          new THREE.LineBasicMaterial({ color: ACCENT_LIGHT, transparent: true, opacity: 0.7 })
        );
        group.add(core);

        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 20, 20),
          new THREE.MeshBasicMaterial({ color: LIVE })
        );
        group.add(pulse);

        // Cursor parallax, kept small so it feels responsive rather than jumpy.
        const target = { x: 0, y: 0 };
        const onMove = (e: MouseEvent) => {
          target.x = (e.clientY / window.innerHeight - 0.5) * 0.5;
          target.y = (e.clientX / window.innerWidth - 0.5) * 0.5;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        const onResize = () => {
          s = size();
          renderer.setSize(s, s);
          camera.aspect = 1;
          camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        let raf = 0;
        const clock = new THREE.Clock();

        const tick = () => {
          const t = clock.getElapsedTime();

          group.rotation.x += (target.x - group.rotation.x) * 0.045;
          group.rotation.y += (target.y - group.rotation.y) * 0.045;

          shell.rotation.y = t * 0.16;
          nodes.rotation.y = t * 0.16;
          core.rotation.y = -t * 0.3;
          core.rotation.x = t * 0.16;

          const beat = 1 + Math.sin(t * 2.1) * 0.22;
          pulse.scale.setScalar(beat);

          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };
        tick();
        setLive(true);

        dispose = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('resize', onResize);
          scene.traverse((obj) => {
            const any = obj as unknown as {
              geometry?: { dispose: () => void };
              material?: { dispose: () => void };
            };
            any.geometry?.dispose();
            any.material?.dispose();
          });
          shellGeo.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        /* Import failed — the SVG fallback is already on screen. */
      });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <div className="dx-object">
      <div className="dx-object__canvas" ref={mountRef} aria-hidden={live} />
      {!live && <StaticFallback />}
      <span className="dx-object__cap">Systems — nodes, edges, and the thing that keeps ticking.</span>
    </div>
  );
}
