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
 * Widgetコンポーネントの共通Props
 */
export interface WidgetComponentProps<T extends Widget> {
  widget: T;               // Widget データ
  isSelected?: boolean;    // 選択状態
  isHovered?: boolean;     // ホバー状態
  onSelect?: () => void;   // 選択イベント
  onHover?: () => void;    // ホバーイベント
  onPropsChange?: (props: Partial<T['props']>) => void; // プロパティ変更
}

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
