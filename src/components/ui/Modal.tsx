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
    if (!isOpen || !closeOnEsc) {
      return;
    }

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
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) {
      return;
    }

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

  if (!isOpen) {
    return null;
  }

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
