import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import './globals.css';

// Google Fontsの読み込み
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// メタデータ設定
export const metadata: Metadata = {
  title: {
    default: 'NoCode UI Builder - ドラッグ&ドロップでUIを作成',
    template: '%s | NoCode UI Builder',
  },
  description:
    'プログラミング不要でWebUIを作成できるノーコードビルダー。ドラッグ&ドロップで直感的にデザイン、HTMLとして出力可能。',
  keywords: [
    'ノーコード',
    'UIビルダー',
    'ドラッグアンドドロップ',
    'Webデザイン',
    'プロトタイピング',
    'NoCode',
  ],
  authors: [{ name: 'NoCode UI Builder Team' }],
  creator: 'NoCode UI Builder',
  publisher: 'NoCode UI Builder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nocode-ui-builder.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://nocode-ui-builder.vercel.app',
    title: 'NoCode UI Builder',
    description: 'プログラミング不要でWebUIを作成できるノーコードビルダー',
    siteName: 'NoCode UI Builder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoCode UI Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoCode UI Builder',
    description: 'プログラミング不要でWebUIを作成できるノーコードビルダー',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        {/* メインコンテンツ */}
        <main className="flex-1 bg-gray-50">
          {children}
        </main>

        {/* フッター */}
        <ConditionalFooter />

        {/* Google Analytics (オプション) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
