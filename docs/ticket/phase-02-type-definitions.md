# Phase 2: 型定義システム構築

**ステータス**: 🟢 完了
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: 15分
**依存**: Phase 1
**優先度**: High
**開始日時**: 2025-10-21 17:00
**完了日時**: 2025-10-21 17:15

## 📋 概要

TypeScriptの型システムを構築し、Widget、Project、Canvas関連の型定義を完全に実装します。Union型、Type Guards、ユーティリティ関数を活用して、型安全性の高い開発環境を整備します。これにより、コンパイル時のエラー検出、IntelliSenseによる開発者体験の向上、リファクタリングの安全性を確保します。

## ✅ タスクチェックリスト

- [x] src/types/widget.tsファイルを作成
- [x] 基本型定義を実装（WidgetType、Position、Size、BaseWidget）
- [x] Text Widget型とPropsを定義（TextWidget、TextWidgetProps、デフォルト値）
- [x] Input Widget型とPropsを定義（InputWidget、InputWidgetProps、デフォルト値）
- [x] Button Widget型とPropsを定義（ButtonWidget、ButtonWidgetProps、デフォルト値）
- [x] Image Widget型とPropsを定義（ImageWidget、ImageWidgetProps、デフォルト値）
- [x] Table Widget型とPropsを定義（TableWidget、TableWidgetProps、TableColumn、TableRow、デフォルト値）
- [x] Select Widget型とPropsを定義（SelectWidget、SelectWidgetProps、SelectOption、デフォルト値）
- [x] Widget Union型を定義（すべてのWidget型の統合）
- [x] Type Guards関数を実装（isTextWidget、isInputWidget、isButtonWidget、isImageWidget、isTableWidget、isSelectWidget）
- [x] Widget関連ヘルパー関数を実装（getDefaultWidgetProps、getDefaultWidgetSize、getWidgetDisplayName）
- [x] src/types/project.tsファイルを作成
- [x] CanvasData型とCanvasSettings型を定義
- [x] Project型を定義（データベーススキーマと対応）
- [x] CreateProjectInput型とUpdateProjectInput型を定義
- [x] ProjectListFilter型とProjectListResponse型を定義
- [x] API Response型を定義（ApiSuccessResponse、ApiErrorResponse、ApiResponse）
- [x] Project関連Type Guardsを実装（isApiSuccess、isApiError）
- [x] Project関連バリデーション関数を実装（validateProjectName、validateProjectDescription、validateCanvasData）
- [x] src/types/canvas.tsファイルを作成
- [x] CanvasState型とCanvasHistoryState型を定義
- [x] CanvasAction関連の型を定義（CanvasActionType、各種Action型、CanvasAction Union型）
- [x] ドラッグ&ドロップ関連型を定義（DragData、DropEventData）
- [x] Canvas関連ヘルパー関数を実装（sortWidgetsByZIndex、getWidgetAtPosition、isOverlapping）
- [x] src/lib/utils.tsファイルを作成
- [x] クラス名結合関数を実装（cn関数、clsxとtailwind-mergeを使用）
- [x] UUID生成関数を実装（generateId、generatePrefixedId）
- [x] 座標計算関数を実装（snapToGrid、calculateDistance、isWithinBounds）
- [x] 文字列処理関数を実装（truncate、camelToWords）
- [x] 数値処理関数を実装（clamp、round）
- [x] オブジェクト処理関数を実装（deepClone、removeUndefined）
- [x] 配列処理関数を実装（unique、shuffle）
- [x] 日時処理関数を実装（getRelativeTime、formatDate）
- [x] デバウンス・スロットル関数を実装（debounce、throttle）
- [x] npm run type-checkでTypeScriptエラーが0件であることを確認
- [x] 型定義のインポートテストを実施（src/app/page.tsxで型が正しくインポートできるか確認）
- [x] npm run lintでESLint警告が5件以下であることを確認
- [x] Gitコミットを作成

## 📦 成果物

- [x] src/types/widget.ts（約250行、6種類のWidget型定義、Type Guards、ヘルパー関数）
- [x] src/types/project.ts（約100行、Project型定義、API Response型、バリデーション関数）
- [x] src/types/canvas.ts（約80行、CanvasState型、CanvasAction型、ヘルパー関数）
- [x] src/lib/utils.ts（約120行、汎用ユーティリティ関数）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_02-type-definitions.md)

## 🎯 完了条件

- [x] すべての型定義ファイル（widget.ts、project.ts、canvas.ts）が作成され、完全に実装されている
- [x] src/lib/utils.tsがすべてのユーティリティ関数を含んでいる
- [x] npm run type-checkでTypeScriptエラーが0件
- [x] Type Guards（isButtonWidget等）が正しく動作し、型を絞り込める
- [x] ユーティリティ関数（cn、generateId、snapToGrid、clamp等）が正しく動作する
- [x] 他のファイルから型定義とユーティリティ関数が正しくインポートできる
- [x] npm run lintでESLint警告が5件以下
- [x] Gitに変更がコミットされている

## 📝 メモ・進捗コメント

### 2025-10-21 17:15 - Phase 2完了

#### 実装完了内容
- src/types/widget.ts（約250行）: 6種類のWidget型定義、Type Guards、ヘルパー関数を完全実装
- src/types/project.ts（約100行）: Project型定義、API Response型、バリデーション関数を完全実装
- src/types/canvas.ts（約80行）: CanvasState型、CanvasAction型、ヘルパー関数を完全実装
- src/lib/utils.ts（約120行）: 汎用ユーティリティ関数を完全実装

#### 成功点・工夫した点
- TypeScript strict modeでエラーなくコンパイル成功
- shuffle関数で配列の分割代入による型エラーが発生したため、一時変数を使用して修正
- すべての型定義で型安全性を確保（Union型、Type Guards、as const活用）
- 実装ドキュメントの完全なコード例をそのまま使用し、一貫性を確保

#### テスト結果
- npm run build: コンパイル成功（エラー0件）
- npm run lint: ESLint警告0件
- 型チェック: 完全通過
- インポートテスト: 正常動作確認

#### 次のPhaseへの引き継ぎ事項
- Phase 3ではこれらの型定義を使用してデータベーススキーマを実装します
- Widget型定義はPhase 6のWidgetコンポーネント実装で使用します
- Project型定義はPhase 4のAPI Routes実装で使用します
- ユーティリティ関数は全Phase共通で使用します

## ⚠️ 注意事項・リスク

- TypeScriptのstrict modeを有効にしているため、すべての型が明示的に定義される必要がある
- Union型を使用する際は、Type Guardsで型を絞り込んでからプロパティにアクセスすること
- `as const`アサーションを使用して、配列やオブジェクトの型を厳密に推論させること
- Widget型の追加や変更時は、必ずType Guardsとヘルパー関数も更新すること
- clsxとtailwind-mergeのインポートが正しく行われていることを確認（Phase 1でインストール済み）
- uuidライブラリのインポート方法に注意（import { v4 as uuidv4 } from 'uuid'）
- デバウンス・スロットル関数は、Reactコンポーネント内で使用する際にuseCallbackでメモ化すること

## 🧪 テスト項目

- [x] TypeScript型チェックがエラーなく完了する（npm run type-check）
- [x] Widget型が正しくインポートできる（import { Widget, TextWidget } from '@/types/widget'）
- [x] Type Guardsが正しく型を絞り込む（isButtonWidget(widget)でwidgetがButtonWidget型に）
- [x] cn関数がTailwindクラスを正しくマージする（cn('px-2 py-1', 'px-4') === 'py-1 px-4'）
- [x] generateId関数がUUID v4を生成する（UUID形式: xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx）
- [x] snapToGrid関数が正しく座標をスナップする（snapToGrid(123, 10) === 120）
- [x] clamp関数が正しく範囲制限する（clamp(150, 0, 100) === 100）
- [x] truncate関数が文字列を切り詰める（truncate('Hello World', 8) === 'Hello...'）
- [x] getRelativeTime関数が相対時間を返す（new Date()を渡すと「たった今」）
- [x] デバウンス関数が正しく遅延実行される
