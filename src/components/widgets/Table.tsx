'use client';

import React, { memo, CSSProperties } from 'react';
import { TableWidget, WidgetComponentProps, TableColumn } from '@/types/widget';

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
