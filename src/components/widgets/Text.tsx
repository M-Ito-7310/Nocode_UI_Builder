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
