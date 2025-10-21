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
    if (duration === 0) {
      return;
    }

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
