import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'
import { Providers } from './components/Providers'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

const tajawal = Tajawal({ 
  subsets: ['arabic'], 
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Match Hire - تحليل السيرة الذاتية ومطابقة الوظائف',
  description: 'منصة متقدمة لتحليل السيرة الذاتية ومطابقة الوظائف باستخدام الذكاء الاصطناعي لتمكين مستقبلك المهني.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className={`${tajawal.className} antialiased`} suppressHydrationWarning>
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
