# Phase 4: API Routes実装

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 3
**優先度**: High
**開始日時**: -
**完了日時**: -

## 📋 概要

Next.js 14 App RouterのRoute Handlersを使用してRESTful APIエンドポイントを実装します。プロジェクトの一覧取得、作成、詳細取得、更新、削除のCRUD操作と、HTMLエクスポート機能を提供するAPIを構築します。すべてのエンドポイントで適切なバリデーション、エラーハンドリング、HTTPステータスコードを使用します。

## ✅ タスクチェックリスト

- [ ] Zodライブラリをインストール（npm install zod）
- [ ] src/app/api/projects/route.tsファイルを作成
- [ ] プロジェクト作成時のバリデーションスキーマを定義（Zodを使用）
- [ ] GET /api/projects エンドポイントを実装（プロジェクト一覧取得、limitパラメータ対応）
- [ ] POST /api/projects エンドポイントを実装（プロジェクト作成、バリデーション付き）
- [ ] src/app/api/projects/[id]/route.tsファイルを作成
- [ ] プロジェクト更新時のバリデーションスキーマを定義（Zodを使用）
- [ ] UUIDバリデーション関数を実装（isValidUUID）
- [ ] GET /api/projects/[id] エンドポイントを実装（プロジェクト詳細取得）
- [ ] PUT /api/projects/[id] エンドポイントを実装（プロジェクト更新、バリデーション付き）
- [ ] DELETE /api/projects/[id] エンドポイントを実装（プロジェクト削除）
- [ ] src/app/api/export/[id]/route.tsファイルを作成
- [ ] GET /api/export/[id] エンドポイントを実装（HTML/CSSエクスポート）
- [ ] src/lib/export/html-generator.tsファイルを作成
- [ ] generateHTML関数を実装（Canvas DataからHTML文字列を生成）
- [ ] generateCSS関数を実装（CSSスタイルの生成）
- [ ] generateComponentHTML関数を実装（各Widget種類のHTML生成）
- [ ] generateComponentCSS関数を実装（各Widget種類のCSS生成）
- [ ] generateTableHTML関数を実装（テーブルHTML生成）
- [ ] generateSelectHTML関数を実装（セレクトHTML生成）
- [ ] escapeHTML関数を実装（XSS対策）
- [ ] src/types/api.tsファイルを作成
- [ ] API Response型を定義（ApiSuccessResponse、ApiErrorResponse）
- [ ] 各エンドポイントのリクエスト・レスポンス型を定義
- [ ] すべてのエンドポイントに一貫したエラーハンドリングを実装
- [ ] すべてのエンドポイントに適切なHTTPステータスコードを設定
- [ ] すべてのエンドポイントにバリデーションを実装
- [ ] npm run type-checkでTypeScriptエラーが0件であることを確認
- [ ] curlまたはブラウザでAPIエンドポイントをテスト
- [ ] Gitコミットを作成

## 📦 成果物

- [ ] src/app/api/projects/route.ts（GET、POST /api/projects）
- [ ] src/app/api/projects/[id]/route.ts（GET、PUT、DELETE /api/projects/[id]）
- [ ] src/app/api/export/[id]/route.ts（GET /api/export/[id]）
- [ ] src/lib/export/html-generator.ts（HTML/CSS生成ユーティリティ）
- [ ] src/types/api.ts（API型定義）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_04-api-routes.md)

## 🎯 完了条件

- [ ] すべてのエンドポイントが実装されている（プロジェクトCRUD、HTMLエクスポート）
- [ ] すべてのエンドポイントでバリデーションが正しく動作する
- [ ] すべてのエンドポイントでエラーハンドリングが一貫している
- [ ] 適切なHTTPステータスコードが返される（200、201、400、404、500）
- [ ] npm run type-checkでTypeScriptエラーが0件
- [ ] curl、Fetch、またはREST Clientでエンドポイントがテストできる
- [ ] HTMLエクスポート機能が正常に動作する
- [ ] Gitに変更がコミットされている

## 📝 メモ・進捗コメント

<!-- ここに進捗メモや問題点を記録 -->

**テスト方法:**
```bash
# プロジェクト一覧取得
curl -X GET http://localhost:3000/api/projects

# プロジェクト作成
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project", "description": "Test"}'

# プロジェクト取得
curl -X GET http://localhost:3000/api/projects/[ID]

# プロジェクト更新
curl -X PUT http://localhost:3000/api/projects/[ID] \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# プロジェクト削除
curl -X DELETE http://localhost:3000/api/projects/[ID]

# HTMLエクスポート
curl -X GET http://localhost:3000/api/export/[ID] -o exported.html
```

## ⚠️ 注意事項・リスク

- Next.js 14 App Routerでは、route.tsファイル名が必須（route.jsやapi.tsは不可）
- HTTPメソッドごとに関数をエクスポート（export async function GET/POST/PUT/DELETE）
- NextRequest、NextResponseをnext/serverからインポートすること
- ZodのsafeParseメソッドを使用してバリデーションエラーを適切にハンドル
- UUIDバリデーションは正規表現で実装（/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i）
- HTMLエクスポート時のXSS対策として、すべてのユーザー入力をエスケープすること
- JSONB型のcanvas_dataは、typeof project.canvasData !== 'object'でバリデーション
- エラーレスポンスは一貫した形式（{ error: string, details?: any }）で返すこと
- 開発環境ではエラー詳細を返すが、本番環境では隠すこと（process.env.NODE_ENV）

## 🧪 テスト項目

- [ ] GET /api/projects が正常にプロジェクト一覧を返す
- [ ] GET /api/projects?limit=5 がlimitパラメータを正しく処理する
- [ ] POST /api/projects が有効なデータでプロジェクトを作成する（201 Created）
- [ ] POST /api/projects が無効なデータでバリデーションエラーを返す（400 Bad Request）
- [ ] GET /api/projects/[id] が存在するプロジェクトを返す（200 OK）
- [ ] GET /api/projects/[id] が存在しないプロジェクトで404を返す（404 Not Found）
- [ ] GET /api/projects/[id] が無効なUUIDで400を返す（400 Bad Request）
- [ ] PUT /api/projects/[id] がプロジェクトを正常に更新する（200 OK）
- [ ] PUT /api/projects/[id] が空のボディで400を返す（400 Bad Request）
- [ ] DELETE /api/projects/[id] がプロジェクトを正常に削除する（200 OK）
- [ ] GET /api/export/[id] が正常なHTMLファイルを返す（Content-Type: text/html）
- [ ] HTMLエクスポートファイルがブラウザで正しく表示される
- [ ] エスケープされたHTMLがXSS攻撃を防ぐ（<script>タグが無効化される）
- [ ] すべてのエンドポイントでTypeScriptエラーが発生しない
