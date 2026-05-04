'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(79,142,247,0.15) 0%, #080b14 60%)',
            backdropFilter: 'blur(0px)',
          }}
        >
          {/* Ambient blobs */}
          <div style={{
            position: 'absolute', top: '20%', left: '15%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '20%', right: '15%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,80,255,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulse 3s ease-in-out infinite 1.5s',
          }} />

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            
            {/* Orbital ring system */}
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '1px solid transparent',
                  borderTopColor: 'rgba(79,142,247,0.8)',
                  borderRightColor: 'rgba(79,142,247,0.3)',
                }}
              />

              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 14, borderRadius: '50%',
                  border: '1px solid transparent',
                  borderTopColor: 'rgba(120,80,255,0.7)',
                  borderLeftColor: 'rgba(120,80,255,0.3)',
                }}
              />

              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: 28, borderRadius: '50%',
                  border: '1px solid transparent',
                  borderTopColor: 'rgba(79,142,247,1)',
                  borderBottomColor: 'rgba(79,142,247,0.2)',
                }}
              />

              {/* Center dot */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(79,142,247,0.9), rgba(79,142,247,0.2))',
                  boxShadow: '0 0 24px rgba(79,142,247,0.6)',
                }} />
              </motion.div>
            </div>

            {/* Brand name */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #ffffff 40%, rgba(79,142,247,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                Match Hire
              </motion.div>

              {/* Animated dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'rgba(79,142,247,0.8)',
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                width: 160, height: 2, borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(79,142,247,0.5), rgba(79,142,247,1))',
                  borderRadius: 2,
                  boxShadow: '0 0 8px rgba(79,142,247,0.8)',
                }}
              />
            </motion.div>
          </div>

          <style jsx global>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
