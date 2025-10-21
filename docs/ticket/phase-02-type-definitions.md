# Phase 2: 型定義システム構築

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 1
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

TypeScriptの型システムを構築し、Widget、Project、Canvas関連の型定義を完全に実装します。Union型、Type Guards、ユーティリティ関数を活用して、型安全性の高い開発環境を整備します。これにより、コンパイル時のエラー検出、IntelliSenseによる開発者体験の向上、リファクタリングの安全性を確保します。

## ✅ タスクチェックリスト

- [ ] src/types/widget.tsファイルを作成
- [ ] 基本型定義を実装（WidgetType、Position、Size、BaseWidget）
- [ ] Text Widget型とPropsを定義（TextWidget、TextWidgetProps、デフォルト値）
- [ ] Input Widget型とPropsを定義（InputWidget、InputWidgetProps、デフォルト値）
- [ ] Button Widget型とPropsを定義（ButtonWidget、ButtonWidgetProps、デフォルト値）
- [ ] Image Widget型とPropsを定義（ImageWidget、ImageWidgetProps、デフォルト値）
- [ ] Table Widget型とPropsを定義（TableWidget、TableWidgetProps、TableColumn、TableRow、デフォルト値）
- [ ] Select Widget型とPropsを定義（SelectWidget、SelectWidgetProps、SelectOption、デフォルト値）
- [ ] Widget Union型を定義（すべてのWidget型の統合）
- [ ] Type Guards関数を実装（isTextWidget、isInputWidget、isButtonWidget、isImageWidget、isTableWidget、isSelectWidget）
- [ ] Widget関連ヘルパー関数を実装（getDefaultWidgetProps、getDefaultWidgetSize、getWidgetDisplayName）
- [ ] src/types/project.tsファイルを作成
- [ ] CanvasData型とCanvasSettings型を定義
- [ ] Project型を定義（データベーススキーマと対応）
- [ ] CreateProjectInput型とUpdateProjectInput型を定義
- [ ] ProjectListFilter型とProjectListResponse型を定義
- [ ] API Response型を定義（ApiSuccessResponse、ApiErrorResponse、ApiResponse）
- [ ] Project関連Type Guardsを実装（isApiSuccess、isApiError）
- [ ] Project関連バリデーション関数を実装（validateProjectName、validateProjectDescription、validateCanvasData）
- [ ] src/types/canvas.tsファイルを作成
- [ ] CanvasState型とCanvasHistoryState型を定義
- [ ] CanvasAction関連の型を定義（CanvasActionType、各種Action型、CanvasAction Union型）
- [ ] ドラッグ&ドロップ関連型を定義（DragData、DropEventData）
- [ ] Canvas関連ヘルパー関数を実装（sortWidgetsByZIndex、getWidgetAtPosition、isOverlapping）
- [ ] src/lib/utils.tsファイルを作成
- [ ] クラス名結合関数を実装（cn関数、clsxとtailwind-mergeを使用）
- [ ] UUID生成関数を実装（generateId、generatePrefixedId）
- [ ] 座標計算関数を実装（snapToGrid、calculateDistance、isWithinBounds）
- [ ] 文字列処理関数を実装（truncate、camelToWords）
- [ ] 数値処理関数を実装（clamp、round）
- [ ] オブジェクト処理関数を実装（deepClone、removeUndefined）
- [ ] 配列処理関数を実装（unique、shuffle）
- [ ] 日時処理関数を実装（getRelativeTime、formatDate）
- [ ] デバウンス・スロットル関数を実装（debounce、throttle）
- [ ] npm run type-checkでTypeScriptエラーが0件であることを確認
- [ ] 型定義のインポートテストを実施（src/app/page.tsxで型が正しくインポートできるか確認）
- [ ] npm run lintでESLint警告が5件以下であることを確認
- [ ] Gitコミットを作成

## 📦 成果物

- [ ] src/types/widget.ts（約250行、6種類のWidget型定義、Type Guards、ヘルパー関数）
- [ ] src/types/project.ts（約100行、Project型定義、API Response型、バリデーション関数）
- [ ] src/types/canvas.ts（約80行、CanvasState型、CanvasAction型、ヘルパー関数）
- [ ] src/lib/utils.ts（約120行、汎用ユーティリティ関数）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_02-type-definitions.md)

## 🎯 完了条件

- [ ] すべての型定義ファイル（widget.ts、project.ts、canvas.ts）が作成され、完全に実装されている
- [ ] src/lib/utils.tsがすべてのユーティリティ関数を含んでいる
- [ ] npm run type-checkでTypeScriptエラーが0件
- [ ] Type Guards（isButtonWidget等）が正しく動作し、型を絞り込める
- [ ] ユーティリティ関数（cn、generateId、snapToGrid、clamp等）が正しく動作する
- [ ] 他のファイルから型定義とユーティリティ関数が正しくインポートできる
- [ ] npm run lintでESLint警告が5件以下
- [ ] Gitに変更がコミットされている

## 📝 メモ・進捗コメント

<!-- ここに進捗メモや問題点を記録 -->

## ⚠️ 注意事項・リスク

- TypeScriptのstrict modeを有効にしているため、すべての型が明示的に定義される必要がある
- Union型を使用する際は、Type Guardsで型を絞り込んでからプロパティにアクセスすること
- `as const`アサーションを使用して、配列やオブジェクトの型を厳密に推論させること
- Widget型の追加や変更時は、必ずType Guardsとヘルパー関数も更新すること
- clsxとtailwind-mergeのインポートが正しく行われていることを確認（Phase 1でインストール済み）
- uuidライブラリのインポート方法に注意（import { v4 as uuidv4 } from 'uuid'）
- デバウンス・スロットル関数は、Reactコンポーネント内で使用する際にuseCallbackでメモ化すること

## 🧪 テスト項目

- [ ] TypeScript型チェックがエラーなく完了する（npm run type-check）
- [ ] Widget型が正しくインポートできる（import { Widget, TextWidget } from '@/types/widget'）
- [ ] Type Guardsが正しく型を絞り込む（isButtonWidget(widget)でwidgetがButtonWidget型に）
- [ ] cn関数がTailwindクラスを正しくマージする（cn('px-2 py-1', 'px-4') === 'py-1 px-4'）
- [ ] generateId関数がUUID v4を生成する（UUID形式: xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx）
- [ ] snapToGrid関数が正しく座標をスナップする（snapToGrid(123, 10) === 120）
- [ ] clamp関数が正しく範囲制限する（clamp(150, 0, 100) === 100）
- [ ] truncate関数が文字列を切り詰める（truncate('Hello World', 8) === 'Hello...'）
- [ ] getRelativeTime関数が相対時間を返す（new Date()を渡すと「たった今」）
- [ ] デバウンス関数が正しく遅延実行される
