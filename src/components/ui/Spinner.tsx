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
