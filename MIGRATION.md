# Next.js Migration Guide

This document describes the migration from Vite + React to Next.js 15 with App Router.

## Project Structure

```
e:\New folder/
├── src/
│   ├── app/
│   │   ├── components/          # All React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Login.tsx       # Client Component
│   │   │   ├── LandingPage.tsx # Client Component
│   │   │   ├── CVUpload.tsx    # Client Component
│   │   │   ├── Dashboard.tsx   # Client Component
│   │   │   ├── Navbar.tsx      # Client Component
│   │   │   ├── Footer.tsx      # Server Component
│   │   │   ├── DarkVeil.tsx    # Client Component
│   │   │   └── CardNav.tsx     # Client Component
│   │   ├── figma/              # Figma exports
│   │   ├── globals.css         # Global styles with Tailwind
│   │   ├── layout.tsx          # Root layout with ThemeProvider
│   │   ├── page.tsx            # Home page (/)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page (/login)
│   │   ├── upload/
│   │   │   └── page.tsx        # Upload page (/upload)
│   │   └── dashboard/
│   │       └── page.tsx        # Dashboard page (/dashboard)
│   └── styles/
│       ├── fonts.css
│       ├── theme.css
│       └── tailwind.css
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## Key Changes

### 1. Routing
- **Before**: State-based routing with `useState` in App.tsx
- **After**: File-based routing using Next.js App Router
  - `/` → `src/app/page.tsx`
  - `/login` → `src/app/login/page.tsx`
  - `/upload` → `src/app/upload/page.tsx`
  - `/dashboard` → `src/app/dashboard/page.tsx`

### 2. Navigation
- **Before**: `onNavigate('screen')` callback
- **After**: `next/link` for client-side navigation and `useRouter` hook for programmatic navigation

### 3. Components
- Added `'use client'` directive to components that use:
  - React hooks (useState, useEffect, useRef)
  - Event handlers (onClick, onChange)
  - Browser APIs (window, document)
  - Animation libraries (framer-motion, gsap)
- Server Components (no 'use client'):
  - Footer (static content with next/link)

### 4. Layout
- Created `src/app/layout.tsx` as the root layout
- Includes:
  - ThemeProvider (next-themes)
  - DarkVeil background
  - Navbar
  - Footer
- All pages share this layout automatically

### 5. Styling
- Tailwind CSS configured for Next.js
- Global styles in `src/app/globals.css`
- All existing Tailwind classes preserved
- Theme CSS imported from `src/styles/theme.css`

### 6. SEO
- Added metadata API in layout.tsx and individual pages
- Each route has its own title and description

### 7. Dependencies
- Added Next.js 15.1.6
- Added framer-motion (replaced 'motion' package)
- Added tailwindcss-animate
- Removed Vite dependencies
- Removed react-router (not needed with Next.js routing)

## Running the Project

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Environment Variables

Create a `.env.local` file for environment-specific variables:
```bash
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Dynamic Routes

To add dynamic routes (e.g., `/jobs/[id]`):
1. Create folder: `src/app/jobs/[id]/`
2. Add `page.tsx` that receives `params` prop:
```typescript
export default function JobPage({ params }: { params: { id: string } }) {
  return <div>Job ID: {params.id}</div>
}
```

## Data Fetching

### Server Components (Recommended)
```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.name}</div>
}
```

### Client Components
```typescript
'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData)
  }, [])
  
  return <div>{data?.name}</div>
}
```

## Images

Use Next.js Image component for optimization:
```typescript
import Image from 'next/image'

<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
```

## Notes

- The project maintains RTL (right-to-left) direction for Arabic content
- Dark theme is forced by default
- All animations and effects are preserved
- The UI design remains identical to the original Vite version
