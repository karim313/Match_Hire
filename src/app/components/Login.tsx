import { useState } from 'react';
import { Chrome, Apple } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface LoginProps {
  onNavigate: (screen: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex relative" dir="rtl">
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-lg p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-2" style={{ fontSize: '2rem', color: '#0056D2', fontWeight: 'bold' }}>
                Match Hire
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
              </p>
            </div>

            <form className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-2">الاسم بالكامل</label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2">كلمة المرور</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">تذكرني</span>
                  </label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">أو</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-accent transition-colors">
                <Chrome className="w-5 h-5" />
                <span>متابعة مع Google</span>
              </button>
              <button className="w-full py-3 border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-accent transition-colors">
                <Apple className="w-5 h-5" />
                <span>متابعة مع Apple</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              {isLogin ? (
                <p>
                  ليس لديك حساب؟{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:underline"
                  >
                    سجل الآن
                  </button>
                </p>
              ) : (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline"
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
