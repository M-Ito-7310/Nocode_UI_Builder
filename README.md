# NoCode UI Builder

ドラッグ&ドロップでWebインターフェースを作成できるノーコードUIビルダー

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ドラッグ&ドロップ**: @dnd-kit
- **データベース**: Neon PostgreSQL + Drizzle ORM
- **デプロイ**: Vercel

## 機能

- 🎨 ドラッグ&ドロップでUIを構築
- 📦 6種類のWidget（Text、Input、Button、Image、Table、Select）
- 💾 プロジェクトの保存・読み込み
- 📤 HTML/CSSエクスポート
- 🔍 リアルタイムプレビュー

## セットアップ

### 前提条件

- Node.js 18.x以上
- npm 9.x以上

### インストール

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.localにDATABASE_URLを設定
```

### 開発サーバー起動

```bash
npm run dev
```

<http://localhost:3000> を開いてアプリケーションを確認

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLintチェック
- `npm run type-check` - TypeScript型チェック
- `npm run format` - Prettierでフォーマット
- `npm run db:generate` - Drizzleマイグレーション生成
- `npm run db:push` - データベースにスキーマ反映
- `npm run db:studio` - Drizzle Studio起動

## プロジェクト構造

```
nocode-ui-builder/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ・DB
│   └── types/            # TypeScript型定義
├── public/               # 静的ファイル
├── docs/                 # ドキュメント
└── drizzle/              # DBマイグレーション
```

## ライセンス

MIT
