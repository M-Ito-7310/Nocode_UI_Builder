'use client';

import React, { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { WidgetWrapper } from './WidgetWrapper';
import type { Widget } from '@/types/widget';

interface CanvasProps {
  widgets: Widget[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
  onDeleteWidget: (id: string) => void;
  showGrid?: boolean;
}

export function Canvas({
  widgets,
  selectedWidgetId,
  onSelectWidget,
  onUpdateWidget,
  onDeleteWidget,
  showGrid = true,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // ドロップ可能エリアとして設定
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  // キャンバスクリックで選択解除
  const handleCanvasClick = (e: React.MouseEvent) => {
    // キャンバス自体をクリックした場合のみ選択解除
    if (e.target === canvasRef.current) {
      onSelectWidget('');
    }
  };

  // 空状態の判定
  const isEmpty = widgets.length === 0;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (node) {
          (canvasRef as React.MutableRefObject<HTMLDivElement>).current = node;
        }
      }}
      onClick={handleCanvasClick}
      className={`
        relative w-full h-full min-h-[600px] bg-white overflow-auto
        ${showGrid ? 'canvas-grid' : ''}
        ${isOver ? 'ring-2 ring-blue-400 ring-inset' : ''}
        transition-all duration-200
      `}
      style={{
        backgroundImage: showGrid
          ? `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `
          : 'none',
        backgroundSize: showGrid ? '20px 20px' : 'auto',
      }}
    >
      {/* 空状態表示 */}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-sm font-medium">キャンバスが空です</h3>
            <p className="mt-1 text-xs">
              左側のパレットからWidgetをドラッグ&ドロップしてください
            </p>
          </div>
        </div>
      )}

      {/* Widget一覧のレンダリング */}
      {widgets.map((widget) => (
        <WidgetWrapper
          key={widget.id}
          widget={widget}
          isSelected={selectedWidgetId === widget.id}
          onSelect={() => onSelectWidget(widget.id)}
          onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
          onDelete={() => onDeleteWidget(widget.id)}
        />
      ))}

      {/* ドロップ可能状態のオーバーレイ */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-30 pointer-events-none border-2 border-dashed border-blue-400 rounded-lg">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 font-medium">
            ここにドロップ
          </div>
        </div>
      )}
    </div>
  );
}
