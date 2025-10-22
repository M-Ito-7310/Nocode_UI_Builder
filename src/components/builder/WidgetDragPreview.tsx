'use client';

import React from 'react';
import type { Widget, WidgetType } from '@/types/widget';
import { getDefaultSize } from '@/lib/widget-utils';

interface WidgetDragPreviewProps {
  widget?: Widget;
  widgetType?: WidgetType;
}

/**
 * ドラッグ中にウィジェットのアウトラインを表示するコンポーネント
 *
 * パレットからのドラッグ時: widgetType を使用してデフォルトサイズで表示
 * 既存ウィジェットの移動時: widget を使用して実際のサイズで表示
 */
export function WidgetDragPreview({ widget, widgetType }: WidgetDragPreviewProps) {
  // サイズの決定
  const size = widget?.size || (widgetType ? getDefaultSize(widgetType) : { width: 120, height: 40 });
  const type = widget?.type || widgetType || 'Button';

  // ウィジェットタイプに応じた色設定
  const getColorForType = (type: WidgetType): string => {
    switch (type) {
      case 'Text':
        return 'border-blue-400 bg-blue-50';
      case 'Input':
        return 'border-green-400 bg-green-50';
      case 'Button':
        return 'border-purple-400 bg-purple-50';
      case 'Image':
        return 'border-yellow-400 bg-yellow-50';
      case 'Table':
        return 'border-red-400 bg-red-50';
      case 'Select':
        return 'border-indigo-400 bg-indigo-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  // ウィジェットタイプに応じたラベル
  const getLabel = (): string => {
    if (widget) {
      return `${type} (${size.width}×${size.height})`;
    }
    return `${type} Widget`;
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 border-dashed shadow-lg
        ${getColorForType(type)}
        opacity-80
        transition-all duration-200
      `}
      style={{
        width: size.width,
        height: size.height,
        pointerEvents: 'none',
      }}
    >
      {/* アウトライン内部のコンテンツ */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700">
            {getLabel()}
          </div>

          {/* ウィジェットタイプアイコン */}
          <div className="mt-1 flex items-center justify-center opacity-50">
            {type === 'Text' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            )}
            {type === 'Input' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
            {type === 'Button' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            )}
            {type === 'Image' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {type === 'Table' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            {type === 'Select' && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 4隅のリサイズハンドルの視覚化（装飾用） */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-current rounded-full opacity-50" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full opacity-50" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-current rounded-full opacity-50" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-current rounded-full opacity-50" />
    </div>
  );
}
