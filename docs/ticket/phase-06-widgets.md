# Phase 6: Widgetコンポーネント実装

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 45-60分
**実績時間**: -
**依存**: Phase 5
**優先度**: High

## 📋 概要

NoCode UI Builderで使用する6種類のWidgetコンポーネント（Text, Input, Button, Image, Table, Select）を実装します。各Widgetは選択状態・ホバー状態の管理、Props to Style変換、React.memoによる最適化を含みます。

### 実装するWidget一覧
1. **Text Widget** - テキスト表示
2. **Input Widget** - フォーム入力
3. **Button Widget** - ボタン
4. **Image Widget** - 画像表示
5. **Table Widget** - データテーブル
6. **Select Widget** - ドロップダウン選択

## ✅ タスクチェックリスト

### 型定義
- [ ] `src/types/widget.ts` にWidget型定義追加（Phase 2で作成済みの場合は確認）
- [ ] BaseWidget インターフェース定義
- [ ] 各Widget固有のProps型定義
- [ ] WidgetComponentProps ジェネリック型定義
- [ ] Widget Union型定義

### Text Widget
- [ ] `src/components/widgets/Text.tsx` 作成
- [ ] TextWidgetProps インターフェース実装
- [ ] Propsからスタイルオブジェクト生成
- [ ] 選択状態のスタイル実装
- [ ] ホバー状態のスタイル実装
- [ ] React.memoでメモ化
- [ ] カスタム比較関数実装

### Input Widget
- [ ] `src/components/widgets/Input.tsx` 作成
- [ ] InputWidgetProps インターフェース実装
- [ ] ラベルとフィールドのレイアウト実装
- [ ] 5種類のinputType対応（text, email, password, number, tel）
- [ ] 必須項目マーク表示
- [ ] ビルダー内での入力無効化（readOnly）
- [ ] React.memoでメモ化

### Button Widget
- [ ] `src/components/widgets/Button.tsx` 作成
- [ ] ButtonWidgetProps インターフェース実装
- [ ] 4種類のバリアント実装（primary, secondary, outline, ghost）
- [ ] 3種類のサイズ実装（small, medium, large）
- [ ] hexToRgba ヘルパー関数実装
- [ ] 無効状態のスタイル実装
- [ ] React.memoでメモ化

### Image Widget
- [ ] `src/components/widgets/Image.tsx` 作成
- [ ] ImageWidgetProps インターフェース実装
- [ ] 画像読み込み状態管理
- [ ] エラー状態管理
- [ ] プレースホルダー表示実装
- [ ] object-fit スタイル対応
- [ ] borderRadius と opacity 対応
- [ ] React.memoでメモ化

### Table Widget
- [ ] `src/components/widgets/Table.tsx` 作成
- [ ] TableWidgetProps インターフェース実装
- [ ] TableColumn と TableRow 型定義
- [ ] ストライプ表示実装
- [ ] ボーダー表示実装
- [ ] ホバー効果実装
- [ ] 空データ時の表示実装
- [ ] React.memoでメモ化

### Select Widget
- [ ] `src/components/widgets/Select.tsx` 作成
- [ ] SelectWidgetProps インターフェース実装
- [ ] SelectOption 型定義
- [ ] プレースホルダーオプション実装
- [ ] 選択値の状態管理
- [ ] カスタム矢印アイコン実装（SVG Data URI）
- [ ] ビルダー内での選択無効化（disabled）
- [ ] React.memoでメモ化

### デフォルト値とユーティリティ
- [ ] `src/lib/widget-defaults.ts` 作成
- [ ] 各Widget種類のデフォルトProps定義
- [ ] getDefaultProps() 関数実装
- [ ] `src/lib/style-converter.ts` 作成
- [ ] Props to Style 変換関数実装
- [ ] hexToRgba() ユーティリティ実装

### 選択状態管理
- [ ] `src/hooks/useWidgetSelection.ts` 作成
- [ ] selectedId 状態管理
- [ ] hoveredId 状態管理
- [ ] selectWidget, clearSelection 関数
- [ ] hoverWidget, clearHover 関数
- [ ] isSelected, isHovered ヘルパー関数

### Widgetレンダラー
- [ ] `src/lib/widget-renderer.ts` 作成（オプション）
- [ ] Widget種類に応じたコンポーネント取得関数
- [ ] 動的インポート対応

## 📦 成果物

### Widgetコンポーネント（6種類）
- [ ] `src/components/widgets/Text.tsx` - テキストWidget
- [ ] `src/components/widgets/Input.tsx` - 入力Widget
- [ ] `src/components/widgets/Button.tsx` - ボタンWidget
- [ ] `src/components/widgets/Image.tsx` - 画像Widget
- [ ] `src/components/widgets/Table.tsx` - テーブルWidget
- [ ] `src/components/widgets/Select.tsx` - セレクトWidget

### ユーティリティとフック
- [ ] `src/lib/widget-defaults.ts` - デフォルト値定義
- [ ] `src/lib/style-converter.ts` - スタイル変換ユーティリティ
- [ ] `src/hooks/useWidgetSelection.ts` - 選択状態管理フック

### 型定義
- [ ] `src/types/widget.ts` - Widget型定義（更新）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_06-widget-components.md)
- [Widget仕様書](../idea/03-widget-specifications.md)
- [型定義](../implementation/20251021_02-type-definitions.md)

## 📝 メモ・コメント

### 実装メモ
- 全Widgetは React.memo でメモ化してパフォーマンス最適化
- 比較関数で deep comparison を実装（JSON.stringify使用）
- 選択状態とホバー状態で視覚的フィードバック提供
- すべてのスタイルをインラインで適用（position: relative）

### React.memo 最適化戦略
```typescript
// カスタム比較関数パターン
export default memo(WidgetComponent, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
```

### スタイル実装パターン
- 基本スタイル: position, width, height, padding等
- 選択スタイル: outline 2px solid #3B82F6
- ホバースタイル: outline 1px dashed #93C5FD
- transition: all 0.2s ease で滑らかな変化

### 注意点
- InputとSelectはビルダー内で入力を無効化（readOnly/disabled）
- Imageは読み込みエラー時のフォールバック表示必須
- Tableは空データ時の表示必須
- Buttonのdisabled状態は opacity: 0.5

## ✅ 完了条件

- [ ] 全6種類のWidget（Text, Input, Button, Image, Table, Select）実装完了
- [ ] 各Widgetで適切なPropsインターフェース定義
- [ ] Props to Style変換が正しく動作
- [ ] 選択状態とホバー状態のスタイルが適用
- [ ] React.memoによる最適化実装
- [ ] カスタム比較関数でパフォーマンス確保
- [ ] TypeScriptエラーなし（型安全性確保）
- [ ] デフォルト値定義完了
- [ ] スタイル変換ユーティリティ動作確認
- [ ] useWidgetSelectionフック動作確認
- [ ] data-widget-type, data-widget-id 属性が正しく設定
