import { Upload, Brain, Target, TrendingUp, Users, FileCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import TextType from './TextType';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  {
    icon: <Upload className="w-7 h-7" style={{ color: '#4f8ef7' }} />,
    title: 'رفع السيرة الذاتية',
    desc: 'ارفع سيرتك الذاتية بصيغة PDF أو Word واحصل على تحليل فوري ودقيق',
  },
  {
    icon: <Brain className="w-7 h-7" style={{ color: '#4f8ef7' }} />,
    title: 'استخراج المهارات',
    desc: 'تحليل ذكي لاستخراج المهارات التقنية والشخصية من سيرتك الذاتية',
  },
  {
    icon: <Target className="w-7 h-7" style={{ color: '#4f8ef7' }} />,
    title: 'مطابقة الوظائف',
    desc: 'احصل على توصيات وظيفية مخصصة بناءً على مهاراتك وخبراتك',
  },
];

const whyItems = [
  { icon: <TrendingUp className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'تحليل متقدم', desc: 'خوارزميات ذكاء اصطناعي متطورة لتحليل دقيق وشامل' },
  { icon: <Users className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دعم شامل', desc: 'فريق دعم متخصص متاح على مدار الساعة لمساعدتك' },
  { icon: <FileCheck className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'نتائج فورية', desc: 'احصل على تحليل كامل لسيرتك الذاتية في ثوانٍ' },
  { icon: <Zap className="w-6 h-6" style={{ color: '#4f8ef7' }} />, title: 'دقة عالية', desc: 'نسبة دقة تصل إلى 95% في استخراج المهارات والمطابقة' },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="w-full text-white">
      {/* ── Hero ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.3)' }}
          >
            <Zap className="w-4 h-4" />
            مدعوم بالذكاء الاصطناعي
          </motion.div>

          <div className="mb-10 text-center" style={{ minHeight: '200px' }}>
            <TextType 
              as="h2"
              className="font-bold leading-tight"
              style={{ fontSize: '3.5rem', color: '#ffffff', whiteSpace: 'pre-wrap' }}
              text={[
                "هندس مسيرتك المهنية بالذكاء الاصطناعي\n\nمنصة متقدمة لتحليل السيرة الذاتية بدقة عالية.",
                "اكتشف مستقبلك الوظيفي بالذكاء الاصطناعي\n\nاستخرج مهاراتك التقنية بدقة وسرعة فائقة.",
                "طور مسارك المهني بالذكاء الاصطناعي\n\nاحصل على توصيات وظيفية مخصصة لخبراتك.",
                "عزز فرصك الوظيفية بالذكاء الاصطناعي\n\nاكتشف إمكانياتك الحقيقية في سوق العمل.",
                "ابنِ سيرة ذاتية لا تُقهر بالذكاء الاصطناعي\n\nحقق حلمك المهني بخطوات ذكية ومدروسة."
              ]}
              typingSpeed={40}
              deletingSpeed={20}
              pauseDuration={2500}
              showCursor={true}
              cursorCharacter="|"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('upload')}
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: '#4f8ef7',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(79,142,247,0.35)',
              }}
            >
              ابدأ التحليل المجاني
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 rounded-xl text-lg font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              تسجيل الدخول
            </button>
          </div>
        </motion.div>

        {/* ── Feature Cards ─────────────────── */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1 + i * 0.1)}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group p-7 rounded-2xl cursor-default"
              style={{
                background: 'rgba(20,20,30,0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: 'rgba(79,142,247,0.15)' }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#ffffff' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Stats Banner ──────────────────── */}
        <motion.div
          {...fadeUp(0.3)}
          className="rounded-2xl p-12 mb-20 text-white"
          style={{ 
            background: 'rgba(20,20,30,0.6)', 
            border: '1px solid rgba(79,142,247,0.2)',
            backdropFilter: 'blur(24px)',
            boxShadow: 'inset 0 0 40px rgba(79,142,247,0.1)'
          }}
        >
          <div className="text-center mb-12">
            <h3 className="mb-3 font-bold" style={{ fontSize: '2.2rem' }}>إحصائيات منصتنا</h3>
            <p className="text-lg" style={{ opacity: 0.85 }}>أرقام تعكس ثقة عملائنا ونجاحهم المهني</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { val: '500K+', label: 'سيرة ذاتية محللة' },
              { val: '95%', label: 'نسبة الدقة' },
              { val: '50K+', label: 'وظيفة متاحة' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(0.1 + i * 0.08)} className="text-center">
                <div className="font-bold mb-1" style={{ fontSize: '3rem' }}>{s.val}</div>
                <div style={{ opacity: 0.85 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Why Match Hire ────────────────── */}
        <motion.div {...fadeUp(0.2)} className="text-center mb-4">
          <h3 className="font-bold mb-2" style={{ fontSize: '2rem', color: '#ffffff' }}>
            لماذا Match Hire؟
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>كل ما تحتاجه لتطوير مسيرتك المهنية في مكان واحد</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mt-10 max-w-4xl mx-auto mb-8">
          {whyItems.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.15 + i * 0.1)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex items-start gap-4 p-6 rounded-2xl text-right"
              style={{
                background: 'rgba(20,20,30,0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(79,142,247,0.15)' }}
              >
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#ffffff' }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
