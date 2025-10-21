# Phase 5: 共通UIコンポーネント実装

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 45-60分
**実績時間**: -
**依存**: Phase 4
**優先度**: High

## 📋 概要

NoCode UI Builderで使用する共通UIコンポーネントを実装します。Modal、Toast、Spinner、Button、Inputなどの再利用可能なコンポーネントを作成し、Tailwind CSSでスタイリングします。全コンポーネントでアクセシビリティ対応とアニメーション動作を実装します。

### 技術スタック
- React 18+ (Client Components)
- TypeScript
- Tailwind CSS
- lucide-react (アイコン)
- clsx + tailwind-merge (クラス結合)

## ✅ タスクチェックリスト

### 準備
- [ ] `clsx` と `tailwind-merge` パッケージのインストール
- [ ] `lucide-react` パッケージのインストール
- [ ] `src/lib/utils.ts` にクラス結合ユーティリティ作成

### Modalコンポーネント
- [ ] `src/components/ui/Modal.tsx` 作成
- [ ] Props定義（isOpen, onClose, title, children, footer, size等）
- [ ] ドロップエリアのオーバーレイ実装
- [ ] Escキーで閉じる機能実装
- [ ] 背景クリックで閉じる機能実装
- [ ] フォーカストラップ実装
- [ ] ボディスクロール無効化実装
- [ ] アクセシビリティ属性追加（role, aria-modal等）

### Toastコンポーネント
- [ ] `src/components/ui/Toast.tsx` 作成
- [ ] 4種類のバリアント実装（success, error, warning, info）
- [ ] 自動消去タイマー実装
- [ ] ToastContainerコンポーネント作成
- [ ] useToastカスタムフック作成
- [ ] アニメーション（フェードイン/アウト）実装
- [ ] アクセシビリティ対応（aria-live, role）

### Spinnerコンポーネント
- [ ] `src/components/ui/Spinner.tsx` 作成
- [ ] サイズバリエーション実装（sm, md, lg, xl）
- [ ] カラーバリエーション実装（primary, white, gray）
- [ ] FullScreenSpinnerコンポーネント作成
- [ ] InlineSpinnerコンポーネント作成
- [ ] 回転アニメーション実装

### Buttonコンポーネント
- [ ] `src/components/ui/Button.tsx` 作成
- [ ] 5種類のバリアント実装（primary, secondary, danger, ghost, outline）
- [ ] サイズバリエーション実装（sm, md, lg）
- [ ] ローディング状態実装
- [ ] アイコン対応（leftIcon, rightIcon）
- [ ] 無効状態スタイリング
- [ ] forwardRef実装

### Inputコンポーネント
- [ ] `src/components/ui/Input.tsx` 作成
- [ ] ラベル、エラー表示、ヘルプテキスト実装
- [ ] アイコン対応（leftIcon, rightIcon）
- [ ] TextAreaコンポーネント作成
- [ ] 必須項目マーク実装
- [ ] バリデーション表示機能
- [ ] forwardRef実装
- [ ] アクセシビリティ対応（aria-invalid, aria-describedby）

### Tailwind設定
- [ ] `tailwind.config.ts` にカスタムカラー追加
- [ ] アニメーション定義追加（fade-in, slide-up, spin-slow）
- [ ] keyframes定義追加
- [ ] `src/app/globals.css` にsr-onlyクラス追加

### 統合とエクスポート
- [ ] `src/components/ui/index.ts` 作成
- [ ] 全コンポーネントのエクスポート設定
- [ ] 型定義のエクスポート設定

## 📦 成果物

- [ ] `src/lib/utils.ts` - クラス結合ユーティリティ
- [ ] `src/components/ui/Modal.tsx` - モーダルダイアログ
- [ ] `src/components/ui/Toast.tsx` - トースト通知
- [ ] `src/components/ui/Spinner.tsx` - ローディングスピナー
- [ ] `src/components/ui/Button.tsx` - ボタンコンポーネント
- [ ] `src/components/ui/Input.tsx` - 入力フィールド
- [ ] `src/components/ui/index.ts` - エクスポート統合
- [ ] `tailwind.config.ts` - Tailwind設定（更新）
- [ ] `src/app/globals.css` - グローバルCSS（更新）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_05-common-ui-components.md)
- [型定義](../implementation/20251021_02-type-definitions.md)

## 📝 メモ・コメント

### 実装メモ
- Modalは Portal API を使用せず、固定位置で実装
- Toastは右上に固定表示
- すべてのコンポーネントでTailwind CSSのみ使用（カスタムCSS最小限）
- アニメーションはCSSトランジションとkeyframesで実装

### アクセシビリティ対応項目
- ARIA属性の適切な使用（role, aria-label, aria-labelledby等）
- キーボード操作のサポート（Tab, Escape, Enter）
- スクリーンリーダー対応（sr-onlyクラス、aria-live）
- フォーカス管理（フォーカストラップ、フォーカス復元）

### 注意点
- Modalのフォーカストラップは必須
- Toastの自動消去は duration=0 で無効化可能
- Buttonのローディング中は無効化
- Inputのエラー表示はaria-invalidと連動

## ✅ 完了条件

- [ ] Modal、Toast、Spinner、Button、Inputの全5コンポーネント実装完了
- [ ] 各コンポーネントで適切なPropsインターフェース定義
- [ ] アクセシビリティ対応（ARIA属性、キーボード操作）完了
- [ ] アニメーション動作（フェード、スライド、スピン）実装
- [ ] TypeScriptエラーなし（型安全性確保）
- [ ] Tailwind設定完了（カスタムカラー、アニメーション）
- [ ] すべてのコンポーネントが `src/components/ui/index.ts` からエクスポート
- [ ] forwardRefを使用したref対応（Button、Input）
- [ ] 実装ドキュメントの使用例で動作確認
