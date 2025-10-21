'use client';

import React, { memo, CSSProperties } from 'react';
import { ButtonWidget, WidgetComponentProps } from '@/types/widget';

/**
 * hex色をrgbaに変換するヘルパー関数
 *
 * @param {string} hex - 16進数カラーコード (#RRGGBB)
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} rgba形式の色文字列
 */
function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = parseInt(result[1]!, 16);
  const g = parseInt(result[2]!, 16);
  const b = parseInt(result[3]!, 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Button Widget Component
 *
 * クリック可能なボタンWidget。
 * 4種類のバリアント（primary, secondary, outline, ghost）と
 * 3種類のサイズ（small, medium, large）をサポート。
 *
 * @param {WidgetComponentProps<ButtonWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされたボタンWidget
 */
const Button: React.FC<WidgetComponentProps<ButtonWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { text, variant, size, color, textColor, borderRadius, disabled } = widget.props;

  /**
   * サイズ別のスタイル設定
   */
  const sizeStyles: Record<typeof size, CSSProperties> = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: '32px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
      minHeight: '40px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
      minHeight: '48px',
    },
  };

  /**
   * バリアント別のスタイル設定
   */
  const variantStyles: Record<typeof variant, CSSProperties> = {
    primary: {
      backgroundColor: color,
      color: textColor,
      border: 'none',
    },
    secondary: {
      backgroundColor: hexToRgba(color, 0.1),
      color: color,
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: color,
      border: `2px solid ${color}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: color,
      border: 'none',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  /**
   * 基本ボタンスタイル
   */
  const baseButtonStyle: CSSProperties = {
    borderRadius: `${borderRadius}px`,
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '4px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '4px',
      }
    : {};

  /**
   * 最終的なボタンスタイルをマージ
   */
  const finalButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onSelect?.();
    }
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    if (!disabled) {
      onHover?.();
    }
  };

  return (
    <button
      style={finalButtonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      aria-label={text}
      data-widget-type="Button"
      data-widget-id={widget.id}
      data-variant={variant}
      data-size={size}
    >
      {text || 'Button'}
    </button>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Button, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
