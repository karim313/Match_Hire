# Match Hire - AI-Powered Resume Analysis Platform

Match Hire is a production-ready Next.js application designed to analyze resumes, extract skills, and match candidates with the most relevant job opportunities using Artificial Intelligence.

## 🚀 Features

- **Modern UI/UX**: Premium glassmorphic design with smooth GSAP and Framer Motion animations.
- **AI Analysis**: Intelligent skill extraction and job matching (Mocked).
- **Secure Authentication**: Integrated with **NextAuth.js** for robust session management.
- **Robust Error Handling**: Centralized error management and user-friendly notifications via **Sonner**.
- **Performance Optimized**: 
  - Dynamic imports for heavy components.
  - Optimized asset loading.
  - Server-side rendering where applicable.
- **API Proxy Layer**: Secure data fetching layer using **Axios**.
- **Responsive Design**: Fully functional across all devices (Mobile, Tablet, Desktop).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/), [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/match-hire.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   NEXT_PUBLIC_API_URL=/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js App Router (Pages, API Routes).
- `src/components`: Reusable UI components.
- `src/lib`: Shared utilities, auth configuration, and API proxy.
- `public`: Static assets (Videos, Images).

## 🛡️ Authentication

The project uses NextAuth for authentication. Current mock credentials:
- **Email**: `admin@matchhire.com`
- **Password**: `password123`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.