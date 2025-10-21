# Widget Specifications

## Widget概要

Widgetは、ノーコードUIビルダーで使用できる再利用可能なUIコンポーネントです。各Widgetは、ドラッグ&ドロップでキャンバスに配置でき、プロパティパネルでカスタマイズ可能です。

## 共通仕様

### 全Widget共通プロパティ

すべてのWidgetは以下の共通プロパティを持ちます：

```typescript
interface BaseWidget {
  id: string;              // ユニークID（UUID）
  type: WidgetType;        // Widget種類
  position: {
    x: number;             // X座標（px）
    y: number;             // Y座標（px）
  };
  size: {
    width: number;         // 幅（px）
    height: number;        // 高さ（px）
  };
  props: Record<string, any>; // Widget固有のプロパティ
}

type WidgetType = 'Text' | 'Input' | 'Button' | 'Image' | 'Table' | 'Select';
```

### 共通操作
- **ドラッグ移動**: キャンバス上でドラッグして位置を変更
- **リサイズ**: 角をドラッグしてサイズ変更
- **選択**: クリックで選択状態にし、プロパティパネルで編集
- **削除**: 選択後、Deleteキーまたは削除ボタン

---

## 1. Text Widget

### 概要
テキストを表示するための基本的なWidget。見出しや段落などに使用。

### プロパティ

```typescript
interface TextWidgetProps {
  content: string;           // 表示テキスト
  fontSize: number;          // フォントサイズ（px）
  color: string;             // テキスト色（hex）
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign: 'left' | 'center' | 'right';
  fontFamily?: string;       // フォントファミリー（オプション）
  lineHeight?: number;       // 行高（オプション）
}
```

### デフォルト値

```typescript
{
  content: 'Text',
  fontSize: 16,
  color: '#000000',
  fontWeight: 'normal',
  textAlign: 'left'
}
```

### レンダリング例

```html
<div style="
  font-size: 16px;
  color: #000000;
  font-weight: normal;
  text-align: left;
">
  Text
</div>
```

### プロパティパネルUI
- **Content**: テキストエリア
- **Font Size**: 数値入力（8-72）
- **Color**: カラーピッカー
- **Font Weight**: ドロップダウン
- **Text Align**: ボタングループ（左/中央/右）

---

## 2. Input Widget

### 概要
ユーザー入力を受け付けるフォームフィールド。

### プロパティ

```typescript
interface InputWidgetProps {
  label: string;             // ラベルテキスト
  placeholder: string;       // プレースホルダー
  inputType: 'text' | 'email' | 'password' | 'number' | 'tel';
  required: boolean;         // 必須フラグ
  defaultValue?: string;     // デフォルト値
  width: number;             // 幅（px）
}
```

### デフォルト値

```typescript
{
  label: 'Input',
  placeholder: 'Enter text...',
  inputType: 'text',
  required: false,
  width: 200
}
```

### レンダリング例

```html
<div>
  <label>Input</label>
  <input
    type="text"
    placeholder="Enter text..."
    style="width: 200px;"
  />
</div>
```

### プロパティパネルUI
- **Label**: テキスト入力
- **Placeholder**: テキスト入力
- **Input Type**: ドロップダウン
- **Required**: チェックボックス
- **Width**: 数値スライダー（100-500）

---

## 3. Button Widget

### 概要
クリック可能なボタン要素。

### プロパティ

```typescript
interface ButtonWidgetProps {
  text: string;              // ボタンテキスト
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  color: string;             // 背景色（hex）
  textColor: string;         // テキスト色（hex）
  borderRadius: number;      // 角丸（px）
  disabled?: boolean;        // 無効化フラグ
}
```

### デフォルト値

```typescript
{
  text: 'Button',
  variant: 'primary',
  size: 'medium',
  color: '#3B82F6',
  textColor: '#FFFFFF',
  borderRadius: 6,
  disabled: false
}
```

### バリアント別スタイル

**Primary**: 塗りつぶしボタン
```css
background: color;
color: textColor;
border: none;
```

**Secondary**: 薄い背景のボタン
```css
background: rgba(color, 0.1);
color: color;
border: none;
```

**Outline**: 枠線のみボタン
```css
background: transparent;
color: color;
border: 1px solid color;
```

**Ghost**: 背景なし、ホバー時のみ背景表示
```css
background: transparent;
color: color;
border: none;
```

### サイズ別スタイル
- **Small**: padding: 8px 16px; font-size: 14px;
- **Medium**: padding: 12px 24px; font-size: 16px;
- **Large**: padding: 16px 32px; font-size: 18px;

### プロパティパネルUI
- **Text**: テキスト入力
- **Variant**: ボタングループ
- **Size**: ボタングループ
- **Color**: カラーピッカー
- **Text Color**: カラーピッカー
- **Border Radius**: 数値スライダー（0-20）

---

## 4. Image Widget

### 概要
画像を表示するWidget。

### プロパティ

```typescript
interface ImageWidgetProps {
  src: string;               // 画像URL
  alt: string;               // 代替テキスト
  objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  borderRadius: number;      // 角丸（px）
  opacity: number;           // 不透明度（0-1）
}
```

### デフォルト値

```typescript
{
  src: 'https://via.placeholder.com/300x200',
  alt: 'Image',
  objectFit: 'cover',
  borderRadius: 0,
  opacity: 1
}
```

### レンダリング例

```html
<img
  src="https://via.placeholder.com/300x200"
  alt="Image"
  style="
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 0px;
    opacity: 1;
  "
/>
```

### プロパティパネルUI
- **Image URL**: テキスト入力（URL検証）
- **Alt Text**: テキスト入力
- **Object Fit**: ドロップダウン
- **Border Radius**: 数値スライダー（0-50）
- **Opacity**: 数値スライダー（0-1, step: 0.1）

---

## 5. Table Widget

### 概要
データを表形式で表示するWidget。

### プロパティ

```typescript
interface TableWidgetProps {
  columns: TableColumn[];    // カラム定義
  data: TableRow[];          // データ行
  striped: boolean;          // ストライプ表示
  bordered: boolean;         // ボーダー表示
  hoverable: boolean;        // ホバー効果
  headerBgColor: string;     // ヘッダー背景色
  headerTextColor: string;   // ヘッダーテキスト色
}

interface TableColumn {
  key: string;               // データキー
  label: string;             // 表示ラベル
  width?: number;            // カラム幅（px）
}

interface TableRow {
  [key: string]: string | number;
}
```

### デフォルト値

```typescript
{
  columns: [
    { key: 'id', label: 'ID', width: 50 },
    { key: 'name', label: 'Name', width: 150 },
    { key: 'email', label: 'Email', width: 200 }
  ],
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ],
  striped: true,
  bordered: true,
  hoverable: true,
  headerBgColor: '#F3F4F6',
  headerTextColor: '#111827'
}
```

### レンダリング例

```html
<table style="width: 100%; border-collapse: collapse;">
  <thead style="background: #F3F4F6; color: #111827;">
    <tr>
      <th style="width: 50px; padding: 12px; border: 1px solid #E5E7EB;">ID</th>
      <th style="width: 150px; padding: 12px; border: 1px solid #E5E7EB;">Name</th>
      <th style="width: 200px; padding: 12px; border: 1px solid #E5E7EB;">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #FFFFFF;">
      <td style="padding: 12px; border: 1px solid #E5E7EB;">1</td>
      <td style="padding: 12px; border: 1px solid #E5E7EB;">John Doe</td>
      <td style="padding: 12px; border: 1px solid #E5E7EB;">john@example.com</td>
    </tr>
    <tr style="background: #F9FAFB;">
      <td style="padding: 12px; border: 1px solid #E5E7EB;">2</td>
      <td style="padding: 12px; border: 1px solid #E5E7EB;">Jane Smith</td>
      <td style="padding: 12px; border: 1px solid #E5E7EB;">jane@example.com</td>
    </tr>
  </tbody>
</table>
```

### プロパティパネルUI
- **Columns**: JSONエディタまたはカラムビルダー
- **Data**: JSONエディタまたはデータグリッド
- **Striped**: チェックボックス
- **Bordered**: チェックボックス
- **Hoverable**: チェックボックス
- **Header Background**: カラーピッカー
- **Header Text Color**: カラーピッカー

---

## 6. Select Widget

### 概要
ドロップダウン選択フィールド。

### プロパティ

```typescript
interface SelectWidgetProps {
  label: string;             // ラベル
  options: SelectOption[];   // 選択肢
  defaultValue?: string;     // デフォルト選択値
  placeholder: string;       // プレースホルダー
  required: boolean;         // 必須フラグ
  width: number;             // 幅（px）
}

interface SelectOption {
  value: string;             // 値
  label: string;             // 表示ラベル
}
```

### デフォルト値

```typescript
{
  label: 'Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ],
  placeholder: 'Choose an option...',
  required: false,
  width: 200
}
```

### レンダリング例

```html
<div>
  <label>Select</label>
  <select style="width: 200px; padding: 8px;">
    <option value="" disabled selected>Choose an option...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </select>
</div>
```

### プロパティパネルUI
- **Label**: テキスト入力
- **Options**: リストエディタ（追加/削除/編集）
  - Value: テキスト入力
  - Label: テキスト入力
- **Placeholder**: テキスト入力
- **Required**: チェックボックス
- **Width**: 数値スライダー（100-500）

---

## Widget実装パターン

### TypeScript型定義（types/widget.ts）

```typescript
export type WidgetType = 'Text' | 'Input' | 'Button' | 'Image' | 'Table' | 'Select';

export interface BaseWidget {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface TextWidget extends BaseWidget {
  type: 'Text';
  props: TextWidgetProps;
}

export interface InputWidget extends BaseWidget {
  type: 'Input';
  props: InputWidgetProps;
}

// ... 他のWidget型定義

export type Widget =
  | TextWidget
  | InputWidget
  | ButtonWidget
  | ImageWidget
  | TableWidget
  | SelectWidget;
```

### Widget Componentパターン

各Widgetコンポーネントは以下の構造を持ちます：

```typescript
// components/widgets/Button.tsx
interface ButtonProps {
  widget: ButtonWidget;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function Button({ widget, isSelected, onSelect }: ButtonProps) {
  const { text, variant, size, color, textColor, borderRadius } = widget.props;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'transition-all',
        isSelected && 'ring-2 ring-blue-500'
      )}
      style={{
        background: color,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        // ... その他のスタイル
      }}
    >
      {text}
    </button>
  );
}
```

---

## Widget追加の拡張性

将来的にWidgetを追加する場合の手順：

1. **型定義追加** (`types/widget.ts`)
   - 新しいWidget型を定義
   - `WidgetType` に追加
   - `Widget` Union型に追加

2. **Componentの作成** (`components/widgets/NewWidget.tsx`)
   - Widgetコンポーネントを実装

3. **パレット登録** (`components/builder/WidgetPalette.tsx`)
   - パレットに追加

4. **プロパティパネル対応** (`components/builder/PropertiesPanel.tsx`)
   - Widget別のプロパティ編集UIを追加

5. **エクスポート対応** (`lib/export/html-generator.ts`)
   - HTML/CSS生成ロジックを追加

---

## レスポンシブ対応（将来的）

現在のプロトタイプではスコープ外ですが、将来的には以下の対応を検討：

```typescript
interface ResponsiveWidget extends BaseWidget {
  responsive: {
    desktop: { size: Size; position: Position };
    tablet: { size: Size; position: Position };
    mobile: { size: Size; position: Position };
  };
}
```
