'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const inputClassName =
  'w-full px-4 py-3.5 text-base sm:text-sm bg-background border border-input rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-colors shadow-sm';

export function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.ok) {
          toast.success('تم تسجيل الدخول بنجاح!');
          router.push('/dashboard');
          router.refresh();
        } else {
          toast.error('خطأ في تسجيل الدخول. يرجى التأكد من البيانات.');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'حدث خطأ أثناء إنشاء الحساب');
        }

        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ في العملية. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col lg:flex-row relative overflow-hidden bg-background mt-16" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-6 left-6 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:p-12 z-10 relative w-full">
        <Link href="/" className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 flex items-center justify-center rounded-2xl mx-auto mb-4 sm:mb-6 shadow-inner border border-primary/20">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary" aria-hidden />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-foreground leading-tight">
              {isLogin ? 'مرحباً بعودتك' : 'ابدأ رحلتك المهنية'}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {isLogin
                ? 'أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك'
                : 'أنشئ حساباً جديداً للبدء في تحليل سيرتك الذاتية'}
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-2xl border border-border shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8">
            {/* Google OAuth button */}
            <button
              type="button"
              onClick={() => { window.location.href = '/api/ExternalAuth/google-login'; }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 mb-5 rounded-xl border border-border bg-background hover:bg-accent active:scale-[0.98] transition-all duration-200 text-sm font-medium text-foreground shadow-sm"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.92-2.75 3.48-4.51 6.76-4.51z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.6z"/>
                <path fill="#FBBC05" d="M5.24 14.55c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 6.98C.5 8.78 0 10.78 0 12.92s.5 4.14 1.39 5.94l3.85-3.31z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.28 0-5.84-2.16-6.76-4.91L1.39 16.7C3.37 20.63 7.35 23 12 23z"/>
              </svg>
              {isLogin ? 'تسجيل الدخول باستخدام Google' : 'التسجيل باستخدام Google'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">أو</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">الاسم بالكامل</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أحمد محمد"
                      className={inputClassName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={inputClassName}
                  dir="ltr"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">كلمة المرور</label>
                  {isLogin && (
                    <Link href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={inputClassName}
                  dir="ltr"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="btn-primary w-full py-3.5 sm:py-4 mt-1 sm:mt-2 touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                    <span>جاري المعالجة...</span>
                  </span>
                ) : (
                  <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</span>
                )}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', name: '' });
                  }}
                  className="font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline touch-manipulation"
                >
                  {isLogin ? 'سجل الآن' : 'قم بتسجيل الدخول'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Side Panel */}
      <div className="hidden lg:flex flex-1 relative bg-zinc-950 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 opacity-50 z-0" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-lg p-12"
        >
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            بياناتك محمية بأعلى معايير التشفير
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            حلل مسيرتك، <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
              واكتشف إمكانياتك
            </span>
          </h2>

          <p className="text-lg text-white/60 mb-10 leading-relaxed">
            منصة متكاملة مدعومة بالذكاء الاصطناعي لفهم مهاراتك بشكل أعمق ومطابقتها مع أفضل الفرص في سوق العمل بخطوات بسيطة.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-sm text-white/50">دقة تحليل المهارات</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-1">+50K</div>
              <div className="text-sm text-white/50">وظيفة متاحة للمطابقة</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

