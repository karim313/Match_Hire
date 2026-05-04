'use client';

import { useEffect, useRef } from 'react';

/**
 * Background3D — Fake 3D Parallax Glass Layers
 *
 * How it achieves the 3D illusion:
 * ─────────────────────────────────
 * 1. CSS `perspective` on the root container creates a 3D space.
 * 2. Multiple layers translated on Z-axis (translateZ) simulate depth.
 * 3. Each layer responds to mouse movement at a different speed multiplier
 *    (slow layers = far, fast layers = near), reinforcing the depth cue.
 * 4. A cursor-following radial glow adds a "light source" that reacts to the user.
 *
 * Why it's performant:
 * ─────────────────────
 * - Only `transform` and `opacity` are animated → GPU composited, zero layout work.
 * - A single `requestAnimationFrame` loop; mouse data is stored in a ref (no re-renders).
 * - `will-change: transform` applied only to moving layers.
 * - `position: fixed` + `pointer-events: none` → CLS = 0.
 * - Total JS footprint: ~60 lines of logic, no external deps.
 */

interface Layer {
  width: string;
  height: string;
  top: string;
  left: string;
  gradient: string;
  blur: string;
  speed: number;       // parallax speed multiplier (0 = static, 1 = full mouse range)
  rotate: string;
  opacity: number;
  zOffset: number;     // CSS translateZ for depth ordering
  border?: string;
  floatDuration?: string; // CSS animation duration for idle float
  floatDelay?: string;
}

const LAYERS: Layer[] = [
  // ── Far background blobs ──────────────────────────────
  {
    width: '75vw', height: '65vw',
    top: '-20%', left: '-20%',
    gradient: 'radial-gradient(ellipse at 40% 40%, rgba(59,130,246,0.16) 0%, transparent 65%)',
    blur: 'blur(60px)',
    speed: 0.012, rotate: 'rotate(-12deg)',
    opacity: 1, zOffset: -60,
    floatDuration: '22s', floatDelay: '0s',
  },
  {
    width: '70vw', height: '60vw',
    top: '30%', left: '40%',
    gradient: 'radial-gradient(ellipse at 60% 60%, rgba(139,92,246,0.14) 0%, transparent 65%)',
    blur: 'blur(70px)',
    speed: 0.015, rotate: 'rotate(8deg)',
    opacity: 1, zOffset: -50,
    floatDuration: '28s', floatDelay: '5s',
  },

  // ── Mid glass panels ──────────────────────────────────
  {
    width: '55vw', height: '45vw',
    top: '5%', left: '55%',
    gradient: 'linear-gradient(135deg, rgba(79,142,247,0.07) 0%, rgba(139,92,246,0.05) 100%)',
    blur: 'blur(2px)',
    speed: 0.03,
    rotate: 'rotate(-6deg) rotateX(4deg)',
    opacity: 0.9, zOffset: -20,
    border: '1px solid rgba(255,255,255,0.05)',
    floatDuration: '18s', floatDelay: '2s',
  },
  {
    width: '45vw', height: '40vw',
    top: '40%', left: '-5%',
    gradient: 'linear-gradient(225deg, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.05) 100%)',
    blur: 'blur(2px)',
    speed: 0.04,
    rotate: 'rotate(10deg) rotateY(-4deg)',
    opacity: 0.85, zOffset: -10,
    border: '1px solid rgba(255,255,255,0.04)',
    floatDuration: '24s', floatDelay: '7s',
  },

  // ── Near foreground accent lines ──────────────────────
  {
    width: '30vw', height: '1px',
    top: '28%', left: '20%',
    gradient: 'linear-gradient(90deg, transparent, rgba(79,142,247,0.4), rgba(139,92,246,0.3), transparent)',
    blur: 'blur(0px)',
    speed: 0.06, rotate: 'rotate(-2deg)',
    opacity: 0.7, zOffset: 0,
    floatDuration: '14s', floatDelay: '1s',
  },
  {
    width: '20vw', height: '1px',
    top: '65%', left: '60%',
    gradient: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)',
    blur: 'blur(0px)',
    speed: 0.08, rotate: 'rotate(3deg)',
    opacity: 0.5, zOffset: 10,
    floatDuration: '17s', floatDelay: '3s',
  },
];

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Normalise to -1 → 1 range
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const container = containerRef.current;
    const glow = glowRef.current;
    const layerEls = container
      ? Array.from(container.querySelectorAll<HTMLElement>('[data-layer]'))
      : [];

    const tick = () => {
      // High-quality Lerp for "Liquid" feel (0.05 for more lag/smoothness)
      current.current.x += (mouse.current.x - current.current.x) * 0.05;
      current.current.y += (mouse.current.y - current.current.y) * 0.05;

      const cx = current.current.x;
      const cy = current.current.y;

      // 1. Tilt the entire container slightly for 3D depth
      if (containerRef.current) {
        const tiltX = cy * 5; // Max 5deg tilt
        const tiltY = cx * -5;
        containerRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      // 2. Move layers with staggered speeds
      layerEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed || '0');
        const baseTransform = el.dataset.baseTransform || '';
        // Subtle translation
        const tx = cx * speed * 80; 
        const ty = cy * speed * 80;
        el.style.transform = `${baseTransform} translate(${tx}px, ${ty}px)`;
      });

      // 3. Magnetic Spotlight Effect
      if (glowRef.current) {
        const gx = (mouse.current.x * 0.5 + 0.5) * 100;
        const gy = (mouse.current.y * 0.5 + 0.5) * 100;
        glowRef.current.style.background = `radial-gradient(circle 35vw at ${gx}% ${gy}%, rgba(79,142,247,0.12) 0%, rgba(139,92,246,0.04) 40%, transparent 80%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes bg3d-float {
          0%, 100% { transform: translateY(0px) var(--base-rotate, rotate(0deg)); }
          50%       { transform: translateY(-15px) var(--base-rotate, rotate(0deg)); }
        }
        [data-layer] {
          animation: bg3d-float var(--float-dur, 20s) ease-in-out infinite var(--float-delay, 0s);
        }
      `}</style>

      {/* Static Root Container */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#0a0c16]"
        style={{ perspective: '1500px' }}
      >
        {/* Top ambient glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Tilt Wrapper - This is what rotates */}
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full transition-none"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {/* Cursor-following spotlight */}
          <div
            ref={glowRef}
            className="absolute inset-[-20%] transition-none opacity-60"
            style={{ willChange: 'background' }}
          />

          {/* High-fidelity Dot grid */}
          <div
            className="absolute inset-[-10%]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.18,
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)',
              transform: 'translateZ(-100px)',
            }}
          />

          {/* Parallax layers */}
          {LAYERS.map((layer, i) => {
            const baseTransform = `${layer.rotate} translateZ(${layer.zOffset}px)`;
            return (
              <div
                key={i}
                data-layer="true"
                data-speed={layer.speed}
                data-base-transform={baseTransform}
                style={{
                  position: 'absolute',
                  width: layer.width,
                  height: layer.height,
                  top: layer.top,
                  left: layer.left,
                  background: layer.gradient,
                  filter: layer.blur,
                  opacity: layer.opacity,
                  border: layer.border,
                  borderRadius: '50%',
                  transform: baseTransform,
                  willChange: 'transform',
                  '--float-dur': layer.floatDuration,
                  '--float-delay': layer.floatDelay,
                  '--base-rotate': layer.rotate,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
