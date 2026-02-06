import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata = {
  title: 'Scalable Systems Simulator',
  description:
    'Interactive system design tool featuring search engine, distributed cache, and file storage',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
