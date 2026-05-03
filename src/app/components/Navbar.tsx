import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Home, LogIn, UploadCloud, BrainCircuit, LayoutDashboard, Target, UserPlus } from 'lucide-react';
import CardNav from './CardNav';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navbar({ currentScreen, onNavigate }: NavbarProps) {
  
  const navItems = useMemo(() => [
    {
      label: "المنصة",
      bgColor: "rgba(20, 20, 30, 0.5)",
      textColor: "#fff",
      links: [
        { label: "الرئيسية", onClick: () => onNavigate('landing'), ariaLabel: "الرئيسية", icon: <Home size={18} /> },
        { label: currentScreen === 'login' ? "حساب جديد" : "تسجيل الدخول", onClick: () => onNavigate('login'), ariaLabel: "تسجيل الدخول", icon: currentScreen === 'login' ? <UserPlus size={18} /> : <LogIn size={18} /> }
      ]
    },
    {
      label: "خدماتنا", 
      bgColor: "rgba(20, 20, 30, 0.5)",
      textColor: "#fff",
      links: [
        { label: "رفع سيرة ذاتية", onClick: () => onNavigate('upload'), ariaLabel: "رفع سيرة ذاتية", icon: <UploadCloud size={18} /> },
        { label: "تحليل المهارات", onClick: () => onNavigate('upload'), ariaLabel: "تحليل المهارات", icon: <BrainCircuit size={18} /> }
      ]
    },
    {
      label: "حسابي",
      bgColor: "rgba(20, 20, 30, 0.5)", 
      textColor: "#fff",
      links: [
        { label: "لوحة التحكم", onClick: () => onNavigate('dashboard'), ariaLabel: "لوحة التحكم", icon: <LayoutDashboard size={18} /> },
        { label: "توصيات الوظائف", onClick: () => onNavigate('dashboard'), ariaLabel: "توصيات الوظائف", icon: <Target size={18} /> }
      ]
    }
  ], [currentScreen, onNavigate]);

  const VideoLogo = (
    <div style={{
      width: 38, height: 38, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
      boxShadow: '0 4px 12px rgba(79,142,247,0.3)',
      background: 'rgba(79,142,247,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <video
        src="/images/hero%20logo.mp4"
        autoPlay loop muted playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <CardNav
        logo={
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            {VideoLogo}
            <span style={{
              fontWeight: 700, fontSize: '1.15rem',
              background: 'linear-gradient(135deg,#fff,#4f8ef7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Match Hire
            </span>
          </div>
        }
        items={navItems}
        baseColor="rgba(10, 10, 15, 0.6)"
        menuColor="#ffffff"
        buttonBgColor="#4f8ef7"
        buttonTextColor="#ffffff"
        ease="power3.out"
        ctaText="ابدأ الآن"
        onCtaClick={() => onNavigate('upload')}
      />
    </motion.div>
  );
}
