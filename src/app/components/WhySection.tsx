'use client'

import { motion } from 'framer-motion';
import { TrendingUp, Users, FileCheck, Zap } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const whyItems = [
  { icon: <TrendingUp className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'تحليل متقدم', desc: 'خوارزميات ذكاء اصطناعي متطورة لتحليل دقيق وشامل' },
  { icon: <Users className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دعم شامل', desc: 'فريق دعم متخصص متاح على مدار الساعة لمساعدتك' },
  { icon: <FileCheck className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'نتائج فورية', desc: 'احصل على تحليل كامل لسيرتك الذاتية في ثوانٍ' },
  { icon: <Zap className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دقة عالية', desc: 'نسبة دقة تصل إلى 95% في استخراج المهارات والمطابقة' },
];

export default function WhySection() {
  return (
    <>
      <motion.div {...fadeUp(0.2)} className="text-center mb-6">
        <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(1.35rem, 3vw, 2rem)', color: '#ffffff' }}>
          لماذا Match Hire؟
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>كل ما تحتاجه لتطوير مسيرتك المهنية في مكان واحد</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6 max-w-4xl mx-auto mb-8">
        {whyItems.map((item, i) => (
          <motion.div
            key={i}
            {...fadeUp(0.15 + i * 0.1)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex items-start gap-4 p-5 rounded-2xl glass-card"
            style={{
              background: 'rgba(10, 12, 22, 0.65)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.2)' }}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-semibold mb-1" style={{ color: '#ffffff', fontSize: '0.95rem' }}>{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
