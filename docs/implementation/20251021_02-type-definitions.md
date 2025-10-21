# Phase 2: 型定義とユーティリティ - 完全実装ガイド

**Phase**: 2/12
**推定時間**: 45-60分
**前提条件**: Phase 1完了（プロジェクトセットアップ）
**次のPhase**: Phase 3 - データベースセットアップ

---

## 目次

1. [概要](#概要)
2. [TypeScript型システムの設計思想](#typescript型システムの設計思想)
3. [Widget型定義の完全実装](#widget型定義の完全実装)
4. [Project型定義の実装](#project型定義の実装)
5. [Canvas型定義の実装](#canvas型定義の実装)
6. [ユーティリティ関数の実装](#ユーティリティ関数の実装)
7. [型安全性のベストプラクティス](#型安全性のベストプラクティス)
8. [動作確認とテスト](#動作確認とテスト)
9. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 2では、NoCode UI Builderの型システムを構築します。TypeScriptの強力な型推論を活用し、コンパイル時のエラー検出、IntelliSenseによる開発者体験の向上、リファクタリングの安全性を確保します。

### このPhaseで実現すること

- 6種類のWidget型定義（Text、Input、Button、Image、Table、Select）
- Union型とType Guardsによる型安全なWidget判定
- Project型定義（データベーススキーマと対応）
- Canvas型定義（状態管理用）
- ユーティリティ関数（`cn`、UUID生成、座標計算等）

### 型定義の全体像

```
types/
├── widget.ts     - Widget関連の型（BaseWidget、各Widget型、Props）
├── project.ts    - Project関連の型（データベースモデル）
└── canvas.ts     - Canvas関連の型（状態管理）

lib/
└── utils.ts      - ユーティリティ関数
```

---

## TypeScript型システムの設計思想

### 設計原則

#### 1. 型による制約（Type Constraints）

TypeScriptの型システムを活用して、実行時エラーを防ぎます。

**悪い例（型なし）:**
```typescript
function updateWidget(widget, props) {
  widget.props = props; // どんなプロパティでも受け入れてしまう
}
```

**良い例（型あり）:**
```typescript
function updateTextWidget(widget: TextWidget, props: TextWidgetProps) {
  widget.props = props; // TextWidgetPropsのみ受け入れる
}
```

#### 2. Union型による多態性

複数のWidget型を統一的に扱いつつ、型安全性を保ちます。

```typescript
type Widget = TextWidget | InputWidget | ButtonWidget | ImageWidget | TableWidget | SelectWidget;

function renderWidget(widget: Widget) {
  // すべてのWidget型を受け入れ、型ごとに処理を分岐
  if (isButtonWidget(widget)) {
    // この時点でwidgetはButtonWidget型に絞り込まれる
    console.log(widget.props.text);
  }
}
```

#### 3. Type Guardsによる型ナローイング

実行時に型を判定し、安全に型を絞り込みます。

```typescript
function isButtonWidget(widget: Widget): widget is ButtonWidget {
  return widget.type === 'Button';
}
```

#### 4. Immutabilityの推奨

`Readonly`や`as const`を活用し、予期しない変更を防ぎます。

```typescript
const WIDGET_TYPES = ['Text', 'Input', 'Button', 'Image', 'Table', 'Select'] as const;
type WidgetType = typeof WIDGET_TYPES[number]; // 'Text' | 'Input' | ...
```

---

## Widget型定義の完全実装

### ファイル: `src/types/widget.ts`

このファイルには、すべてのWidget関連の型定義を記述します（約250行）。

```typescript
/**
 * Widget型定義
 *
 * NoCode UI Builderで使用可能なすべてのWidget（UIコンポーネント）の型定義
 * 各Widgetは共通のBaseWidget型を継承し、固有のProps型を持つ
 */

// =====================================================
// 基本型定義
// =====================================================

/**
 * Widget種類の列挙
 */
export const WIDGET_TYPES = ['Text', 'Input', 'Button', 'Image', 'Table', 'Select'] as const;
export type WidgetType = typeof WIDGET_TYPES[number];

/**
 * Widget位置（絶対座標）
 */
export interface Position {
  x: number; // X座標（px）
  y: number; // Y座標（px）
}

/**
 * Widgetサイズ
 */
export interface Size {
  width: number;  // 幅（px）
  height: number; // 高さ（px）
}

/**
 * すべてのWidgetが共有する基本プロパティ
 */
export interface BaseWidget {
  id: string;              // ユニークID（UUID v4）
  type: WidgetType;        // Widget種類
  position: Position;      // キャンバス上の位置
  size: Size;              // Widgetのサイズ
  zIndex?: number;         // 重なり順（オプション、デフォルト: 1）
}

// =====================================================
// Text Widget
// =====================================================

/**
 * フォント太さの型
 */
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * テキスト整列
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Text Widgetのプロパティ
 */
export interface TextWidgetProps {
  content: string;           // 表示テキスト
  fontSize: number;          // フォントサイズ（px、8-72）
  color: string;             // テキスト色（hex、例: #000000）
  fontWeight: FontWeight;    // フォント太さ
  textAlign: TextAlign;      // テキスト整列
  fontFamily?: string;       // フォントファミリー（オプション）
  lineHeight?: number;       // 行高（オプション、1.0-3.0）
  letterSpacing?: number;    // 文字間隔（オプション、px）
}

/**
 * Text Widgetのデフォルト値
 */
export const DEFAULT_TEXT_WIDGET_PROPS: TextWidgetProps = {
  content: 'Text',
  fontSize: 16,
  color: '#000000',
  fontWeight: 'normal',
  textAlign: 'left',
};

/**
 * Text Widget
 */
export interface TextWidget extends BaseWidget {
  type: 'Text';
  props: TextWidgetProps;
}

// =====================================================
// Input Widget
// =====================================================

/**
 * Input要素のtype属性
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';

/**
 * Input Widgetのプロパティ
 */
export interface InputWidgetProps {
  label: string;             // ラベルテキスト
  placeholder: string;       // プレースホルダー
  inputType: InputType;      // input要素のtype
  required: boolean;         // 必須フラグ
  defaultValue?: string;     // デフォルト値（オプション）
  maxLength?: number;        // 最大文字数（オプション）
  minLength?: number;        // 最小文字数（オプション）
  pattern?: string;          // 正規表現パターン（オプション）
  disabled?: boolean;        // 無効化フラグ（オプション）
}

/**
 * Input Widgetのデフォルト値
 */
export const DEFAULT_INPUT_WIDGET_PROPS: InputWidgetProps = {
  label: 'Input',
  placeholder: 'Enter text...',
  inputType: 'text',
  required: false,
};

/**
 * Input Widget
 */
export interface InputWidget extends BaseWidget {
  type: 'Input';
  props: InputWidgetProps;
}

// =====================================================
// Button Widget
// =====================================================

/**
 * ボタンバリアント（見た目のスタイル）
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * ボタンサイズ
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button Widgetのプロパティ
 */
export interface ButtonWidgetProps {
  text: string;              // ボタンテキスト
  variant: ButtonVariant;    // ボタンバリアント
  size: ButtonSize;          // ボタンサイズ
  color: string;             // 背景色（hex）
  textColor: string;         // テキスト色（hex）
  borderRadius: number;      // 角丸（px、0-50）
  disabled?: boolean;        // 無効化フラグ（オプション）
  fullWidth?: boolean;       // 幅100%フラグ（オプション）
}

/**
 * Button Widgetのデフォルト値
 */
export const DEFAULT_BUTTON_WIDGET_PROPS: ButtonWidgetProps = {
  text: 'Button',
  variant: 'primary',
  size: 'medium',
  color: '#3b82f6',
  textColor: '#ffffff',
  borderRadius: 6,
};

/**
 * Button Widget
 */
export interface ButtonWidget extends BaseWidget {
  type: 'Button';
  props: ButtonWidgetProps;
}

// =====================================================
// Image Widget
// =====================================================

/**
 * CSS object-fitプロパティ
 */
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * Image Widgetのプロパティ
 */
export interface ImageWidgetProps {
  src: string;               // 画像URL
  alt: string;               // 代替テキスト（アクセシビリティ）
  objectFit: ObjectFit;      // 画像のフィット方法
  borderRadius: number;      // 角丸（px、0-50）
  opacity: number;           // 不透明度（0-1）
  grayscale?: number;        // グレースケール（オプション、0-100）
}

/**
 * Image Widgetのデフォルト値
 */
export const DEFAULT_IMAGE_WIDGET_PROPS: ImageWidgetProps = {
  src: 'https://via.placeholder.com/300x200',
  alt: 'Image',
  objectFit: 'cover',
  borderRadius: 0,
  opacity: 1,
};

/**
 * Image Widget
 */
export interface ImageWidget extends BaseWidget {
  type: 'Image';
  props: ImageWidgetProps;
}

// =====================================================
// Table Widget
// =====================================================

/**
 * テーブルカラム定義
 */
export interface TableColumn {
  key: string;               // データキー
  label: string;             // 表示ラベル（ヘッダー）
  width?: number;            // カラム幅（px、オプション）
  align?: 'left' | 'center' | 'right'; // テキスト整列（オプション）
}

/**
 * テーブル行データ
 */
export interface TableRow {
  [key: string]: string | number | boolean; // 動的なカラムキー
}

/**
 * Table Widgetのプロパティ
 */
export interface TableWidgetProps {
  columns: TableColumn[];    // カラム定義配列
  data: TableRow[];          // データ行配列
  striped: boolean;          // ストライプ表示（偶数行に背景色）
  bordered: boolean;         // ボーダー表示
  hoverable: boolean;        // ホバー効果
  headerBgColor: string;     // ヘッダー背景色（hex）
  headerTextColor: string;   // ヘッダーテキスト色（hex）
  rowBgColor?: string;       // 行背景色（オプション）
  fontSize?: number;         // フォントサイズ（オプション、px）
}

/**
 * Table Widgetのデフォルト値
 */
export const DEFAULT_TABLE_WIDGET_PROPS: TableWidgetProps = {
  columns: [
    { key: 'id', label: 'ID', width: 50, align: 'center' },
    { key: 'name', label: 'Name', width: 150, align: 'left' },
    { key: 'email', label: 'Email', width: 200, align: 'left' },
  ],
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ],
  striped: true,
  bordered: true,
  hoverable: true,
  headerBgColor: '#f3f4f6',
  headerTextColor: '#111827',
};

/**
 * Table Widget
 */
export interface TableWidget extends BaseWidget {
  type: 'Table';
  props: TableWidgetProps;
}

// =====================================================
// Select Widget
// =====================================================

/**
 * Select選択肢
 */
export interface SelectOption {
  value: string;             // 値（送信される値）
  label: string;             // 表示ラベル
  disabled?: boolean;        // 無効化フラグ（オプション）
}

/**
 * Select Widgetのプロパティ
 */
export interface SelectWidgetProps {
  label: string;             // ラベルテキスト
  options: SelectOption[];   // 選択肢配列
  defaultValue?: string;     // デフォルト選択値（オプション）
  placeholder: string;       // プレースホルダー
  required: boolean;         // 必須フラグ
  multiple?: boolean;        // 複数選択フラグ（オプション）
  disabled?: boolean;        // 無効化フラグ（オプション）
}

/**
 * Select Widgetのデフォルト値
 */
export const DEFAULT_SELECT_WIDGET_PROPS: SelectWidgetProps = {
  label: 'Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  placeholder: 'Choose an option...',
  required: false,
};

/**
 * Select Widget
 */
export interface SelectWidget extends BaseWidget {
  type: 'Select';
  props: SelectWidgetProps;
}

// =====================================================
// Widget Union型
// =====================================================

/**
 * すべてのWidget型のUnion型
 *
 * この型により、任意のWidget型を統一的に扱いつつ、
 * Type Guardsで型を絞り込むことができる
 */
export type Widget =
  | TextWidget
  | InputWidget
  | ButtonWidget
  | ImageWidget
  | TableWidget
  | SelectWidget;

/**
 * Widget Propsの Union型
 */
export type WidgetProps =
  | TextWidgetProps
  | InputWidgetProps
  | ButtonWidgetProps
  | ImageWidgetProps
  | TableWidgetProps
  | SelectWidgetProps;

// =====================================================
// Type Guards
// =====================================================

/**
 * Text Widgetか判定
 */
export function isTextWidget(widget: Widget): widget is TextWidget {
  return widget.type === 'Text';
}

/**
 * Input Widgetか判定
 */
export function isInputWidget(widget: Widget): widget is InputWidget {
  return widget.type === 'Input';
}

/**
 * Button Widgetか判定
 */
export function isButtonWidget(widget: Widget): widget is ButtonWidget {
  return widget.type === 'Button';
}

/**
 * Image Widgetか判定
 */
export function isImageWidget(widget: Widget): widget is ImageWidget {
  return widget.type === 'Image';
}

/**
 * Table Widgetか判定
 */
export function isTableWidget(widget: Widget): widget is TableWidget {
  return widget.type === 'Table';
}

/**
 * Select Widgetか判定
 */
export function isSelectWidget(widget: Widget): widget is SelectWidget {
  return widget.type === 'Select';
}

// =====================================================
// ヘルパー関数
// =====================================================

/**
 * Widget種類からデフォルトPropsを取得
 */
export function getDefaultWidgetProps(type: WidgetType): WidgetProps {
  switch (type) {
    case 'Text':
      return DEFAULT_TEXT_WIDGET_PROPS;
    case 'Input':
      return DEFAULT_INPUT_WIDGET_PROPS;
    case 'Button':
      return DEFAULT_BUTTON_WIDGET_PROPS;
    case 'Image':
      return DEFAULT_IMAGE_WIDGET_PROPS;
    case 'Table':
      return DEFAULT_TABLE_WIDGET_PROPS;
    case 'Select':
      return DEFAULT_SELECT_WIDGET_PROPS;
  }
}

/**
 * Widget種類からデフォルトサイズを取得
 */
export function getDefaultWidgetSize(type: WidgetType): Size {
  switch (type) {
    case 'Text':
      return { width: 200, height: 30 };
    case 'Input':
      return { width: 250, height: 60 };
    case 'Button':
      return { width: 120, height: 40 };
    case 'Image':
      return { width: 300, height: 200 };
    case 'Table':
      return { width: 500, height: 200 };
    case 'Select':
      return { width: 250, height: 60 };
  }
}

/**
 * Widget種類の表示名を取得
 */
export function getWidgetDisplayName(type: WidgetType): string {
  const displayNames: Record<WidgetType, string> = {
    Text: 'テキスト',
    Input: '入力フィールド',
    Button: 'ボタン',
    Image: '画像',
    Table: 'テーブル',
    Select: 'セレクト',
  };
  return displayNames[type];
}
```

---

## Project型定義の実装

### ファイル: `src/types/project.ts`

データベーススキーマと対応するProject型定義を記述します（約100行）。

```typescript
/**
 * Project型定義
 *
 * プロジェクト（保存されたUI設計）の型定義
 * データベーススキーマと対応
 */

import { Widget } from './widget';

// =====================================================
// Canvas Data
// =====================================================

/**
 * Canvas Data（キャンバスの状態）
 *
 * データベースにJSON形式で保存される
 */
export interface CanvasData {
  components: Widget[];      // キャンバス上のWidget配列
  version: string;           // データ形式バージョン（将来の互換性のため）
  settings?: CanvasSettings; // キャンバス設定（オプション）
}

/**
 * Canvas設定
 */
export interface CanvasSettings {
  backgroundColor?: string;  // 背景色
  backgroundImage?: string;  // 背景画像URL
  gridSize?: number;         // グリッドサイズ（px）
  snapToGrid?: boolean;      // グリッドスナップ有効/無効
  width?: number;            // キャンバス幅（固定幅の場合）
  height?: number;           // キャンバス高さ（固定高の場合）
}

// =====================================================
// Project（データベースモデル）
// =====================================================

/**
 * Project（データベースから取得した状態）
 */
export interface Project {
  id: number;                // プロジェクトID（自動採番）
  name: string;              // プロジェクト名
  description: string | null; // プロジェクト説明
  canvasData: CanvasData;    // Canvas Data（JSON）
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
  userId?: string | null;    // ユーザーID（将来の認証機能用、現在はnull）
  isPublic?: boolean;        // 公開フラグ（将来の機能用）
  tags?: string[];           // タグ配列（将来の機能用）
}

/**
 * Project作成時のInput（IDや日時は自動生成されるため不要）
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
  canvasData: CanvasData;
}

/**
 * Project更新時のInput
 */
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  canvasData?: CanvasData;
}

/**
 * Project一覧取得時のフィルタ
 */
export interface ProjectListFilter {
  limit?: number;            // 取得件数（デフォルト: 10）
  offset?: number;           // オフセット（ページネーション用）
  sortBy?: 'createdAt' | 'updatedAt' | 'name'; // ソート項目
  sortOrder?: 'asc' | 'desc'; // ソート順
  search?: string;           // 検索キーワード（名前・説明で検索）
}

/**
 * Project一覧のレスポンス
 */
export interface ProjectListResponse {
  projects: Project[];
  total: number;             // 総件数
  limit: number;
  offset: number;
}

// =====================================================
// API Response型
// =====================================================

/**
 * API成功レスポンス
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;            // エラーコード（例: PROJECT_NOT_FOUND）
    message: string;         // エラーメッセージ
    details?: unknown;       // 追加のエラー詳細
  };
}

/**
 * API レスポンス（成功 or エラー）
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// =====================================================
// Type Guards
// =====================================================

/**
 * API成功レスポンスか判定
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * APIエラーレスポンスか判定
 */
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return response.success === false;
}

// =====================================================
// バリデーション関数
// =====================================================

/**
 * プロジェクト名のバリデーション
 */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'プロジェクト名は必須です' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'プロジェクト名は100文字以内にしてください' };
  }
  return { valid: true };
}

/**
 * プロジェクト説明のバリデーション
 */
export function validateProjectDescription(description: string | undefined): { valid: boolean; error?: string } {
  if (description && description.length > 500) {
    return { valid: false, error: 'プロジェクト説明は500文字以内にしてください' };
  }
  return { valid: true };
}

/**
 * Canvas Dataのバリデーション
 */
export function validateCanvasData(canvasData: CanvasData): { valid: boolean; error?: string } {
  if (!canvasData) {
    return { valid: false, error: 'Canvas Dataは必須です' };
  }
  if (!Array.isArray(canvasData.components)) {
    return { valid: false, error: 'Canvas Data.componentsは配列である必要があります' };
  }
  if (!canvasData.version) {
    return { valid: false, error: 'Canvas Data.versionは必須です' };
  }
  return { valid: true };
}
```

---

## Canvas型定義の実装

### ファイル: `src/types/canvas.ts`

Canvas（状態管理）に関連する型定義を記述します（約80行）。

```typescript
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
```

---

## ユーティリティ関数の実装

### ファイル: `src/lib/utils.ts`

共通のユーティリティ関数を実装します（約120行）。

```typescript
/**
 * ユーティリティ関数
 *
 * プロジェクト全体で使用する汎用的なヘルパー関数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

// =====================================================
// クラス名結合
// =====================================================

/**
 * Tailwind CSSクラス名を結合し、重複を解決
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// =====================================================
// UUID生成
// =====================================================

/**
 * ユニークIDを生成（UUID v4）
 *
 * @example
 * generateId() // => '550e8400-e29b-41d4-a716-446655440000'
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * プレフィックス付きIDを生成
 *
 * @example
 * generatePrefixedId('widget') // => 'widget-550e8400-e29b-41d4-a716-446655440000'
 */
export function generatePrefixedId(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

// =====================================================
// 座標計算
// =====================================================

/**
 * グリッドにスナップした座標を取得
 *
 * @param value - 座標値
 * @param gridSize - グリッドサイズ
 * @returns スナップ後の座標
 *
 * @example
 * snapToGrid(123, 10) // => 120
 * snapToGrid(127, 10) // => 130
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * 2点間の距離を計算
 *
 * @param x1 - 始点X
 * @param y1 - 始点Y
 * @param x2 - 終点X
 * @param y2 - 終点Y
 * @returns 距離
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 矩形が範囲内にあるか判定
 *
 * @param rect - 矩形（位置とサイズ）
 * @param bounds - 範囲（位置とサイズ）
 * @returns 範囲内ならtrue
 */
export function isWithinBounds(
  rect: { x: number; y: number; width: number; height: number },
  bounds: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect.x >= bounds.x &&
    rect.y >= bounds.y &&
    rect.x + rect.width <= bounds.x + bounds.width &&
    rect.y + rect.height <= bounds.y + bounds.height
  );
}

// =====================================================
// 文字列処理
// =====================================================

/**
 * 文字列を切り詰める
 *
 * @param str - 文字列
 * @param maxLength - 最大長
 * @param suffix - 末尾に追加する文字列（デフォルト: '...'）
 * @returns 切り詰めた文字列
 *
 * @example
 * truncate('Hello World', 8) // => 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * キャメルケースをスペース区切りに変換
 *
 * @example
 * camelToWords('backgroundColor') // => 'Background Color'
 */
export function camelToWords(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

// =====================================================
// 数値処理
// =====================================================

/**
 * 数値を範囲内にクランプ
 *
 * @param value - 値
 * @param min - 最小値
 * @param max - 最大値
 * @returns クランプ後の値
 *
 * @example
 * clamp(150, 0, 100) // => 100
 * clamp(-10, 0, 100) // => 0
 * clamp(50, 0, 100)  // => 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 小数点を指定桁数で丸める
 *
 * @param value - 値
 * @param decimals - 小数点以下の桁数
 * @returns 丸めた値
 *
 * @example
 * round(3.14159, 2) // => 3.14
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// =====================================================
// オブジェクト処理
// =====================================================

/**
 * オブジェクトのディープコピー
 *
 * @param obj - コピーするオブジェクト
 * @returns コピーされたオブジェクト
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * オブジェクトから未定義のプロパティを除去
 *
 * @param obj - オブジェクト
 * @returns 未定義プロパティが除去されたオブジェクト
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}

// =====================================================
// 配列処理
// =====================================================

/**
 * 配列から重複を除去
 *
 * @param arr - 配列
 * @returns 重複が除去された配列
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 配列をシャッフル
 *
 * @param arr - 配列
 * @returns シャッフルされた配列
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// =====================================================
// 日時処理
// =====================================================

/**
 * 日時を相対表現で取得
 *
 * @param date - 日時
 * @returns 相対表現（例: '2時間前'）
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'たった今';
  } else if (diffMins < 60) {
    return `${diffMins}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
}

/**
 * 日時をフォーマット
 *
 * @param date - 日時
 * @param format - フォーマット（'date' | 'datetime' | 'time'）
 * @returns フォーマットされた文字列
 */
export function formatDate(date: Date, format: 'date' | 'datetime' | 'time' = 'datetime'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (format === 'datetime' || format === 'time') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  if (format === 'time') {
    delete options.year;
    delete options.month;
    delete options.day;
  }

  return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

// =====================================================
// デバウンス・スロットル
// =====================================================

/**
 * デバウンス関数
 *
 * @param func - 実行する関数
 * @param wait - 待機時間（ms）
 * @returns デバウンス関数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * スロットル関数
 *
 * @param func - 実行する関数
 * @param limit - 制限時間（ms）
 * @returns スロットル関数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
```

---

## 型安全性のベストプラクティス

### 1. 厳格な型チェック

`tsconfig.json`で厳格モードを有効化:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 2. Type Guardsの活用

```typescript
function updateWidget(widget: Widget, props: WidgetProps) {
  // ❌ 型エラー: WidgetとPropsの型が一致しない可能性
  widget.props = props;

  // ✅ Type Guardで安全に型を絞り込む
  if (isButtonWidget(widget) && 'text' in props) {
    widget.props = props as ButtonWidgetProps;
  }
}
```

### 3. `as const`の活用

```typescript
// ❌ 型が string[] になる
const types = ['Text', 'Button', 'Image'];

// ✅ 型が readonly ['Text', 'Button', 'Image'] になる
const types = ['Text', 'Button', 'Image'] as const;
type Type = typeof types[number]; // 'Text' | 'Button' | 'Image'
```

### 4. `satisfies`の活用（TypeScript 4.9+）

```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} satisfies { apiUrl: string; timeout: number };

// configの型は推論されつつ、型チェックが行われる
```

---

## 動作確認とテスト

### ステップ 1: 型チェック

```bash
npm run type-check
```

**期待される結果:**
エラーなし（何も表示されない）

### ステップ 2: 型定義のインポートテスト

`src/app/page.tsx`に以下を追加して型が正しくインポートできるか確認:

```typescript
import { Widget, TextWidget, ButtonWidget, isButtonWidget } from '@/types/widget';
import { Project, CreateProjectInput } from '@/types/project';
import { CanvasState } from '@/types/canvas';
import { cn, generateId, snapToGrid } from '@/lib/utils';

export default function Home() {
  // 型が正しく推論されることを確認
  const widget: TextWidget = {
    id: generateId(),
    type: 'Text',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 30 },
    props: {
      content: 'Hello',
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
    },
  };

  console.log('Widget ID:', widget.id);
  console.log('Snapped position:', snapToGrid(127, 10)); // 130

  return (
    <div className={cn('p-4', 'bg-gray-100')}>
      <h1>Type Definitions Test</h1>
    </div>
  );
}
```

開発サーバーで確認:
```bash
npm run dev
```

コンソールに以下が表示されることを確認:
```
Widget ID: 550e8400-e29b-41d4-a716-446655440000
Snapped position: 130
```

### ステップ 3: ESLint確認

```bash
npm run lint
```

警告が5件以下であることを確認。

---

## 成果物チェックリスト

Phase 2完了時に以下をすべて確認してください:

### ファイル確認

- [ ] `src/types/widget.ts` が作成されている（250行程度）
- [ ] `src/types/project.ts` が作成されている（100行程度）
- [ ] `src/types/canvas.ts` が作成されている（80行程度）
- [ ] `src/lib/utils.ts` が作成されている（120行程度）

### 型定義確認

- [ ] `WidgetType` が正しく定義されている
- [ ] 6種類のWidget型がすべて定義されている
- [ ] Type Guards（`isButtonWidget`等）が正しく動作
- [ ] `Project`型が定義されている
- [ ] `CanvasState`型が定義されている

### ユーティリティ関数確認

- [ ] `cn()` 関数が正しく動作
- [ ] `generateId()` がUUIDを生成
- [ ] `snapToGrid()` が正しく計算
- [ ] `clamp()` が正しく範囲制限

### 型チェック確認

- [ ] `npm run type-check` がエラーなし
- [ ] `npm run lint` が警告5件以下
- [ ] インポートが正しく動作

### Git確認

- [ ] 変更がコミットされている

```bash
git add .
git commit -m "Phase 2: Add TypeScript type definitions and utilities

- Add widget types (Text, Input, Button, Image, Table, Select)
- Add project types (Project, CanvasData, API responses)
- Add canvas types (CanvasState, CanvasAction)
- Add utility functions (cn, generateId, snapToGrid, etc.)
- Add type guards for type-safe narrowing
- Add validation functions for project data"
```

---

## 次のPhaseへの準備

Phase 2が完了したら、Phase 3に進みます。

### Phase 3で実施すること

1. **Neon PostgreSQLのセットアップ**
   - Neonアカウント作成
   - データベース作成
   - 接続文字列取得

2. **Drizzle ORMの設定**
   - スキーマ定義
   - マイグレーション実行

### 必要な準備

- Phase 2のすべてのチェックリストが完了していること
- Neonアカウント作成の準備（メールアドレス）

---

## まとめ

Phase 2では、TypeScript型定義とユーティリティ関数を完全に実装しました。

**達成したこと:**
- 6種類のWidget型定義（250行）
- Project型定義（100行）
- Canvas型定義（80行）
- ユーティリティ関数（120行）
- Type Guardsによる型安全性の確保
- バリデーション関数の実装

**次のステップ:**
Phase 3のドキュメント（次回作成）を参照して、データベースセットアップに進んでください。

---

**所要時間（実績）:** _____分
**遭遇した問題:** _______________
**メモ:** _______________

**Phase 2 完了日:** ___________
**次のPhase開始予定日:** ___________

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月21日
**バージョン**: 1.0
