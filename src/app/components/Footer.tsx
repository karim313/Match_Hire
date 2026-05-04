'use client'

import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, Send, Brain } from 'lucide-react';

const socialHoverCss = `.social-link:hover { background: rgba(79,142,247,0.1) !important; border-color: rgba(79,142,247,0.3) !important; }`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/5 overflow-hidden">
      <style>{socialHoverCss}</style>
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(79,142,247,0.4), rgba(139,92,246,0.3), transparent)',
        }}
      />
      {/* Background tint */}
      <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-md pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Brand ─────────────────────────── */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)', boxShadow: '0 4px 16px rgba(79,142,247,0.3)' }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Match<span style={{ color: '#4f8ef7' }}>Hire</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              منصة ذكاء اصطناعي تساعدك تلاقي شغلك المناسب بناءً على مهاراتك الحقيقية — مش بس الـ CV.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Github, href: '#', label: 'GitHub' },
                { Icon: Mail, href: '#', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-link w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4 text-white/40" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────── */}
          <div>
            <h3 className="text-white/80 font-semibold mb-5 text-sm uppercase tracking-widest">المنصة</h3>
            <ul className="space-y-3">
              {[
                { label: 'الرئيسية', href: '/' },
                { label: 'تحليل CV', href: '/upload' },
                { label: 'لوحة التحكم', href: '/dashboard' },
                { label: 'تسجيل الدخول', href: '/login' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About ─────────────────────────── */}
          <div>
            <h3 className="text-white/80 font-semibold mb-5 text-sm uppercase tracking-widest">عن المنصة</h3>
            <ul className="space-y-3">
              {[
                { label: 'كيف تعمل؟', href: '#' },
                { label: 'سياسة الخصوصية', href: '#' },
                { label: 'شروط الاستخدام', href: '#' },
                { label: 'تواصل معنا', href: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-white/80 font-semibold text-sm uppercase tracking-widest">ابقَ على اطلاع</h3>
            <p className="text-white/35 text-sm leading-relaxed">
              اشترك واحصل على أحدث فرص العمل ونصايح التوظيف على طول.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full h-11 rounded-xl px-4 pr-4 pl-12 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(79,142,247,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                aria-label="اشتراك"
                className="absolute left-1.5 top-1.5 h-8 w-8 rounded-lg flex items-center justify-center transition-all bg-primary hover:scale-110 active:scale-95 shadow-[0_4px_12px_rgba(79,142,247,0.3)]"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ────────────────────────── */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-white/25 text-xs">
            © {year} MatchHire · صُنع بـ ❤️ في مصر
          </p>
          <div className="flex items-center gap-6">
            {['سياسة الخصوصية', 'شروط الاستخدام'].map(label => (
              <Link key={label} href="#" className="text-white/25 hover:text-white/60 text-xs transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
