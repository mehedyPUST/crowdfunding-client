import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthProvider } from './context/AuthContext';
import ChatBot from './components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CrowdFund - Fuel Your Ideas',
  description: 'Crowdfunding platform to turn ideas into reality',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-800 antialiased`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster position="top-right" />
        <ChatBot />
      </body>
    </html>
  );
}