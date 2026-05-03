export function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes blob-1 {
          0%,100% { transform: translate(0px,   0px) scale(1);    }
          33%      { transform: translate(80px, -60px) scale(1.1); }
          66%      { transform: translate(-40px, 70px) scale(0.9); }
        }
        @keyframes blob-2 {
          0%,100% { transform: translate(0px,    0px) scale(1);    }
          33%      { transform: translate(-80px,  40px) scale(1.1); }
          66%      { transform: translate(50px,  -80px) scale(0.9); }
        }
        @keyframes blob-3 {
          0%,100% { transform: translate(0px,   0px) scale(1);    }
          50%      { transform: translate(60px,  80px) scale(1.15);}
        }
        @keyframes blob-4 {
          0%,100% { transform: translate(0px,   0px) scale(1);    }
          40%      { transform: translate(-60px,-50px) scale(1.05);}
          80%      { transform: translate(40px,  60px) scale(0.95);}
        }

        .mh-blob {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
          pointer-events: none;
        }
        .mh-blob-1 {
          width: 600px; height: 600px;
          top: -180px; left: -150px;
          background: radial-gradient(circle, rgba(0,100,255,0.55) 0%, rgba(0,60,200,0.25) 60%, transparent 100%);
          filter: blur(60px);
          animation: blob-1 20s ease-in-out infinite;
        }
        .mh-blob-2 {
          width: 550px; height: 550px;
          bottom: -150px; right: -120px;
          background: radial-gradient(circle, rgba(120,80,255,0.50) 0%, rgba(80,40,220,0.22) 60%, transparent 100%);
          filter: blur(65px);
          animation: blob-2 25s ease-in-out infinite;
        }
        .mh-blob-3 {
          width: 450px; height: 450px;
          top: 30%; left: 30%;
          background: radial-gradient(circle, rgba(56,189,248,0.38) 0%, rgba(14,165,233,0.15) 60%, transparent 100%);
          filter: blur(70px);
          animation: blob-3 30s ease-in-out infinite;
        }
        .mh-blob-4 {
          width: 350px; height: 350px;
          top: 55%; left: 0%;
          background: radial-gradient(circle, rgba(168,85,247,0.40) 0%, rgba(139,92,246,0.18) 60%, transparent 100%);
          filter: blur(55px);
          animation: blob-4 22s ease-in-out infinite reverse;
        }

        /* Dark mode — richer glow colors */
        .dark .mh-blob-1 {
          background: radial-gradient(circle, rgba(30,120,255,0.65) 0%, rgba(10,80,230,0.30) 60%, transparent 100%);
        }
        .dark .mh-blob-2 {
          background: radial-gradient(circle, rgba(140,90,255,0.60) 0%, rgba(100,50,240,0.28) 60%, transparent 100%);
        }
        .dark .mh-blob-3 {
          background: radial-gradient(circle, rgba(56,200,255,0.45) 0%, rgba(14,170,240,0.20) 60%, transparent 100%);
        }
        .dark .mh-blob-4 {
          background: radial-gradient(circle, rgba(190,100,255,0.50) 0%, rgba(160,100,246,0.22) 60%, transparent 100%);
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <div className="mh-blob mh-blob-1" />
        <div className="mh-blob mh-blob-2" />
        <div className="mh-blob mh-blob-3" />
        <div className="mh-blob mh-blob-4" />
      </div>
    </>
  );
}
