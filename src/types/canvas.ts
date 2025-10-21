/**
 * Canvas型定義
 *
 * キャンバスの状態管理に関連する型定義
 */

import { Widget } from './widget';

// =====================================================
// Canvas State
// =====================================================

/**
 * Canvasの状態（React State）
 */
export interface CanvasState {
  components: Widget[];      // キャンバス上のWidget配列
  selectedComponentId: string | null; // 選択中のWidget ID
  clipboard: Widget | null;  // クリップボード（コピー&ペースト用）
  history: CanvasHistoryState; // 履歴（Undo/Redo用）
  gridSize: number;          // グリッドサイズ（px）
  snapToGrid: boolean;       // グリッドスナップ有効/無効
  zoom: number;              // ズームレベル（1.0 = 100%）
}

/**
 * Canvas履歴状態（Undo/Redo機能用）
 */
export interface CanvasHistoryState {
  past: Widget[][];          // 過去の状態配列
  present: Widget[];         // 現在の状態
  future: Widget[][];        // 未来の状態配列（Undoした場合）
}

// =====================================================
// Canvas Actions
// =====================================================

/**
 * Canvas Action種類
 */
export type CanvasActionType =
  | 'ADD_WIDGET'
  | 'UPDATE_WIDGET'
  | 'DELETE_WIDGET'
  | 'SELECT_WIDGET'
  | 'DESELECT_WIDGET'
  | 'MOVE_WIDGET'
  | 'RESIZE_WIDGET'
  | 'COPY_WIDGET'
  | 'PASTE_WIDGET'
  | 'UNDO'
  | 'REDO'
  | 'CLEAR_CANVAS'
  | 'LOAD_PROJECT';

/**
 * Widget追加アクション
 */
export interface AddWidgetAction {
  type: 'ADD_WIDGET';
  payload: {
    widget: Widget;
  };
}

/**
 * Widget更新アクション
 */
export interface UpdateWidgetAction {
  type: 'UPDATE_WIDGET';
  payload: {
    id: string;
    updates: Partial<Widget>;
  };
}

/**
 * Widget削除アクション
 */
export interface DeleteWidgetAction {
  type: 'DELETE_WIDGET';
  payload: {
    id: string;
  };
}

/**
 * Widget選択アクション
 */
export interface SelectWidgetAction {
  type: 'SELECT_WIDGET';
  payload: {
    id: string;
  };
}

/**
 * Widget選択解除アクション
 */
export interface DeselectWidgetAction {
  type: 'DESELECT_WIDGET';
}

/**
 * Widget移動アクション
 */
export interface MoveWidgetAction {
  type: 'MOVE_WIDGET';
  payload: {
    id: string;
    position: { x: number; y: number };
  };
}

/**
 * Widgetリサイズアクション
 */
export interface ResizeWidgetAction {
  type: 'RESIZE_WIDGET';
  payload: {
    id: string;
    size: { width: number; height: number };
  };
}

/**
 * Canvasクリアアクション
 */
export interface ClearCanvasAction {
  type: 'CLEAR_CANVAS';
}

/**
 * プロジェクト読み込みアクション
 */
export interface LoadProjectAction {
  type: 'LOAD_PROJECT';
  payload: {
    components: Widget[];
  };
}

/**
 * Canvas Action（Union型）
 */
export type CanvasAction =
  | AddWidgetAction
  | UpdateWidgetAction
  | DeleteWidgetAction
  | SelectWidgetAction
  | DeselectWidgetAction
  | MoveWidgetAction
  | ResizeWidgetAction
  | ClearCanvasAction
  | LoadProjectAction;

// =====================================================
// ドラッグ&ドロップ関連
// =====================================================

/**
 * ドラッグ中のデータ
 */
export interface DragData {
  type: 'palette' | 'canvas'; // ドラッグ元
  widgetType?: string;        // パレットからの場合、Widget種類
  widgetId?: string;          // キャンバスからの場合、Widget ID
}

/**
 * ドロップイベントデータ
 */
export interface DropEventData {
  position: { x: number; y: number }; // ドロップ位置
  dragData: DragData;                 // ドラッグデータ
}

// =====================================================
// ヘルパー関数
// =====================================================

/**
 * Widgetを座標でソート（z-index考慮）
 */
export function sortWidgetsByZIndex(widgets: Widget[]): Widget[] {
  return [...widgets].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
}

/**
 * 指定座標にあるWidgetを取得
 */
export function getWidgetAtPosition(
  widgets: Widget[],
  position: { x: number; y: number }
): Widget | null {
  // 逆順でチェック（上にあるWidgetを優先）
  const sortedWidgets = sortWidgetsByZIndex(widgets).reverse();

  for (const widget of sortedWidgets) {
    const { x, y } = widget.position;
    const { width, height } = widget.size;

    if (
      position.x >= x &&
      position.x <= x + width &&
      position.y >= y &&
      position.y <= y + height
    ) {
      return widget;
    }
  }

  return null;
}

/**
 * Widgetが重なっているか判定
 */
export function isOverlapping(widget1: Widget, widget2: Widget): boolean {
  const x1 = widget1.position.x;
  const y1 = widget1.position.y;
  const w1 = widget1.size.width;
  const h1 = widget1.size.height;

  const x2 = widget2.position.x;
  const y2 = widget2.position.y;
  const w2 = widget2.size.width;
  const h2 = widget2.size.height;

  return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}
