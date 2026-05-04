import Link from 'next/link';
import { Twitter, Facebook, Linkedin, Github, Mail, Phone, MapPin, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-[#080b14]/80 backdrop-blur-2xl overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <video 
                src="/images/hero%20logo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-10 h-10 object-cover rounded-xl shadow-lg shadow-primary/20"
              />
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary/80">
                Match Hire
              </span>
            </div>
            <p className="text-white/50 text-[15px] leading-relaxed max-w-xs">
              المنصة الرائدة المدعومة بالذكاء الاصطناعي لتحليل السير الذاتية ومساعدة المحترفين في الوصول للوظيفة المثالية بدقة متناهية.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Github, href: '#' },
                { Icon: Facebook, href: '#' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <social.Icon className="w-4.5 h-4.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">المنصة</h3>
            <ul className="space-y-4">
              {[
                { label: 'الرئيسية', href: '/' },
                { label: 'تحليل السيرة', href: '/upload' },
                { label: 'لوحة التحكم', href: '/dashboard' },
                { label: 'اكتشاف الوظائف', href: '/upload' }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-white/50 hover:text-white hover:translate-x-[-4px] transition-all flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">الدعم والتواصل</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50">
                <MapPin className="w-5 h-5 text-primary/60 flex-shrink-0" />
                <span className="text-sm">الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <Phone className="w-5 h-5 text-primary/60 flex-shrink-0" />
                <span className="text-sm" dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <Mail className="w-5 h-5 text-primary/60 flex-shrink-0" />
                <span className="text-sm">support@matchhire.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">اشترك في النشرة</h3>
            <p className="text-white/40 text-sm">احصل على آخر نصائح التوظيف وأخبار سوق العمل مباشرة.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
              />
              <button className="absolute left-1.5 top-1.5 h-9 w-9 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/30 text-xs tracking-wide">
            © {new Date().getFullYear()} Match Hire. جميع الحقوق محفوظة. تم التطوير بكل ❤️
          </div>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-white/30 hover:text-white text-xs transition-colors">سياسة الخصوصية</Link>
            <Link href="#" className="text-white/30 hover:text-white text-xs transition-colors">شروط الاستخدام</Link>
            <Link href="#" className="text-white/30 hover:text-white text-xs transition-colors">ملفات التعريف</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
