import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ShadowBump AI — Catch Behavioral Changes Before Production',
  description: 'A developer tool for detecting silent behavioral changes and regressions caused by software dependency upgrades using twin-environment differential testing and NVIDIA open-source models via Nebius.',
  keywords: ['differential testing', 'software dependencies', 'regression detection', 'Nebius', 'NVIDIA', 'Zod migration', 'developer tools'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-sky-500/20 selection:text-sky-300">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
