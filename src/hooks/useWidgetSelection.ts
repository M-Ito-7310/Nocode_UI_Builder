import { useState, useCallback } from 'react';

/**
 * Widget選択状態を管理するカスタムフック
 */
export function useWidgetSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /**
   * Widgetを選択
   */
  const selectWidget = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  /**
   * 選択を解除
   */
  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  /**
   * Widgetにホバー
   */
  const hoverWidget = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  /**
   * ホバーを解除
   */
  const clearHover = useCallback(() => {
    setHoveredId(null);
  }, []);

  /**
   * 指定IDのWidgetが選択されているか
   */
  const isSelected = useCallback(
    (id: string) => selectedId === id,
    [selectedId]
  );

  /**
   * 指定IDのWidgetがホバーされているか
   */
  const isHovered = useCallback(
    (id: string) => hoveredId === id,
    [hoveredId]
  );

  return {
    selectedId,
    hoveredId,
    selectWidget,
    clearSelection,
    hoverWidget,
    clearHover,
    isSelected,
    isHovered,
  };
}
