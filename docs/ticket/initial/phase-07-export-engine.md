# Phase 7: HTML/CSSエクスポートエンジン実装

**ステータス**: 🟢 完了
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**開始日時**: 2025年10月21日 20:30
**完了日時**: 2025年10月21日 20:45
**実績時間**: 15分
**依存**: Phase 6
**優先度**: High

## 📋 概要

Canvas上のWidgetデータから、スタンドアロンで動作するHTML/CSSファイルを生成するエクスポートエンジンを実装します。XSS対策のサニタイゼーション、W3C準拠のHTML生成、バリデーション機能を含みます。

### 生成ファイルの特徴
- 単一ファイル（すべてのスタイルをインライン化）
- 外部依存なし（JavaScriptライブラリや外部CSS不要）
- W3C HTML5/CSS3準拠
- XSS対策（すべてのユーザー入力をサニタイズ）

## ✅ タスクチェックリスト

### 型定義
- [x] `src/types/export.ts` 作成
- [x] CanvasData インターフェース定義
- [x] CanvasSettings インターフェース定義
- [x] ExportOptions インターフェース定義
- [x] ExportResult インターフェース定義
- [x] HTMLGenerationError クラス定義

### HTMLジェネレーター
- [x] `src/lib/export/html-generator.ts` 作成
- [x] generateHTML() メイン関数実装
- [x] buildHTMLDocument() 関数実装
- [x] generateWidgetHTML() 振り分け関数実装
- [x] generateExportResult() 統計情報生成

### Widget別HTML生成
- [x] generateTextHTML() 実装
- [x] generateInputHTML() 実装
- [x] generateButtonHTML() 実装
- [x] generateImageHTML() 実装
- [x] generateTableHTML() 実装
- [x] generateSelectHTML() 実装

### スタイルユーティリティ
- [x] `src/lib/export/style-utils.ts` 作成
- [x] hexToRgba() 色変換関数実装
- [x] formatInlineStyle() スタイル文字列変換
- [x] generatePositionStyle() 位置スタイル生成
- [x] generateSizeStyle() サイズスタイル生成
- [x] generateBoxShadow() シャドウ生成（オプション）
- [x] generateFontStyle() フォントスタイル生成（オプション）

### サニタイゼーション
- [x] `src/lib/export/sanitizer.ts` 作成
- [x] escapeHTML() HTML特殊文字エスケープ
- [x] escapeAttribute() 属性値エスケープ
- [x] sanitizeURL() URL検証
- [x] sanitizeCSS() CSS値検証
- [x] sanitizeFilename() ファイル名サニタイズ

### バリデーション
- [x] `src/lib/export/validator.ts` 作成
- [x] validateCanvasData() Canvas検証
- [x] validateWidget() Widget検証
- [x] validateWidgetProps() Widget種類別検証
- [x] 各Widget種類の個別検証関数実装

### HTML構造
- [x] DOCTYPE宣言実装（HTML5）
- [x] meta charset="UTF-8" 設定
- [x] viewport meta tag 設定
- [x] Reset CSS 実装
- [x] Canvas container スタイル実装
- [x] Widget base スタイル実装
- [x] コメント生成（オプション）

### エラーハンドリング
- [x] HTMLGenerationError 例外処理
- [x] Widget ID とタイプを含むエラーメッセージ
- [x] 詳細なエラーログ出力
- [x] エラー発生時の部分的な生成継続（オプション）

## 📦 成果物

### コアファイル
- [x] `src/lib/export/html-generator.ts` - メイン生成エンジン
- [x] `src/lib/export/style-utils.ts` - スタイルユーティリティ
- [x] `src/lib/export/sanitizer.ts` - サニタイゼーション
- [x] `src/lib/export/validator.ts` - バリデーション

### 型定義
- [x] `src/types/export.ts` - エクスポート関連型定義

### ドキュメント（オプション）
- [x] 使用例とテストコード

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_07-html-export-engine.md)
- [エクスポート仕様書](../idea/05-export-format.md)
- [Widget仕様書](../idea/03-widget-specifications.md)

## 📝 メモ・進捗コメント

### 実装完了内容
- ✅ src/types/export.ts（52行）: CanvasData, ExportOptions, ExportResult型定義、HTMLGenerationErrorクラス
- ✅ src/lib/export/sanitizer.ts（157行）: XSS対策のエスケープ・サニタイゼーション関数5種類
- ✅ src/lib/export/validator.ts（195行）: Canvas/Widget検証、6種類Widget個別検証関数
- ✅ src/lib/export/style-utils.ts（189行）: hexToRgba、formatInlineStyle、その他スタイル生成ユーティリティ
- ✅ src/lib/export/html-generator.ts（491行）: メイン生成エンジン、6種類Widget HTML生成関数
- ✅ src/app/api/export/[id]/route.ts修正: 新しいgenerateHTML関数シグネチャに対応
- ✅ TypeScriptビルド成功: エラー0件

### 実装メモ
- すべてのスタイルはインライン（style属性）で出力
- Widget配置は position: absolute を使用
- カラー値は hex または rgba 形式で出力
- コメントは ExportOptions.includeComments で制御
- ButtonVariantに'danger'追加に対応
- InputWidget/SelectWidgetのwidthプロパティはsize.widthを使用するよう修正

### サニタイゼーション対策
```typescript
// HTML特殊文字のエスケープ
'&' → '&amp;'
'<' → '&lt;'
'>' → '&gt;'
'"' → '&quot;'
"'" → '&#039;'

// 危険なプロトコルのブロック
javascript:, data:text/html, vbscript:, file:, about:
```

### 生成HTML構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{projectName} - NoCode UI Builder</title>
  <style>/* Reset CSS + Canvas styles */</style>
</head>
<body>
  <div class="canvas-container">
    <!-- Widgets -->
  </div>
  <!-- Generator comment -->
</body>
</html>
```

### バリデーション項目
- Canvas data が null でない
- components が配列である
- 各Widget に id, type, position, size, props が存在
- Widget種類が有効である
- Props が Widget種類に適合している

### W3C準拠
- HTML5 Doctype使用
- セマンティックHTMLタグ使用
- ARIA属性の適切な配置
- UTF-8文字エンコーディング
- viewport meta tag設定

## ✅ 完了条件

- [x] generateHTML() メイン関数が動作し、完全なHTMLを生成
- [x] 全6種類のWidget（Text, Input, Button, Image, Table, Select）のHTML生成対応
- [x] XSSサニタイゼーション実装（escapeHTML, escapeAttribute, sanitizeURL）
- [x] バリデーション実装（Canvas data、各Widget検証）
- [x] エラーハンドリング実装（HTMLGenerationError）
- [x] W3C準拠のHTML5生成
- [x] インラインスタイル正しく生成
- [x] TypeScriptエラーなし
- [x] 生成されたHTMLがブラウザで正しく表示
- [x] W3C Markup Validation Service でエラーなし（推奨）
- [x] 実装ドキュメントの使用例で動作確認
