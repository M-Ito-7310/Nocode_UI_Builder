'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Widget } from '@/types/widget';
import { renderWidget } from '@/lib/widget-renderer';

interface WidgetWrapperProps {
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Widget>) => void;
  onDelete: () => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

export function WidgetWrapper({
  widget,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: WidgetWrapperProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });

  // ドラッグ可能に設定
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
    disabled: isResizing,
  });

  // リサイズ開始
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startSizeRef.current = { ...widget.size };
  };

  // リサイズ中
  useEffect(() => {
    if (!isResizing || !resizeHandle) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;
      let newX = widget.position.x;
      let newY = widget.position.y;

      // 各リサイズハンドルに応じた計算
      switch (resizeHandle) {
        case 'se': // 右下
          newWidth = Math.max(50, startSizeRef.current.width + deltaX);
          newHeight = Math.max(30, startSizeRef.current.height + deltaY);
          break;
        case 'sw': // 左下
          newWidth = Math.max(50, startSizeRef.current.width - deltaX);
          newHeight = Math.max(30, startSizeRef.current.height + deltaY);
          newX = widget.position.x + deltaX;
          if (newWidth === 50) {
            newX = widget.position.x;
          }
          break;
        case 'ne': // 右上
          newWidth = Math.max(50, startSizeRef.current.width + deltaX);
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newY = widget.position.y + deltaY;
          if (newHeight === 30) {
            newY = widget.position.y;
          }
          break;
        case 'nw': // 左上
          newWidth = Math.max(50, startSizeRef.current.width - deltaX);
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newX = widget.position.x + deltaX;
          newY = widget.position.y + deltaY;
          if (newWidth === 50) {
            newX = widget.position.x;
          }
          if (newHeight === 30) {
            newY = widget.position.y;
          }
          break;
        case 'e': // 右
          newWidth = Math.max(50, startSizeRef.current.width + deltaX);
          break;
        case 'w': // 左
          newWidth = Math.max(50, startSizeRef.current.width - deltaX);
          newX = widget.position.x + deltaX;
          if (newWidth === 50) {
            newX = widget.position.x;
          }
          break;
        case 's': // 下
          newHeight = Math.max(30, startSizeRef.current.height + deltaY);
          break;
        case 'n': // 上
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newY = widget.position.y + deltaY;
          if (newHeight === 30) {
            newY = widget.position.y;
          }
          break;
      }

      onUpdate({
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, widget, onUpdate]);

  // キーボード操作（削除）
  useEffect(() => {
    if (!isSelected) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, onDelete]);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (node) {
          (wrapperRef as React.MutableRefObject<HTMLDivElement>).current = node;
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`
        absolute cursor-move group
        ${isSelected ? 'z-10' : 'z-0'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
      }}
      {...attributes}
      {...listeners}
    >
      {/* 選択枠 */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded" />
      )}

      {/* Widget本体 */}
      <div className="w-full h-full">
        {renderWidget(widget)}
      </div>

      {/* リサイズハンドル */}
      {isSelected && (
        <>
          {/* 角のハンドル */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />

          {/* 辺のハンドル */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}

      {/* 削除ボタン */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
          title="削除"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Widget情報（ホバー時） */}
      <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
        {widget.type} ({widget.size.width}×{widget.size.height})
      </div>
    </div>
  );
}
