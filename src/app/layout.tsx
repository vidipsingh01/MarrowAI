import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthLayout from '@/components/layout/AuthLayout';
import { UIProvider } from '@/context/UIContext';  
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MarrowAI - Advanced Hematological Analysis Platform',
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
        <AuthProvider>
          <UIProvider>
          <AuthLayout>
            {children}
          </AuthLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
