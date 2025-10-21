# UI/UXテストと品質向上ガイド

**作成日**: 2025年10月21日
**Phase**: 11 - UI/UX調整とテスト
**所要時間**: 3-4時間

---

## 目次

1. [UI/UX調整チェックリスト](#1-uiux調整チェックリスト)
2. [レスポンシブ対応](#2-レスポンシブ対応)
3. [カラースキーム調整](#3-カラースキーム調整)
4. [アニメーションとトランジション](#4-アニメーションとトランジション)
5. [エラーメッセージ改善](#5-エラーメッセージ改善)
6. [バリデーション強化](#6-バリデーション強化)
7. [ローディング状態の改善](#7-ローディング状態の改善)
8. [詳細なテストケース](#8-詳細なテストケース)
9. [ブラウザ互換性確認](#9-ブラウザ互換性確認)
10. [パフォーマンス最適化](#10-パフォーマンス最適化)
11. [アクセシビリティ確認](#11-アクセシビリティ確認)

---

## 1. UI/UX調整チェックリスト

### 1.1 全体チェックリスト

#### 視覚的要素

- [ ] 一貫したカラースキーム
- [ ] 適切なフォントサイズとウェイト
- [ ] 十分なコントラスト比（WCAG 2.1 AA準拠）
- [ ] 統一されたボーダー半径
- [ ] 適切な余白とパディング
- [ ] シャドウの統一感

#### インタラクション

- [ ] ホバー効果の実装
- [ ] フォーカス状態の明示
- [ ] アクティブ状態のフィードバック
- [ ] スムーズなトランジション
- [ ] ローディングインジケーター
- [ ] エラー表示の適切性

#### ユーザビリティ

- [ ] 直感的な操作フロー
- [ ] 明確なCTA（Call To Action）
- [ ] 適切なエラーメッセージ
- [ ] ツールチップやヘルプテキスト
- [ ] キーボード操作のサポート
- [ ] ドラッグ&ドロップの視覚的フィードバック

### 1.2 各画面のチェックリスト

#### ビルダー画面

- [ ] サイドバーの開閉アニメーション
- [ ] Widget一覧の見やすさ
- [ ] キャンバスのグリッド表示
- [ ] 選択状態の明示
- [ ] プロパティパネルの使いやすさ
- [ ] ツールバーのアクセスしやすさ

#### プロジェクト管理画面

- [ ] プロジェクト一覧のレイアウト
- [ ] カード形式の視覚的魅力
- [ ] 作成/編集モーダルの使いやすさ
- [ ] 削除確認ダイアログ
- [ ] 検索・フィルタ機能

#### エクスポート画面

- [ ] プレビュー表示
- [ ] ダウンロードボタンの目立ちやすさ
- [ ] 成功メッセージの表示
- [ ] エラー時の適切な対応

---

## 2. レスポンシブ対応

### 2.1 ブレークポイント定義

```typescript
// lib/constants/breakpoints.ts
export const BREAKPOINTS = {
  xs: 0,      // モバイル（小）
  sm: 640,    // モバイル
  md: 768,    // タブレット
  lg: 1024,   // デスクトップ（小）
  xl: 1280,   // デスクトップ
  '2xl': 1536, // デスクトップ（大）
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
```

### 2.2 Tailwind CSS設定

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

### 2.3 デスクトップ優先のレスポンシブ実装

#### ビルダーレイアウト

```tsx
// components/builder/BuilderLayout.tsx
export function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* サイドバー - デスクトップで表示、モバイルで非表示 */}
      <aside className="
        hidden lg:block
        w-64 xl:w-80
        border-r border-gray-200
        bg-white
        overflow-y-auto
      ">
        <WidgetPalette />
      </aside>

      {/* メインコンテンツ */}
      <main className="
        flex-1
        overflow-auto
        bg-gray-50
      ">
        {children}
      </main>

      {/* プロパティパネル - デスクトップで表示 */}
      <aside className="
        hidden xl:block
        w-80
        border-l border-gray-200
        bg-white
        overflow-y-auto
      ">
        <PropertiesPanel />
      </aside>
    </div>
  );
}
```

#### モバイル対応のモーダル表示

```tsx
// components/builder/MobileWidgetPalette.tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileWidgetPalette() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* モバイルメニューボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          lg:hidden
          fixed bottom-4 right-4
          z-50
          w-14 h-14
          bg-blue-600 hover:bg-blue-700
          text-white
          rounded-full
          shadow-lg
          flex items-center justify-center
          transition-colors
        "
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="
          lg:hidden
          fixed inset-0
          z-50
          bg-black bg-opacity-50
        ">
          <div className="
            absolute right-0 top-0 bottom-0
            w-80 max-w-full
            bg-white
            shadow-xl
            overflow-y-auto
            transform transition-transform
          ">
            {/* ヘッダー */}
            <div className="
              flex items-center justify-between
              p-4
              border-b border-gray-200
            ">
              <h2 className="text-lg font-semibold">Widgets</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Widget一覧 */}
            <WidgetPalette />
          </div>
        </div>
      )}
    </>
  );
}
```

### 2.4 キャンバスのレスポンシブ対応

```tsx
// components/builder/Canvas.tsx
export function Canvas() {
  return (
    <div className="
      w-full h-full
      p-4 md:p-6 lg:p-8
      overflow-auto
    ">
      <div className="
        mx-auto
        max-w-full lg:max-w-6xl
        min-h-[600px] md:min-h-[800px]
        bg-white
        rounded-lg
        shadow-sm
        border-2 border-gray-200
        relative
      ">
        {/* キャンバスコンテンツ */}
      </div>
    </div>
  );
}
```

### 2.5 レスポンシブテスト

#### テスト対象デバイス

| デバイス | 画面サイズ | 備考 |
|---------|----------|------|
| iPhone SE | 375×667 | 最小モバイル |
| iPhone 12/13 | 390×844 | 標準モバイル |
| iPad | 768×1024 | タブレット |
| Desktop | 1280×720 | 小型デスクトップ |
| Desktop | 1920×1080 | 標準デスクトップ |
| Desktop | 2560×1440 | 大型デスクトップ |

#### Chrome DevToolsでのテスト

```bash
# 開発サーバー起動
npm run dev

# ブラウザで開く
http://localhost:3000
```

1. F12キーでDevToolsを開く
2. Ctrl+Shift+M（Windows）または Cmd+Shift+M（Mac）でデバイスモード
3. 各デバイスサイズで確認

---

## 3. カラースキーム調整

### 3.1 カラーパレット定義

```typescript
// lib/constants/colors.ts
export const COLORS = {
  // プライマリカラー（メインアクション）
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // メイン
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // セカンダリカラー（補助的なアクション）
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // 成功
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#10B981',
    700: '#047857',
  },

  // 警告
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    700: '#B45309',
  },

  // エラー
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    700: '#B91C1C',
  },

  // グレースケール
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;
```

### 3.2 カラーの適用例

#### ボタンコンポーネント

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-md
        font-medium
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
}
```

### 3.3 ダークモード対応（将来的な拡張）

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
```

---

## 4. アニメーションとトランジション

### 4.1 基本トランジション設定

```css
/* app/globals.css */

/* 滑らかなトランジション */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ホバー時の浮き上がり */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* フェードイン */
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

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

/* スライドイン（右から） */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}
```

### 4.2 Widgetドラッグアニメーション

```tsx
// components/builder/DraggableWidget.tsx
import { useDraggable } from '@dnd-kit/core';

export function DraggableWidget({ widget }: { widget: Widget }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: widget.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded-md border-2
        cursor-move
        transition-all duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105 opacity-50'
          : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
        }
      `}
    >
      {widget.type}
    </div>
  );
}
```

### 4.3 モーダルアニメーション

```tsx
// components/ui/Modal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black
        transition-opacity duration-300
        ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-lg shadow-xl
          w-full max-w-md
          p-6
          transform transition-all duration-300
          ${isOpen
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="
              p-1 rounded-md
              text-gray-400 hover:text-gray-600
              hover:bg-gray-100
              transition-colors
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div>{children}</div>
      </div>
    </div>
  );
}
```

### 4.4 ローディングスピナー

```tsx
// components/ui/Spinner.tsx
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className="
        h-full w-full
        border-4 border-gray-200
        border-t-blue-600
        rounded-full
      " />
    </div>
  );
}
```

---

## 5. エラーメッセージ改善

### 5.1 エラーメッセージコンポーネント

```tsx
// components/ui/ErrorMessage.tsx
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ErrorMessageProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function ErrorMessage({
  type = 'error',
  title,
  message,
  onClose
}: ErrorMessageProps) {
  const config = {
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-200',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-200',
    },
    success: {
      icon: AlertCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      borderColor: 'border-green-200',
    },
  };

  const { icon: Icon, bgColor, textColor, iconColor, borderColor } = config[type];

  return (
    <div className={`
      ${bgColor} ${borderColor}
      border rounded-md p-4
      fade-in
    `}>
      <div className="flex items-start">
        <Icon className={`${iconColor} w-5 h-5 mt-0.5 mr-3`} />
        <div className="flex-1">
          {title && (
            <h3 className={`${textColor} text-sm font-medium mb-1`}>
              {title}
            </h3>
          )}
          <p className={`${textColor} text-sm`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${textColor} ml-3 hover:opacity-70`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
```

### 5.2 エラーメッセージの例

```tsx
// 使用例
<ErrorMessage
  type="error"
  title="保存に失敗しました"
  message="ネットワーク接続を確認して、もう一度お試しください。"
/>

<ErrorMessage
  type="warning"
  title="未保存の変更があります"
  message="このページを離れると、変更内容が失われます。"
/>

<ErrorMessage
  type="success"
  title="保存完了"
  message="プロジェクトが正常に保存されました。"
/>
```

### 5.3 ユーザーフレンドリーなエラーメッセージ

```typescript
// lib/utils/errorMessages.ts
export const ERROR_MESSAGES = {
  // ネットワークエラー
  NETWORK_ERROR: 'ネットワーク接続を確認してください。',
  TIMEOUT_ERROR: '接続がタイムアウトしました。もう一度お試しください。',

  // データベースエラー
  DB_CONNECTION_ERROR: 'データベースに接続できませんでした。',
  DB_QUERY_ERROR: 'データの取得に失敗しました。',

  // バリデーションエラー
  REQUIRED_FIELD: (field: string) => `${field}は必須項目です。`,
  INVALID_FORMAT: (field: string) => `${field}の形式が正しくありません。`,
  TOO_LONG: (field: string, max: number) =>
    `${field}は${max}文字以内で入力してください。`,

  // プロジェクトエラー
  PROJECT_NOT_FOUND: 'プロジェクトが見つかりませんでした。',
  PROJECT_SAVE_ERROR: 'プロジェクトの保存に失敗しました。',
  PROJECT_DELETE_ERROR: 'プロジェクトの削除に失敗しました。',

  // エクスポートエラー
  EXPORT_ERROR: 'エクスポートに失敗しました。',
  NO_COMPONENTS: 'エクスポートするコンポーネントがありません。',
} as const;
```

---

## 6. バリデーション強化

### 6.1 フォームバリデーション

```typescript
// lib/validation/projectValidation.ts
import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string()
    .min(1, 'プロジェクト名を入力してください')
    .max(255, 'プロジェクト名は255文字以内で入力してください')
    .regex(/^[a-zA-Z0-9\s\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF]+$/,
      '使用できない文字が含まれています'),

  description: z.string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),

  canvasData: z.object({
    components: z.array(z.any()),
    settings: z.object({
      backgroundColor: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }).optional(),
  }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
```

### 6.2 リアルタイムバリデーション

```tsx
// components/forms/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/lib/validation/projectValidation';

export function ProjectForm({ onSubmit }: { onSubmit: (data: ProjectFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* プロジェクト名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          プロジェクト名 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          className={`
            w-full px-3 py-2
            border rounded-md
            focus:outline-none focus:ring-2
            ${errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
            }
          `}
          placeholder="例: ランディングページ"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className={`
            w-full px-3 py-2
            border rounded-md
            focus:outline-none focus:ring-2
            ${errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
            }
          `}
          placeholder="プロジェクトの説明を入力..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full py-2 px-4
          bg-blue-600 hover:bg-blue-700
          text-white font-medium rounded-md
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {isSubmitting ? '保存中...' : '保存'}
      </button>
    </form>
  );
}
```

---

## 7. ローディング状態の改善

### 7.1 スケルトンローディング

```tsx
// components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`
      animate-pulse
      bg-gray-200
      rounded
      ${className}
    `} />
  );
}

// プロジェクト一覧のスケルトン
export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7.2 進捗バー

```tsx
// components/ui/ProgressBar.tsx
interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 8. 詳細なテストケース

### 8.1 ドラッグ&ドロップテスト

#### テストケース1: Widget追加

**手順**:
1. サイドバーから「Text」Widgetをドラッグ
2. キャンバスにドロップ
3. Widgetが配置されることを確認

**期待される動作**:
- [ ] ドラッグ中にWidgetが半透明になる
- [ ] キャンバス上でドロップ可能エリアがハイライトされる
- [ ] ドロップ後、Widgetが正しい位置に配置される
- [ ] 配置後、自動的に選択状態になる

#### テストケース2: Widget移動

**手順**:
1. 既存のWidgetをドラッグ
2. 別の位置に移動
3. ドロップ

**期待される動作**:
- [ ] ドラッグ中に他のWidgetとの重なりが可視化される
- [ ] グリッドスナップが機能する（グリッド表示時）
- [ ] 移動後の位置が保存される

#### テストケース3: 複数Widget選択

**手順**:
1. Ctrlキー（MacはCmd）を押しながら複数のWidgetをクリック
2. 選択されたWidgetをドラッグ

**期待される動作**:
- [ ] 選択された全てのWidgetが同時に移動する
- [ ] 相対的な位置関係が保持される

### 8.2 Widget編集テスト

#### テストケース4: プロパティ変更

**手順**:
1. TextWidgetを選択
2. プロパティパネルでフォントサイズを変更
3. 色を変更

**期待される動作**:
- [ ] リアルタイムでキャンバスに反映される
- [ ] 変更履歴が記録される（将来的な機能）
- [ ] プロパティパネルと実際の表示が一致する

#### テストケース5: Widget削除

**手順**:
1. Widgetを選択
2. Deleteキーを押す（または削除ボタンをクリック）

**期待される動作**:
- [ ] 確認ダイアログが表示される
- [ ] 削除後、他のWidgetが影響を受けない
- [ ] 元に戻す機能が動作する（将来的な機能）

### 8.3 保存/読み込みテスト

#### テストケース6: プロジェクト保存

**手順**:
1. キャンバスに複数のWidgetを配置
2. 「保存」ボタンをクリック
3. プロジェクト名を入力
4. 保存を実行

**期待される動作**:
- [ ] 保存中のローディング表示
- [ ] 成功メッセージの表示
- [ ] データベースに正しくデータが保存される
- [ ] プロジェクト一覧に反映される

#### テストケース7: プロジェクト読み込み

**手順**:
1. プロジェクト一覧から既存プロジェクトを選択
2. 「編集」ボタンをクリック

**期待される動作**:
- [ ] ローディング表示
- [ ] 全てのWidgetが正しい位置に復元される
- [ ] プロパティも完全に復元される
- [ ] エラーハンドリングが適切

### 8.4 エクスポートテスト

#### テストケース8: HTML/CSSエクスポート

**手順**:
1. プロジェクトを作成
2. 「エクスポート」ボタンをクリック
3. HTMLファイルをダウンロード

**期待される動作**:
- [ ] HTMLファイルが正しく生成される
- [ ] スタイルが埋め込まれている
- [ ] ブラウザで開いて正しく表示される
- [ ] Widget配置が元と同じ

### 8.5 エラーケーステスト

#### テストケース9: ネットワークエラー

**手順**:
1. ネットワーク接続を切断（DevToolsでオフライン設定）
2. プロジェクト保存を試行

**期待される動作**:
- [ ] 適切なエラーメッセージが表示される
- [ ] リトライオプションが提供される
- [ ] アプリケーションがクラッシュしない

#### テストケース10: バリデーションエラー

**手順**:
1. プロジェクト名を空白で保存しようとする
2. 255文字を超える名前を入力

**期待される動作**:
- [ ] インラインエラーメッセージが表示される
- [ ] フィールドがハイライトされる
- [ ] フォーカスが該当フィールドに移動する

---

## 9. ブラウザ互換性確認

### 9.1 対応ブラウザ

| ブラウザ | バージョン | 優先度 | テスト状況 |
|---------|----------|--------|-----------|
| Chrome | 最新版 | 高 | [ ] |
| Firefox | 最新版 | 高 | [ ] |
| Safari | 最新版 | 中 | [ ] |
| Edge | 最新版 | 中 | [ ] |
| Chrome (Android) | 最新版 | 低 | [ ] |
| Safari (iOS) | 最新版 | 低 | [ ] |

### 9.2 ブラウザ固有のテスト

#### Chromeテスト

```bash
# Chrome DevToolsで以下を確認
1. Console エラーがないこと
2. Network タブでAPIリクエストが成功
3. Performance タブでレンダリング時間
4. Lighthouse スコア確認
```

#### Firefoxテスト

```bash
# Firefoxで確認すべき点
1. Flexbox レイアウトの表示
2. CSS Grid の動作
3. ドラッグ&ドロップの互換性
4. フォント表示の違い
```

#### Safariテスト

```bash
# Safariで特に注意する点
1. Webkit固有のCSS接頭辞
2. Date/Time フォーマットの違い
3. Fetch API の動作
4. CSS Grid/Flexbox の実装差異
```

### 9.3 ポリフィル設定

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};
```

---

## 10. パフォーマンス最適化

### 10.1 React.memoの活用

```tsx
// components/builder/Widget.tsx
import { memo } from 'react';

export const Widget = memo(function Widget({ widget, onUpdate }: WidgetProps) {
  // Widgetレンダリングロジック
  return <div>...</div>;
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return prevProps.widget.id === nextProps.widget.id &&
         JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props);
});
```

### 10.2 useMemo/useCallbackの活用

```tsx
// components/builder/Canvas.tsx
'use client';

import { useMemo, useCallback } from 'react';

export function Canvas() {
  const widgets = useWidgets();

  // 重い計算をメモ化
  const sortedWidgets = useMemo(() => {
    return [...widgets].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [widgets]);

  // コールバック関数をメモ化
  const handleWidgetUpdate = useCallback((id: string, props: any) => {
    updateWidget(id, props);
  }, []);

  return (
    <div>
      {sortedWidgets.map(widget => (
        <Widget
          key={widget.id}
          widget={widget}
          onUpdate={handleWidgetUpdate}
        />
      ))}
    </div>
  );
}
```

### 10.3 遅延ローディング

```tsx
// app/builder/page.tsx
import dynamic from 'next/dynamic';

// プロパティパネルを遅延ロード
const PropertiesPanel = dynamic(
  () => import('@/components/builder/PropertiesPanel'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false, // サーバーサイドレンダリング無効化
  }
);

export default function BuilderPage() {
  return (
    <div>
      <Canvas />
      <PropertiesPanel />
    </div>
  );
}
```

### 10.4 画像最適化

```tsx
// Next.js Imageコンポーネントの使用
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="NoCode UI Builder"
  width={200}
  height={50}
  priority // 初期表示画像は優先読み込み
/>
```

---

## 11. アクセシビリティ確認

### 11.1 キーボード操作

#### 必須キーボードショートカット

| キー | 動作 |
|-----|------|
| Tab | 次の要素にフォーカス |
| Shift+Tab | 前の要素にフォーカス |
| Enter | ボタンクリック・選択 |
| Escape | モーダル閉じる |
| Delete | Widget削除 |
| Ctrl+S | プロジェクト保存 |
| Ctrl+Z | 元に戻す |
| Ctrl+Y | やり直し |

#### 実装例

```tsx
// components/builder/Canvas.tsx
'use client';

import { useEffect } from 'react';

export function Canvas() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: 保存
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Delete: 削除
      if (e.key === 'Delete') {
        handleDelete();
      }

      // Escape: 選択解除
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <div>...</div>;
}
```

### 11.2 ARIA属性

```tsx
// components/ui/Button.tsx
export function Button({ children, onClick, disabled, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      role="button"
      className="..."
    >
      {children}
    </button>
  );
}

// components/builder/Widget.tsx
export function Widget({ widget }: WidgetProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${widget.type} widget`}
      aria-selected={widget.isSelected}
      className="..."
    >
      {/* Widget content */}
    </div>
  );
}
```

### 11.3 スクリーンリーダー対応

```tsx
// components/ui/VisuallyHidden.tsx
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="
      absolute
      w-px h-px
      p-0 m-[-1px]
      overflow-hidden
      clip-[rect(0,0,0,0)]
      whitespace-nowrap
      border-0
    ">
      {children}
    </span>
  );
}

// 使用例
<button>
  <PlusIcon />
  <VisuallyHidden>新しいWidgetを追加</VisuallyHidden>
</button>
```

---

## まとめ

### テスト完了チェックリスト

#### UI/UX

- [ ] レスポンシブデザイン確認完了
- [ ] カラースキーム統一完了
- [ ] アニメーション実装完了
- [ ] エラーメッセージ改善完了
- [ ] バリデーション強化完了

#### 機能テスト

- [ ] ドラッグ&ドロップ動作確認
- [ ] Widget編集機能確認
- [ ] 保存/読み込み機能確認
- [ ] エクスポート機能確認
- [ ] エラーケース対応確認

#### ブラウザ互換性

- [ ] Chrome動作確認
- [ ] Firefox動作確認
- [ ] Safari動作確認
- [ ] Edge動作確認

#### パフォーマンス

- [ ] React.memo実装
- [ ] useMemo/useCallback活用
- [ ] 遅延ローディング実装
- [ ] 画像最適化完了

#### アクセシビリティ

- [ ] キーボード操作確認
- [ ] ARIA属性設定完了
- [ ] スクリーンリーダー対応

### 次のステップ

次は **Vercelデプロイ** (Phase 12) に進みます:

```bash
# 次のドキュメント
docs/implementation/20251021_12-vercel-deployment.md
```

---

**作成者**: Claude
**最終更新**: 2025年10月21日
