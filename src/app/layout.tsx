import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NoCode UI Builder',
  description: 'A no-code UI builder for creating web interfaces with drag-and-drop',
  keywords: ['nocode', 'ui builder', 'drag and drop', 'web builder'],
  authors: [{ name: 'NoCode UI Builder Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
