'use client';

/**
 * Background — Premium AI/SaaS Background
 *
 * Why it's performant:
 * - Pure CSS: zero JS execution, zero TBT impact
 * - GPU-only animations: uses transform + opacity only (no layout thrashing)
 * - No will-change abuse: only applied on animated elements
 * - Fixed positioning: zero CLS (does not affect document flow)
 * - Blur via filter (GPU composited, not CPU)
 * - Total JS weight: 0 KB (just JSX returning static divs)
 */
export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      style={{ background: '#030712' }}
    >
      {/* ── Base deep dark radial gradient ───────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,142,247,0.14) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139,92,246,0.1) 0%, transparent 60%)',
        }}
      />

      {/* ── Subtle dot grid ──────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* ── Blob 1 — Blue, top-left, slow float ──────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: 900,
          maxHeight: 900,
          top: '-15%',
          left: '-15%',
          background:
            'radial-gradient(circle at center, rgba(59,130,246,0.13) 0%, transparent 65%)',
          filter: 'blur(40px)',
          animation: 'bg-float 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* ── Blob 2 — Purple, bottom-right, slow float ────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: 800,
          maxHeight: 800,
          bottom: '-20%',
          right: '-10%',
          background:
            'radial-gradient(circle at center, rgba(139,92,246,0.12) 0%, transparent 65%)',
          filter: 'blur(40px)',
          animation: 'bg-float 24s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* ── Blob 3 — Indigo, center accent ───────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          width: '30vw',
          height: '30vw',
          maxWidth: 500,
          maxHeight: 500,
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle at center, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'bg-float 30s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* ── Top edge glow beam ───────────────────────────── */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          transform: 'translateX(-50%)',
          width: '70%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(79,142,247,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent 100%)',
          opacity: 0.6,
        }}
      />
      {/* Glow spread below the beam */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          transform: 'translateX(-50%)',
          width: '50%',
          height: '220px',
          background:
            'linear-gradient(180deg, rgba(79,142,247,0.07) 0%, transparent 100%)',
          filter: 'blur(12px)',
        }}
      />

      {/* ── CSS Keyframes (injected once) ────────────────── */}
      <style>{`
        @keyframes bg-float {
          0%   { transform: translate(0px,  0px)  scale(1);   }
          33%  { transform: translate(24px, -20px) scale(1.04); }
          66%  { transform: translate(-16px, 16px) scale(0.97); }
          100% { transform: translate(0px,  0px)  scale(1);   }
        }
      `}</style>
    </div>
  );
}
