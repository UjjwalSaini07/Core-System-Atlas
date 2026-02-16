import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Core System Atlas',
    template: '%s · Core System Atlas',
  },
  description: 'Core System Atlas is an interactive system design and observability tool showcasing a full-text search engine, distributed LRU cache, and file storage with real-time analytics.',
  applicationName: 'Core System Atlas',
  keywords: [
    'system design',
    'search engine',
    'LRU cache',
    'distributed systems',
    'full-text search',
    'indexing',
    'observability',
    'performance monitoring',
    'backend architecture',
    'system simulator',
  ],
  authors: [
    { name: 'UjjwalS', url: 'https://www.ujjwalsaini.dev/' },
  ],
  creator: 'UjjwalS',
  generator: 'Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#F8FAFC',

  openGraph: {
    type: 'website',
    title: 'Core System Atlas',
    description:
      'Explore and visualize core backend systems including search, caching, and storage with real-time metrics.',
    siteName: 'Core System Atlas',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Core System Atlas',
    description:
      'An interactive system design and analytics platform for search engines, caches, and storage layers.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
