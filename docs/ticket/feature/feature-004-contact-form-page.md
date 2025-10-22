# Feature #004: お問い合わせフォームページの追加

**ステータス**: 🟢 完了
**優先度**: Medium
**担当**: AIエージェント
**開始日時**: 2025-10-22
**完了日時**: 2025-10-22
**見積もり時間**: 4-6時間
**実績時間**: 2時間30分
**作成日**: 2025-10-22

## 📋 機能概要

Xserverメールサーバーを使用したお問い合わせフォームページを実装します。CodeNestとBlueprintHubの実装を参考に、ユーザーからの問い合わせをメール送信する機能を追加します。

## 🎯 目的・背景

ユーザーがNoCode UI Builderに関する質問、フィードバック、サポート依頼を送信できる窓口を提供し、ユーザーとのコミュニケーションチャネルを確立します。

## 👥 対象ユーザー

- NoCode UI Builderを使用する全てのユーザー
- 製品に関する質問や問題を抱えているユーザー
- フィードバックや改善提案を送りたいユーザー

## ✨ 主要機能

1. お問い合わせフォームUI
   - 名前入力フィールド
   - メールアドレス入力フィールド
   - 件名入力フィールド
   - メッセージ入力フィールド（複数行テキストエリア）
   - 送信ボタン

2. フォームバリデーション
   - 必須項目チェック
   - メールアドレス形式チェック
   - 文字数制限チェック

3. メール送信機能
   - Xserverメールサーバー経由での送信
   - 送信先: nocode_ui_builder_contact@kaleidofuture.com
   - 送信完了通知（成功・失敗）

4. レスポンシブデザイン
   - モバイル・タブレット・デスクトップ対応

## 📐 技術仕様

### メールサーバー情報

- **メールアドレス**: nocode_ui_builder_contact@kaleidofuture.com
- **パスワード**: d5A_2V~[E952
- **SMTPサーバー**: Xserver（詳細はCodeNest/BlueprintHub参考）
- **参考プロジェクト**:
  - C:\Users\mitoi\Desktop\Projects\CodeNest
  - C:\Users\mitoi\Desktop\Projects\BlueprintHub

### データ構造

```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### API設計

- `POST /api/contact` - お問い合わせメール送信
  - Request Body: `ContactFormData`
  - Response: `ContactFormResponse`

### UI/UXデザイン

- `/contact` ルートに配置
- フッターからリンク追加
- シンプルで使いやすいフォームデザイン
- 送信中のローディング表示
- 送信成功/失敗のフィードバック表示

## ✅ 実装タスク

- [x] CodeNest/BlueprintHubのメール送信実装を調査
- [x] 必要なメールライブラリのインストール（nodemailer等）
- [x] 型定義作成（ContactFormData, ContactFormResponse）
- [x] APIエンドポイント実装（/api/contact）
- [x] Xserverメール送信設定
- [x] お問い合わせページUI実装（/contact）
- [x] フォームバリデーション実装
- [x] ローディング・エラーハンドリング実装
- [x] フッターへのリンク追加
- [x] レスポンシブデザイン対応
- [x] テスト実施（実際のメール送信確認）
- [x] ドキュメント更新

## 📦 成果物

- [x] `src/app/api/contact/route.ts` - メール送信APIエンドポイント
- [x] `src/app/contact/page.tsx` - お問い合わせページ
- [x] `src/components/ContactForm.tsx` - お問い合わせフォームコンポーネント
- [x] `src/lib/email.ts` - メール送信ユーティリティ（型定義含む）
- [x] `.env.local` - メール送信設定（環境変数）

## 🧪 テスト計画

### 単体テスト

- [x] フォームバリデーションのテスト
- [x] 各入力フィールドの動作確認

### 統合テスト

- [x] APIエンドポイントのテスト
- [x] メール送信機能のテスト（実際の送信確認）

### E2Eテスト

- [x] フォーム入力から送信完了までのフロー確認
- [x] エラーケースの動作確認（無効なメールアドレス等）
- [x] レスポンシブデザインの確認

## 📊 完了条件

- [x] 全実装タスク完了
- [x] 実際にメールが送信されることを確認
- [x] 全テスト項目パス
- [x] モバイル・デスクトップでの動作確認
- [x] フッターからのナビゲーション動作確認
- [x] ドキュメント更新完了

## 🔗 依存関係

- 依存する機能: feature-003（フッターコンポーネント）
- ブロックしている機能: なし

## 📝 メモ

### 実装詳細

実装日: 2025-10-22
実装者: AIエージェント

#### 作成したファイル

- `src/lib/email.ts` - メール送信ユーティリティ（nodemailer使用）
- `src/app/api/contact/route.ts` - お問い合わせAPIエンドポイント（Zodバリデーション）
- `src/components/ContactForm.tsx` - お問い合わせフォームコンポーネント
- `src/app/contact/page.tsx` - お問い合わせページ

#### 修正したファイル

- `package.json` - nodemailerと@types/nodemailerを追加
- `.env.local` - Xserverメール設定を追加（SMTP_HOST, SMTP_PORT等）
- `src/components/Footer.tsx` - お問い合わせリンクを追加

#### 技術的な決定事項

- **データベース保存なし**: CodeNestと異なり、メール送信のみに特化（シンプルな実装）
- **レート制限なし**: 初期実装では実装せず、必要に応じて後で追加
- **認証不要**: 誰でもお問い合わせ可能
- **Xserverメール使用**: sv16631.xserver.jp、ポート465、SSL使用
- **Zodバリデーション**: 名前30文字、件名100文字、メッセージ10-2000文字の制限

#### 注意点

- CodeNestとBlueprintHubの実装を参考にした
- メール認証情報は環境変数で管理（.env.local）
- セキュリティ対策（スパム防止、レート制限）は今後検討
- 送信成功時のユーザーへの自動返信メールも今後検討可
- 実際にメール送信を確認済み

### 完了記録

完了日時: 2025-10-22
実績時間: 2時間30分
見積時間: 4-6時間
Git commit: 69cf8cc47a2c41751ecf7dbb44cfbef3008a406e

#### 最終確認

- [x] すべての機能が実装されている
- [x] すべてのテストがパス
- [x] TypeScriptエラーなし
- [x] ドキュメント更新済み
- [x] デプロイ可能な状態
- [x] localhost動作確認済み
- [x] 実際のメール送信確認済み

## 🔗 関連

- 関連Feature: feature-003-footer-with-legal-pages
- 参考プロジェクト: CodeNest, BlueprintHub
- 関連Issue: -
- 関連PR: -
