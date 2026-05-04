'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Brain, Target, FileCheck, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const features = [
  { icon: <Upload size={24} />, title: 'رفع السيرة الذاتية', desc: 'ارفع سيرتك الذاتية بصيغة PDF أو Word واحصل على تحليل فوري ودقيق' },
  { icon: <Brain size={24} />, title: 'استخراج المهارات', desc: 'تحليل ذكي لاستخراج المهارات التقنية والشخصية من سيرتك الذاتية' },
  { icon: <Target size={24} />, title: 'مطابقة الوظائف', desc: 'احصل على توصيات وظيفية مخصصة بناءً على مهاراتك وخبراتك' },
  { icon: <FileCheck size={24} />, title: 'تقارير احترافية', desc: 'احصل على تقارير مفصلة تساعدك في تحسين نقاط الضعف في سيرتك الذاتية' },
  { icon: <TrendingUp size={24} />, title: 'تتبع التقديمات', desc: 'تابع حالة تقديماتك للوظائف المختلفة في مكان واحد وبسهولة تامة' },
  { icon: <Users size={24} />, title: 'نصائح مهنية', desc: 'احصل على نصائح مخصصة لتحسين ملفك الشخصي وزيادة فرص قبولك' },
];

export default function FeatureSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: 'rtl', align: 'center', skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-7xl mx-auto mb-32 group">
      {/* ── Carousel Wrapper ──────────────── */}
      <div className="overflow-hidden px-4 py-12" ref={emblaRef}>
        <div className="flex -ml-6">
          {features.map((item, i) => {
            const isActive = selectedIndex === i;
            return (
              <div 
                key={i} 
                className="flex-[0_0_100%] md:flex-[0_0_40%] lg:flex-[0_0_31%] pl-6 min-w-0 transition-all duration-500"
                style={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.92 }}
              >
                <div 
                  className={`relative h-full p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                    isActive 
                      ? 'bg-[#090b1a]/80 border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                  style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                  {/* Active glow effect */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] pointer-events-none rounded-full"
                      />
                    )}
                  </AnimatePresence>

                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {item.icon}
                  </div>

                  <h3 className={`text-xl font-bold mb-4 transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {item.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-white/60' : 'text-white/30'}`}>
                    {item.desc}
                  </p>

                  {/* Decorative corner element */}
                  <div className={`absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 transition-opacity duration-500 ${
                    isActive ? 'border-primary/20 opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Controls ──────────────────────── */}
      <div className="flex items-center justify-center gap-10 mt-8">
        <button 
          onClick={scrollNext} // In RTL, next moves right (which is prev logically in Embla)
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-90"
        >
          <ChevronRight size={24} />
        </button>

        {/* Progress Dots */}
        <div className="flex gap-2.5">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selectedIndex === i ? 'w-8 bg-primary' : 'w-2 bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
