'use client'

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Home, LogIn, UploadCloud, LayoutDashboard, LogOut, Brain } from 'lucide-react';
import CardNav from './CardNav';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const navItems = useMemo(() => {
    const items = [
      {
        label: "عام",
        bgColor: "rgba(20, 20, 30, 0.5)",
        textColor: "#fff",
        links: [
          { label: "الرئيسية", href: "/", ariaLabel: "الرئيسية", icon: <Home size={18} /> },
          session ? 
            { label: "تسجيل الخروج", onClick: () => signOut({ callbackUrl: '/login' }), ariaLabel: "تسجيل الخروج", icon: <LogOut size={18} /> } :
            { label: "تسجيل الدخول", href: "/login", ariaLabel: "تسجيل الدخول", icon: <LogIn size={18} /> }
        ]
      },
      {
        label: "خدماتي", 
        bgColor: "rgba(20, 20, 30, 0.5)",
        textColor: "#fff",
        links: [
          { label: "رفع سيرة ذاتية", href: "/upload", ariaLabel: "رفع سيرة ذاتية", icon: <UploadCloud size={18} /> },
          { label: "لوحة التحكم", href: "/dashboard", ariaLabel: "لوحة التحكم", icon: <LayoutDashboard size={18} /> }
        ]
      }
    ];
    return items;
  }, [pathname, session]);

  const LogoIcon = (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)',
      boxShadow: '0 4px 14px rgba(79,142,247,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Brain size={18} color="#fff" />
    </div>
  );

  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <CardNav
        logo={
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            {LogoIcon}
            <span style={{
              fontWeight: 700, fontSize: '1.15rem',
              background: 'linear-gradient(135deg,#fff,#4f8ef7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Match Hire
            </span>
          </Link>
        }
        items={navItems}
        baseColor="rgba(10, 10, 15, 0.6)"
        menuColor="#ffffff"
        buttonBgColor="#4f8ef7"
        buttonTextColor="#ffffff"
        ease="power3.out"
        ctaText="ابدأ الآن"
        ctaHref="/upload"
      />
    </motion.div>
  );
}
