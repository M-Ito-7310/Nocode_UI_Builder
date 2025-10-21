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
  const { label, placeholder, inputType, required, defaultValue } = widget.props;

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
    width: '100%',
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
