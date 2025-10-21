# Phase 3: データベース基盤構築

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 2
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

Drizzle ORMを使用したデータベーススキーマの定義と、Neon PostgreSQLへの接続設定を行います。プロジェクトデータを保存するためのprojectsテーブルを作成し、CRUD操作を行うクエリ関数を実装します。このPhaseではマイグレーションの準備まで行い、実際のマイグレーション実行はPhase 10で行います。

## ✅ タスクチェックリスト

- [ ] Neonアカウントを作成（https://neon.tech）
- [ ] Neonで新規プロジェクトを作成（プロジェクト名: nocode-ui-builder、PostgreSQL 16、リージョン: Asia Pacific Singapore推奨）
- [ ] Neonから接続文字列（DATABASE_URL）を取得
- [ ] .env.localファイルにDATABASE_URLを設定
- [ ] src/lib/db/schema.tsファイルを作成
- [ ] projectsテーブルのスキーマを定義（id: UUID、name: VARCHAR(255)、description: TEXT、canvasData: JSONB、createdAt: TIMESTAMP、updatedAt: TIMESTAMP）
- [ ] projectsテーブルにインデックスを定義（createdAt、updatedAt）
- [ ] Drizzleの型推論を活用してProject型を生成（$inferSelect、$inferInsert）
- [ ] src/lib/db/index.tsファイルを作成
- [ ] DATABASE_URL環境変数の検証ロジックを実装
- [ ] Neon SQLクライアントを初期化（@neondatabase/serverless）
- [ ] Drizzle ORMインスタンスを作成（スキーマ付き）
- [ ] スキーマと型定義をエクスポート
- [ ] src/lib/db/queries.tsファイルを作成
- [ ] getRecentProjects関数を実装（最新順でプロジェクト一覧取得）
- [ ] getProjects関数を実装（作成日時順でプロジェクト一覧取得）
- [ ] getProjectById関数を実装（ID指定でプロジェクト取得）
- [ ] createProject関数を実装（プロジェクト作成、バリデーション付き）
- [ ] updateProject関数を実装（プロジェクト更新、バリデーション付き）
- [ ] deleteProject関数を実装（プロジェクト削除）
- [ ] getProjectCount関数を実装（プロジェクト総数取得）
- [ ] searchProjectsByName関数を実装（プロジェクト名で検索）
- [ ] projectExists関数を実装（プロジェクトの存在確認）
- [ ] すべてのクエリ関数に一貫したエラーハンドリングを実装
- [ ] すべてのクエリ関数に入力バリデーションを実装
- [ ] npm run type-checkでTypeScriptエラーが0件であることを確認
- [ ] drizzle.config.tsが正しく設定されていることを確認
- [ ] Gitコミットを作成

## 📦 成果物

- [ ] src/lib/db/schema.ts（Drizzleスキーマ定義、projectsテーブル、インデックス、型定義）
- [ ] src/lib/db/index.ts（Neon接続、Drizzle ORM初期化、エクスポート）
- [ ] src/lib/db/queries.ts（CRUD関数、検索関数、バリデーション）
- [ ] .env.local（DATABASE_URLが設定されている）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_03-database-foundation.md)

## 🎯 完了条件

- [ ] Drizzleスキーマ定義が完成している（schema.ts）
- [ ] データベース接続設定が完了している（index.ts）
- [ ] すべてのCRUD関数が実装されている（queries.ts）
- [ ] DATABASE_URL環境変数が.env.localに設定されている
- [ ] npm run type-checkでTypeScriptエラーが0件
- [ ] データベース接続準備が完了している（マイグレーションはPhase 10で実行）
- [ ] Gitに変更がコミットされている

## 📝 メモ・進捗コメント

<!-- ここに進捗メモや問題点を記録 -->

**重要:** このPhaseではマイグレーション実行は行いません。Phase 10でAPI Routesと合わせてマイグレーションを実行します。

## ⚠️ 注意事項・リスク

- .env.localファイルは絶対にGitにコミットしないこと（DATABASE_URLは機密情報）
- Neonの無料枠は0.5GB、コンピュート時間191.9時間/月で本プロジェクトには十分
- DATABASE_URLには必ず`?sslmode=require`を付けること（Neonは常にSSL接続が必要）
- 接続文字列のパスワードに特殊文字（@、:、/等）が含まれる場合、URLエンコードが必要
- JSONB型を使用するため、canvas_dataはJavaScriptオブジェクトとして扱える
- UUIDは`gen_random_uuid()`でPostgreSQL側で自動生成される
- updatedAtの自動更新はトリガーで実装可能だが、アプリケーション側で更新する方がシンプル
- マイグレーション実行前にDATABASE_URL環境変数が正しく設定されているか必ず確認すること
- Phase 10でマイグレーション実行時に`npx drizzle-kit push:pg`を実行する

## 🧪 テスト項目

- [ ] DATABASE_URL環境変数が設定されている（process.env.DATABASE_URLで確認）
- [ ] TypeScript型チェックがエラーなく完了する（npm run type-check）
- [ ] schema.tsのインポートが成功する（import { projects } from '@/lib/db/schema'）
- [ ] db接続のインポートが成功する（import { db } from '@/lib/db'）
- [ ] クエリ関数のインポートが成功する（import { getRecentProjects } from '@/lib/db/queries'）
- [ ] Drizzle Kitコマンドが実行できる（npx drizzle-kit --version）
- [ ] drizzle.config.tsが正しく認識される（npx drizzle-kit generate:pgでマイグレーションファイル生成テスト - ただし実行はしない）
- [ ] プロジェクト型定義が正しく推論される（Project型がIDや各フィールドを含む）
- [ ] 環境変数が未設定の場合、明確なエラーメッセージが表示される

**注意:** データベース接続テストはPhase 10のマイグレーション実行後に行います。
