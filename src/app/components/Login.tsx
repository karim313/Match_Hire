'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Chrome, Apple, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export function Login() {
  const router = useRouter();
  const { login: setAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await authService.login({
          email: formData.email,
          password: formData.password
        });

        if (res.token) {
          setAuth(res.token, res.user);
          toast.success('تم تسجيل الدخول بنجاح!');
          router.push('/dashboard');
        } else {
          toast.error('خطأ في تسجيل الدخول. يرجى التأكد من البيانات.');
        }
      } else {
        const res = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'حدث خطأ في العملية. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative" dir="rtl">
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10" />
            
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                Match Hire
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium">الاسم بالكامل</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded bg-white/5 border-white/10 text-primary focus:ring-primary/50" />
                    <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">تذكرني</span>
                  </label>
                  <button type="button" className="text-xs text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-transparent text-muted-foreground">أو</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                <Chrome className="w-5 h-5" />
                <span className="text-sm">متابعة مع Google</span>
              </button>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                <Apple className="w-5 h-5" />
                <span className="text-sm">متابعة مع Apple</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              {isLogin ? (
                <p className="text-muted-foreground">
                  ليس لديك حساب؟{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary font-medium hover:underline"
                  >
                    سجل الآن
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  لديك حساب بالفعل؟{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary font-medium hover:underline"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-800 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="mb-4" style={{ fontSize: '2.5rem' }}>
            مهندس مسيرتك المهنية
          </h2>
          <p className="text-lg opacity-90 mb-8">
            منصة ذكية مدعومة بالذكاء الاصطناعي لتحليل السيرة الذاتية واستخراج المهارات ومطابقة الوظائف
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>تحليل ذكي للسيرة الذاتية</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>استخراج المهارات تلقائياً</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                ✓
              </div>
              <span>مطابقة الوظائف الأمثل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
