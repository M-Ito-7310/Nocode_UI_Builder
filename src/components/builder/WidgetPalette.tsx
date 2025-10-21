'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { WidgetType } from '@/types/widget';

interface WidgetPaletteProps {
  className?: string;
}

interface WidgetPaletteItemData {
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

// Widget一覧データ
const WIDGET_ITEMS: WidgetPaletteItemData[] = [
  {
    type: 'Text',
    label: 'テキスト',
    description: 'テキストや見出しを表示',
    color: 'bg-blue-100 text-blue-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    type: 'Input',
    label: '入力',
    description: 'テキスト入力フィールド',
    color: 'bg-green-100 text-green-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    type: 'Button',
    label: 'ボタン',
    description: 'クリック可能なボタン',
    color: 'bg-purple-100 text-purple-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    type: 'Image',
    label: '画像',
    description: '画像を表示',
    color: 'bg-yellow-100 text-yellow-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'Table',
    label: 'テーブル',
    description: 'データテーブル',
    color: 'bg-red-100 text-red-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'Select',
    label: 'セレクト',
    description: 'ドロップダウン選択',
    color: 'bg-indigo-100 text-indigo-700',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
];

interface DraggableWidgetItemProps {
  data: WidgetPaletteItemData;
}

// ドラッグ可能なWidgetアイテム
function DraggableWidgetItem({ data }: DraggableWidgetItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${data.type}`,
    data: { type: data.type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200
        hover:border-blue-400 hover:shadow-md cursor-move
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <div className={`flex-shrink-0 p-2 rounded-md ${data.color}`}>
        {data.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900">{data.label}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{data.description}</p>
      </div>
    </div>
  );
}

export function WidgetPalette({ className = '' }: WidgetPaletteProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Widgets</h2>
        <p className="text-xs text-gray-500 mt-1">
          ドラッグしてキャンバスに配置
        </p>
      </div>

      {/* Widget一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {WIDGET_ITEMS.map((item) => (
          <DraggableWidgetItem key={item.type} data={item} />
        ))}
      </div>

      {/* フッター（オプション） */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-400 text-center">
          {WIDGET_ITEMS.length}種類のWidget
        </p>
      </div>
    </div>
  );
}
