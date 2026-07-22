import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-loading-skeleton/dist/skeleton.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}