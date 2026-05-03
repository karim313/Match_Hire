import { useState } from 'react';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { CVUpload } from './components/CVUpload';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import DarkVeil from './components/DarkVeil';

type Screen = 'login' | 'landing' | 'upload' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }} dir="rtl" className="dark">
      {/* Background layer: z=0, fixed behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <DarkVeil hueShift={-20} speed={0.4} noiseIntensity={0.03} />
      </div>
      {/* Page content: z=1, sits above blobs */}
      <div className="relative flex flex-col min-h-screen text-foreground font-sans" style={{ zIndex: 1 }}>
        {/* Single unified Navbar — always visible */}
        <Navbar currentScreen={currentScreen} onNavigate={handleNavigate} />
        <main className="flex-grow">
          {currentScreen === 'login'     && <Login     onNavigate={handleNavigate} />}
          {currentScreen === 'landing'   && <LandingPage onNavigate={handleNavigate} />}
          {currentScreen === 'upload'    && <CVUpload  onNavigate={handleNavigate} />}
          {currentScreen === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        </main>
        <Footer />
      </div>
    </div>
  );
}