# Phase 12: Vercelデプロイとプレリリース

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 15-30分
**実績時間**: -
**依存**: Phase 11（UI/UXテスト完了）
**優先度**: High

## 📋 概要

Vercelへのデプロイを実行し、本番環境でアプリケーションを公開します。ビルドテスト、Vercelプロジェクト作成、環境変数設定、デプロイ実行、動作確認、カスタムドメイン設定（オプション）を行い、プレリリース公開を完了させます。

### 主な作業内容

- ローカルビルドテストと準備
- Vercelアカウント作成とCLIセットアップ
- GitHubリポジトリとの連携
- 環境変数設定（DATABASE_URL）
- 本番環境デプロイ
- 動作確認とパフォーマンステスト
- カスタムドメイン設定（オプション）

## ✅ タスクチェックリスト

### 1. デプロイ準備
- [ ] `package.json` のスクリプト確認
- [ ] ローカルビルドテスト実行（`npm run build`）
- [ ] ビルドエラーの解消
- [ ] TypeScript型エラー解消
- [ ] ESLintエラー解消
- [ ] `.gitignore` 設定確認
- [ ] 不要なファイルの除外確認

### 2. Vercelアカウント作成
- [ ] Vercel公式サイトにアクセス（https://vercel.com）
- [ ] GitHubアカウントでサインアップ
- [ ] アカウント認証完了
- [ ] Vercel CLIインストール（`npm install -g vercel`）
- [ ] Vercel CLIログイン（`vercel login`）
- [ ] ログイン成功確認

### 3. GitHubリポジトリ準備
- [ ] GitHubに新規リポジトリ作成（nocode-ui-builder）
- [ ] ローカルリポジトリ初期化（`git init`）
- [ ] 全ファイルをステージング（`git add .`）
- [ ] 初回コミット作成（`git commit -m "Initial commit"`）
- [ ] リモートリポジトリ追加
- [ ] mainブランチにプッシュ（`git push -u origin main`）

### 4. Vercel Dashboard経由デプロイ
- [ ] Vercel Dashboardにログイン
- [ ] "Add New Project" をクリック
- [ ] GitHubリポジトリをインポート
- [ ] Vercel GitHub連携の許可
- [ ] プロジェクト設定確認（Framework: Next.js）
- [ ] Root Directory設定確認（./）
- [ ] Build Command確認（npm run build）
- [ ] Output Directory確認（.next）

### 5. 環境変数設定
- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] `DATABASE_URL` 環境変数を追加
- [ ] Neon接続文字列を値に設定
- [ ] Environment選択（Production, Preview, Development）
- [ ] 環境変数保存
- [ ] 他の必要な環境変数追加（あれば）

### 6. 初回デプロイ実行
- [ ] "Deploy" ボタンをクリック
- [ ] ビルドログの確認
- [ ] デプロイ成功確認
- [ ] プレビューURL取得
- [ ] プレビューURLにアクセス
- [ ] 基本動作確認

### 7. 本番環境デプロイ
- [ ] 環境変数設定後に再デプロイ実行
- [ ] 本番URL取得（https://nocode-ui-builder.vercel.app）
- [ ] 本番環境での動作確認
- [ ] 自動デプロイ設定確認（GitHubプッシュ連動）

### 8. 動作確認
- [ ] トップページ表示確認
- [ ] ビルダーページ表示確認
- [ ] プロジェクト一覧表示確認
- [ ] Widget追加動作確認
- [ ] Widget編集動作確認
- [ ] プロジェクト保存動作確認
- [ ] プロジェクト読み込み動作確認
- [ ] エクスポート機能確認
- [ ] データベース接続確認

### 9. API動作確認
- [ ] `GET /api/projects` テスト
- [ ] `POST /api/projects` テスト（プロジェクト作成）
- [ ] `GET /api/projects/[id]` テスト（個別取得）
- [ ] `PUT /api/projects/[id]` テスト（更新）
- [ ] `DELETE /api/projects/[id]` テスト（削除）
- [ ] エラーハンドリング確認
- [ ] レスポンスタイム確認

### 10. パフォーマンステスト
- [ ] Chrome Lighthouse実行
- [ ] Performance スコア確認（目標: 90以上）
- [ ] Accessibility スコア確認（目標: 90以上）
- [ ] Best Practices スコア確認（目標: 90以上）
- [ ] SEO スコア確認（目標: 90以上）
- [ ] WebPageTest実行
- [ ] First Contentful Paint確認（< 1.5秒）
- [ ] Time to Interactive確認（< 3.0秒）

### 11. エラー監視設定
- [ ] Vercel Analytics有効化
- [ ] アナリティクスダッシュボード確認
- [ ] Web Vitals確認
- [ ] エラーログ確認機能確認
- [ ] カスタムアラート設定（オプション）

### 12. カスタムドメイン設定（オプション）
- [ ] カスタムドメイン取得（あれば）
- [ ] Vercel Dashboard → Settings → Domains
- [ ] ドメイン追加
- [ ] DNSレコード設定（Aレコード、CNAMEレコード）
- [ ] SSL証明書自動発行確認
- [ ] HTTPS有効化確認
- [ ] カスタムドメインでのアクセス確認

### 13. デプロイ後のモニタリング
- [ ] Deployments タブでデプロイ履歴確認
- [ ] Functions タブでログ確認
- [ ] Analytics タブでアクセス状況確認
- [ ] 使用状況確認（無料枠の残量）
- [ ] ビルド失敗アラート設定確認

## 📦 成果物

- [ ] デプロイされたアプリケーション
- [ ] 本番URL（https://nocode-ui-builder.vercel.app）
- [ ] 動作確認レポート（テスト結果）
- [ ] パフォーマンステストレポート（Lighthouseスコア）
- [ ] デプロイメント設定ドキュメント
- [ ] 環境変数設定（Vercel Dashboard）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_12-vercel-deployment.md)
- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js デプロイガイド](https://nextjs.org/docs/deployment)

## 📝 メモ・コメント

### Vercel無料プランの制限

| 項目 | 制限 |
|-----|------|
| プロジェクト数 | 無制限 |
| デプロイ | 1日100回まで |
| 帯域幅 | 月100GB |
| ビルド時間 | 月6000分 |
| サーバーレス関数実行時間 | 月100GB-時間 |

### デプロイの流れ

```
ローカル開発 → Git Push → Vercel自動ビルド → デプロイ → 公開URL
```

### 環境変数設定方法

**Vercel Dashboard**:
```
Settings → Environment Variables → Add
Name: DATABASE_URL
Value: postgresql://username:password@endpoint/database?sslmode=require
Environment: Production, Preview, Development
```

**Vercel CLI**:
```bash
vercel env add DATABASE_URL
```

### curlコマンドでのAPIテスト例

```bash
# プロジェクト一覧取得
curl https://nocode-ui-builder.vercel.app/api/projects

# プロジェクト作成
curl -X POST https://nocode-ui-builder.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"本番環境テスト","description":"Vercelデプロイ後のテスト"}'
```

### よくあるエラーと対処法

**エラー1: `Module not found`**
- 原因: パスエイリアス設定が不正
- 対処: `tsconfig.json` の `paths` 設定確認

**エラー2: `Build failed with exit code 1`**
- 原因: TypeScript/ESLintエラー
- 対処: ローカルで `npm run build` 実行、エラー修正

**エラー3: `DATABASE_URL is not defined`**
- 原因: 環境変数未設定
- 対処: Vercel Dashboardで環境変数設定、再デプロイ

**エラー4: `Failed to connect to database`**
- 原因: 接続文字列が間違っている
- 対処: Neonダッシュボードで接続文字列再取得、更新

### パフォーマンス最適化設定

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};
```

### 自動デプロイの仕組み

| ブランチ | デプロイ先 | URL |
|---------|----------|-----|
| main | Production | `https://nocode-ui-builder.vercel.app` |
| develop | Preview | `https://nocode-ui-builder-git-develop-username.vercel.app` |
| feature/* | Preview | `https://nocode-ui-builder-git-feature-xxx-username.vercel.app` |

## ✅ 完了条件

### デプロイ成功
- [ ] Vercelへのデプロイが成功している
- [ ] 本番URLにアクセスできる（https://nocode-ui-builder.vercel.app）
- [ ] GitHubプッシュで自動デプロイされる
- [ ] ビルドログにエラーがない

### 環境設定
- [ ] 環境変数 `DATABASE_URL` が設定されている
- [ ] Neonデータベースに接続できる
- [ ] SSL証明書が有効になっている（HTTPS）

### 動作確認
- [ ] トップページが正常に表示される
- [ ] ビルダーページが正常に動作する
- [ ] Widget追加・編集・削除が動作する
- [ ] プロジェクト保存・読み込みが動作する
- [ ] エクスポート機能が動作する
- [ ] 全API Routesが正常に動作する

### パフォーマンス
- [ ] Lighthouse Performance スコア 90以上
- [ ] Lighthouse Accessibility スコア 90以上
- [ ] Lighthouse Best Practices スコア 90以上
- [ ] Lighthouse SEO スコア 90以上
- [ ] First Contentful Paint < 1.5秒
- [ ] Time to Interactive < 3.0秒

### モニタリング
- [ ] Vercel Analyticsが有効になっている
- [ ] デプロイ履歴が確認できる
- [ ] エラーログが確認できる
- [ ] 使用状況が確認できる

### プレリリース公開
- [ ] 本番環境で全機能が動作している
- [ ] パフォーマンステストに合格している
- [ ] エラーが発生していない
- [ ] 公開URLが共有可能な状態である

---

**作成日**: 2025年10月21日
**最終更新**: 2025年10月21日
