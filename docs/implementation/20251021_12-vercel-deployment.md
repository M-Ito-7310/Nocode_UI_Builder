# Vercelデプロイ完全ガイド

**作成日**: 2025年10月21日
**Phase**: 12 - 本番環境デプロイ
**所要時間**: 1-2時間

---

## 目次

1. [Vercelの概要](#1-vercelの概要)
2. [デプロイ準備](#2-デプロイ準備)
3. [Vercel CLIインストール](#3-vercel-cliインストール)
4. [CLI経由でのデプロイ](#4-cli経由でのデプロイ)
5. [Vercel Dashboard経由でのデプロイ](#5-vercel-dashboard経由でのデプロイ)
6. [環境変数設定](#6-環境変数設定)
7. [カスタムドメイン設定](#7-カスタムドメイン設定)
8. [動作確認](#8-動作確認)
9. [デプロイ後のモニタリング](#9-デプロイ後のモニタリング)
10. [トラブルシューティング](#10-トラブルシューティング)

---

## 1. Vercelの概要

### 1.1 Vercelとは

Vercelは、Next.jsを開発したVercel社が提供するホスティングプラットフォームです。

#### 主な特徴

- **Next.js最適化**: Next.jsアプリケーションに最適化されたインフラ
- **自動デプロイ**: GitHubと連携し、pushするだけで自動デプロイ
- **グローバルCDN**: 世界中にエッジサーバーを配置
- **無料枠**: 個人プロジェクトに十分な無料プラン
- **簡単な設定**: 環境変数やドメイン設定が簡単

### 1.2 Vercel無料プランの制限

| 項目 | 制限 |
|-----|------|
| プロジェクト数 | 無制限 |
| デプロイ | 1日100回まで |
| 帯域幅 | 月100GB |
| ビルド時間 | 月6000分 |
| サーバーレス関数実行時間 | 月100GB-時間 |
| チームメンバー | Hobby: 1人のみ |
| カスタムドメイン | あり |

```
無料プランで十分な理由:
- プロトタイプアプリケーションに最適
- トラフィックが少ない初期段階では十分
- 必要に応じてProプラン($20/月)にアップグレード可能
```

### 1.3 デプロイの流れ

```
ローカル開発 → Git Push → Vercel自動ビルド → デプロイ → 公開URL
```

---

## 2. デプロイ準備

### 2.1 package.jsonスクリプト確認

`package.json` の `scripts` セクションを確認:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**重要**: Vercelは `npm run build` を実行するため、ビルドスクリプトが正しく動作する必要があります。

### 2.2 ローカルビルドテスト

デプロイ前に、ローカルでビルドが成功するか確認:

```bash
# 依存パッケージのインストール
npm install

# プロダクションビルド
npm run build
```

**期待される出力**:

```
> nocode-ui-builder@0.1.0 build
> next build

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         87.3 kB
├ ○ /api/projects                        0 B                0 B
├ ○ /api/projects/[id]                   0 B                0 B
├ ○ /builder                             12.4 kB        95.1 kB
└ ○ /projects                            8.3 kB         90.2 kB

○  (Static)  prerendered as static content

✨ Done in 15.23s
```

### 2.3 ビルドエラーの対処

#### エラー1: TypeScript型エラー

```bash
# エラー例
Type error: Property 'xxx' does not exist on type 'yyy'
```

**解決方法**:

```bash
# 型チェック実行
npm run type-check

# または
npx tsc --noEmit
```

エラー箇所を修正してから再ビルド。

#### エラー2: ESLintエラー

```bash
# エラー例
Error: ESLint found errors
```

**解決方法**:

```bash
# ESLint実行
npm run lint

# 自動修正
npm run lint -- --fix
```

#### エラー3: 環境変数未定義

```bash
# エラー例
Error: DATABASE_URL is not defined
```

**解決方法**:

ビルド時には環境変数は不要ですが、ランタイムで必要です。Vercelで環境変数を設定します（後述）。

### 2.4 .gitignoreの確認

`.gitignore` ファイルに以下が含まれていることを確認:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 3. Vercel CLIインストール

### 3.1 Vercel CLIのインストール

```bash
# グローバルインストール
npm install -g vercel

# インストール確認
vercel --version
```

**期待される出力**:

```
Vercel CLI 32.5.0
```

### 3.2 Vercelアカウント作成

#### ステップ1: Vercelサイトにアクセス

1. ブラウザで [https://vercel.com](https://vercel.com) を開く
2. **Sign Up** ボタンをクリック

#### ステップ2: サインアップ方法の選択

以下のいずれかを選択:
- **GitHub** (推奨)
- **GitLab**
- **Bitbucket**
- **Email**

```
推奨: GitHubアカウントでサインアップ
理由: リポジトリとの連携が簡単
```

#### ステップ3: 認証完了

1. 選択したプロバイダーで認証
2. Vercelダッシュボードにリダイレクトされる

### 3.3 Vercel CLIでログイン

```bash
# ログイン
vercel login
```

**実行フロー**:

```
Vercel CLI 32.5.0
? Log in to Vercel (Use arrow keys)
❯ Continue with GitHub
  Continue with GitLab
  Continue with Bitbucket
  Continue with Email
```

GitHubを選択すると、ブラウザが開きます:

1. **Authorize Vercel** ボタンをクリック
2. ターミナルに戻り、成功メッセージを確認

```
✔ Success! GitHub authentication complete for user@example.com
```

---

## 4. CLI経由でのデプロイ

### 4.1 初回デプロイ

プロジェクトルートディレクトリで以下を実行:

```bash
cd c:\Users\mitoi\Desktop\Projects\nocode-ui-builder

# デプロイコマンド実行
vercel
```

### 4.2 対話型セットアップ

#### 質問1: スコープの選択

```
? Set up and deploy "~/nocode-ui-builder"? (Y/n)
```

**`y`** を入力してEnter。

#### 質問2: アカウント選択

```
? Which scope do you want to deploy to?
❯ Your Username
  + Create a Team
```

自分のアカウントを選択。

#### 質問3: リンク先プロジェクト

```
? Link to existing project? (y/N)
```

**`N`** を入力（初回は新規プロジェクト作成）。

#### 質問4: プロジェクト名

```
? What's your project's name? (nocode-ui-builder)
```

デフォルト（`nocode-ui-builder`）でEnter、または任意の名前を入力。

#### 質問5: プロジェクトディレクトリ

```
? In which directory is your code located? ./
```

デフォルト（`./`）でEnter。

#### 質問6: Next.js自動検出

```
Auto-detected Project Settings (Next.js):
- Build Command: next build
- Development Command: next dev --port 3000
- Install Command: npm install
- Output Directory: .next

? Want to modify these settings? (y/N)
```

**`N`** を入力（デフォルト設定のまま）。

### 4.3 デプロイ実行

設定完了後、自動的にデプロイが開始されます:

```
🔗  Linked to username/nocode-ui-builder (created .vercel and added it to .gitignore)
🔍  Inspect: https://vercel.com/username/nocode-ui-builder/xxxxx [1s]
✅  Production: https://nocode-ui-builder-xxxxx.vercel.app [45s]
📝  Deployed to production. Run `vercel --prod` to overwrite later (https://vercel.link/2F).
💡  To change the domain or build command, go to https://vercel.com/username/nocode-ui-builder/settings
```

**デプロイ完了!**

プレビューURL: `https://nocode-ui-builder-xxxxx.vercel.app`

### 4.4 本番デプロイ

上記は「プレビュー」デプロイです。本番環境にデプロイするには:

```bash
vercel --prod
```

**実行結果**:

```
🔍  Inspect: https://vercel.com/username/nocode-ui-builder/xxxxx [1s]
✅  Production: https://nocode-ui-builder.vercel.app [35s]
```

**本番URL**: `https://nocode-ui-builder.vercel.app`

### 4.5 デプロイステータス確認

```bash
# 最新のデプロイ情報を表示
vercel ls

# プロジェクト詳細を表示
vercel inspect
```

---

## 5. Vercel Dashboard経由でのデプロイ

より視覚的な方法として、Vercel Dashboardを使用できます。

### 5.1 GitHubリポジトリ準備

#### ステップ1: GitHubにリポジトリを作成

1. [https://github.com/new](https://github.com/new) にアクセス
2. リポジトリ名: `nocode-ui-builder`
3. Public または Private を選択
4. **Create repository** をクリック

#### ステップ2: ローカルリポジトリをGitHubにプッシュ

```bash
# Gitリポジトリ初期化（まだの場合）
git init

# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: NoCode UI Builder"

# リモートリポジトリを追加
git remote add origin https://github.com/yourusername/nocode-ui-builder.git

# プッシュ
git branch -M main
git push -u origin main
```

### 5.2 Vercel Dashboardでインポート

#### ステップ1: Vercel Dashboardにログイン

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) にアクセス
2. **Add New...** → **Project** をクリック

#### ステップ2: GitHubリポジトリをインポート

1. **Import Git Repository** セクションで検索ボックスに `nocode-ui-builder` を入力
2. リポジトリが表示されたら **Import** をクリック

初回の場合、GitHub連携の許可が必要:

1. **Install Vercel** をクリック
2. リポジトリアクセス権限を許可
3. Vercel Dashboardに戻る

#### ステップ3: プロジェクト設定

```yaml
Project Name: nocode-ui-builder
Framework Preset: Next.js (自動検出)
Root Directory: ./
Build Command: npm run build (自動設定)
Output Directory: .next (自動設定)
Install Command: npm install (自動設定)
```

**Environment Variables** は後で設定するため、ここではスキップ。

#### ステップ4: デプロイ実行

**Deploy** ボタンをクリック。

ビルドログがリアルタイムで表示されます:

```
Cloning repository...
Installing dependencies...
Running build...
✓ Build completed
Uploading build outputs...
✓ Deployment ready
```

デプロイ完了後、以下が表示されます:

```
🎉 Congratulations! Your project has been successfully deployed.

Visit: https://nocode-ui-builder.vercel.app
```

### 5.3 自動デプロイ設定

Vercelは、GitHubリポジトリと連携すると、以下のように自動デプロイします:

| ブランチ | デプロイ先 | URL |
|---------|----------|-----|
| main | Production | `https://nocode-ui-builder.vercel.app` |
| develop | Preview | `https://nocode-ui-builder-git-develop-username.vercel.app` |
| feature/* | Preview | `https://nocode-ui-builder-git-feature-xxx-username.vercel.app` |

**自動デプロイの流れ**:

1. コードをGitHubにプッシュ
2. Vercelが自動的に検出
3. ビルド開始
4. デプロイ完了
5. GitHub PRにデプロイURLがコメントされる

---

## 6. 環境変数設定

### 6.1 Vercel Dashboardで環境変数を設定

#### ステップ1: プロジェクト設定を開く

1. Vercel Dashboard → プロジェクトを選択
2. **Settings** タブをクリック
3. 左サイドバーの **Environment Variables** をクリック

#### ステップ2: 環境変数を追加

**DATABASE_URL**:

```
Name: DATABASE_URL
Value: postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development
```

**追加手順**:

1. **Name** フィールドに `DATABASE_URL` を入力
2. **Value** フィールドに Neon接続文字列を貼り付け
3. **Environment** で以下をチェック:
   - [x] Production
   - [x] Preview
   - [x] Development
4. **Save** ボタンをクリック

#### ステップ3: 再デプロイ

環境変数を追加した後、再デプロイが必要です:

1. **Deployments** タブをクリック
2. 最新のデプロイの右側の `...` メニューをクリック
3. **Redeploy** を選択
4. **Redeploy** ボタンをクリック

### 6.2 Vercel CLIで環境変数を設定

```bash
# 環境変数を追加
vercel env add DATABASE_URL

# 以下のプロンプトに従って入力
? What's the value of DATABASE_URL? postgresql://...
? Add DATABASE_URL to which Environments? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯ ◉ Production
  ◉ Preview
  ◉ Development

✅ Added Environment Variable DATABASE_URL to Project nocode-ui-builder
```

### 6.3 環境変数の確認

```bash
# 全環境変数を表示
vercel env ls
```

**出力例**:

```
Environment Variables for nocode-ui-builder
┌─────────────┬─────────────┬──────────────────────┐
│ Name        │ Value       │ Environments         │
├─────────────┼─────────────┼──────────────────────┤
│ DATABASE_URL│ (encrypted) │ Production, Preview  │
└─────────────┴─────────────┴──────────────────────┘
```

### 6.4 .env.productionファイル（オプション）

本番環境専用の環境変数ファイルを作成することもできます:

```bash
# .env.production
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="https://nocode-ui-builder.vercel.app"
```

**注意**: このファイルは `.gitignore` に追加してください。

---

## 7. カスタムドメイン設定

### 7.1 カスタムドメインの追加

Vercelでは、カスタムドメイン（例: `www.myapp.com`）を無料で設定できます。

#### ステップ1: ドメインを取得

ドメインレジストラ（お名前.com、Google Domains、Cloudflareなど）でドメインを購入。

#### ステップ2: Vercel Dashboardでドメインを追加

1. プロジェクトの **Settings** → **Domains** をクリック
2. **Add** ボタンをクリック
3. ドメイン名を入力（例: `nocode-builder.com`）
4. **Add** をクリック

#### ステップ3: DNSレコードを設定

Vercelが指示するDNSレコードをドメインレジストラに追加:

**Aレコード**:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAMEレコード**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### ステップ4: SSL証明書の自動発行

Vercelが自動的にSSL証明書を発行します（Let's Encrypt）。

数分〜数時間で完了:

```
✓ Domain configured
✓ SSL certificate issued
✓ HTTPS enabled
```

### 7.2 サブドメイン設定

```
例:
- app.nocode-builder.com
- demo.nocode-builder.com
```

同様の手順で、複数のサブドメインを追加できます。

---

## 8. 動作確認

### 8.1 デプロイ後の動作確認チェックリスト

#### 基本動作

- [ ] トップページが正しく表示される
- [ ] ビルダー画面が表示される
- [ ] プロジェクト一覧が表示される

#### API動作確認

```bash
# プロジェクト一覧取得
curl https://nocode-ui-builder.vercel.app/api/projects

# プロジェクト作成
curl -X POST https://nocode-ui-builder.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"本番環境テスト","description":"Vercelデプロイ後のテスト"}'
```

#### データベース接続確認

- [ ] プロジェクト作成が成功する
- [ ] プロジェクト一覧が取得できる
- [ ] プロジェクトの編集が動作する
- [ ] プロジェクトの削除が動作する

#### UI/UX確認

- [ ] ドラッグ&ドロップが動作する
- [ ] Widget編集が動作する
- [ ] レスポンシブデザインが正しく表示される
- [ ] アニメーションがスムーズに動作する

### 8.2 パフォーマンステスト

#### Lighthouseスコア確認

1. Chrome DevToolsを開く（F12）
2. **Lighthouse** タブを選択
3. **Analyze page load** をクリック

**目標スコア**:

| カテゴリ | 目標 |
|---------|------|
| Performance | 90以上 |
| Accessibility | 90以上 |
| Best Practices | 90以上 |
| SEO | 90以上 |

#### WebPageTestでの確認

1. [https://www.webpagetest.org/](https://www.webpagetest.org/) にアクセス
2. URLを入力: `https://nocode-ui-builder.vercel.app`
3. **Start Test** をクリック

**確認項目**:

- First Contentful Paint: < 1.5秒
- Time to Interactive: < 3.0秒
- Total Blocking Time: < 300ms

### 8.3 エラー監視

#### Vercel Analytics有効化

1. プロジェクトの **Settings** → **Analytics** をクリック
2. **Enable Analytics** をクリック

**利用可能なメトリクス**:

- ページビュー数
- ユニークビジター数
- トップページ
- Web Vitals (LCP, FID, CLS)

#### Sentry統合（オプション）

エラートラッキングのために、Sentryを統合できます:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## 9. デプロイ後のモニタリング

### 9.1 Vercel Dashboardでのモニタリング

#### デプロイ履歴

1. **Deployments** タブで全デプロイ履歴を確認
2. 各デプロイのステータス、コミットメッセージ、デプロイ時間を確認

#### リアルタイムログ

1. **Functions** タブでサーバーレス関数のログを確認
2. エラーログ、実行時間、メモリ使用量を確認

### 9.2 アラート設定

#### ビルド失敗アラート

Vercelは、ビルドが失敗すると自動的にメール通知を送信します。

#### カスタムアラート（Webhook）

1. **Settings** → **Git** → **Deploy Hooks** をクリック
2. Webhookを追加（Slack、Discord、カスタムエンドポイント）

**Slack通知の例**:

```
POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL
{
  "text": "✅ NoCode UI Builder deployed successfully!\nURL: https://nocode-ui-builder.vercel.app"
}
```

### 9.3 使用状況の確認

#### 無料枠の残量確認

1. **Settings** → **Usage** をクリック
2. 以下の使用状況を確認:
   - ビルド時間
   - 帯域幅
   - サーバーレス関数実行時間

**制限に近づいた場合の対処**:

- 画像最適化を強化
- キャッシュ戦略を見直し
- 必要に応じてProプランにアップグレード

---

## 10. トラブルシューティング

### 10.1 ビルドエラー

#### エラー: `Module not found`

**エラーメッセージ**:

```
Error: Module not found: Can't resolve '@/components/...'
```

**原因**: パスエイリアスの設定が不正、またはファイルが存在しない

**解決方法**:

1. `tsconfig.json` の `paths` 設定を確認:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. ファイルが実際に存在するか確認
3. 大文字小文字が一致しているか確認（Vercelは大文字小文字を区別）

#### エラー: `Build failed with exit code 1`

**エラーメッセージ**:

```
Error: Command "npm run build" exited with 1
```

**原因**: TypeScriptエラー、ESLintエラー、または依存関係の問題

**解決方法**:

```bash
# ローカルでビルドを試行
npm run build

# エラー内容を確認して修正

# 再デプロイ
vercel --prod
```

### 10.2 環境変数未設定エラー

#### エラー: `DATABASE_URL is not defined`

**原因**: 環境変数が設定されていない

**解決方法**:

1. Vercel Dashboardで環境変数を確認
2. 設定後、再デプロイ
3. Vercel CLIで確認:

```bash
vercel env ls
```

### 10.3 データベース接続失敗

#### エラー: `Failed to connect to database`

**原因**:
- 環境変数の接続文字列が間違っている
- Neonデータベースが停止している
- ネットワークの問題

**解決方法**:

1. Neon Dashboardでデータベースの状態を確認
2. 接続文字列を再取得して更新
3. Vercelの **Functions** ログでエラー詳細を確認

### 10.4 SSL証明書エラー

#### エラー: `SSL handshake failed`

**原因**: Neon接続時のSSL設定

**解決方法**:

接続文字列に `sslmode=require` が含まれているか確認:

```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### 10.5 404エラー

#### エラー: ページが見つからない

**原因**: ルーティング設定の問題

**解決方法**:

1. `app` ディレクトリ構造を確認
2. 動的ルートの設定を確認
3. `next.config.js` のリライトルールを確認

### 10.6 デプロイが遅い

#### 問題: ビルドに10分以上かかる

**原因**: 依存関係が多い、または重い処理

**解決方法**:

```javascript
// next.config.js
module.exports = {
  // SWCコンパイラを使用（高速化）
  swcMinify: true,

  // 不要なページの生成をスキップ
  experimental: {
    optimizeCss: true,
  },
};
```

### 10.7 Vercelサポートへの問い合わせ

問題が解決しない場合:

1. [Vercelサポートページ](https://vercel.com/support) にアクセス
2. **Contact Support** をクリック
3. 問題の詳細、デプロイURL、ビルドログを添付

**無料プラン**: メールサポートのみ
**Proプラン**: 優先サポート

---

## まとめ

### デプロイ完了チェックリスト

#### 準備

- [ ] ローカルビルド成功
- [ ] Gitリポジトリにプッシュ
- [ ] `.gitignore` 設定確認
- [ ] 環境変数準備

#### デプロイ

- [ ] Vercelアカウント作成
- [ ] プロジェクトインポート
- [ ] 環境変数設定
- [ ] 初回デプロイ成功

#### 動作確認

- [ ] トップページ表示確認
- [ ] API動作確認
- [ ] データベース接続確認
- [ ] UI/UX動作確認

#### 最適化

- [ ] Lighthouseスコア確認
- [ ] パフォーマンステスト
- [ ] エラー監視設定
- [ ] アラート設定

### 公開URL

デプロイが完了すると、以下のURLでアクセスできます:

```
本番環境: https://nocode-ui-builder.vercel.app
プレビュー環境: https://nocode-ui-builder-git-[branch].vercel.app
```

### 次のステップ

次は **Gitコミット戦略** (Phase 13) に進みます:

```bash
# 次のドキュメント
docs/implementation/20251021_13-git-commit-strategy.md
```

---

**作成者**: Claude
**最終更新**: 2025年10月21日
