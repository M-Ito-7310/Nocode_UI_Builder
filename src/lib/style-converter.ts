import { CSSProperties } from 'react';
import {
  TextWidgetProps,
  ButtonWidgetProps,
  ImageWidgetProps,
} from '@/types/widget';

/**
 * hex色をrgbaに変換
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
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
 * Text Widget Props を CSS スタイルに変換
 */
export function textPropsToStyle(props: TextWidgetProps): CSSProperties {
  return {
    fontSize: `${props.fontSize}px`,
    color: props.color,
    fontWeight: props.fontWeight,
    textAlign: props.textAlign,
    fontFamily: props.fontFamily || 'inherit',
    lineHeight: props.lineHeight ? `${props.lineHeight}` : 'normal',
  };
}

/**
 * Button Widget Props を CSS スタイルに変換
 */
export function buttonPropsToStyle(props: ButtonWidgetProps): CSSProperties {
  const variantStyles: Record<typeof props.variant, CSSProperties> = {
    primary: {
      backgroundColor: props.color,
      color: props.textColor,
      border: 'none',
    },
    secondary: {
      backgroundColor: hexToRgba(props.color, 0.1),
      color: props.color,
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: props.color,
      border: `2px solid ${props.color}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: props.color,
      border: 'none',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  const sizeStyles: Record<typeof props.size, CSSProperties> = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
    },
  };

  return {
    ...variantStyles[props.variant],
    ...sizeStyles[props.size],
    borderRadius: `${props.borderRadius}px`,
    opacity: props.disabled ? 0.5 : 1,
  };
}

/**
 * Image Widget Props を CSS スタイルに変換
 */
export function imagePropsToStyle(props: ImageWidgetProps): CSSProperties {
  return {
    objectFit: props.objectFit,
    borderRadius: `${props.borderRadius}px`,
    opacity: props.opacity,
  };
}

/**
 * 汎用的なスタイル変換関数
 */
export function propsToStyle(type: string, props: any): CSSProperties {
  switch (type) {
    case 'Text':
      return textPropsToStyle(props as TextWidgetProps);
    case 'Button':
      return buttonPropsToStyle(props as ButtonWidgetProps);
    case 'Image':
      return imagePropsToStyle(props as ImageWidgetProps);
    default:
      return {};
  }
}
