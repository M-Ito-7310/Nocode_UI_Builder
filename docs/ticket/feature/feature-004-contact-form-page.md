# Feature #004: お問い合わせフォームページの追加

**ステータス**: 🔴 未着手
**優先度**: Medium
**担当**: 未割当
**見積もり時間**: 4-6時間
**実績時間**: -
**作成日**: 2025-10-22
**完了日**: -

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

- [ ] CodeNest/BlueprintHubのメール送信実装を調査
- [ ] 必要なメールライブラリのインストール（nodemailer等）
- [ ] 型定義作成（ContactFormData, ContactFormResponse）
- [ ] APIエンドポイント実装（/api/contact）
- [ ] Xserverメール送信設定
- [ ] お問い合わせページUI実装（/contact）
- [ ] フォームバリデーション実装
- [ ] ローディング・エラーハンドリング実装
- [ ] フッターへのリンク追加
- [ ] レスポンシブデザイン対応
- [ ] テスト実施（実際のメール送信確認）
- [ ] ドキュメント更新

## 📦 成果物

- [ ] `pages/api/contact.ts` - メール送信APIエンドポイント
- [ ] `pages/contact.tsx` - お問い合わせページ
- [ ] `components/ContactForm.tsx` - お問い合わせフォームコンポーネント
- [ ] メール送信設定ファイル（環境変数、設定ファイル等）
- [ ] 関連する型定義ファイル

## 🧪 テスト計画

### 単体テスト
- [ ] フォームバリデーションのテスト
- [ ] 各入力フィールドの動作確認

### 統合テスト
- [ ] APIエンドポイントのテスト
- [ ] メール送信機能のテスト（実際の送信確認）

### E2Eテスト
- [ ] フォーム入力から送信完了までのフロー確認
- [ ] エラーケースの動作確認（無効なメールアドレス等）
- [ ] レスポンシブデザインの確認

## 📊 完了条件

- [ ] 全実装タスク完了
- [ ] 実際にメールが送信されることを確認
- [ ] 全テスト項目パス
- [ ] モバイル・デスクトップでの動作確認
- [ ] フッターからのナビゲーション動作確認
- [ ] ドキュメント更新完了

## 🔗 依存関係

- 依存する機能: feature-003（フッターコンポーネント）
- ブロックしている機能: なし

## 📝 メモ

- CodeNestとBlueprintHubの実装を参考にすること
- メール認証情報は環境変数で管理すること（.env.local）
- セキュリティ対策（スパム防止、レート制限）を検討すること
- 送信成功時のユーザーへの自動返信メールも検討可

## 🔗 関連

- 関連Feature: feature-003-footer-with-legal-pages
- 参考プロジェクト: CodeNest, BlueprintHub
- 関連Issue: -
- 関連PR: -
