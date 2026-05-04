'use client'

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';

const TextType = dynamic(() => import('./TextType'), { ssr: false });
const FeatureSlider = dynamic(() => import('./FeatureSlider'), { ssr: false });
const WhySection = dynamic(() => import('./WhySection'), { ssr: false });

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="w-full text-white">
      {/* ── Hero ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto mb-16 mt-4">
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

          <div className="mb-10 text-center" style={{ minHeight: '180px' }}>
            <Suspense fallback={<div className="h-[180px]" />}>
              <TextType 
                as="h2"
                className="font-bold leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', color: '#ffffff', whiteSpace: 'pre-wrap' }}
                text={[
                  "حمّل CV بتاعك دلوقتي\n\nوشوف إنت مناسب لإيه بالظبط.",
                  "مهاراتك أكتر مما بتفتكر\n\nاحنا بنوريلك الصورة كاملة.",
                  "متقدمش على أي وظيفة عشوائي\n\nخلّي الـ AI يختارلك الأنسب.",
                  "مستقبلك المهني بيبدأ من هنا\n\nابدأ دلوقتي ومجاناً."
                ]}
                typingSpeed={40}
                deletingSpeed={55}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
              />
            </Suspense>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/upload')}
              className="btn-primary text-lg"
            >
              ابدأ التحليل المجاني
            </button>
            <button
              onClick={() => router.push(session ? '/dashboard' : '/login')}
              className="btn-secondary text-lg"
            >
              {session ? 'لوحة التحكم' : 'تسجيل الدخول'}
            </button>
          </div>
        </motion.div>

        {/* ── Feature Slider ─────────────────── */}
        <Suspense fallback={<div className="h-40" />}>
          <FeatureSlider />
        </Suspense>

        {/* ── Why Match Hire ────────────────── */}
        <Suspense fallback={<div className="h-40" />}>
          <WhySection />
        </Suspense>
      </section>
    </div>
  );
}
