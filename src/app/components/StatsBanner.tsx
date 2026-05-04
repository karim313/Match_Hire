'use client'

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FileText, Target, Users, Building2 } from 'lucide-react';

function Counter({ end, duration = 1.5, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const interval = 1000 / 60;
      const totalFrames = duration * 60;
      const increment = end / totalFrames;
      
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(startValue));
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function StatsBanner() {
  const stats = [
    { val: 45210, suffix: '+', label: 'سيرة ذاتية محللة', icon: FileText, color: '#4f8ef7' },
    { val: 98, suffix: '%', label: 'دقة مطابقة المهارات', icon: Target, color: '#22c55e' },
    { val: 12480, suffix: '+', label: 'مستخدم نشط', icon: Users, color: '#a855f7' },
    { val: 1200, suffix: '+', label: 'شركة توظيف', icon: Building2, color: '#f59e0b' },
  ];

  return (
    <motion.div
      {...fadeUp(0.1)}
      className="rounded-[2.5rem] mb-20 text-white glass-card relative overflow-hidden"
      style={{ 
        background: 'rgba(10, 12, 22, 0.7)', 
        border: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <h3 className="mb-3 font-bold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>إحصائيات منصتنا</h3>
        <p className="text-white/40 max-w-xl mx-auto" style={{ fontSize: '1rem' }}>
          نحن لا نقدم مجرد أدوات، بل نبني مستقبلاً مهنياً يعتمد على دقة البيانات وقوة الذكاء الاصطناعي.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            {...fadeUp(0.2 + i * 0.1)} 
            className="flex flex-col items-center"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
            >
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div className="font-black mb-1 tabular-nums" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              <Counter end={s.val} suffix={s.suffix} />
            </div>
            <div className="text-white/40 font-medium text-xs sm:text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
