'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Canvas } from '@/components/builder/Canvas';
import { WidgetPalette } from '@/components/builder/WidgetPalette';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';
import type { Widget, WidgetType } from '@/types/widget';
import {
  getDefaultSize,
  getDefaultProps,
  generateId,
} from '@/lib/widget-utils';

const STORAGE_KEY = 'nocode-builder-project';

export default function BuilderPage() {
  // 状態管理
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // dnd-kit センサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px移動したらドラッグ開始
      },
    })
  );

  // 選択中のWidget
  const selectedWidget = useMemo(
    () => widgets.find((w) => w.id === selectedWidgetId) || null,
    [widgets, selectedWidgetId]
  );

  // ローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setWidgets(data.widgets || []);
        setProjectName(data.projectName || 'Untitled Project');
        setLastSaved(data.lastSaved ? new Date(data.lastSaved) : null);
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
  }, []);

  // 自動保存（5秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      if (widgets.length > 0) {
        saveToLocalStorage(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [widgets, projectName]);

  // ローカルストレージに保存
  const saveToLocalStorage = useCallback(
    (showFeedback = true) => {
      const data = {
        widgets,
        projectName,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());

      if (showFeedback) {
        // 保存完了のフィードバック（オプション: Toastなど）
        console.log('Project saved');
      }
    },
    [widgets, projectName]
  );

  // ドラッグ開始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // ドラッグ終了
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        setActiveId(null);
        return;
      }

      // パレットからキャンバスへのドロップ
      if (
        over.id === 'canvas' &&
        active.id.toString().startsWith('palette-')
      ) {
        const widgetType = active.data.current?.type as WidgetType;

        // ドロップ位置の計算
        const canvasElement = document.querySelector('[data-canvas="true"]');
        const canvasRect = canvasElement?.getBoundingClientRect();

        if (canvasRect && event.activatorEvent) {
          const mouseEvent = event.activatorEvent as MouseEvent;
          const dropX = Math.max(
            0,
            mouseEvent.clientX - canvasRect.left - 50
          );
          const dropY = Math.max(
            0,
            mouseEvent.clientY - canvasRect.top - 20
          );

          addWidget(widgetType, { x: dropX, y: dropY });
        } else {
          // フォールバック: ランダムな位置
          const randomX = Math.floor(Math.random() * 400);
          const randomY = Math.floor(Math.random() * 300);
          addWidget(widgetType, { x: randomX, y: randomY });
        }
      }

      // キャンバス上のWidget移動
      if (over.id === 'canvas' && !active.id.toString().startsWith('palette-')) {
        const widgetId = active.id as string;
        const widget = widgets.find((w) => w.id === widgetId);

        if (widget && event.delta) {
          updateWidget(widgetId, {
            position: {
              x: Math.max(0, widget.position.x + event.delta.x),
              y: Math.max(0, widget.position.y + event.delta.y),
            },
          });
        }
      }

      setActiveId(null);
    },
    [widgets]
  );

  // Widget追加
  const addWidget = useCallback(
    (type: WidgetType, position: { x: number; y: number }) => {
      const newWidget = {
        id: generateId(),
        type,
        position,
        size: getDefaultSize(type),
        props: getDefaultProps(type),
      } as Widget;

      setWidgets((prev) => [...prev, newWidget]);
      setSelectedWidgetId(newWidget.id);
    },
    []
  );

  // Widget更新
  const updateWidget = useCallback(
    (id: string, updates: Partial<Widget>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...updates } as Widget : w))
      );
    },
    []
  );

  // Widget削除
  const deleteWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedWidgetId((prev) => (prev === id ? null : prev));
  }, []);

  // 保存処理
  const handleSave = useCallback(async () => {
    setIsSaving(true);

    // ローカルストレージに保存
    saveToLocalStorage(true);

    // 将来的なAPI保存処理
    // try {
    //   const response = await fetch('/api/projects', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       name: projectName,
    //       canvas_data: { components: widgets },
    //     }),
    //   });
    //   const data = await response.json();
    //   console.log('Saved to database:', data.id);
    // } catch (error) {
    //   console.error('Save failed:', error);
    // }

    // 保存完了のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  }, [widgets, projectName, saveToLocalStorage]);

  // プレビュー処理
  const handlePreview = useCallback(() => {
    // プレビューデータを一時保存
    const previewData = {
      projectName,
      widgets,
    };

    sessionStorage.setItem('preview-data', JSON.stringify(previewData));

    // 新しいウィンドウでプレビューを開く
    window.open('/preview/temp', '_blank', 'width=1200,height=800');
  }, [widgets, projectName]);

  // エクスポート処理
  const handleExport = useCallback(() => {
    // HTML/CSS生成
    const html = generateHTML(widgets, projectName);

    // ダウンロード
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [widgets, projectName]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-50">
        {/* ツールバー */}
        <Toolbar
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={handleExport}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />

        {/* メインエリア */}
        <div className="flex flex-1 overflow-hidden">
          {/* Widgetパレット */}
          <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
            <WidgetPalette />
          </div>

          {/* キャンバス */}
          <div className="flex-1 overflow-auto p-6" data-canvas="true">
            <Canvas
              widgets={widgets}
              selectedWidgetId={selectedWidgetId}
              onSelectWidget={setSelectedWidgetId}
              onUpdateWidget={updateWidget}
              onDeleteWidget={deleteWidget}
              showGrid={true}
            />
          </div>

          {/* プロパティパネル */}
          <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200">
            <PropertiesPanel
              selectedWidget={selectedWidget}
              onUpdateWidget={(updates) => {
                if (selectedWidgetId) {
                  updateWidget(selectedWidgetId, updates);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ドラッグオーバーレイ */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg px-4 py-3 shadow-lg">
            <span className="text-blue-700 font-medium">
              {activeId.toString().startsWith('palette-')
                ? `${activeId.toString().replace('palette-', '')} Widget`
                : 'Widget移動中...'}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// HTML生成関数
function generateHTML(widgets: Widget[], projectName: string): string {
  const widgetsHTML = widgets
    .map((widget) => {
      const style = `
        position: absolute;
        left: ${widget.position.x}px;
        top: ${widget.position.y}px;
        width: ${widget.size.width}px;
        height: ${widget.size.height}px;
      `.trim();

      // Widget種類ごとのHTML生成
      switch (widget.type) {
        case 'Text':
          return `<div style="${style} font-size: ${widget.props.fontSize}px; color: ${widget.props.color}; font-weight: ${widget.props.fontWeight}; text-align: ${widget.props.textAlign};">${widget.props.content}</div>`;

        case 'Button':
          return `<button style="${style} background: ${widget.props.color}; color: ${widget.props.textColor}; border-radius: ${widget.props.borderRadius}px; border: none; cursor: pointer; font-size: 16px;">${widget.props.text}</button>`;

        case 'Input':
          return `<div style="${style}"><label style="display: block; margin-bottom: 4px;">${widget.props.label}</label><input type="${widget.props.inputType}" placeholder="${widget.props.placeholder}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" ${widget.props.required ? 'required' : ''} /></div>`;

        case 'Image':
          return `<img src="${widget.props.src}" alt="${widget.props.alt}" style="${style} object-fit: ${widget.props.objectFit}; border-radius: ${widget.props.borderRadius}px; opacity: ${widget.props.opacity};" />`;

        default:
          return `<div style="${style}"></div>`;
      }
    })
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .container {
      position: relative;
      min-height: 600px;
    }
  </style>
</head>
<body>
  <div class="container">
    ${widgetsHTML}
  </div>
</body>
</html>`;
}
