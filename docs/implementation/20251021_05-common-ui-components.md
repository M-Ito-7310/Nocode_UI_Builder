# 共通UIコンポーネント実装ガイド

## 目次
1. [共通UIコンポーネントの設計思想](#共通uiコンポーネントの設計思想)
2. [Tailwind CSSスタイリングパターン](#tailwind-cssスタイリングパターン)
3. [Modalコンポーネント](#modalコンポーネント)
4. [Toastコンポーネント](#toastコンポーネント)
5. [Spinnerコンポーネント](#spinnerコンポーネント)
6. [Buttonコンポーネント](#buttonコンポーネント)
7. [Inputコンポーネント](#inputコンポーネント)
8. [アクセシビリティ対応](#アクセシビリティ対応)
9. [使用例とベストプラクティス](#使用例とベストプラクティス)

---

## 共通UIコンポーネントの設計思想

### 設計原則

#### 1. **再利用性 (Reusability)**
- 複数の画面で使用できる汎用的な設計
- Props APIによる柔軟なカスタマイズ
- デフォルト値の適切な設定

#### 2. **一貫性 (Consistency)**
- デザインシステムに基づいた統一感
- 同じパターンのProps命名規則
- 予測可能な動作

#### 3. **アクセシビリティ (Accessibility)**
- ARIA属性の適切な使用
- キーボード操作のサポート
- スクリーンリーダー対応

#### 4. **パフォーマンス (Performance)**
- 不要な再レンダリングの防止
- React.memoの適切な使用
- 軽量なコンポーネント設計

### ディレクトリ構造

```
src/components/ui/
├── Modal.tsx           # モーダルダイアログ
├── Toast.tsx           # 通知トースト
├── Spinner.tsx         # ローディングインジケーター
├── Button.tsx          # ボタンコンポーネント
├── Input.tsx           # 入力フィールド
└── index.ts            # エクスポート統合
```

---

## Tailwind CSSスタイリングパターン

### Tailwindの活用方法

#### 1. **ユーティリティクラスの組み合わせ**

```tsx
// 良い例: 小さなコンポーネント
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click Me
</button>

// 悪い例: カスタムCSS
<button className="custom-button">Click Me</button>
```

#### 2. **条件付きスタイリング**

```tsx
import { cn } from '@/lib/utils';

<button
  className={cn(
    'px-4 py-2 rounded',
    variant === 'primary' && 'bg-blue-500 text-white',
    variant === 'secondary' && 'bg-gray-200 text-gray-800',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  {children}
</button>
```

#### 3. **カスタムユーティリティの作成**

`tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### ユーティリティ関数: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwindクラスを結合するユーティリティ関数
 *
 * clsxとtailwind-mergeを組み合わせて、
 * 条件付きクラスと競合するクラスを適切に処理します。
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

必要なパッケージ:
```bash
npm install clsx tailwind-merge
```

---

## Modalコンポーネント

### 完全実装: `src/components/ui/Modal.tsx`

```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;

  /** モーダルを閉じる際のコールバック */
  onClose: () => void;

  /** モーダルのタイトル */
  title?: string;

  /** モーダルのコンテンツ */
  children: React.ReactNode;

  /** フッター部分のコンテンツ */
  footer?: React.ReactNode;

  /** モーダルのサイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** 背景クリックで閉じるかどうか */
  closeOnOverlayClick?: boolean;

  /** Escキーで閉じるかどうか */
  closeOnEsc?: boolean;

  /** カスタムクラス名 */
  className?: string;

  /** 閉じるボタンを表示するかどうか */
  showCloseButton?: boolean;
}

/**
 * Modalコンポーネント
 *
 * 再利用可能なモーダルダイアログコンポーネント。
 * アクセシビリティとキーボード操作に対応しています。
 *
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="プロジェクトを削除"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={onClose}>キャンセル</Button>
 *       <Button variant="danger" onClick={onDelete}>削除</Button>
 *     </>
 *   }
 * >
 *   本当に削除しますか?
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // モーダルが開いたときに前のフォーカス要素を保存
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      // モーダル内の最初のフォーカス可能な要素にフォーカス
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      // モーダルが閉じたら前のフォーカス位置に戻る
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Escキーで閉じる
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // ボディのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // フォーカストラップ（モーダル内でTabキーを循環）
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* モーダルコンテンツ */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl animate-slide-up',
          sizeClasses[size],
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* ヘッダー */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="閉じる"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* ボディ */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* フッター */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Props API詳細

| Prop | 型 | デフォルト | 説明 |
|------|---|----------|------|
| `isOpen` | `boolean` | - | モーダルの開閉状態（必須） |
| `onClose` | `() => void` | - | 閉じる時のコールバック（必須） |
| `title` | `string` | - | モーダルのタイトル |
| `children` | `ReactNode` | - | モーダルの内容（必須） |
| `footer` | `ReactNode` | - | フッター部分のコンテンツ |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | モーダルのサイズ |
| `closeOnOverlayClick` | `boolean` | `true` | 背景クリックで閉じる |
| `closeOnEsc` | `boolean` | `true` | Escキーで閉じる |
| `className` | `string` | - | カスタムクラス名 |
| `showCloseButton` | `boolean` | `true` | 閉じるボタンを表示 |

---

## Toastコンポーネント

### 完全実装: `src/components/ui/Toast.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** トーストのメッセージ */
  message: string;

  /** トーストの種類 */
  variant?: ToastVariant;

  /** トーストの表示時間（ミリ秒） */
  duration?: number;

  /** 閉じるコールバック */
  onClose?: () => void;

  /** タイトル */
  title?: string;

  /** 手動で閉じるボタンを表示 */
  showCloseButton?: boolean;

  /** カスタムクラス名 */
  className?: string;
}

/**
 * Toastコンポーネント
 *
 * 通知メッセージを表示するトーストコンポーネント。
 * 4つのバリアント（成功、エラー、警告、情報）をサポートします。
 *
 * @example
 * <Toast
 *   message="プロジェクトを保存しました"
 *   variant="success"
 *   duration={3000}
 *   onClose={() => setToast(null)}
 * />
 */
export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  onClose,
  title,
  showCloseButton = true,
  className,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // アニメーション完了を待つ
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const variantConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-900',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-900',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-900',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300',
        config.bgColor,
        config.borderColor,
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* アイコン */}
      <Icon className={cn('flex-shrink-0 mt-0.5', config.iconColor)} size={20} />

      {/* コンテンツ */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('font-semibold mb-1', config.textColor)}>{title}</p>
        )}
        <p className={cn('text-sm', config.textColor)}>{message}</p>
      </div>

      {/* 閉じるボタン */}
      {showCloseButton && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
            config.iconColor
          )}
          aria-label="閉じる"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/**
 * ToastContainerコンポーネント
 *
 * 複数のToastを管理するコンテナ。
 * 画面の右上に固定表示されます。
 */
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full"
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  );
}

/**
 * useToastカスタムフック
 *
 * Toastの表示を管理するカスタムフック。
 *
 * @example
 * const { toast, showToast, hideToast } = useToast();
 *
 * showToast({ message: '保存しました', variant: 'success' });
 */
export function useToast() {
  const [toast, setToast] = useState<
    (ToastProps & { id: string }) | null
  >(null);

  const showToast = (props: ToastProps) => {
    const id = Date.now().toString();
    setToast({ ...props, id });
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
```

### 使用例

```typescript
'use client';

import { Toast, ToastContainer, useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

export default function ExamplePage() {
  const { toast, showToast, hideToast } = useToast();

  return (
    <div>
      <Button
        onClick={() =>
          showToast({
            message: 'プロジェクトを保存しました',
            variant: 'success',
          })
        }
      >
        成功トースト
      </Button>

      <Button
        onClick={() =>
          showToast({
            message: 'エラーが発生しました',
            variant: 'error',
            title: 'エラー',
          })
        }
      >
        エラートースト
      </Button>

      <ToastContainer>
        {toast && (
          <Toast
            {...toast}
            onClose={hideToast}
          />
        )}
      </ToastContainer>
    </div>
  );
}
```

---

## Spinnerコンポーネント

### 完全実装: `src/components/ui/Spinner.tsx`

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  /** スピナーのサイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** スピナーの色 */
  color?: 'primary' | 'white' | 'gray';

  /** カスタムクラス名 */
  className?: string;

  /** ラベル（アクセシビリティ用） */
  label?: string;
}

/**
 * Spinnerコンポーネント
 *
 * ローディング状態を表示するスピナー。
 *
 * @example
 * <Spinner size="lg" color="primary" label="読み込み中..." />
 */
export function Spinner({
  size = 'md',
  color = 'primary',
  className,
  label = '読み込み中',
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent',
  };

  return (
    <div
      className={cn(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * FullScreenSpinnerコンポーネント
 *
 * 全画面表示のローディングスピナー。
 *
 * @example
 * {isLoading && <FullScreenSpinner />}
 */
export function FullScreenSpinner({ label = '読み込み中' }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" color="primary" label={label} />
        <p className="text-gray-700 font-medium">{label}</p>
      </div>
    </div>
  );
}

/**
 * InlineSpinnerコンポーネント
 *
 * インライン表示のスピナー（ボタン内など）。
 *
 * @example
 * <Button disabled={isLoading}>
 *   {isLoading && <InlineSpinner />}
 *   保存
 * </Button>
 */
export function InlineSpinner({ size = 'sm' }: Pick<SpinnerProps, 'size'>) {
  return <Spinner size={size} className="mr-2" />;
}
```

---

## Buttonコンポーネント

### 完全実装: `src/components/ui/Button.tsx`

```typescript
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのバリアント */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

  /** ボタンのサイズ */
  size?: 'sm' | 'md' | 'lg';

  /** ローディング状態 */
  isLoading?: boolean;

  /** 全幅表示 */
  fullWidth?: boolean;

  /** アイコン（左） */
  leftIcon?: React.ReactNode;

  /** アイコン（右） */
  rightIcon?: React.ReactNode;
}

/**
 * Buttonコンポーネント
 *
 * 再利用可能なボタンコンポーネント。
 * 複数のバリアント、サイズ、状態をサポートします。
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   保存
 * </Button>
 *
 * <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
 *   削除
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500',
      outline:
        'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'gray'} />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 使用例

```typescript
import { Button } from '@/components/ui/Button';
import { Save, Trash2, Download } from 'lucide-react';

<Button variant="primary" leftIcon={<Save size={16} />}>
  保存
</Button>

<Button variant="danger" leftIcon={<Trash2 size={16} />} isLoading={isDeleting}>
  削除
</Button>

<Button variant="outline" rightIcon={<Download size={16} />}>
  エクスポート
</Button>
```

---

## Inputコンポーネント

### 完全実装: `src/components/ui/Input.tsx`

```typescript
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** ラベル */
  label?: string;

  /** エラーメッセージ */
  error?: string;

  /** ヘルプテキスト */
  helperText?: string;

  /** 左側のアイコン */
  leftIcon?: React.ReactNode;

  /** 右側のアイコン */
  rightIcon?: React.ReactNode;

  /** 全幅表示 */
  fullWidth?: boolean;
}

/**
 * Inputコンポーネント
 *
 * 再利用可能な入力フィールドコンポーネント。
 * ラベル、エラー表示、アイコンなどをサポートします。
 *
 * @example
 * <Input
 *   label="プロジェクト名"
 *   placeholder="プロジェクト名を入力"
 *   error={errors.name}
 *   required
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* ラベル */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* 入力フィールド */}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-3 py-2 border rounded-lg transition-colors',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ヘルプテキスト */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * TextAreaコンポーネント
 *
 * 複数行入力用のテキストエリア。
 */
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
  }
>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 border rounded-lg transition-colors resize-y',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
```

### 使用例

```typescript
import { Input, TextArea } from '@/components/ui/Input';
import { Search, Mail } from 'lucide-react';

<Input
  label="プロジェクト名"
  placeholder="例: ランディングページ"
  required
  fullWidth
/>

<Input
  type="email"
  label="メールアドレス"
  leftIcon={<Mail size={18} />}
  placeholder="example@email.com"
  error={errors.email}
/>

<Input
  type="search"
  placeholder="検索..."
  leftIcon={<Search size={18} />}
/>

<TextArea
  label="プロジェクトの説明"
  placeholder="プロジェクトについて説明してください"
  helperText="最大1000文字まで入力できます"
  rows={5}
  fullWidth
/>
```

---

## アクセシビリティ対応

### ARIA属性の使用

すべてのコンポーネントで適切なARIA属性を実装しています。

#### 1. **role属性**

```tsx
// モーダル
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

// トースト
<div role="alert" aria-live="polite">

// ローディングスピナー
<div role="status" aria-label="読み込み中">
```

#### 2. **aria-label / aria-labelledby**

```tsx
// ラベルを直接指定
<button aria-label="閉じる">
  <X size={20} />
</button>

// 既存要素をラベルとして参照
<div aria-labelledby="modal-title">
  <h2 id="modal-title">タイトル</h2>
</div>
```

#### 3. **aria-describedby**

```tsx
<input
  id="email"
  aria-describedby="email-error"
/>
<span id="email-error">メールアドレスが無効です</span>
```

#### 4. **aria-invalid**

```tsx
<input aria-invalid={error ? 'true' : 'false'} />
```

### キーボード操作のサポート

#### 1. **フォーカス管理**

```tsx
// モーダルが開いたときに自動フォーカス
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('button');
    firstFocusable?.focus();
  }
}, [isOpen]);
```

#### 2. **フォーカストラップ**

```tsx
// Tabキーでモーダル内を循環
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Tab') {
    // 最初と最後の要素間で循環
  }
};
```

#### 3. **Escapeキー**

```tsx
useEffect(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

### スクリーンリーダー対応

#### 1. **sr-only クラス**

視覚的には隠すが、スクリーンリーダーには読ませる:

```tsx
<span className="sr-only">読み込み中</span>
```

`globals.css`に追加:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### 2. **aria-live**

動的な変更をスクリーンリーダーに通知:

```tsx
<div aria-live="polite" aria-atomic="true">
  {toast?.message}
</div>
```

---

## 使用例とベストプラクティス

### 統合エクスポート: `src/components/ui/index.ts`

```typescript
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Toast, ToastContainer, useToast } from './Toast';
export type { ToastProps, ToastVariant } from './Toast';

export { Spinner, FullScreenSpinner, InlineSpinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input, TextArea } from './Input';
export type { InputProps } from './Input';
```

### 実践例: プロジェクト削除確認

```typescript
'use client';

import { useState } from 'react';
import { Modal, Button, useToast, ToastContainer } from '@/components/ui';
import { Trash2 } from 'lucide-react';

export function DeleteProjectButton({ projectId, projectName }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      showToast({
        message: 'プロジェクトを削除しました',
        variant: 'success',
      });

      setIsModalOpen(false);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : '削除に失敗しました',
        variant: 'error',
        title: 'エラー',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        leftIcon={<Trash2 size={16} />}
        onClick={() => setIsModalOpen(true)}
      >
        削除
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="プロジェクトを削除"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              削除
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          <strong>{projectName}</strong> を削除してもよろしいですか？
        </p>
        <p className="text-sm text-gray-500 mt-2">
          この操作は取り消せません。
        </p>
      </Modal>

      <ToastContainer>
        {toast && <Toast {...toast} onClose={hideToast} />}
      </ToastContainer>
    </>
  );
}
```

### ベストプラクティス

#### 1. **一貫性のある命名**

```typescript
// ✅ 良い例
<Button variant="primary" size="md" />
<Modal size="lg" />

// ❌ 悪い例
<Button type="primary" dimension="medium" />
<Modal modalSize="large" />
```

#### 2. **Props のデフォルト値**

```typescript
// デフォルト値を設定して使いやすく
export function Button({
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  // ...
}
```

#### 3. **forwardRef の使用**

```typescript
// ref を受け取れるようにする
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

#### 4. **TypeScript の活用**

```typescript
// 厳密な型定義
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

// Union型で安全性を確保
variant?: ButtonVariant;
```

#### 5. **コンポーネントの合成**

```typescript
// 小さなコンポーネントを組み合わせる
<Modal
  footer={
    <>
      <Button variant="secondary">キャンセル</Button>
      <Button variant="primary">保存</Button>
    </>
  }
>
  内容
</Modal>
```

---

## まとめ

このドキュメントでは、NoCode UI Builderの共通UIコンポーネントの完全な実装を提供しました。

### 実装したコンポーネント

1. **`Modal.tsx`** - 再利用可能なモーダルダイアログ
2. **`Toast.tsx`** - 通知トーストとカスタムフック
3. **`Spinner.tsx`** - ローディングインジケーター
4. **`Button.tsx`** - 多機能ボタンコンポーネント
5. **`Input.tsx`** - 入力フィールドとテキストエリア
6. **`index.ts`** - 統合エクスポート
7. **`src/lib/utils.ts`** - クラス名結合ユーティリティ

### 主要な特徴

- **Tailwind CSS**: ユーティリティファーストのスタイリング
- **アクセシビリティ**: ARIA属性、キーボード操作、スクリーンリーダー対応
- **型安全性**: TypeScriptによる厳密な型定義
- **再利用性**: Props APIによる柔軟なカスタマイズ
- **一貫性**: 統一されたデザインパターン

### 次のステップ

これらの共通コンポーネントを使用して、ビルダー画面やその他のUIを実装していきます。
