'use client';

import React, { memo, CSSProperties, useState } from 'react';
import { SelectWidget, WidgetComponentProps } from '@/types/widget';

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
  const { label, options, defaultValue, placeholder, required } = widget.props;

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
    width: '100%',
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
        disabled={onSelect !== undefined}
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
