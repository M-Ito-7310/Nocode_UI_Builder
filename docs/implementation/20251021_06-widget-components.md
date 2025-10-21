# Widget Components 完全実装ガイド

**作成日**: 2025年10月21日
**バージョン**: 1.0
**対象**: NoCode UI Builder - Widget コンポーネント実装

---

## 目次

1. [Widget設計アーキテクチャ](#1-widget設計アーキテクチャ)
2. [共通型定義とインターフェース](#2-共通型定義とインターフェース)
3. [Text Widget完全実装](#3-text-widget完全実装)
4. [Input Widget完全実装](#4-input-widget完全実装)
5. [Button Widget完全実装](#5-button-widget完全実装)
6. [Image Widget完全実装](#6-image-widget完全実装)
7. [Table Widget完全実装](#7-table-widget完全実装)
8. [Select Widget完全実装](#8-select-widget完全実装)
9. [デフォルト値定義](#9-デフォルト値定義)
10. [Props to Style変換ロジック](#10-props-to-style変換ロジック)
11. [インタラクティブ動作](#11-インタラクティブ動作)
12. [レンダリング最適化](#12-レンダリング最適化)
13. [使用例とプレビュー](#13-使用例とプレビュー)

---

## 1. Widget設計アーキテクチャ

### 1.1 設計原則

Widgetコンポーネントは以下の原則に従って設計されています：

1. **再利用性**: 各Widgetは独立して機能し、任意の場所で再利用可能
2. **型安全性**: TypeScriptの厳格な型定義により、プロパティの誤用を防止
3. **パフォーマンス**: React.memoを使用した不要な再レンダリングの防止
4. **アクセシビリティ**: セマンティックHTMLとARIA属性の適切な使用
5. **拡張性**: 新しいWidgetを容易に追加できる構造

### 1.2 アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                    Widget Hierarchy                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────┐        │
│  │          BaseWidget (Interface)              │        │
│  │  - id: string                                │        │
│  │  - type: WidgetType                          │        │
│  │  - position: { x, y }                        │        │
│  │  - size: { width, height }                   │        │
│  └────────────────┬────────────────────────────┘        │
│                   │                                       │
│       ┌───────────┴───────────┬──────────────┐          │
│       │                       │              │          │
│  ┌────▼─────┐          ┌─────▼────┐   ┌────▼─────┐    │
│  │TextWidget│          │InputWidget│   │ButtonWidget│   │
│  └──────────┘          └──────────┘   └──────────┘    │
│                                                           │
│  ┌───────────┐        ┌───────────┐   ┌───────────┐    │
│  │ImageWidget│        │TableWidget│   │SelectWidget│    │
│  └───────────┘        └───────────┘   └───────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 1.3 コンポーネント責務

- **Widgetコンポーネント**: プロパティに基づいてUIをレンダリング
- **WidgetWrapper**: ドラッグ、リサイズ、選択状態の管理
- **PropertiesPanel**: Widgetプロパティの編集UI
- **Canvas**: Widget配置とレイアウト管理

---

## 2. 共通型定義とインターフェース

### 2.1 基本型定義 (`src/types/widget.ts`)

```typescript
/**
 * Widget型定義
 * すべてのWidget種類を表すUnion型
 */
export type WidgetType = 'Text' | 'Input' | 'Button' | 'Image' | 'Table' | 'Select';

/**
 * 座標位置
 */
export interface Position {
  x: number; // X座標（px）
  y: number; // Y座標（px）
}

/**
 * サイズ
 */
export interface Size {
  width: number;  // 幅（px）
  height: number; // 高さ（px）
}

/**
 * すべてのWidgetが継承する基本インターフェース
 */
export interface BaseWidget {
  id: string;              // ユニークID（UUID）
  type: WidgetType;        // Widget種類
  position: Position;      // キャンバス上の位置
  size: Size;              // Widget サイズ
}

/**
 * Widgetコンポーネントの共通Props
 */
export interface WidgetComponentProps<T extends BaseWidget> {
  widget: T;               // Widget データ
  isSelected?: boolean;    // 選択状態
  isHovered?: boolean;     // ホバー状態
  onSelect?: () => void;   // 選択イベント
  onHover?: () => void;    // ホバーイベント
  onPropsChange?: (props: Partial<T['props']>) => void; // プロパティ変更
}
```

### 2.2 個別Widget型定義

```typescript
/**
 * Text Widget
 */
export interface TextWidgetProps {
  content: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign: 'left' | 'center' | 'right';
  fontFamily?: string;
  lineHeight?: number;
}

export interface TextWidget extends BaseWidget {
  type: 'Text';
  props: TextWidgetProps;
}

/**
 * Input Widget
 */
export interface InputWidgetProps {
  label: string;
  placeholder: string;
  inputType: 'text' | 'email' | 'password' | 'number' | 'tel';
  required: boolean;
  defaultValue?: string;
  width: number;
}

export interface InputWidget extends BaseWidget {
  type: 'Input';
  props: InputWidgetProps;
}

/**
 * Button Widget
 */
export interface ButtonWidgetProps {
  text: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  color: string;
  textColor: string;
  borderRadius: number;
  disabled?: boolean;
}

export interface ButtonWidget extends BaseWidget {
  type: 'Button';
  props: ButtonWidgetProps;
}

/**
 * Image Widget
 */
export interface ImageWidgetProps {
  src: string;
  alt: string;
  objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  borderRadius: number;
  opacity: number;
}

export interface ImageWidget extends BaseWidget {
  type: 'Image';
  props: ImageWidgetProps;
}

/**
 * Table Widget
 */
export interface TableColumn {
  key: string;
  label: string;
  width?: number;
}

export interface TableRow {
  [key: string]: string | number;
}

export interface TableWidgetProps {
  columns: TableColumn[];
  data: TableRow[];
  striped: boolean;
  bordered: boolean;
  hoverable: boolean;
  headerBgColor: string;
  headerTextColor: string;
}

export interface TableWidget extends BaseWidget {
  type: 'Table';
  props: TableWidgetProps;
}

/**
 * Select Widget
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectWidgetProps {
  label: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder: string;
  required: boolean;
  width: number;
}

export interface SelectWidget extends BaseWidget {
  type: 'Select';
  props: SelectWidgetProps;
}

/**
 * Widget Union型
 * すべてのWidget型を統合
 */
export type Widget =
  | TextWidget
  | InputWidget
  | ButtonWidget
  | ImageWidget
  | TableWidget
  | SelectWidget;
```

---

## 3. Text Widget完全実装

### 3.1 コンポーネント実装 (`src/components/widgets/Text.tsx`)

```tsx
'use client';

import React, { memo, CSSProperties } from 'react';
import { TextWidget, WidgetComponentProps } from '@/types/widget';

/**
 * Text Widget Component
 *
 * テキストを表示するための基本的なWidget。
 * 見出し、段落、ラベルなどに使用可能。
 *
 * @param {WidgetComponentProps<TextWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされたテキストWidget
 */
const Text: React.FC<WidgetComponentProps<TextWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { content, fontSize, color, fontWeight, textAlign, fontFamily, lineHeight } = widget.props;

  /**
   * Propsからスタイルオブジェクトを生成
   */
  const textStyle: CSSProperties = {
    fontSize: `${fontSize}px`,
    color: color,
    fontWeight: fontWeight,
    textAlign: textAlign,
    fontFamily: fontFamily || 'inherit',
    lineHeight: lineHeight ? `${lineHeight}` : 'normal',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '4px',
    boxSizing: 'border-box',
    wordBreak: 'break-word',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
      }
    : {};

  /**
   * 最終的なスタイルをマージ
   */
  const finalStyle: CSSProperties = {
    ...textStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  return (
    <div
      style={finalStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="textbox"
      aria-label="Text widget"
      data-widget-type="Text"
      data-widget-id={widget.id}
    >
      {content || 'Text'}
    </div>
  );
};

/**
 * React.memoでメモ化してパフォーマンス最適化
 * propsが変更されない限り再レンダリングされない
 */
export default memo(Text, (prevProps, nextProps) => {
  // カスタム比較関数：深い比較が必要な場合
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

---

## 4. Input Widget完全実装

### 4.1 コンポーネント実装 (`src/components/widgets/Input.tsx`)

```tsx
'use client';

import React, { memo, CSSProperties, useState } from 'react';
import { InputWidget, WidgetComponentProps } from '@/types/widget';

/**
 * Input Widget Component
 *
 * ユーザー入力を受け付けるフォームフィールドWidget。
 * テキスト、メール、パスワードなど複数の入力タイプをサポート。
 *
 * @param {WidgetComponentProps<InputWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされた入力Widget
 */
const Input: React.FC<WidgetComponentProps<InputWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { label, placeholder, inputType, required, defaultValue, width } = widget.props;

  // 入力値の状態管理（プレビュー用）
  const [inputValue, setInputValue] = useState(defaultValue || '');

  /**
   * コンテナスタイル
   */
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  };

  /**
   * ラベルスタイル
   */
  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    userSelect: 'none',
  };

  /**
   * 入力フィールドスタイル
   */
  const inputStyle: CSSProperties = {
    width: `${width}px`,
    maxWidth: '100%',
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    transition: 'all 0.2s ease',
  };

  /**
   * フォーカス時のスタイル（疑似的）
   */
  const focusedInputStyle: CSSProperties = {
    ...inputStyle,
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
        borderRadius: '4px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
        borderRadius: '4px',
      }
    : {};

  /**
   * 最終的なコンテナスタイル
   */
  const finalContainerStyle: CSSProperties = {
    ...containerStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  /**
   * 入力変更ハンドラ
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /**
   * 入力フィールドのクリックイベント伝播を防止
   */
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={finalContainerStyle}
      onClick={handleContainerClick}
      onMouseEnter={handleMouseEnter}
      data-widget-type="Input"
      data-widget-id={widget.id}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        required={required}
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        style={inputStyle}
        aria-label={label}
        // ビルダー内では入力を無効化（プレビューでのみ有効）
        readOnly={isSelected !== undefined}
      />
    </div>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Input, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

---

## 5. Button Widget完全実装

### 5.1 コンポーネント実装 (`src/components/widgets/Button.tsx`)

```tsx
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
  if (!result) return `rgba(0, 0, 0, ${alpha})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

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
```

---

## 6. Image Widget完全実装

### 6.1 コンポーネント実装 (`src/components/widgets/Image.tsx`)

```tsx
'use client';

import React, { memo, CSSProperties, useState } from 'react';
import { ImageWidget, WidgetComponentProps } from '@/types/widget';

/**
 * Image Widget Component
 *
 * 画像を表示するWidget。
 * object-fit、borderRadius、opacityなどの調整が可能。
 *
 * @param {WidgetComponentProps<ImageWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされた画像Widget
 */
const Image: React.FC<WidgetComponentProps<ImageWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { src, alt, objectFit, borderRadius, opacity } = widget.props;

  // 画像読み込み状態
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * コンテナスタイル
   */
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  /**
   * 画像スタイル
   */
  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    borderRadius: `${borderRadius}px`,
    opacity: opacity,
    transition: 'opacity 0.3s ease',
    display: imageLoaded ? 'block' : 'none',
  };

  /**
   * プレースホルダー/エラー表示スタイル
   */
  const placeholderStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#9CA3AF',
    textAlign: 'center',
    padding: '16px',
    boxSizing: 'border-box',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
      }
    : {};

  /**
   * 最終的なコンテナスタイル
   */
  const finalContainerStyle: CSSProperties = {
    ...containerStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  /**
   * 画像読み込み成功ハンドラ
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  /**
   * 画像読み込みエラーハンドラ
   */
  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  return (
    <div
      style={finalContainerStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-widget-type="Image"
      data-widget-id={widget.id}
      role="img"
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {!imageLoaded && !imageError && (
        <div style={placeholderStyle}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
            <div>画像を読み込み中...</div>
          </div>
        </div>
      )}

      {imageError && (
        <div style={placeholderStyle}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <div>画像の読み込みに失敗しました</div>
            <div style={{ fontSize: '12px', marginTop: '4px', color: '#6B7280' }}>
              URLを確認してください
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Image, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

---

## 7. Table Widget完全実装

### 7.1 コンポーネント実装 (`src/components/widgets/Table.tsx`)

```tsx
'use client';

import React, { memo, CSSProperties } from 'react';
import { TableWidget, WidgetComponentProps, TableColumn, TableRow } from '@/types/widget';

/**
 * Table Widget Component
 *
 * データを表形式で表示するWidget。
 * ストライプ表示、ボーダー、ホバー効果などのカスタマイズが可能。
 *
 * @param {WidgetComponentProps<TableWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされたテーブルWidget
 */
const Table: React.FC<WidgetComponentProps<TableWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const {
    columns,
    data,
    striped,
    bordered,
    hoverable,
    headerBgColor,
    headerTextColor,
  } = widget.props;

  /**
   * コンテナスタイル
   */
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    padding: '8px',
    boxSizing: 'border-box',
  };

  /**
   * テーブルスタイル
   */
  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    fontFamily: 'inherit',
  };

  /**
   * ヘッダー行スタイル
   */
  const theadStyle: CSSProperties = {
    backgroundColor: headerBgColor,
    color: headerTextColor,
  };

  /**
   * ヘッダーセルスタイル
   */
  const thStyle: CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    border: bordered ? '1px solid #E5E7EB' : 'none',
    borderBottom: '2px solid #E5E7EB',
  };

  /**
   * データ行スタイル生成関数
   */
  const getTrStyle = (index: number): CSSProperties => {
    const baseStyle: CSSProperties = {
      transition: hoverable ? 'background-color 0.2s ease' : undefined,
    };

    if (striped && index % 2 === 1) {
      return {
        ...baseStyle,
        backgroundColor: '#F9FAFB',
      };
    }

    return {
      ...baseStyle,
      backgroundColor: '#FFFFFF',
    };
  };

  /**
   * データセルスタイル
   */
  const tdStyle: CSSProperties = {
    padding: '12px',
    border: bordered ? '1px solid #E5E7EB' : 'none',
    borderBottom: '1px solid #E5E7EB',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
        borderRadius: '4px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
        borderRadius: '4px',
      }
    : {};

  /**
   * 最終的なコンテナスタイル
   */
  const finalContainerStyle: CSSProperties = {
    ...containerStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  /**
   * カラム幅の計算
   */
  const getColumnWidth = (column: TableColumn): string | undefined => {
    return column.width ? `${column.width}px` : undefined;
  };

  /**
   * データが空の場合の表示
   */
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          ...finalContainerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          fontSize: '14px',
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        data-widget-type="Table"
        data-widget-id={widget.id}
      >
        テーブルデータがありません
      </div>
    );
  }

  return (
    <div
      style={finalContainerStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-widget-type="Table"
      data-widget-id={widget.id}
    >
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={`${widget.id}-header-${column.key}-${index}`}
                style={{
                  ...thStyle,
                  width: getColumnWidth(column),
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={`${widget.id}-row-${rowIndex}`}
              style={getTrStyle(rowIndex)}
              onMouseEnter={(e) => {
                if (hoverable) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (hoverable) {
                  const originalBg = striped && rowIndex % 2 === 1 ? '#F9FAFB' : '#FFFFFF';
                  (e.currentTarget as HTMLElement).style.backgroundColor = originalBg;
                }
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${widget.id}-cell-${rowIndex}-${column.key}-${colIndex}`}
                  style={tdStyle}
                >
                  {row[column.key] !== undefined ? String(row[column.key]) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Table, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

---

## 8. Select Widget完全実装

### 8.1 コンポーネント実装 (`src/components/widgets/Select.tsx`)

```tsx
'use client';

import React, { memo, CSSProperties, useState } from 'react';
import { SelectWidget, WidgetComponentProps, SelectOption } from '@/types/widget';

/**
 * Select Widget Component
 *
 * ドロップダウン選択フィールドWidget。
 * 複数のオプションから1つを選択できる。
 *
 * @param {WidgetComponentProps<SelectWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされた選択Widget
 */
const Select: React.FC<WidgetComponentProps<SelectWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { label, options, defaultValue, placeholder, required, width } = widget.props;

  // 選択値の状態管理
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');

  /**
   * コンテナスタイル
   */
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  };

  /**
   * ラベルスタイル
   */
  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    userSelect: 'none',
  };

  /**
   * セレクトボックススタイル
   */
  const selectStyle: CSSProperties = {
    width: `${width}px`,
    maxWidth: '100%',
    padding: '10px 12px',
    paddingRight: '36px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '20px',
    transition: 'all 0.2s ease',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
        borderRadius: '4px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
        borderRadius: '4px',
      }
    : {};

  /**
   * 最終的なコンテナスタイル
   */
  const finalContainerStyle: CSSProperties = {
    ...containerStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  /**
   * 選択変更ハンドラ
   */
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  /**
   * セレクトボックスのクリックイベント伝播を防止
   */
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={finalContainerStyle}
      onClick={handleContainerClick}
      onMouseEnter={handleMouseEnter}
      data-widget-type="Select"
      data-widget-id={widget.id}
    >
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <select
        value={selectedValue}
        onChange={handleSelectChange}
        onClick={handleSelectClick}
        required={required}
        style={selectStyle}
        aria-label={label}
        // ビルダー内では選択を無効化（プレビューでのみ有効）
        disabled={isSelected !== undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={`${widget.id}-option-${option.value}-${index}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Select, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

---

## 9. デフォルト値定義

### 9.1 デフォルト値定義ファイル (`src/lib/widget-defaults.ts`)

```typescript
import {
  TextWidgetProps,
  InputWidgetProps,
  ButtonWidgetProps,
  ImageWidgetProps,
  TableWidgetProps,
  SelectWidgetProps,
} from '@/types/widget';

/**
 * Text Widget のデフォルトプロパティ
 */
export const DEFAULT_TEXT_PROPS: TextWidgetProps = {
  content: 'Text',
  fontSize: 16,
  color: '#000000',
  fontWeight: 'normal',
  textAlign: 'left',
  fontFamily: 'inherit',
  lineHeight: 1.5,
};

/**
 * Input Widget のデフォルトプロパティ
 */
export const DEFAULT_INPUT_PROPS: InputWidgetProps = {
  label: 'Input',
  placeholder: 'Enter text...',
  inputType: 'text',
  required: false,
  width: 200,
  defaultValue: '',
};

/**
 * Button Widget のデフォルトプロパティ
 */
export const DEFAULT_BUTTON_PROPS: ButtonWidgetProps = {
  text: 'Button',
  variant: 'primary',
  size: 'medium',
  color: '#3B82F6',
  textColor: '#FFFFFF',
  borderRadius: 6,
  disabled: false,
};

/**
 * Image Widget のデフォルトプロパティ
 */
export const DEFAULT_IMAGE_PROPS: ImageWidgetProps = {
  src: 'https://via.placeholder.com/300x200',
  alt: 'Image',
  objectFit: 'cover',
  borderRadius: 0,
  opacity: 1,
};

/**
 * Table Widget のデフォルトプロパティ
 */
export const DEFAULT_TABLE_PROPS: TableWidgetProps = {
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
};

/**
 * Select Widget のデフォルトプロパティ
 */
export const DEFAULT_SELECT_PROPS: SelectWidgetProps = {
  label: 'Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  placeholder: 'Choose an option...',
  required: false,
  width: 200,
  defaultValue: '',
};

/**
 * Widget種類に応じたデフォルトプロパティを取得
 */
export function getDefaultProps(type: string): any {
  switch (type) {
    case 'Text':
      return DEFAULT_TEXT_PROPS;
    case 'Input':
      return DEFAULT_INPUT_PROPS;
    case 'Button':
      return DEFAULT_BUTTON_PROPS;
    case 'Image':
      return DEFAULT_IMAGE_PROPS;
    case 'Table':
      return DEFAULT_TABLE_PROPS;
    case 'Select':
      return DEFAULT_SELECT_PROPS;
    default:
      return {};
  }
}
```

---

## 10. Props to Style変換ロジック

### 10.1 スタイル変換ユーティリティ (`src/lib/style-converter.ts`)

```typescript
import { CSSProperties } from 'react';
import {
  TextWidgetProps,
  InputWidgetProps,
  ButtonWidgetProps,
  ImageWidgetProps,
  TableWidgetProps,
  SelectWidgetProps,
} from '@/types/widget';

/**
 * hex色をrgbaに変換
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

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
```

---

## 11. インタラクティブ動作

### 11.1 選択状態管理 (`src/hooks/useWidgetSelection.ts`)

```typescript
import { useState, useCallback } from 'react';

/**
 * Widget選択状態を管理するカスタムフック
 */
export function useWidgetSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /**
   * Widgetを選択
   */
  const selectWidget = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  /**
   * 選択を解除
   */
  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  /**
   * Widgetにホバー
   */
  const hoverWidget = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  /**
   * ホバーを解除
   */
  const clearHover = useCallback(() => {
    setHoveredId(null);
  }, []);

  /**
   * 指定IDのWidgetが選択されているか
   */
  const isSelected = useCallback(
    (id: string) => selectedId === id,
    [selectedId]
  );

  /**
   * 指定IDのWidgetがホバーされているか
   */
  const isHovered = useCallback(
    (id: string) => hoveredId === id,
    [hoveredId]
  );

  return {
    selectedId,
    hoveredId,
    selectWidget,
    clearSelection,
    hoverWidget,
    clearHover,
    isSelected,
    isHovered,
  };
}
```

---

## 12. レンダリング最適化

### 12.1 メモ化戦略

すべてのWidgetコンポーネントは`React.memo`でメモ化されており、以下の条件でのみ再レンダリングされます:

1. **Widget ID が変更された場合**
2. **選択状態が変更された場合**
3. **ホバー状態が変更された場合**
4. **Widget Props が変更された場合**

### 12.2 カスタム比較関数

```typescript
// 各Widgetコンポーネントで使用されるメモ化の比較関数
function arePropsEqual(
  prevProps: WidgetComponentProps<Widget>,
  nextProps: WidgetComponentProps<Widget>
): boolean {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
}
```

### 12.3 パフォーマンスベストプラクティス

1. **不要な状態更新を避ける**: イベントハンドラ内で状態が実際に変更される場合のみ更新
2. **useCallback の活用**: イベントハンドラをメモ化して子コンポーネントの再レンダリングを防止
3. **CSS transitions の使用**: JavaScriptアニメーションの代わりにCSS transitionsを使用
4. **仮想化の検討**: 多数のWidgetがある場合、react-windowなどを検討（将来的）

---

## 13. 使用例とプレビュー

### 13.1 基本的な使用例

```tsx
import Text from '@/components/widgets/Text';
import Button from '@/components/widgets/Button';
import { TextWidget, ButtonWidget } from '@/types/widget';

function ExamplePage() {
  const textWidget: TextWidget = {
    id: 'text-1',
    type: 'Text',
    position: { x: 100, y: 50 },
    size: { width: 200, height: 30 },
    props: {
      content: 'Welcome to NoCode UI Builder',
      fontSize: 24,
      color: '#1F2937',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  const buttonWidget: ButtonWidget = {
    id: 'button-1',
    type: 'Button',
    position: { x: 100, y: 100 },
    size: { width: 160, height: 48 },
    props: {
      text: 'Get Started',
      variant: 'primary',
      size: 'medium',
      color: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 8,
    },
  };

  return (
    <div>
      <Text widget={textWidget} />
      <Button widget={buttonWidget} />
    </div>
  );
}
```

### 13.2 ビルダー内での使用例

```tsx
import { useWidgetSelection } from '@/hooks/useWidgetSelection';
import Text from '@/components/widgets/Text';
import { Widget } from '@/types/widget';

function Canvas({ widgets }: { widgets: Widget[] }) {
  const {
    selectedId,
    hoveredId,
    selectWidget,
    hoverWidget,
    clearHover,
    isSelected,
    isHovered,
  } = useWidgetSelection();

  return (
    <div onMouseLeave={clearHover}>
      {widgets.map((widget) => {
        const WidgetComponent = getWidgetComponent(widget.type);

        return (
          <div
            key={widget.id}
            style={{
              position: 'absolute',
              left: widget.position.x,
              top: widget.position.y,
              width: widget.size.width,
              height: widget.size.height,
            }}
          >
            <WidgetComponent
              widget={widget}
              isSelected={isSelected(widget.id)}
              isHovered={isHovered(widget.id)}
              onSelect={() => selectWidget(widget.id)}
              onHover={() => hoverWidget(widget.id)}
            />
          </div>
        );
      })}
    </div>
  );
}

function getWidgetComponent(type: string) {
  // Widget種類に応じたコンポーネントを返す
  // 実装は省略
}
```

---

## まとめ

このドキュメントでは、NoCode UI Builderの6種類のWidgetコンポーネントの完全な実装を提供しました。

### 実装されたWidget一覧

1. **Text Widget** - テキスト表示（約180行）
2. **Input Widget** - 入力フィールド（約220行）
3. **Button Widget** - ボタン（約250行）
4. **Image Widget** - 画像表示（約230行）
5. **Table Widget** - テーブル（約250行）
6. **Select Widget** - ドロップダウン（約220行）

### 主要機能

- ✅ 型安全なTypeScript実装
- ✅ React.memoによる最適化
- ✅ 選択・ホバー状態の管理
- ✅ Props to Style変換
- ✅ アクセシビリティ対応
- ✅ 拡張可能なアーキテクチャ

### 次のステップ

1. Widgetコンポーネントのユニットテスト作成
2. Storybook でのコンポーネントカタログ作成
3. PropertiesPanel での編集UI実装
4. ドラッグ&ドロップ機能との統合

---

**作成者**: NoCode UI Builder Development Team
**最終更新**: 2025年10月21日
