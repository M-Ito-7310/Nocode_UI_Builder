# Architecture

## システムアーキテクチャ概要

NoCode UI Builderは、Next.js 14のApp Routerをベースにしたフルスタックアプリケーションです。フロントエンドとバックエンドAPI、データベースを統合したモノリシックな構成を採用します。

## 技術スタック詳細

### フロントエンド
- **Next.js 14** (App Router)
  - React Server Components (RSC)
  - Client Components（インタラクティブなUI用）
- **TypeScript 5+**
  - 型安全性の確保
  - 開発者体験の向上
- **Tailwind CSS 3+**
  - ユーティリティファーストのスタイリング
  - カスタムデザインシステム
- **dnd-kit**
  - アクセシビリティに配慮したドラッグ&ドロップライブラリ
  - タッチデバイス対応

### バックエンド
- **Next.js API Routes** (App Router)
  - RESTful API
  - サーバーサイドロジック
- **Drizzle ORM**
  - 型安全なORMクエリ
  - PostgreSQL対応
- **Neon PostgreSQL**
  - サーバーレスPostgreSQL
  - 無料枠: 0.5GB ストレージ

### デプロイ・インフラ
- **Vercel**
  - Next.jsに最適化されたホスティング
  - 自動CI/CD
  - エッジネットワーク

## アプリケーション構造

### ディレクトリ構成

```
nocode-ui-builder/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # ランディングページ
│   │   ├── builder/              # ビルダー画面
│   │   │   └── page.tsx
│   │   ├── preview/              # プレビュー機能
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── api/                  # API Routes
│   │       ├── projects/
│   │       │   ├── route.ts      # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts  # GET, PUT, DELETE
│   │       └── export/
│   │           └── [id]/
│   │               └── route.ts  # HTML/CSS生成
│   ├── components/
│   │   ├── builder/              # ビルダー関連コンポーネント
│   │   │   ├── Canvas.tsx        # ドロップ可能なキャンバス
│   │   │   ├── WidgetPalette.tsx # ドラッグ可能なパーツ一覧
│   │   │   ├── PropertiesPanel.tsx # プロパティ編集パネル
│   │   │   ├── Toolbar.tsx       # ツールバー
│   │   │   └── WidgetWrapper.tsx # キャンバス上のWidget包含コンポーネント
│   │   ├── widgets/              # UIパーツコンポーネント
│   │   │   ├── Text.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Select.tsx
│   │   └── ui/                   # 共通UIコンポーネント
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── Spinner.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts          # Neon接続設定
│   │   │   ├── schema.ts         # Drizzleスキーマ定義
│   │   │   └── queries.ts        # データベースクエリ
│   │   ├── export/
│   │   │   └── html-generator.ts # HTML/CSS生成ロジック
│   │   └── utils.ts              # ユーティリティ関数
│   └── types/
│       ├── widget.ts             # Widget型定義
│       ├── project.ts            # Project型定義
│       └── canvas.ts             # Canvas型定義
├── public/
│   └── widget-icons/             # パーツアイコン画像
├── docs/
│   └── idea/                     # 設計ドキュメント
├── .env.local                    # 環境変数（Neon接続情報）
├── drizzle.config.ts             # Drizzle設定
├── next.config.js                # Next.js設定
├── tailwind.config.ts            # Tailwind設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係
```

## コンポーネントアーキテクチャ

### 画面構成

#### 1. ランディングページ (`/`)
- プロジェクト紹介
- 「Get Started」ボタン → ビルダー画面へ

#### 2. ビルダー画面 (`/builder`)

```
┌─────────────────────────────────────────────────────────┐
│  Toolbar                                                 │
│  [保存] [プレビュー] [エクスポート]                      │
├───────────┬────────────────────────┬─────────────────────┤
│           │                        │                     │
│  Widget   │                        │   Properties        │
│  Palette  │      Canvas            │   Panel             │
│           │                        │                     │
│  [Text]   │   ┌──────────┐        │  ┌─ Selected: ────┐ │
│  [Input]  │   │  Widget  │        │  │  Type: Button  │ │
│  [Button] │   └──────────┘        │  │  Text: Click   │ │
│  [Image]  │                        │  │  Color: Blue   │ │
│  [Table]  │   ┌──────────┐        │  │  Size: Medium  │ │
│  [Select] │   │  Widget  │        │  └────────────────┘ │
│           │   └──────────┘        │                     │
│           │                        │                     │
└───────────┴────────────────────────┴─────────────────────┘
```

**主要機能:**
- **Widget Palette**: ドラッグ可能なパーツ一覧
- **Canvas**: ドロップ可能な作業領域
- **Properties Panel**: 選択中Widgetの編集
- **Toolbar**: 保存、プレビュー、エクスポート

#### 3. プレビュー画面 (`/preview/[id]`)
- 作成したUIの実際の表示
- レスポンシブ切り替え（将来的）

### データフロー

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ ドラッグ&ドロップ
       ▼
┌─────────────────────┐
│  Canvas (State)     │ ← React State Management
│  - components[]     │
│  - selectedId       │
└──────┬──────────────┘
       │ 保存操作
       ▼
┌─────────────────────┐
│  API Route          │
│  POST /api/projects │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Drizzle ORM        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Neon PostgreSQL    │
│  projects table     │
└─────────────────────┘
```

### 状態管理

**React State（useState）を使用**
- `canvasComponents`: キャンバス上のコンポーネント配列
- `selectedComponentId`: 選択中のコンポーネントID
- `projectMetadata`: プロジェクト名、説明など

**将来的な拡張（スコープ外）:**
- Zustand / Jotai 等のグローバル状態管理
- Undo/Redo機能のための履歴管理

## API設計

### エンドポイント一覧

#### 1. プロジェクト一覧・作成
**GET /api/projects**
- レスポンス: プロジェクト一覧（最近の10件など）

**POST /api/projects**
- リクエスト: `{ name, description, canvas_data }`
- レスポンス: 作成されたプロジェクトID

#### 2. プロジェクト詳細・更新・削除
**GET /api/projects/[id]**
- レスポンス: プロジェクトデータ（canvas_data含む）

**PUT /api/projects/[id]**
- リクエスト: `{ name, description, canvas_data }`
- レスポンス: 更新結果

**DELETE /api/projects/[id]**
- レスポンス: 削除結果

#### 3. HTML/CSSエクスポート
**GET /api/export/[id]**
- レスポンス: 生成されたHTML/CSSファイル（zipまたは単一HTML）

### データ構造

#### canvas_data (JSON)
```typescript
{
  "components": [
    {
      "id": "comp-uuid-1",
      "type": "Button",
      "props": {
        "text": "Click Me",
        "color": "blue",
        "size": "medium",
        "variant": "primary"
      },
      "position": { "x": 100, "y": 50 },
      "size": { "width": 120, "height": 40 }
    },
    {
      "id": "comp-uuid-2",
      "type": "Text",
      "props": {
        "content": "Hello World",
        "fontSize": 24,
        "color": "#000000",
        "fontWeight": "bold"
      },
      "position": { "x": 50, "y": 150 },
      "size": { "width": 200, "height": 30 }
    }
  ]
}
```

## ドラッグ&ドロップ実装

### dnd-kit使用パターン

```typescript
// WidgetPalette.tsx (ドラッグ元)
import { useDraggable } from '@dnd-kit/core';

function DraggableWidget({ type }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${type}`,
    data: { type }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {type}
    </div>
  );
}

// Canvas.tsx (ドロップ先)
import { useDroppable } from '@dnd-kit/core';

function Canvas() {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  return (
    <div ref={setNodeRef}>
      {/* キャンバスコンテンツ */}
    </div>
  );
}
```

## データベース接続

### Neon PostgreSQL設定

**.env.local**
```
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
```

**lib/db/index.ts**
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

## セキュリティ考慮事項

### 初期プロトタイプ
- **認証なし**: 誰でもアクセス可能
- **公開プロジェクト**: すべてのプロジェクトは公開状態

### 将来的な対策（スコープ外）
- Next-Auth / Clerk による認証
- プロジェクトの所有権管理
- CSRF対策
- XSS対策（サニタイゼーション）
- Rate Limiting

## パフォーマンス最適化

### 初期段階
- React Server Componentsの活用
- 静的アセットの最適化
- Tailwind CSSのPurge設定

### 将来的な最適化（スコップ外）
- キャンバスの仮想化（react-window）
- 画像最適化（next/image）
- コード分割
- キャッシング戦略

## デプロイ戦略

### Vercel設定
1. GitHubリポジトリ連携
2. 環境変数設定（DATABASE_URL）
3. 自動デプロイ（mainブランチへのpush時）

### ビルド設定
- **Node.js**: 18.x以上
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `.next/`

## 拡張性の考慮

### プラグインアーキテクチャ（将来的）
- Widgetの動的登録
- カスタムWidgetの追加
- テーマシステム

### API拡張（将来的）
- WebSocket (リアルタイムコラボレーション)
- GraphQL (柔軟なクエリ)
- Webhooks (外部連携)
