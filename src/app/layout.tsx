import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Chatbot from '@/components/layout/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MarroAI - Advanced Hematological Analysis Platform',
  description: 'AI-powered platform for detecting and managing aplastic anemia and bone marrow-related diseases',
  keywords: 'hematology, aplastic anemia, bone marrow, medical AI, blood disorders',
  authors: [{ name: 'MarrowAI Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 pt-20 p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Chatbot />
        </div>
      </body>
    </html>
  );
}
