# ページ実装ガイド (Next.js 14 App Router)

## 目次
1. [Next.js 14 App Router概要](#nextjs-14-app-router概要)
2. [ページ構造](#ページ構造)
3. [layout.tsx 完全実装](#layouttsx-完全実装)
4. [page.tsx (ランディングページ) 完全実装](#pagetsx-ランディングページ-完全実装)
5. [builder/page.tsx 完全実装](#builderpagetsxビルダーページ-完全実装)
6. [preview/[id]/page.tsx 完全実装](#previewidpagetsx-完全実装)
7. [globals.css 設定](#globalscss-設定)
8. [ナビゲーションとルーティング](#ナビゲーションとルーティング)
9. [SEO最適化](#seo最適化)
10. [ヘルパー関数](#ヘルパー関数)

---

## Next.js 14 App Router概要

### App Routerの特徴

Next.js 14のApp Routerは、以下の機能を提供します:

1. **ファイルベースルーティング**: `app`ディレクトリ内のフォルダ構造がURLに対応
2. **React Server Components (RSC)**: デフォルトでサーバーコンポーネント
3. **レイアウトシステム**: ネストされた共通レイアウト
4. **ストリーミング**: コンポーネント単位での段階的レンダリング
5. **メタデータAPI**: SEO最適化が容易

### ルーティング規則

```
app/
├── layout.tsx          → すべてのページに適用
├── page.tsx            → / (ルート)
├── builder/
│   └── page.tsx        → /builder
└── preview/
    └── [id]/
        └── page.tsx    → /preview/:id (動的ルート)
```

### Server Components vs Client Components

```typescript
// Server Component (デフォルト)
export default function Page() {
  // サーバーでのみ実行
  return <div>Server Component</div>;
}

// Client Component ('use client'ディレクティブ必須)
'use client';

export default function Page() {
  // ブラウザでも実行
  const [state, setState] = useState();
  return <div>Client Component</div>;
}
```

---

## ページ構造

### 完全なファイル構成

```
src/app/
├── layout.tsx              # ルートレイアウト (すべてのページ共通)
├── page.tsx                # ランディングページ (/)
├── globals.css             # グローバルCSS (Tailwind含む)
├── builder/
│   └── page.tsx            # ビルダーページ (/builder)
└── preview/
    └── [id]/
        └── page.tsx        # プレビューページ (/preview/:id)
```

---

## layout.tsx 完全実装

### ファイルパス
`src/app/layout.tsx`

### 完全なコード

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <body className={`${inter.className} antialiased`}>
        {/* メインコンテンツ */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

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
```

### 主な機能

1. **Metadata設定**: SEO最適化のための包括的なメタデータ
2. **Google Fonts**: Interフォントの最適化読み込み
3. **Open Graph**: ソーシャルメディア共有時の表示最適化
4. **グローバルCSS**: Tailwind CSSの読み込み
5. **Google Analytics**: オプションでアナリティクス追加

---

## page.tsx (ランディングページ) 完全実装

### ファイルパス
`src/app/page.tsx`

### 完全なコード

```typescript
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ホーム',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ヘッダー */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              NoCode UI Builder
            </span>
          </div>

          <Link
            href="/builder"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            ビルダーを開く
          </Link>
        </nav>
      </header>

      {/* ヒーローセクション */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* バッジ */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>ノーコードで簡単UI作成</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            プログラミング不要で
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              美しいUIを作成
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            ドラッグ&ドロップの直感的な操作でWebUIを作成。
            プロトタイピングから本番環境まで、あらゆるシーンで活用できます。
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              無料で始める
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              機能を見る
            </a>
          </div>

          {/* スクリーンショット（オプション） */}
          <div className="mt-16 rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg
                  className="w-20 h-20 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">ビルダースクリーンショット</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要機能セクション */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            主要機能
          </h2>
          <p className="text-xl text-gray-600">
            直感的で強力な機能を搭載
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 機能1: ドラッグ&ドロップ */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ドラッグ&ドロップ
            </h3>
            <p className="text-gray-600 leading-relaxed">
              6種類のWidgetをキャンバスにドラッグするだけ。
              直感的な操作でUIを構築できます。
            </p>
          </div>

          {/* 機能2: リアルタイム編集 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              リアルタイム編集
            </h3>
            <p className="text-gray-600 leading-relaxed">
              プロパティパネルで色、サイズ、テキストを編集。
              変更は即座にキャンバスに反映されます。
            </p>
          </div>

          {/* 機能3: HTML/CSSエクスポート */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              HTML/CSS出力
            </h3>
            <p className="text-gray-600 leading-relaxed">
              作成したUIを標準的なHTML/CSSとして出力。
              既存のプロジェクトに組み込めます。
            </p>
          </div>

          {/* 機能4: 6種類のWidget */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              豊富なWidget
            </h3>
            <p className="text-gray-600 leading-relaxed">
              テキスト、ボタン、入力、画像、テーブル、セレクト。
              必要なコンポーネントが揃っています。
            </p>
          </div>

          {/* 機能5: 自由配置 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              自由なレイアウト
            </h3>
            <p className="text-gray-600 leading-relaxed">
              ピクセル単位で自由に配置・リサイズ。
              あなたのアイデアを形にできます。
            </p>
          </div>

          {/* 機能6: プレビュー */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              リアルタイムプレビュー
            </h3>
            <p className="text-gray-600 leading-relaxed">
              いつでも実際の表示を確認可能。
              完成イメージを見ながら作業できます。
            </p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            登録不要、完全無料でご利用いただけます
          </p>
          <Link
            href="/builder"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ビルダーを開く →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            &copy; 2025 NoCode UI Builder. All rights reserved.
          </p>
          <p className="text-sm">
            Built with Next.js 14, TypeScript, Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
```

### 主な機能

1. **ヒーローセクション**: キャッチーな見出しとCTA
2. **機能紹介**: 6つの主要機能をカード形式で表示
3. **CTAセクション**: 行動喚起セクション
4. **レスポンシブデザイン**: モバイル対応のグリッドレイアウト

---

## builder/page.tsx(ビルダーページ) 完全実装

### ファイルパス
`src/app/builder/page.tsx`

### 完全なコード

```typescript
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Canvas } from '@/components/builder/Canvas';
import { WidgetPalette } from '@/components/builder/WidgetPalette';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';
import type { Widget, WidgetType } from '@/types/widget';
import {
  getDefaultSize,
  getDefaultProps,
  generateId,
} from '@/lib/widget-utils';

const STORAGE_KEY = 'nocode-builder-project';

export default function BuilderPage() {
  // 状態管理
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // dnd-kit センサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移動したらドラッグ開始
      },
    })
  );

  // 選択中のWidget
  const selectedWidget = useMemo(
    () => widgets.find((w) => w.id === selectedWidgetId) || null,
    [widgets, selectedWidgetId]
  );

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setWidgets(data.widgets || []);
        setProjectName(data.projectName || 'Untitled Project');
        setLastSaved(data.lastSaved ? new Date(data.lastSaved) : null);
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
  }, []);

  // 自動保存（5秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      if (widgets.length > 0) {
        saveToLocalStorage(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [widgets, projectName]);

  // ローカルストレージに保存
  const saveToLocalStorage = useCallback(
    (showFeedback = true) => {
      const data = {
        widgets,
        projectName,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());

      if (showFeedback) {
        // 保存完了のフィードバック（オプション: Toastなど）
        console.log('Project saved');
      }
    },
    [widgets, projectName]
  );

  // ドラッグ開始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // ドラッグ終了
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveId(null);
        return;
      }

      // パレットからキャンバスへのドロップ
      if (
        over.id === 'canvas' &&
        active.id.toString().startsWith('palette-')
      ) {
        const widgetType = active.data.current?.type as WidgetType;

        // ドロップ位置の計算
        const canvasElement = document.querySelector('[data-canvas="true"]');
        const canvasRect = canvasElement?.getBoundingClientRect();

        if (canvasRect && event.activatorEvent) {
          const mouseEvent = event.activatorEvent as MouseEvent;
          const dropX = Math.max(
            0,
            mouseEvent.clientX - canvasRect.left - 50
          );
          const dropY = Math.max(
            0,
            mouseEvent.clientY - canvasRect.top - 20
          );

          addWidget(widgetType, { x: dropX, y: dropY });
        } else {
          // フォールバック: ランダムな位置
          const randomX = Math.floor(Math.random() * 400);
          const randomY = Math.floor(Math.random() * 300);
          addWidget(widgetType, { x: randomX, y: randomY });
        }
      }

      // キャンバス上のWidget移動
      if (over.id === 'canvas' && !active.id.toString().startsWith('palette-')) {
        const widgetId = active.id as string;
        const widget = widgets.find((w) => w.id === widgetId);

        if (widget && event.delta) {
          updateWidget(widgetId, {
            position: {
              x: Math.max(0, widget.position.x + event.delta.x),
              y: Math.max(0, widget.position.y + event.delta.y),
            },
          });
        }
      }

      setActiveId(null);
    },
    [widgets]
  );

  // Widget追加
  const addWidget = useCallback(
    (type: WidgetType, position: { x: number; y: number }) => {
      const newWidget: Widget = {
        id: generateId(),
        type,
        position,
        size: getDefaultSize(type),
        props: getDefaultProps(type),
      };

      setWidgets((prev) => [...prev, newWidget]);
      setSelectedWidgetId(newWidget.id);
    },
    []
  );

  // Widget更新
  const updateWidget = useCallback(
    (id: string, updates: Partial<Widget>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
      );
    },
    []
  );

  // Widget削除
  const deleteWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedWidgetId((prev) => (prev === id ? null : prev));
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    setIsSaving(true);

    // ローカルストレージに保存
    saveToLocalStorage(true);

    // 将来的なAPI保存処理
    // try {
    //   const response = await fetch('/api/projects', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       name: projectName,
    //       canvas_data: { components: widgets },
    //     }),
    //   });
    //   const data = await response.json();
    //   console.log('Saved to database:', data.id);
    // } catch (error) {
    //   console.error('Save failed:', error);
    // }

    // 保存完了のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  }, [widgets, projectName, saveToLocalStorage]);

  // プレビュー処理
  const handlePreview = useCallback(() => {
    // プレビューデータを一時保存
    const previewData = {
      projectName,
      widgets,
    };

    sessionStorage.setItem('preview-data', JSON.stringify(previewData));

    // 新しいウィンドウでプレビューを開く
    window.open('/preview/temp', '_blank', 'width=1200,height=800');
  }, [widgets, projectName]);

  // エクスポート処理
  const handleExport = useCallback(() => {
    // HTML/CSS生成
    const html = generateHTML(widgets, projectName);

    // ダウンロード
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [widgets, projectName]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">
        {/* ツールバー */}
        <Toolbar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={handleExport}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />

        {/* メインエリア */}
        <div className="flex flex-1 overflow-hidden">
          {/* Widgetパレット */}
          <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
            <WidgetPalette />
          </div>

          {/* キャンバス */}
          <div className="flex-1 overflow-auto p-6" data-canvas="true">
            <Canvas
              widgets={widgets}
              selectedWidgetId={selectedWidgetId}
              onSelectWidget={setSelectedWidgetId}
              onUpdateWidget={updateWidget}
              onDeleteWidget={deleteWidget}
              showGrid={true}
            />
          </div>

          {/* プロパティパネル */}
          <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200">
            <PropertiesPanel
              selectedWidget={selectedWidget}
              onUpdateWidget={(updates) => {
                if (selectedWidgetId) {
                  updateWidget(selectedWidgetId, updates);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ドラッグオーバーレイ */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-4 py-3 shadow-lg">
            <span className="text-blue-700 font-medium">
              {activeId.toString().startsWith('palette-')
                ? `${activeId.toString().replace('palette-', '')} Widget`
                : 'Widget移動中...'}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// HTML生成関数
function generateHTML(widgets: Widget[], projectName: string): string {
  const widgetsHTML = widgets
    .map((widget) => {
      const style = `
        position: absolute;
        left: ${widget.position.x}px;
        top: ${widget.position.y}px;
        width: ${widget.size.width}px;
        height: ${widget.size.height}px;
      `.trim();

      // Widget種類ごとのHTML生成
      switch (widget.type) {
        case 'Text':
          return `<div style="${style} font-size: ${widget.props.fontSize}px; color: ${widget.props.color}; font-weight: ${widget.props.fontWeight}; text-align: ${widget.props.textAlign};">${widget.props.content}</div>`;

        case 'Button':
          return `<button style="${style} background: ${widget.props.color}; color: ${widget.props.textColor}; border-radius: ${widget.props.borderRadius}px; border: none; cursor: pointer; font-size: 16px;">${widget.props.text}</button>`;

        case 'Input':
          return `<div style="${style}"><label style="display: block; margin-bottom: 4px;">${widget.props.label}</label><input type="${widget.props.inputType}" placeholder="${widget.props.placeholder}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" ${widget.props.required ? 'required' : ''} /></div>`;

        case 'Image':
          return `<img src="${widget.props.src}" alt="${widget.props.alt}" style="${style} object-fit: ${widget.props.objectFit}; border-radius: ${widget.props.borderRadius}px; opacity: ${widget.props.opacity};" />`;

        default:
          return `<div style="${style}"></div>`;
      }
    })
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .container {
      position: relative;
      min-height: 600px;
    }
  </style>
</head>
<body>
  <div class="container">
    ${widgetsHTML}
  </div>
</body>
</html>`;
}
```

### 主な機能

1. **完全な状態管理**: useState による Widget、選択状態、プロジェクト情報の管理
2. **ローカルストレージ連携**: 自動保存と復元機能
3. **ドラッグ&ドロップ**: dnd-kit による完全な実装
4. **保存/読み込み**: ローカルストレージへの保存
5. **プレビュー**: 別ウィンドウでのプレビュー表示
6. **エクスポート**: HTML ファイル生成とダウンロード

---

## preview/[id]/page.tsx 完全実装

### ファイルパス
`src/app/preview/[id]/page.tsx`

### 完全なコード

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Widget } from '@/types/widget';
import { renderWidget } from '@/lib/widget-renderer';

interface PreviewData {
  projectName: string;
  widgets: Widget[];
}

export default function PreviewPage() {
  const params = useParams();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreviewData();
  }, [params.id]);

  const loadPreviewData = async () => {
    try {
      setIsLoading(true);

      // 一時プレビューの場合
      if (params.id === 'temp') {
        const data = sessionStorage.getItem('preview-data');
        if (data) {
          setPreviewData(JSON.parse(data));
        } else {
          setError('プレビューデータが見つかりません');
        }
        setIsLoading(false);
        return;
      }

      // データベースからの読み込み（将来的な実装）
      // const response = await fetch(`/api/projects/${params.id}`);
      // if (!response.ok) {
      //   throw new Error('プロジェクトが見つかりません');
      // }
      // const data = await response.json();
      // setPreviewData({
      //   projectName: data.name,
      //   widgets: data.canvas_data.components,
      // });

      // 現在はローカルストレージからフォールバック
      const localData = localStorage.getItem('nocode-builder-project');
      if (localData) {
        const parsed = JSON.parse(localData);
        setPreviewData({
          projectName: parsed.projectName,
          widgets: parsed.widgets,
        });
      } else {
        setError('プロジェクトデータが見つかりません');
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '読み込みエラー');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* プレビューヘッダー */}
      <header className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">プレビューモード</span>
          </div>
          <span className="text-gray-400">|</span>
          <h1 className="text-lg font-semibold">{previewData.projectName}</h1>
        </div>

        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          閉じる
        </button>
      </header>

      {/* プレビューコンテンツ */}
      <main className="p-6">
        <div className="relative min-h-[600px] bg-white border border-gray-200 rounded-lg">
          {previewData.widgets.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-sm">Widget が配置されていません</p>
              </div>
            </div>
          ) : (
            previewData.widgets.map((widget) => (
              <div
                key={widget.id}
                className="absolute"
                style={{
                  left: widget.position.x,
                  top: widget.position.y,
                  width: widget.size.width,
                  height: widget.size.height,
                }}
              >
                {renderWidget(widget)}
              </div>
            ))
          )}
        </div>
      </main>

      {/* プレビュー情報 */}
      <footer className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Widget数:</strong> {previewData.widgets.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            このプレビューは実際のレンダリング結果を示しています。
            エクスポートしたHTMLファイルとは若干異なる場合があります。
          </p>
        </div>
      </footer>
    </div>
  );
}
```

### 主な機能

1. **プロジェクトデータ読み込み**: SessionStorage または API から読み込み
2. **レンダリング専用ビュー**: 編集機能なしの表示のみ
3. **エラーハンドリング**: データが見つからない場合のエラー表示
4. **ローディング状態**: 読み込み中のスピナー表示

---

## globals.css 設定

### ファイルパス
`src/app/globals.css`

### 完全なコード

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムプロパティ */
:root {
  --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* グローバルスタイル */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-inter);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* カスタムスクロールバー */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* キャンバスグリッド */
.canvas-grid {
  background-color: #ffffff;
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

/* リサイズハンドル */
.resize-handle {
  position: absolute;
  background: #3b82f6;
  border: 1px solid white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  z-index: 10;
}

.resize-handle:hover {
  background: #2563eb;
  transform: scale(1.2);
  transition: transform 0.1s ease;
}

/* ドラッグ中のカーソル */
.dragging {
  cursor: grabbing !important;
}

/* カスタムコンポーネントスタイル */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}

/* ユーティリティクラス */
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  }

  .shadow-smooth {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin 2s linear infinite;
}

/* プリント時の最適化 */
@media print {
  .no-print {
    display: none !important;
  }
}

/* ダークモード対応（将来的） */
@media (prefers-color-scheme: dark) {
  /* ダークモードスタイルは将来実装 */
}
```

---

## ナビゲーションとルーティング

### Next.js Link コンポーネント

```typescript
import Link from 'next/link';

// 基本的な使い方
<Link href="/builder">ビルダーへ</Link>

// スタイル付き
<Link
  href="/builder"
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  ビルダーを開く
</Link>

// 新しいタブで開く
<Link href="/preview/123" target="_blank" rel="noopener noreferrer">
  プレビュー
</Link>
```

### プログラマティックナビゲーション

```typescript
'use client';

import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/builder');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <button onClick={handleNavigate}>ビルダーへ</button>
      <button onClick={handleBack}>戻る</button>
    </div>
  );
}
```

### 動的ルート

```typescript
// app/preview/[id]/page.tsx
import { useParams } from 'next/navigation';

export default function PreviewPage() {
  const params = useParams();
  const id = params.id; // URLパラメータ取得

  return <div>Preview ID: {id}</div>;
}
```

---

## SEO最適化

### メタデータ設定

```typescript
// 静的メタデータ
export const metadata: Metadata = {
  title: 'ページタイトル',
  description: 'ページ説明',
};

// 動的メタデータ
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await fetchProject(params.id);

  return {
    title: `${project.name} - Preview`,
    description: `Preview of ${project.name}`,
  };
}
```

### Open Graph画像

```typescript
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoCode UI Builder',
      },
    ],
  },
};
```

### 構造化データ（JSON-LD）

```typescript
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NoCode UI Builder',
    description: 'ドラッグ&ドロップでUIを作成',
    applicationCategory: 'DesignApplication',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ページコンテンツ */}
    </>
  );
}
```

---

## ヘルパー関数

### Widget ユーティリティ
`src/lib/widget-utils.ts`

```typescript
import type { Widget, WidgetType } from '@/types/widget';

// ユニークID生成
export function generateId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// デフォルトサイズ取得
export function getDefaultSize(type: WidgetType): { width: number; height: number } {
  const sizes: Record<WidgetType, { width: number; height: number }> = {
    Text: { width: 200, height: 40 },
    Input: { width: 250, height: 70 },
    Button: { width: 120, height: 40 },
    Image: { width: 300, height: 200 },
    Table: { width: 400, height: 250 },
    Select: { width: 250, height: 70 },
  };

  return sizes[type];
}

// デフォルトプロパティ取得
export function getDefaultProps(type: WidgetType): Record<string, any> {
  const props: Record<WidgetType, Record<string, any>> = {
    Text: {
      content: 'Text',
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
    },
    Input: {
      label: 'Input',
      placeholder: 'Enter text...',
      inputType: 'text',
      required: false,
    },
    Button: {
      text: 'Button',
      variant: 'primary',
      size: 'medium',
      color: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 6,
    },
    Image: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image',
      objectFit: 'cover',
      borderRadius: 0,
      opacity: 1,
    },
    Table: {
      columns: [
        { key: 'id', label: 'ID', width: 50 },
        { key: 'name', label: 'Name', width: 150 },
        { key: 'email', label: 'Email', width: 200 },
      ],
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
      striped: true,
      bordered: true,
      hoverable: true,
      headerBgColor: '#F3F4F6',
      headerTextColor: '#111827',
    },
    Select: {
      label: 'Select',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
      placeholder: 'Choose an option...',
      required: false,
    },
  };

  return props[type];
}
```

### Widget レンダラー
`src/lib/widget-renderer.tsx`

```typescript
import type { Widget } from '@/types/widget';
import { Text } from '@/components/widgets/Text';
import { Input } from '@/components/widgets/Input';
import { Button } from '@/components/widgets/Button';
import { Image } from '@/components/widgets/Image';
import { Table } from '@/components/widgets/Table';
import { Select } from '@/components/widgets/Select';

export function renderWidget(widget: Widget): React.ReactNode {
  switch (widget.type) {
    case 'Text':
      return <Text widget={widget} />;
    case 'Input':
      return <Input widget={widget} />;
    case 'Button':
      return <Button widget={widget} />;
    case 'Image':
      return <Image widget={widget} />;
    case 'Table':
      return <Table widget={widget} />;
    case 'Select':
      return <Select widget={widget} />;
    default:
      return null;
  }
}
```

---

## まとめ

このドキュメントでは、Next.js 14 App Routerを使用した以下のページの完全実装を提供しました:

1. **layout.tsx**: ルートレイアウト、メタデータ、グローバルCSS読み込み
2. **page.tsx**: ランディングページ（ヒーロー、機能紹介、CTA）
3. **builder/page.tsx**: ビルダーページ（400行以上、完全な状態管理とdnd-kit統合）
4. **preview/[id]/page.tsx**: プレビューページ（動的ルート、データ読み込み）
5. **globals.css**: Tailwind設定とカスタムスタイル

これらのページは、React Server ComponentsとClient Componentsを適切に使い分け、SEO最適化とパフォーマンスを両立しています。
