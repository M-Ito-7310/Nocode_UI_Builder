# Phase 7: HTML/CSSエクスポートエンジン実装

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
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
- [ ] `src/types/export.ts` 作成
- [ ] CanvasData インターフェース定義
- [ ] CanvasSettings インターフェース定義
- [ ] ExportOptions インターフェース定義
- [ ] ExportResult インターフェース定義
- [ ] HTMLGenerationError クラス定義

### HTMLジェネレーター
- [ ] `src/lib/export/html-generator.ts` 作成
- [ ] generateHTML() メイン関数実装
- [ ] buildHTMLDocument() 関数実装
- [ ] generateWidgetHTML() 振り分け関数実装
- [ ] generateExportResult() 統計情報生成

### Widget別HTML生成
- [ ] generateTextHTML() 実装
- [ ] generateInputHTML() 実装
- [ ] generateButtonHTML() 実装
- [ ] generateImageHTML() 実装
- [ ] generateTableHTML() 実装
- [ ] generateSelectHTML() 実装

### スタイルユーティリティ
- [ ] `src/lib/export/style-utils.ts` 作成
- [ ] hexToRgba() 色変換関数実装
- [ ] formatInlineStyle() スタイル文字列変換
- [ ] generatePositionStyle() 位置スタイル生成
- [ ] generateSizeStyle() サイズスタイル生成
- [ ] generateBoxShadow() シャドウ生成（オプション）
- [ ] generateFontStyle() フォントスタイル生成（オプション）

### サニタイゼーション
- [ ] `src/lib/export/sanitizer.ts` 作成
- [ ] escapeHTML() HTML特殊文字エスケープ
- [ ] escapeAttribute() 属性値エスケープ
- [ ] sanitizeURL() URL検証
- [ ] sanitizeCSS() CSS値検証
- [ ] sanitizeFilename() ファイル名サニタイズ

### バリデーション
- [ ] `src/lib/export/validator.ts` 作成
- [ ] validateCanvasData() Canvas検証
- [ ] validateWidget() Widget検証
- [ ] validateWidgetProps() Widget種類別検証
- [ ] 各Widget種類の個別検証関数実装

### HTML構造
- [ ] DOCTYPE宣言実装（HTML5）
- [ ] meta charset="UTF-8" 設定
- [ ] viewport meta tag 設定
- [ ] Reset CSS 実装
- [ ] Canvas container スタイル実装
- [ ] Widget base スタイル実装
- [ ] コメント生成（オプション）

### エラーハンドリング
- [ ] HTMLGenerationError 例外処理
- [ ] Widget ID とタイプを含むエラーメッセージ
- [ ] 詳細なエラーログ出力
- [ ] エラー発生時の部分的な生成継続（オプション）

## 📦 成果物

### コアファイル
- [ ] `src/lib/export/html-generator.ts` - メイン生成エンジン
- [ ] `src/lib/export/style-utils.ts` - スタイルユーティリティ
- [ ] `src/lib/export/sanitizer.ts` - サニタイゼーション
- [ ] `src/lib/export/validator.ts` - バリデーション

### 型定義
- [ ] `src/types/export.ts` - エクスポート関連型定義

### ドキュメント（オプション）
- [ ] 使用例とテストコード

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_07-html-export-engine.md)
- [エクスポート仕様書](../idea/05-export-format.md)
- [Widget仕様書](../idea/03-widget-specifications.md)

## 📝 メモ・コメント

### 実装メモ
- すべてのスタイルはインライン（style属性）で出力
- Widget配置は position: absolute を使用
- カラー値は hex または rgba 形式で出力
- コメントは ExportOptions.includeComments で制御

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

- [ ] generateHTML() メイン関数が動作し、完全なHTMLを生成
- [ ] 全6種類のWidget（Text, Input, Button, Image, Table, Select）のHTML生成対応
- [ ] XSSサニタイゼーション実装（escapeHTML, escapeAttribute, sanitizeURL）
- [ ] バリデーション実装（Canvas data、各Widget検証）
- [ ] エラーハンドリング実装（HTMLGenerationError）
- [ ] W3C準拠のHTML5生成
- [ ] インラインスタイル正しく生成
- [ ] TypeScriptエラーなし
- [ ] 生成されたHTMLがブラウザで正しく表示
- [ ] W3C Markup Validation Service でエラーなし（推奨）
- [ ] 実装ドキュメントの使用例で動作確認
