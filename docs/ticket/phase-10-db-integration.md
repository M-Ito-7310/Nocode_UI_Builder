# Phase 10: データベース統合とマイグレーション

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 15-30分
**実績時間**: -
**依存**: Phase 9（ページ実装完了）
**優先度**: High

## 📋 概要

Neon PostgreSQLデータベースのセットアップ、環境変数設定、Drizzle ORMマイグレーション実行、データベース接続テスト、API動作確認を行います。このPhaseでは、実際のデータベースと連携して、プロジェクトの保存・読み込み機能を動作させます。

### 主な作業内容

- Neon PostgreSQLアカウント作成とプロジェクトセットアップ
- 接続文字列取得と環境変数設定
- Drizzle Kitによるマイグレーション実行
- Drizzle Studioでのデータベース管理
- 接続テストとAPI動作確認

## ✅ タスクチェックリスト

### 1. Neon PostgreSQL セットアップ（ユーザー作業）
- [ ] Neon公式サイトにアクセス（https://neon.tech）
- [ ] GitHubアカウントでサインアップ
- [ ] 新規プロジェクト作成（nocode-ui-builder）
- [ ] リージョン選択（US East Ohio 推奨）
- [ ] 接続文字列をコピー
- [ ] 接続情報を安全に保存

### 2. 環境変数設定（ユーザー作業）
- [ ] プロジェクトルートに `.env.local` ファイル作成
- [ ] `DATABASE_URL` 環境変数を設定
- [ ] `.gitignore` に `.env.local` が含まれているか確認
- [ ] 環境変数読み込みテスト実行

### 3. Drizzle マイグレーション実行
- [ ] `drizzle.config.ts` 設定確認
- [ ] `npx drizzle-kit generate` 実行
- [ ] マイグレーションファイル生成確認（`drizzle/` フォルダ）
- [ ] 生成されたSQLファイル確認
- [ ] `npx drizzle-kit push` 実行
- [ ] マイグレーション成功確認
- [ ] テーブル作成確認（projects）
- [ ] インデックス作成確認

### 4. Drizzle Studio 起動・確認
- [ ] `npx drizzle-kit studio` 実行
- [ ] ブラウザで Drizzle Studio を開く
- [ ] projects テーブル表示確認
- [ ] テストデータ作成（手動）
- [ ] JSONB データ編集テスト
- [ ] データ削除テスト

### 5. データベース接続テスト
- [ ] `scripts/test-db-connection.ts` 作成
- [ ] 基本接続テスト実装
- [ ] テーブル存在確認テスト実装
- [ ] カラム構造確認テスト実装
- [ ] インデックス確認テスト実装
- [ ] テストスクリプト実行
- [ ] 全テスト成功確認

### 6. Drizzle ORM 接続テスト
- [ ] `scripts/test-drizzle.ts` 作成
- [ ] プロジェクト作成テスト実装
- [ ] プロジェクト取得テスト実装
- [ ] プロジェクト更新テスト実装
- [ ] プロジェクト削除テスト実装
- [ ] JSONB データ読み書きテスト実装
- [ ] テストスクリプト実行
- [ ] 全CRUD操作成功確認

### 7. API Routes 動作確認
- [ ] 開発サーバー起動（`npm run dev`）
- [ ] `GET /api/projects` テスト（curl）
- [ ] `POST /api/projects` テスト（プロジェクト作成）
- [ ] `GET /api/projects/[id]` テスト（個別取得）
- [ ] `PUT /api/projects/[id]` テスト（更新）
- [ ] `DELETE /api/projects/[id]` テスト（削除）
- [ ] レスポンス形式確認
- [ ] エラーハンドリング確認

### 8. トラブルシューティング対応
- [ ] SSL証明書エラー対処確認
- [ ] タイムアウトエラー対処確認
- [ ] 認証エラー対処確認
- [ ] マイグレーション失敗対処確認
- [ ] JSONB型エラー対処確認
- [ ] デバッグモード設定確認

## 📦 成果物

- [ ] `.env.local` ファイル（ユーザー作成、Gitには含めない）
- [ ] `drizzle/0000_initial_schema.sql` マイグレーションファイル
- [ ] `drizzle/meta/` マイグレーション履歴
- [ ] `scripts/test-db-connection.ts` テストスクリプト
- [ ] `scripts/test-drizzle.ts` ORMテストスクリプト
- [ ] 動作するデータベース接続
- [ ] 正常に動作するAPI Routes

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_10-database-integration.md)
- [データベーススキーマ設計](../idea/04-database-schema.md)
- [Neon公式ドキュメント](https://neon.tech/docs)
- [Drizzle ORM公式ドキュメント](https://orm.drizzle.team)

## 📝 メモ・コメント

### 実装時の注意点

1. **環境変数の安全性**
   - `.env.local` は絶対にGitにコミットしない
   - パスワードは1度しか表示されないため、必ずコピーして保存

2. **Neon無料枠の制限**
   - ストレージ: 0.5GB
   - データ転送: 月5GB
   - Compute時間: 月191.9時間
   - プロトタイプには十分

3. **マイグレーション実行順序**
   ```bash
   npx drizzle-kit generate  # SQLファイル生成
   npx drizzle-kit push      # データベースに反映
   ```

4. **接続文字列の形式**
   ```
   postgresql://[username]:[password]@[endpoint]/[database]?sslmode=require
   ```

### テストコマンド例

```bash
# 環境変数テスト
npx tsx scripts/test-env.ts

# データベース接続テスト
npx tsx scripts/test-db-connection.ts

# Drizzle ORMテスト
npx tsx scripts/test-drizzle.ts

# Drizzle Studio起動
npx drizzle-kit studio

# API動作確認（curl）
curl http://localhost:3000/api/projects
```

### よくあるエラーと対処法

**エラー1: `DATABASE_URL is not defined`**
- 原因: 環境変数が読み込まれていない
- 対処: `.env.local` ファイルを確認、開発サーバー再起動

**エラー2: `Connection timeout`**
- 原因: ネットワーク接続の問題
- 対処: インターネット接続確認、Neonサービス状態確認

**エラー3: `SSL certificate verification failed`**
- 原因: SSL証明書の検証問題
- 対処: 接続文字列に `?sslmode=require` を追加

**エラー4: `relation "projects" already exists`**
- 原因: テーブルが既に存在
- 対処: `DROP TABLE` または `drizzle/` フォルダ削除して再実行

### 完了確認チェックリスト

```
データベース:
✓ Neonプロジェクト作成完了
✓ 接続文字列取得完了
✓ マイグレーション実行成功
✓ projectsテーブル作成確認
✓ インデックス作成確認

テスト:
✓ 基本接続テスト成功
✓ CRUD操作テスト成功
✓ API Routes動作確認完了

ツール:
✓ Drizzle Studio起動成功
✓ データベース管理動作確認
```

## ✅ 完了条件

- [ ] Neonデータベースが作成されている
- [ ] `.env.local` ファイルに `DATABASE_URL` が設定されている
- [ ] `npx drizzle-kit generate` が成功する
- [ ] `npx drizzle-kit push` が成功する
- [ ] `drizzle/` フォルダにマイグレーションファイルが生成されている
- [ ] Drizzle Studioが起動し、projectsテーブルが表示される
- [ ] データベース接続テストが全て成功する
- [ ] Drizzle ORMテストが全て成功する
- [ ] `GET /api/projects` が正常に動作する
- [ ] `POST /api/projects` でプロジェクト作成が成功する
- [ ] `GET /api/projects/[id]` でプロジェクト取得が成功する
- [ ] `PUT /api/projects/[id]` でプロジェクト更新が成功する
- [ ] `DELETE /api/projects/[id]` でプロジェクト削除が成功する
- [ ] エラーハンドリングが適切に機能する
- [ ] JSONB型のcanvas_dataが正しく保存・読み込みできる

---

**作成日**: 2025年10月21日
**最終更新**: 2025年10月21日
