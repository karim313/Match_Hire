import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './components/Providers'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Match Hire - تحليل السيرة الذاتية ومطابقة الوظائف',
  description: 'منصة متقدمة لتحليل السيرة الذاتية ومطابقة الوظائف باستخدام الذكاء الاصطناعي لتمكين مستقبلك المهني.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="relative flex flex-col min-h-screen text-foreground font-sans" style={{ zIndex: 1 }}>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
