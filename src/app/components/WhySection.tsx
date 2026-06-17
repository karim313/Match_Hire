'use client'

import { motion } from 'framer-motion';
import { TrendingUp, Users, FileCheck, Zap } from 'lucide-react';

const whyItems = [
  { icon: <TrendingUp className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'تحليل متقدم', desc: 'خوارزميات ذكاء اصطناعي متطورة لتحليل دقيق وشامل' },
  { icon: <Users className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دعم شامل', desc: 'فريق دعم متخصص متاح على مدار الساعة لمساعدتك' },
  { icon: <FileCheck className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'نتائج فورية', desc: 'احصل على تحليل كامل لسيرتك الذاتية في ثوانٍ' },
  { icon: <Zap className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دقة عالية', desc: 'نسبة دقة تصل إلى 95% في استخراج المهارات والمطابقة' },
];

export default function WhySection() {
  return (
    <div className="py-20 relative overflow-hidden" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-20 relative z-10"
      >
        <h3 className="font-bold mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#ffffff' }}>
          لماذا Match Hire؟
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
          كل ما تحتاجه لتطوير مسيرتك المهنية في مكان واحد
        </p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-10">
        {/* The central vertical line */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute right-4 md:right-1/2 top-0 w-1 bg-gradient-to-b from-primary/80 via-blue-500/50 to-transparent rounded-full transform md:translate-x-1/2"
        />

        <div className="space-y-12 md:space-y-24">
          {whyItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`relative flex flex-col items-center justify-between group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Node on the central line */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                  className="absolute right-4 md:right-1/2 w-8 h-8 rounded-full bg-[#0a0c16] border-4 border-primary z-20 transform translate-x-[14px] md:translate-x-1/2 shadow-[0_0_15px_rgba(79,142,247,0.5)]"
                />

                {/* Content Card */}
                <div className="w-full md:w-[45%] flex">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="w-full mr-12 md:mr-0 p-6 md:p-8 rounded-3xl relative overflow-hidden transition-all border border-white/10"
                    style={{
                      background: 'rgba(15, 20, 35, 0.6)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Decorative glow inside the card */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" 
                        style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)' }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                        <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty space for the other half on desktop */}
                <div className="hidden md:block w-[45%]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
