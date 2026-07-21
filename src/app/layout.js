'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-800 antialiased`}>
        <AuthProvider>
          {!isDashboard && <Navbar />}
          <main>{children}</main>
          {!isDashboard && <Footer />}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}