# Phase 1: プロジェクトセットアップ - 詳細実装ガイド

**Phase**: 1/12
**推定時間**: 30-45分
**前提条件**: Node.js 18.x以上、Git、テキストエディタ
**次のPhase**: Phase 2 - 型定義とユーティリティ

---

## 目次

1. [概要](#概要)
2. [前提条件の確認](#前提条件の確認)
3. [プロジェクト初期化](#プロジェクト初期化)
4. [依存パッケージのインストール](#依存パッケージのインストール)
5. [設定ファイルの作成](#設定ファイルの作成)
6. [ディレクトリ構造の作成](#ディレクトリ構造の作成)
7. [Git初期化](#git初期化)
8. [動作確認](#動作確認)
9. [トラブルシューティング](#トラブルシューティング)
10. [成果物チェックリスト](#成果物チェックリスト)

---

## 概要

Phase 1では、NoCode UI Builderプロジェクトの開発環境を構築します。Next.js 14をベースに、TypeScript、Tailwind CSS、dnd-kit、Drizzle ORMなどの必要な依存関係をインストールし、プロジェクトの基盤を整えます。

### このPhaseで実現すること

- Next.js 14プロジェクトの初期化
- すべての依存パッケージのインストール
- TypeScript、Tailwind CSS、ESLintの設定
- ディレクトリ構造の構築
- Git バージョン管理の初期化
- 開発サーバーの起動確認

---

## 前提条件の確認

### 必要なソフトウェア

#### 1. Node.js（バージョン 18.x 以上）

**確認コマンド:**
```bash
node --version
# 出力例: v18.17.0 または v20.x.x
```

**インストールが必要な場合:**
- 公式サイト: https://nodejs.org/
- 推奨: LTS版（Long Term Support）

#### 2. npm または yarn

**確認コマンド:**
```bash
npm --version
# 出力例: 9.6.7
```

本ドキュメントでは`npm`を使用しますが、`yarn`でも代替可能です。

#### 3. Git

**確認コマンド:**
```bash
git --version
# 出力例: git version 2.40.1
```

**インストールが必要な場合:**
- 公式サイト: https://git-scm.com/

#### 4. テキストエディタ

推奨: **Visual Studio Code**
- 公式サイト: https://code.visualstudio.com/
- 推奨拡張機能:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## プロジェクト初期化

### ステップ 1: 作業ディレクトリへ移動

```bash
# 既にプロジェクトディレクトリが存在する場合
cd c:/Users/mitoi/Desktop/Projects/nocode-ui-builder

# または新規作成の場合
mkdir -p c:/Users/mitoi/Desktop/Projects/nocode-ui-builder
cd c:/Users/mitoi/Desktop/Projects/nocode-ui-builder
```

### ステップ 2: Next.js プロジェクト初期化

**コマンド:**
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src --import-alias "@/*"
```

**インタラクティブプロンプトへの回答:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No
```

**実行後の出力（期待される結果）:**
```
Creating a new Next.js app in c:/Users/mitoi/Desktop/Projects/nocode-ui-builder.

Using npm.

Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/react
- @types/node
- @types/react-dom
- tailwindcss
- postcss
- autoprefixer
- eslint
- eslint-config-next

Success! Created nocode-ui-builder at c:/Users/mitoi/Desktop/Projects/nocode-ui-builder
```

**重要なファイルが作成されたことを確認:**
```bash
ls -la
```

**期待される出力:**
```
package.json
tsconfig.json
next.config.js
tailwind.config.ts
postcss.config.js
.eslintrc.json
.gitignore
src/
  app/
    layout.tsx
    page.tsx
    globals.css
public/
node_modules/
```

---

## 依存パッケージのインストール

### ステップ 3: 追加パッケージのインストール

#### プロダクション依存関係

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
            @neondatabase/serverless \
            drizzle-orm \
            clsx tailwind-merge \
            uuid \
            isomorphic-dompurify \
            lucide-react
```

**各パッケージの説明:**

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `@dnd-kit/core` | ^6.1.0 | ドラッグ&ドロップのコア機能 |
| `@dnd-kit/sortable` | ^8.0.0 | ソート可能なリスト |
| `@dnd-kit/utilities` | ^3.2.2 | dnd-kitユーティリティ関数 |
| `@neondatabase/serverless` | ^0.9.0 | Neon PostgreSQL接続 |
| `drizzle-orm` | ^0.30.0 | 型安全なORM |
| `clsx` | ^2.1.0 | 条件付きクラス名結合 |
| `tailwind-merge` | ^2.2.0 | Tailwindクラスのマージ |
| `uuid` | ^9.0.1 | ユニークID生成 |
| `isomorphic-dompurify` | ^2.9.0 | XSS対策（HTMLサニタイゼーション） |
| `lucide-react` | ^0.344.0 | アイコンライブラリ |

#### 開発依存関係

```bash
npm install -D drizzle-kit \
               @types/uuid \
               @types/dompurify \
               prettier \
               prettier-plugin-tailwindcss
```

**各パッケージの説明:**

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `drizzle-kit` | ^0.20.0 | Drizzle ORMのマイグレーションツール |
| `@types/uuid` | ^9.0.8 | uuidの型定義 |
| `@types/dompurify` | ^3.0.5 | DOMPurifyの型定義 |
| `prettier` | ^3.2.5 | コードフォーマッター |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Tailwindクラスの自動ソート |

#### インストール確認

```bash
npm list --depth=0
```

**期待される出力（抜粋）:**
```
nocode-ui-builder@0.1.0
├── @dnd-kit/core@6.1.0
├── @dnd-kit/sortable@8.0.0
├── @neondatabase/serverless@0.9.0
├── drizzle-orm@0.30.0
├── next@14.1.0
├── react@18.2.0
├── typescript@5.3.3
└── ...
```

---

## 設定ファイルの作成

### ステップ 4: package.json の完全版

`package.json`を以下の内容で更新します:

```json
{
  "name": "nocode-ui-builder",
  "version": "0.1.0",
  "description": "A no-code UI builder for creating web interfaces with drag-and-drop",
  "author": "Your Name",
  "license": "MIT",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@neondatabase/serverless": "^0.9.0",
    "clsx": "^2.1.0",
    "drizzle-orm": "^0.30.0",
    "isomorphic-dompurify": "^2.9.0",
    "lucide-react": "^0.344.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^9.0.8",
    "autoprefixer": "^10.0.1",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "postcss": "^8",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.11",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**スクリプト解説:**

| スクリプト | コマンド | 説明 |
|-----------|---------|------|
| `dev` | `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `build` | `npm run build` | 本番ビルド |
| `start` | `npm run start` | 本番サーバー起動 |
| `lint` | `npm run lint` | ESLintによるコードチェック |
| `type-check` | `npm run type-check` | TypeScript型チェック |
| `format` | `npm run format` | Prettierでコード整形 |
| `db:generate` | `npm run db:generate` | Drizzleマイグレーション生成 |
| `db:push` | `npm run db:push` | データベースにスキーマ反映 |
| `db:studio` | `npm run db:studio` | Drizzle Studio起動（GUI管理ツール） |

---

### ステップ 5: tsconfig.json の完全版

`tsconfig.json`を以下の内容で更新します:

```json
{
  "compilerOptions": {
    /* 言語とモジュール設定 */
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,

    /* 型チェック設定 */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,

    /* JSX設定 */
    "jsx": "preserve",

    /* インクリメンタルビルド */
    "incremental": true,
    "skipLibCheck": true,

    /* パスエイリアス */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Next.js固有設定 */
    "plugins": [
      {
        "name": "next"
      }
    ],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out"
  ]
}
```

**重要なオプション解説:**

| オプション | 値 | 説明 |
|-----------|---|------|
| `strict` | `true` | 厳格な型チェック有効化 |
| `noUnusedLocals` | `true` | 未使用ローカル変数をエラーに |
| `noUncheckedIndexedAccess` | `true` | 配列アクセス時の安全性向上 |
| `paths` | `{"@/*": ["./src/*"]}` | インポートエイリアス設定 |
| `jsx` | `"preserve"` | JSXをそのまま保持（Next.jsが変換） |
| `incremental` | `true` | インクリメンタルコンパイル有効化 |

---

### ステップ 6: next.config.js の設定

`next.config.js`を以下の内容で作成/更新します:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Modeを有効化（開発時の警告検出）
  reactStrictMode: true,

  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 環境変数の公開設定
  env: {
    NEXT_PUBLIC_APP_NAME: 'NoCode UI Builder',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },

  // 本番ビルド最適化
  swcMinify: true,

  // 実験的機能（必要に応じて有効化）
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },

  // 型チェックとLintをビルド時に実行
  typescript: {
    // 本番ビルド時に型エラーを無視しない
    ignoreBuildErrors: false,
  },
  eslint: {
    // 本番ビルド時にLintエラーを無視しない
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
```

**設定解説:**

- **reactStrictMode**: 開発時に潜在的な問題を検出
- **images.remotePatterns**: 外部画像URLの許可リスト
- **swcMinify**: 高速なJavaScriptミニファイヤー
- **serverActions**: Next.js 14のServer Actions機能を有効化
- **serverComponentsExternalPackages**: サーバーコンポーネントで使用する外部パッケージを指定

---

### ステップ 7: tailwind.config.ts の完全版

`tailwind.config.ts`を以下の内容で更新します:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // カスタムカラーパレット
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // ベースカラー
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        canvas: {
          bg: '#f8fafc',
          border: '#e2e8f0',
          grid: '#cbd5e1',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'widget': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'widget-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'widget-selected': '0 0 0 2px #3b82f6, 0 4px 16px rgba(59, 130, 246, 0.3)',
        'panel': '0 0 20px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      gridTemplateColumns: {
        'builder': '240px 1fr 320px', // Palette | Canvas | Properties
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};

export default config;
```

**カスタマイズ解説:**

- **colors**: プライマリ、セカンダリ、状態カラー（success/warning/error）、キャンバス専用カラー
- **spacing**: 追加のスペーシング値
- **boxShadow**: Widget用のカスタムシャドウ
- **animation**: フェードイン、スライドインアニメーション
- **gridTemplateColumns**: ビルダーレイアウト用のグリッド定義

---

### ステップ 8: postcss.config.js の確認

`postcss.config.js`がすでに存在するはずです。内容を確認:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

このファイルはそのまま使用します。

---

### ステップ 9: .eslintrc.json の完全版

`.eslintrc.json`を以下の内容で更新します:

```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // TypeScript関連
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // React関連
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // 一般的なコーディング規約
    "no-console": [
      "warn",
      {
        "allow": ["warn", "error"]
      }
    ],
    "prefer-const": "warn",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"]
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "public/"
  ]
}
```

**ルール解説:**

- **no-unused-vars**: 未使用変数を警告（`_`プレフィックスは除外）
- **no-explicit-any**: `any`型の使用を警告
- **no-console**: `console.log`を警告（`console.warn`と`console.error`は許可）
- **eqeqeq**: 厳密等価演算子（`===`）を強制

---

### ステップ 10: Prettier設定ファイル

`.prettierrc.json`を新規作成します:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**設定解説:**

- **singleQuote**: シングルクォート使用
- **printWidth**: 1行の最大文字数
- **tailwindcss plugin**: Tailwindクラスを自動ソート

`.prettierignore`も作成:

```
# 依存関係
node_modules/

# ビルド出力
.next/
out/
dist/
build/

# 環境変数
.env*

# ログ
*.log

# その他
.DS_Store
coverage/
```

---

### ステップ 11: .gitignore の完全版

`.gitignore`を以下の内容で更新します:

```
# 依存関係
/node_modules
/.pnp
.pnp.js

# テスト
/coverage

# Next.js
/.next/
/out/

# 本番ビルド
/build

# 環境変数
.env*.local
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# デバッグ
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# ローカル設定
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Drizzle
drizzle/
```

---

### ステップ 12: 環境変数テンプレート

`.env.local.example`を新規作成します:

```bash
# データベース接続（Neon PostgreSQL）
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# アプリケーション設定
NEXT_PUBLIC_APP_NAME="NoCode UI Builder"
NEXT_PUBLIC_APP_VERSION="0.1.0"

# 本番環境のみ
# VERCEL_URL=your-deployment-url.vercel.app
```

**注意事項:**
- `.env.local.example`はGitにコミット（テンプレートとして）
- `.env.local`は実際の機密情報を含むため、Gitにコミットしない（`.gitignore`に含まれている）

**実際の`.env.local`ファイルを作成:**
```bash
cp .env.local.example .env.local
```

Phase 3でNeon PostgreSQLのセットアップ後、`DATABASE_URL`を実際の値に更新します。

---

### ステップ 13: Drizzle設定ファイル

`drizzle.config.ts`を新規作成します:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

**設定解説:**

- **schema**: Drizzleスキーマファイルのパス
- **out**: マイグレーションファイルの出力先
- **driver**: PostgreSQLドライバー
- **dbCredentials**: データベース接続情報
- **verbose**: 詳細ログ出力
- **strict**: 厳格モード（型安全性向上）

---

## ディレクトリ構造の作成

### ステップ 14: ディレクトリ構造の構築

以下のコマンドで必要なディレクトリをすべて作成します:

```bash
# Windowsの場合（PowerShellまたはCmd）
mkdir -p src\app\builder
mkdir -p src\app\preview\[id]
mkdir -p src\app\api\projects\[id]
mkdir -p src\app\api\export\[id]
mkdir -p src\components\builder
mkdir -p src\components\widgets
mkdir -p src\components\ui
mkdir -p src\lib\db
mkdir -p src\lib\export
mkdir -p src\types
mkdir -p public\widget-icons

# Unix系（Mac/Linux）の場合
mkdir -p src/app/builder
mkdir -p src/app/preview/\[id\]
mkdir -p src/app/api/projects/\[id\]
mkdir -p src/app/api/export/\[id\]
mkdir -p src/components/builder
mkdir -p src/components/widgets
mkdir -p src/components/ui
mkdir -p src/lib/db
mkdir -p src/lib/export
mkdir -p src/types
mkdir -p public/widget-icons
```

### 完成したディレクトリ構造

```
nocode-ui-builder/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # ルートレイアウト
│   │   ├── page.tsx                   # ランディングページ
│   │   ├── globals.css                # グローバルCSS
│   │   ├── builder/
│   │   │   └── page.tsx               # ビルダー画面
│   │   ├── preview/
│   │   │   └── [id]/
│   │   │       └── page.tsx           # プレビュー画面
│   │   └── api/
│   │       ├── projects/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET, PUT, DELETE
│   │       └── export/
│   │           └── [id]/
│   │               └── route.ts       # HTMLエクスポート
│   ├── components/
│   │   ├── builder/
│   │   │   ├── Canvas.tsx
│   │   │   ├── WidgetPalette.tsx
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── WidgetWrapper.tsx
│   │   ├── widgets/
│   │   │   ├── Text.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Select.tsx
│   │   └── ui/
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts               # Neon接続
│   │   │   ├── schema.ts              # Drizzleスキーマ
│   │   │   └── queries.ts             # クエリ関数
│   │   ├── export/
│   │   │   └── html-generator.ts      # HTML/CSS生成
│   │   └── utils.ts                   # ユーティリティ関数
│   └── types/
│       ├── widget.ts                  # Widget型定義
│       ├── project.ts                 # Project型定義
│       └── canvas.ts                  # Canvas型定義
├── public/
│   └── widget-icons/                  # Widgetアイコン画像
├── drizzle/                           # マイグレーションファイル（自動生成）
├── docs/
│   ├── idea/                          # 設計ドキュメント
│   └── implementation/                # 実装ドキュメント（本ファイル）
├── .env.local                         # 環境変数（Gitにコミットしない）
├── .env.local.example                 # 環境変数テンプレート
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── drizzle.config.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Git初期化

### ステップ 15: Gitリポジトリの初期化

```bash
git init
```

**期待される出力:**
```
Initialized empty Git repository in c:/Users/mitoi/Desktop/Projects/nocode-ui-builder/.git/
```

### ステップ 16: 初回コミット

```bash
# ステージングエリアに追加
git add .

# 初回コミット
git commit -m "Initial commit: Project setup with Next.js 14, TypeScript, Tailwind CSS

- Next.js 14 with App Router
- TypeScript strict mode
- Tailwind CSS with custom config
- dnd-kit for drag-and-drop
- Drizzle ORM for database
- ESLint and Prettier configuration
- Directory structure setup"
```

### ステップ 17: リモートリポジトリの追加（オプション）

GitHubでリポジトリを作成した場合:

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/your-username/nocode-ui-builder.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

---

## 動作確認

### ステップ 18: TypeScript型チェック

```bash
npm run type-check
```

**期待される出力:**
```
> type-check
> tsc --noEmit

# エラーがなければ何も表示されない
```

### ステップ 19: ESLintチェック

```bash
npm run lint
```

**期待される出力:**
```
> lint
> next lint

✔ No ESLint warnings or errors
```

### ステップ 20: 開発サーバー起動

```bash
npm run dev
```

**期待される出力:**
```
> dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

**ブラウザで確認:**
1. http://localhost:3000 を開く
2. Next.jsのデフォルトランディングページが表示される

### ステップ 21: Prettierフォーマット確認

```bash
# フォーマット適用
npm run format

# フォーマットチェック
npm run format:check
```

---

## トラブルシューティング

### 問題1: `npm install`が失敗する

**症状:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決策:**
```bash
# パッケージロックファイルを削除
rm package-lock.json

# node_modulesを削除
rm -rf node_modules

# クリーンインストール
npm install --legacy-peer-deps
```

---

### 問題2: ポート3000がすでに使用中

**症状:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決策1: ポートを変更**
```bash
# 別のポートで起動
PORT=3001 npm run dev
```

**解決策2: 既存のプロセスを停止**
```bash
# Windowsの場合
netstat -ano | findstr :3000
taskkill /PID <プロセスID> /F

# Mac/Linuxの場合
lsof -ti:3000 | xargs kill -9
```

---

### 問題3: TypeScriptエラーが多数発生

**症状:**
```
Type error: ...
```

**解決策（一時的）:**

`tsconfig.json`の`strict`を一時的に`false`に設定:
```json
{
  "compilerOptions": {
    "strict": false,
    // ...
  }
}
```

後でPhase 2で型定義を完成させた後、`strict: true`に戻します。

---

### 問題4: Tailwind CSSが適用されない

**症状:**
ブラウザでTailwindクラスが効いていない

**解決策:**

1. `src/app/globals.css`に以下が含まれているか確認:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. `tailwind.config.ts`の`content`パスが正しいか確認:
```typescript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

3. 開発サーバーを再起動:
```bash
# Ctrl+Cでサーバー停止
npm run dev
```

---

### 問題5: Windows環境でのパス問題

**症状:**
```
Error: Cannot find module '@/...'
```

**解決策:**

`tsconfig.json`のパスエイリアスを確認:
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

Windowsでバックスラッシュではなくスラッシュを使用:
```typescript
// ❌ 間違い
import { Widget } from '@\types\widget';

// ✅ 正しい
import { Widget } from '@/types/widget';
```

---

## 成果物チェックリスト

Phase 1完了時に以下をすべて確認してください:

### ファイル確認

- [ ] `package.json` が正しく設定されている
- [ ] `tsconfig.json` が正しく設定されている
- [ ] `next.config.js` が正しく設定されている
- [ ] `tailwind.config.ts` が正しく設定されている
- [ ] `.eslintrc.json` が正しく設定されている
- [ ] `.prettierrc.json` が作成されている
- [ ] `drizzle.config.ts` が作成されている
- [ ] `.env.local.example` が作成されている
- [ ] `.env.local` が作成されている（機密情報なし）
- [ ] `.gitignore` が正しく設定されている

### ディレクトリ確認

- [ ] `src/app/builder/` ディレクトリが存在
- [ ] `src/app/api/projects/` ディレクトリが存在
- [ ] `src/components/builder/` ディレクトリが存在
- [ ] `src/components/widgets/` ディレクトリが存在
- [ ] `src/lib/db/` ディレクトリが存在
- [ ] `src/types/` ディレクトリが存在

### コマンド確認

- [ ] `npm run dev` が正常に起動
- [ ] `npm run type-check` がエラーなし
- [ ] `npm run lint` が警告5件以下
- [ ] `npm run format` が実行可能
- [ ] http://localhost:3000 でページが表示

### Git確認

- [ ] `git init` が完了
- [ ] 初回コミットが完了
- [ ] `.git` ディレクトリが存在

### 依存関係確認

- [ ] `node_modules/` ディレクトリが存在
- [ ] `@dnd-kit/core` がインストール済み
- [ ] `@neondatabase/serverless` がインストール済み
- [ ] `drizzle-orm` がインストール済み
- [ ] `lucide-react` がインストール済み

---

## 次のPhaseへの準備

Phase 1が完了したら、Phase 2に進みます。

### Phase 2で実施すること

1. **TypeScript型定義の作成**
   - `src/types/widget.ts`
   - `src/types/project.ts`
   - `src/types/canvas.ts`

2. **ユーティリティ関数の実装**
   - `src/lib/utils.ts`（`cn`関数等）

### 必要な準備

- Phase 1のすべてのチェックリストが完了していること
- TypeScriptの基本的な知識
- 型システム（Union型、Type Guards等）の理解

---

## まとめ

Phase 1では、NoCode UI Builderプロジェクトの開発環境を完全にセットアップしました。

**達成したこと:**
- Next.js 14プロジェクトの初期化
- TypeScript、Tailwind CSS、ESLintの設定
- 必要な依存パッケージのインストール
- ディレクトリ構造の構築
- Gitバージョン管理の初期化
- 開発サーバーの起動確認

**次のステップ:**
Phase 2のドキュメント（`20251021_02-type-definitions.md`）を参照して、TypeScript型定義の実装に進んでください。

---

**所要時間（実績）:** _____分
**遭遇した問題:** _______________
**メモ:** _______________

**Phase 1 完了日:** ___________
**次のPhase開始予定日:** ___________

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月21日
**バージョン**: 1.0
