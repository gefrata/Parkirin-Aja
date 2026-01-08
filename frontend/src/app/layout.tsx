import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Parking Ticket System',
  description: 'Sistem pemesanan tiket parkir yang efektif',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
