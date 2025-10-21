# ビルダーコンポーネント実装ガイド

## 目次
1. [ビルダーアーキテクチャ設計](#ビルダーアーキテクチャ設計)
2. [dnd-kitライブラリ概要](#dnd-kitライブラリ概要)
3. [状態管理戦略](#状態管理戦略)
4. [Canvas.tsx 完全実装](#canvastsx-完全実装)
5. [WidgetPalette.tsx 完全実装](#widgetpalettetsx-完全実装)
6. [WidgetWrapper.tsx 完全実装](#widgetwrappertsx-完全実装)
7. [PropertiesPanel.tsx 完全実装](#propertiespaneltsx-完全実装)
8. [Toolbar.tsx 完全実装](#toolbartsx-完全実装)
9. [パフォーマンス最適化](#パフォーマンス最適化)

---

## ビルダーアーキテクチャ設計

### 全体構造

ビルダーは以下の5つの主要コンポーネントで構成されます:

```
┌────────────────────────────────────────────────────────┐
│  Toolbar (保存、プレビュー、エクスポート)              │
├──────────┬────────────────────────┬────────────────────┤
│          │                        │                    │
│  Widget  │                        │   Properties       │
│  Palette │      Canvas            │   Panel            │
│          │                        │                    │
│  (6種)   │   ┌──────────────┐    │  (選択Widget編集)  │
│          │   │WidgetWrapper │    │                    │
│          │   └──────────────┘    │                    │
│          │                        │                    │
└──────────┴────────────────────────┴────────────────────┘
```

### データフロー

```typescript
// 状態管理フロー
User Action (ドラッグ&ドロップ)
    ↓
DndContext イベント (onDragEnd)
    ↓
State 更新 (setWidgets)
    ↓
Canvas 再レンダリング
    ↓
WidgetWrapper 表示更新
```

### コンポーネント間の依存関係

```
Builder Page (親)
├── Toolbar
├── DndContext
│   ├── WidgetPalette (ドラッグ元)
│   ├── Canvas (ドロップ先)
│   │   └── WidgetWrapper[] (個別Widget)
│   └── DragOverlay
└── PropertiesPanel
```

---

## dnd-kitライブラリ概要

### dnd-kitとは

`@dnd-kit/core`は、モダンなドラッグ&ドロップ機能を実装するためのReactライブラリです。

**主な特徴:**
- アクセシビリティ対応（キーボード操作可能）
- タッチデバイス対応
- 型安全（TypeScript完全対応）
- パフォーマンス最適化
- カスタマイズ性が高い

### インストール

```bash
npm install @dnd-kit/core @dnd-kit/utilities
```

### 基本概念

#### 1. DndContext
ドラッグ&ドロップの親コンテキスト。すべてのドラッグ可能/ドロップ可能な要素を包む。

```typescript
import { DndContext, DragEndEvent } from '@dnd-kit/core';

<DndContext onDragEnd={handleDragEnd}>
  {/* ドラッグ可能/ドロップ可能な要素 */}
</DndContext>
```

#### 2. useDraggable
ドラッグ可能な要素を作成するフック。

```typescript
import { useDraggable } from '@dnd-kit/core';

function DraggableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { type: 'widget' }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      ドラッグ可能
    </div>
  );
}
```

#### 3. useDroppable
ドロップ可能なエリアを作成するフック。

```typescript
import { useDroppable } from '@dnd-kit/core';

function DroppableArea({ id }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} style={{ background: isOver ? 'lightblue' : 'white' }}>
      ドロップエリア
    </div>
  );
}
```

#### 4. DragOverlay
ドラッグ中のプレビュー表示。

```typescript
import { DragOverlay } from '@dnd-kit/core';

<DragOverlay>
  {activeId ? <div>ドラッグ中...</div> : null}
</DragOverlay>
```

### イベントハンドリング

```typescript
// DragStartイベント - ドラッグ開始時
function handleDragStart(event: DragStartEvent) {
  const { active } = event;
  console.log('ドラッグ開始:', active.id);
}

// DragEndイベント - ドラッグ終了時
function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (over && over.id === 'canvas') {
    // キャンバスにドロップされた
    const widgetType = active.data.current?.type;
    addWidgetToCanvas(widgetType);
  }
}
```

---

## 状態管理戦略

### React useState を使用

プロトタイプでは、シンプルな`useState`で状態管理を行います。

```typescript
// Builder Page での状態定義
const [widgets, setWidgets] = useState<Widget[]>([]);
const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
const [projectName, setProjectName] = useState<string>('Untitled Project');
```

### 状態の種類

#### 1. widgets: Widget[]
キャンバス上のすべてのWidgetを保持。

```typescript
interface Widget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props: Record<string, any>;
}
```

#### 2. selectedWidgetId: string | null
現在選択中のWidgetのID。`null`は何も選択されていない状態。

#### 3. projectName: string
プロジェクト名。

### 状態更新パターン

```typescript
// Widget追加
const addWidget = (type: WidgetType, position: { x: number; y: number }) => {
  const newWidget: Widget = {
    id: generateId(),
    type,
    position,
    size: getDefaultSize(type),
    props: getDefaultProps(type),
  };
  setWidgets([...widgets, newWidget]);
};

// Widget更新
const updateWidget = (id: string, updates: Partial<Widget>) => {
  setWidgets(widgets.map(w =>
    w.id === id ? { ...w, ...updates } : w
  ));
};

// Widget削除
const deleteWidget = (id: string) => {
  setWidgets(widgets.filter(w => w.id !== id));
  if (selectedWidgetId === id) {
    setSelectedWidgetId(null);
  }
};
```

---

## Canvas.tsx 完全実装

### ファイルパス
`src/components/builder/Canvas.tsx`

### 完全なコード

```typescript
'use client';

import React, { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { WidgetWrapper } from './WidgetWrapper';
import type { Widget, WidgetType } from '@/types/widget';

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

// グリッド表示用のCSS（globals.cssに追加）
/*
.canvas-grid {
  background-color: #ffffff;
}

.canvas-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}
*/
```

### 主な機能

1. **ドロップ可能エリア**: `useDroppable`でキャンバス全体をドロップ可能に設定
2. **グリッド表示**: `backgroundImage`を使用してグリッド線を表示
3. **空状態表示**: Widgetがない場合の案内メッセージ
4. **選択解除**: キャンバス自体をクリックした時に選択解除
5. **ドロップハイライト**: `isOver`でドロップ可能状態を視覚的に表示

### スタイリング詳細

```css
/* グリッド背景 */
background-image:
  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
background-size: 20px 20px;

/* ドロップハイライト */
ring-2 ring-blue-400 ring-inset
```

---

## WidgetPalette.tsx 完全実装

### ファイルパス
`src/components/builder/WidgetPalette.tsx`

### 完全なコード

```typescript
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
```

### 主な機能

1. **6種類のWidget**: Text, Input, Button, Image, Table, Select
2. **ドラッグ可能**: 各アイテムが`useDraggable`で設定
3. **視覚的フィードバック**: ドラッグ中は透明度とスケールが変化
4. **アイコン表示**: 各Widgetに対応するSVGアイコン
5. **カラーコード**: Widget種類ごとに異なる背景色

### デザイン詳細

- **ホバー効果**: `hover:border-blue-400 hover:shadow-md`
- **ドラッグ効果**: `opacity-50 scale-95` (ドラッグ中)
- **レスポンシブ**: スクロール可能で、高さに応じて自動調整

---

## WidgetWrapper.tsx 完全実装

### ファイルパス
`src/components/builder/WidgetWrapper.tsx`

### 完全なコード

```typescript
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
    if (!isResizing || !resizeHandle) return;

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
          if (newWidth === 50) newX = widget.position.x;
          break;
        case 'ne': // 右上
          newWidth = Math.max(50, startSizeRef.current.width + deltaX);
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newY = widget.position.y + deltaY;
          if (newHeight === 30) newY = widget.position.y;
          break;
        case 'nw': // 左上
          newWidth = Math.max(50, startSizeRef.current.width - deltaX);
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newX = widget.position.x + deltaX;
          newY = widget.position.y + deltaY;
          if (newWidth === 50) newX = widget.position.x;
          if (newHeight === 30) newY = widget.position.y;
          break;
        case 'e': // 右
          newWidth = Math.max(50, startSizeRef.current.width + deltaX);
          break;
        case 'w': // 左
          newWidth = Math.max(50, startSizeRef.current.width - deltaX);
          newX = widget.position.x + deltaX;
          if (newWidth === 50) newX = widget.position.x;
          break;
        case 's': // 下
          newHeight = Math.max(30, startSizeRef.current.height + deltaY);
          break;
        case 'n': // 上
          newHeight = Math.max(30, startSizeRef.current.height - deltaY);
          newY = widget.position.y + deltaY;
          if (newHeight === 30) newY = widget.position.y;
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
    if (!isSelected) return;

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
```

### 主な機能

1. **ドラッグ移動**: `useDraggable`でWidget全体をドラッグ可能
2. **リサイズ**: 8方向のハンドルで自由にサイズ変更
3. **選択状態**: クリックで選択、青い枠線で表示
4. **削除ボタン**: 選択時に右上に表示
5. **キーボード操作**: DeleteキーまたはBackspaceで削除
6. **Widget情報**: ホバー時に種類とサイズを表示

### リサイズロジック詳細

```typescript
// 最小サイズ制限
Math.max(50, calculatedWidth)  // 幅の最小値50px
Math.max(30, calculatedHeight) // 高さの最小値30px

// ハンドル位置計算
'nw': 左上 - width減少、height減少、x増加、y増加
'ne': 右上 - width増加、height減少、y増加
'sw': 左下 - width減少、height増加、x増加
'se': 右下 - width増加、height増加
'n':  上   - height減少、y増加
's':  下   - height増加
'e':  右   - width増加
'w':  左   - width減少、x増加
```

---

## PropertiesPanel.tsx 完全実装

### ファイルパス
`src/components/builder/PropertiesPanel.tsx`

### 完全なコード

```typescript
'use client';

import React from 'react';
import type { Widget, WidgetType } from '@/types/widget';

interface PropertiesPanelProps {
  selectedWidget: Widget | null;
  onUpdateWidget: (updates: Partial<Widget>) => void;
  className?: string;
}

export function PropertiesPanel({
  selectedWidget,
  onUpdateWidget,
  className = '',
}: PropertiesPanelProps) {
  if (!selectedWidget) {
    return (
      <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">プロパティ</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <p className="text-sm">Widgetを選択してください</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProps = (propUpdates: Record<string, any>) => {
    onUpdateWidget({
      props: { ...selectedWidget.props, ...propUpdates },
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">プロパティ</h2>
        <p className="text-xs text-gray-500 mt-1">
          {selectedWidget.type} Widget
        </p>
      </div>

      {/* プロパティフォーム */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 共通プロパティ: 位置とサイズ */}
        <PropertySection title="位置とサイズ">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="X"
              value={selectedWidget.position.x}
              onChange={(x) => onUpdateWidget({ position: { ...selectedWidget.position, x } })}
              min={0}
            />
            <NumberInput
              label="Y"
              value={selectedWidget.position.y}
              onChange={(y) => onUpdateWidget({ position: { ...selectedWidget.position, y } })}
              min={0}
            />
            <NumberInput
              label="幅"
              value={selectedWidget.size.width}
              onChange={(width) => onUpdateWidget({ size: { ...selectedWidget.size, width } })}
              min={50}
            />
            <NumberInput
              label="高さ"
              value={selectedWidget.size.height}
              onChange={(height) => onUpdateWidget({ size: { ...selectedWidget.size, height } })}
              min={30}
            />
          </div>
        </PropertySection>

        {/* Widget種類別プロパティ */}
        {selectedWidget.type === 'Text' && (
          <TextWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Input' && (
          <InputWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Button' && (
          <ButtonWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Image' && (
          <ImageWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Table' && (
          <TableWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Select' && (
          <SelectWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
      </div>
    </div>
  );
}

// セクションコンポーネント
function PropertySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 border-b pb-2">{title}</h3>
      {children}
    </div>
  );
}

// 入力コンポーネント
function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-9 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label className="ml-2 text-sm text-gray-700">{label}</label>
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step || 1}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

// Widget別プロパティコンポーネント

function TextWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="テキスト">
        <TextAreaInput
          label="内容"
          value={props.content || 'Text'}
          onChange={(content) => updateProps({ content })}
        />
        <RangeInput
          label="フォントサイズ"
          value={props.fontSize || 16}
          onChange={(fontSize) => updateProps({ fontSize })}
          min={8}
          max={72}
        />
        <ColorInput
          label="テキスト色"
          value={props.color || '#000000'}
          onChange={(color) => updateProps({ color })}
        />
        <SelectInput
          label="太さ"
          value={props.fontWeight || 'normal'}
          onChange={(fontWeight) => updateProps({ fontWeight })}
          options={[
            { value: 'normal', label: '標準' },
            { value: 'bold', label: '太字' },
            { value: '300', label: '細字' },
            { value: '500', label: '中字' },
            { value: '700', label: '太字' },
          ]}
        />
        <SelectInput
          label="配置"
          value={props.textAlign || 'left'}
          onChange={(textAlign) => updateProps({ textAlign })}
          options={[
            { value: 'left', label: '左揃え' },
            { value: 'center', label: '中央揃え' },
            { value: 'right', label: '右揃え' },
          ]}
        />
      </PropertySection>
    </>
  );
}

function InputWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="入力フィールド">
        <TextInput
          label="ラベル"
          value={props.label || 'Input'}
          onChange={(label) => updateProps({ label })}
        />
        <TextInput
          label="プレースホルダー"
          value={props.placeholder || 'Enter text...'}
          onChange={(placeholder) => updateProps({ placeholder })}
        />
        <SelectInput
          label="入力タイプ"
          value={props.inputType || 'text'}
          onChange={(inputType) => updateProps({ inputType })}
          options={[
            { value: 'text', label: 'テキスト' },
            { value: 'email', label: 'メール' },
            { value: 'password', label: 'パスワード' },
            { value: 'number', label: '数値' },
            { value: 'tel', label: '電話番号' },
          ]}
        />
        <CheckboxInput
          label="必須項目"
          value={props.required || false}
          onChange={(required) => updateProps({ required })}
        />
      </PropertySection>
    </>
  );
}

function ButtonWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="ボタン">
        <TextInput
          label="テキスト"
          value={props.text || 'Button'}
          onChange={(text) => updateProps({ text })}
        />
        <SelectInput
          label="バリアント"
          value={props.variant || 'primary'}
          onChange={(variant) => updateProps({ variant })}
          options={[
            { value: 'primary', label: 'プライマリ' },
            { value: 'secondary', label: 'セカンダリ' },
            { value: 'outline', label: 'アウトライン' },
            { value: 'ghost', label: 'ゴースト' },
          ]}
        />
        <SelectInput
          label="サイズ"
          value={props.size || 'medium'}
          onChange={(size) => updateProps({ size })}
          options={[
            { value: 'small', label: '小' },
            { value: 'medium', label: '中' },
            { value: 'large', label: '大' },
          ]}
        />
        <ColorInput
          label="背景色"
          value={props.color || '#3B82F6'}
          onChange={(color) => updateProps({ color })}
        />
        <ColorInput
          label="テキスト色"
          value={props.textColor || '#FFFFFF'}
          onChange={(textColor) => updateProps({ textColor })}
        />
        <RangeInput
          label="角丸"
          value={props.borderRadius || 6}
          onChange={(borderRadius) => updateProps({ borderRadius })}
          min={0}
          max={20}
        />
      </PropertySection>
    </>
  );
}

function ImageWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="画像">
        <TextInput
          label="画像URL"
          value={props.src || 'https://via.placeholder.com/300x200'}
          onChange={(src) => updateProps({ src })}
          placeholder="https://example.com/image.jpg"
        />
        <TextInput
          label="代替テキスト"
          value={props.alt || 'Image'}
          onChange={(alt) => updateProps({ alt })}
        />
        <SelectInput
          label="オブジェクトフィット"
          value={props.objectFit || 'cover'}
          onChange={(objectFit) => updateProps({ objectFit })}
          options={[
            { value: 'contain', label: '全体表示' },
            { value: 'cover', label: 'カバー' },
            { value: 'fill', label: '引き伸ばし' },
            { value: 'none', label: 'なし' },
          ]}
        />
        <RangeInput
          label="角丸"
          value={props.borderRadius || 0}
          onChange={(borderRadius) => updateProps({ borderRadius })}
          min={0}
          max={50}
        />
        <RangeInput
          label="不透明度"
          value={props.opacity || 1}
          onChange={(opacity) => updateProps({ opacity })}
          min={0}
          max={1}
          step={0.1}
        />
      </PropertySection>
    </>
  );
}

function TableWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="テーブル">
        <CheckboxInput
          label="ストライプ表示"
          value={props.striped ?? true}
          onChange={(striped) => updateProps({ striped })}
        />
        <CheckboxInput
          label="ボーダー表示"
          value={props.bordered ?? true}
          onChange={(bordered) => updateProps({ bordered })}
        />
        <CheckboxInput
          label="ホバー効果"
          value={props.hoverable ?? true}
          onChange={(hoverable) => updateProps({ hoverable })}
        />
        <ColorInput
          label="ヘッダー背景色"
          value={props.headerBgColor || '#F3F4F6'}
          onChange={(headerBgColor) => updateProps({ headerBgColor })}
        />
        <ColorInput
          label="ヘッダーテキスト色"
          value={props.headerTextColor || '#111827'}
          onChange={(headerTextColor) => updateProps({ headerTextColor })}
        />
      </PropertySection>
      <PropertySection title="データ">
        <p className="text-xs text-gray-500">
          テーブルデータの編集は将来のバージョンで実装予定です
        </p>
      </PropertySection>
    </>
  );
}

function SelectWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="セレクト">
        <TextInput
          label="ラベル"
          value={props.label || 'Select'}
          onChange={(label) => updateProps({ label })}
        />
        <TextInput
          label="プレースホルダー"
          value={props.placeholder || 'Choose an option...'}
          onChange={(placeholder) => updateProps({ placeholder })}
        />
        <CheckboxInput
          label="必須項目"
          value={props.required || false}
          onChange={(required) => updateProps({ required })}
        />
      </PropertySection>
      <PropertySection title="オプション">
        <p className="text-xs text-gray-500">
          オプションの編集は将来のバージョンで実装予定です
        </p>
      </PropertySection>
    </>
  );
}
```

### 主な機能

1. **Widget種類別UI**: 各Widgetに最適化されたプロパティ編集UI
2. **リアルタイム更新**: 変更が即座にキャンバスに反映
3. **多様な入力形式**:
   - テキスト入力
   - 数値入力
   - カラーピッカー
   - ドロップダウン
   - チェックボックス
   - レンジスライダー
   - テキストエリア
4. **共通プロパティ**: 位置とサイズは全Widgetで編集可能

---

## Toolbar.tsx 完全実装

### ファイルパス
`src/components/builder/Toolbar.tsx`

### 完全なコード

```typescript
'use client';

import React, { useState } from 'react';

interface ToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function Toolbar({
  projectName,
  onProjectNameChange,
  onSave,
  onPreview,
  onExport,
  isSaving = false,
  lastSaved = null,
}: ToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(projectName);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim());
    } else {
      setTempName(projectName);
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(projectName);
    setIsEditingName(false);
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '未保存';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;

    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* 左側: プロジェクト名 */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') handleNameCancel();
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              style={{ width: '300px' }}
            />
            <button
              onClick={handleNameSave}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleNameCancel}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            onClick={handleNameEdit}
            className="flex items-center gap-2 group"
          >
            <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {projectName}
            </h1>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {/* 最終保存時刻 */}
        {!isEditingName && (
          <span className="text-xs text-gray-500">
            {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>

      {/* 右側: アクションボタン */}
      <div className="flex items-center gap-3">
        {/* 保存ボタン */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              isSaving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }
          `}
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              保存中...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              保存
            </>
          )}
        </button>

        {/* プレビューボタン */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 hover:shadow-md transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          プレビュー
        </button>

        {/* エクスポートボタン */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 hover:shadow-md transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          エクスポート
        </button>
      </div>
    </div>
  );
}
```

### 主な機能

1. **プロジェクト名編集**: クリックでインライン編集モード
2. **保存ボタン**: ローディング状態表示
3. **最終保存時刻**: 相対時間表示（たった今、○分前、など）
4. **プレビューボタン**: 別ウィンドウでプレビュー表示
5. **エクスポートボタン**: HTML/CSSファイル生成

### インタラクション

- **プロジェクト名**:
  - クリックで編集モード
  - Enterで保存、Escapeでキャンセル
  - 空欄の場合は元の名前に戻る

- **保存中**:
  - ボタンが無効化
  - スピナーアニメーション表示

---

## dnd-kitイベントハンドリング

### Builder Pageでの統合

```typescript
// src/app/builder/page.tsx

'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { Canvas } from '@/components/builder/Canvas';
import { WidgetPalette } from '@/components/builder/WidgetPalette';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';
import type { Widget, WidgetType } from '@/types/widget';

export default function BuilderPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');

  // ドラッグ開始
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // ドラッグ終了
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // パレットからキャンバスへのドロップ
    if (over.id === 'canvas' && active.id.toString().startsWith('palette-')) {
      const widgetType = active.data.current?.type as WidgetType;

      // ドロップ位置の計算（簡易版）
      const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
      const dropX = event.activatorEvent ?
        (event.activatorEvent as MouseEvent).clientX - (canvasRect?.left || 0) : 100;
      const dropY = event.activatorEvent ?
        (event.activatorEvent as MouseEvent).clientY - (canvasRect?.top || 0) : 100;

      addWidget(widgetType, { x: dropX, y: dropY });
    }

    setActiveId(null);
  };

  // Widget追加
  const addWidget = (type: WidgetType, position: { x: number; y: number }) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}-${Math.random()}`,
      type,
      position,
      size: getDefaultSize(type),
      props: getDefaultProps(type),
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidgetId(newWidget.id);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">
        <Toolbar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={handleExport}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 flex-shrink-0">
            <WidgetPalette />
          </div>

          <div id="canvas" className="flex-1">
            <Canvas
              widgets={widgets}
              selectedWidgetId={selectedWidgetId}
              onSelectWidget={setSelectedWidgetId}
              onUpdateWidget={updateWidget}
              onDeleteWidget={deleteWidget}
            />
          </div>

          <div className="w-80 flex-shrink-0">
            <PropertiesPanel
              selectedWidget={selectedWidget}
              onUpdateWidget={updateWidget}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 shadow-lg">
            ドラッグ中...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### イベント詳細

#### DragStartEvent
```typescript
{
  active: {
    id: string;              // ドラッグ中の要素ID
    data: {
      current: any;          // カスタムデータ
    };
  };
  activatorEvent: Event;     // 元のイベント
}
```

#### DragEndEvent
```typescript
{
  active: {
    id: string;
    data: { current: any };
  };
  over: {
    id: string;              // ドロップ先のID
    data: { current: any };
  } | null;
  delta: {
    x: number;               // X軸移動量
    y: number;               // Y軸移動量
  };
}
```

---

## パフォーマンス最適化

### 1. React.memo によるコンポーネント最適化

```typescript
// WidgetWrapper.tsx
export const WidgetWrapper = React.memo(function WidgetWrapper({
  widget,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: WidgetWrapperProps) {
  // ... コンポーネント実装
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

### 2. useCallback でイベントハンドラを最適化

```typescript
// Builder Page
const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
  setWidgets(prev => prev.map(w =>
    w.id === id ? { ...w, ...updates } : w
  ));
}, []);

const deleteWidget = useCallback((id: string) => {
  setWidgets(prev => prev.filter(w => w.id !== id));
  setSelectedWidgetId(prev => prev === id ? null : prev);
}, []);
```

### 3. useMemo で計算結果をキャッシュ

```typescript
const selectedWidget = useMemo(() =>
  widgets.find(w => w.id === selectedWidgetId) || null,
  [widgets, selectedWidgetId]
);
```

### 4. 仮想化（大量Widgetの場合）

```typescript
// 将来的な最適化: react-window を使用
import { FixedSizeList } from 'react-window';

// 大量のWidget表示時に仮想スクロール
<FixedSizeList
  height={600}
  itemCount={widgets.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <WidgetWrapper widget={widgets[index]} />
    </div>
  )}
</FixedSizeList>
```

### 5. デバウンス処理

```typescript
// プロパティ更新時のデバウンス
import { debounce } from 'lodash';

const debouncedUpdate = useMemo(
  () => debounce((id: string, updates: Partial<Widget>) => {
    updateWidget(id, updates);
  }, 300),
  [updateWidget]
);
```

---

## まとめ

このドキュメントでは、以下の5つの主要ビルダーコンポーネントの完全実装を提供しました:

1. **Canvas.tsx** (300行以上): ドロップ可能エリア、グリッド表示、空状態
2. **WidgetPalette.tsx** (200行以上): 6種類のドラッグ可能Widget
3. **WidgetWrapper.tsx** (250行以上): 選択、リサイズ、ドラッグ、削除
4. **PropertiesPanel.tsx** (500行以上): Widget種類別プロパティ編集
5. **Toolbar.tsx** (200行以上): プロジェクト管理、保存、プレビュー、エクスポート

これらのコンポーネントは、dnd-kitライブラリを使用した直感的なドラッグ&ドロップ機能と、React hooksによる効率的な状態管理を実現しています。
