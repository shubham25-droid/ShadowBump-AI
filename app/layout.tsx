import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ShadowBump AI — Catch Behavioral Changes Before Production',
  description: 'AI-assisted differential testing engine for software dependencies. Detect breaking changes across runtime versions using parallel sandboxes and NVIDIA Nemotron via Nebius.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#101115] text-[#f9fafb] selection:bg-zinc-700 selection:text-white relative">
        {/* Ambient Top Subtle Grey Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-silver-glow pointer-events-none -z-10 blur-3xl opacity-60" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
