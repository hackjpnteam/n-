'use client';

import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import Navigation from '@/components/common/Navigation'
import Footer from '@/components/common/Footer'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <AuthProvider>
          <Navigation />
          <main className="pt-16 flex-1">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}