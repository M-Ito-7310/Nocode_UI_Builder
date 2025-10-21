# データベース統合ガイド

**作成日**: 2025年10月21日
**Phase**: 10 - データベース統合とAPI実装
**所要時間**: 2-3時間

---

## 目次

1. [Neon PostgreSQL完全セットアップ](#1-neon-postgresql完全セットアップ)
2. [環境変数設定](#2-環境変数設定)
3. [Drizzleマイグレーション実行](#3-drizzleマイグレーション実行)
4. [Drizzle Studio使用方法](#4-drizzle-studio使用方法)
5. [データベース接続テスト](#5-データベース接続テスト)
6. [API動作確認](#6-api動作確認)
7. [トラブルシューティング](#7-トラブルシューティング)

---

## 1. Neon PostgreSQL完全セットアップ

Neonは、サーバーレスPostgreSQLサービスで、無料枠で簡単に開始できます。

### 1.1 Neonアカウント作成

#### ステップ1: Neon公式サイトにアクセス

1. ブラウザで [https://neon.tech](https://neon.tech) を開く
2. 右上の **Sign Up** ボタンをクリック

#### ステップ2: サインアップ方法の選択

以下の3つの方法からいずれかを選択:
- **GitHub アカウント** (推奨)
- **Google アカウント**
- **Email + パスワード**

```
推奨: GitHubアカウントでサインアップ
理由: 後でVercelと統合する際に便利
```

#### ステップ3: 認証とアカウント確認

1. 選択したプロバイダーで認証を完了
2. Emailの場合は確認メールをチェック
3. ダッシュボードにリダイレクトされる

### 1.2 プロジェクト作成

#### ステップ1: 新規プロジェクト作成

1. Neonダッシュボードで **Create a project** をクリック
2. プロジェクト設定を入力:

```yaml
Project name: nocode-ui-builder
Region: US East (Ohio) - us-east-2  # 最も近いリージョンを選択
PostgreSQL version: 16 (デフォルト)
```

#### ステップ2: リージョンの選択基準

| リージョン | 場所 | 推奨ユーザー |
|----------|------|------------|
| US East (Ohio) | 米国東部 | 日本ユーザー向け（低遅延） |
| US West (Oregon) | 米国西部 | アジア太平洋向け |
| Europe (Frankfurt) | ドイツ | ヨーロッパユーザー向け |
| Asia Pacific (Singapore) | シンガポール | 東南アジアユーザー向け |

```
日本からのアクセスの場合:
- US East (Ohio) または Asia Pacific (Singapore) を推奨
- Vercelのデプロイ先リージョンと合わせるとさらに高速
```

#### ステップ3: プロジェクト作成完了

1. **Create Project** ボタンをクリック
2. 数秒でプロジェクトが作成される
3. 自動的にデフォルトデータベース `neondb` が作成される

### 1.3 接続文字列の取得

#### ステップ1: ダッシュボードで接続情報を確認

1. プロジェクトダッシュボードの **Connection Details** セクションを開く
2. **Connection string** タブを選択

#### ステップ2: 接続文字列のコピー

```
表示される接続文字列の形式:
postgresql://[username]:[password]@[endpoint].us-east-2.aws.neon.tech/neondb?sslmode=require
```

**実際の例**:
```
postgresql://nocode_ui_builder_owner:AbCdEfGh1234567890@ep-cool-meadow-12345678.us-east-2.aws.neon.tech/nocode_ui_builder?sslmode=require
```

#### ステップ3: 接続文字列の構成要素

| 要素 | 説明 | 例 |
|-----|------|-----|
| username | データベースユーザー名 | nocode_ui_builder_owner |
| password | 自動生成されたパスワード | AbCdEfGh1234567890 |
| endpoint | Neonエンドポイント | ep-cool-meadow-12345678.us-east-2.aws.neon.tech |
| database | データベース名 | nocode_ui_builder |
| sslmode | SSL接続モード | require (必須) |

#### ステップ4: 接続文字列を安全に保存

```bash
# 一時的にメモ帳などに保存
# 後で .env.local に設定する
```

**重要な注意事項**:
- パスワードは1度しか表示されない
- 紛失した場合はパスワードをリセット可能
- 絶対にGitHubなどに公開しない

### 1.4 Neon無料枠の制限

#### 無料プラン (Free Tier) の仕様

| 項目 | 制限 |
|-----|------|
| ストレージ | 最大 0.5 GB |
| データ転送 | 月 5 GB |
| Compute時間 | 月 191.9時間 (約8日分) |
| プロジェクト数 | 1個 |
| ブランチ数 | 10個 |
| 同時接続数 | 制限あり |
| 自動スケール | あり |
| ポイントインタイムリカバリ | 7日間 |

```
無料枠で十分な理由:
- プロトタイプアプリには十分なリソース
- 必要に応じて有料プランにアップグレード可能
- 自動スケールで突発的なアクセスにも対応
```

---

## 2. 環境変数設定

### 2.1 `.env.local` ファイル作成

プロジェクトルートに `.env.local` ファイルを作成します。

#### ステップ1: ファイル作成

```bash
# プロジェクトルートディレクトリで実行
cd c:\Users\mitoi\Desktop\Projects\nocode-ui-builder

# .env.localファイルを作成
touch .env.local
```

**Windows (PowerShell) の場合**:
```powershell
New-Item .env.local -ItemType File
```

**Windows (コマンドプロンプト) の場合**:
```cmd
type nul > .env.local
```

#### ステップ2: 接続文字列を設定

`.env.local` ファイルに以下を記述:

```env
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://nocode_ui_builder_owner:AbCdEfGh1234567890@ep-cool-meadow-12345678.us-east-2.aws.neon.tech/nocode_ui_builder?sslmode=require"
```

**重要**:
- ダブルクォート `"` で囲む
- 改行やスペースを入れない
- 実際の接続文字列に置き換える

#### ステップ3: `.gitignore` 確認

`.env.local` がGit管理外であることを確認:

```bash
# .gitignore の内容を確認
cat .gitignore
```

`.gitignore` に以下が含まれていることを確認:

```gitignore
# env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2.2 環境変数の検証

#### 環境変数が読み込まれているか確認

簡易テストスクリプトを作成:

```typescript
// scripts/test-env.ts
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL が設定されていません');
  process.exit(1);
}

console.log('✅ DATABASE_URL が正しく読み込まれました');
console.log('接続先:', process.env.DATABASE_URL.split('@')[1]); // パスワード部分を隠す
```

実行:

```bash
npx tsx scripts/test-env.ts
```

期待される出力:
```
✅ DATABASE_URL が正しく読み込まれました
接続先: ep-cool-meadow-12345678.us-east-2.aws.neon.tech/nocode_ui_builder?sslmode=require
```

---

## 3. Drizzleマイグレーション実行

### 3.1 Drizzle Kit設定確認

#### `drizzle.config.ts` ファイルの確認

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

**設定項目の説明**:

| 項目 | 説明 | 値 |
|-----|------|-----|
| schema | スキーマ定義ファイル | ./src/lib/db/schema.ts |
| out | マイグレーションファイル出力先 | ./drizzle |
| dialect | データベース種類 | postgresql |
| dbCredentials.url | データベース接続URL | 環境変数から取得 |

### 3.2 マイグレーションファイル生成

#### ステップ1: `drizzle-kit generate` コマンド実行

```bash
# スキーマからマイグレーションファイルを生成
npx drizzle-kit generate
```

**実行例**:
```
$ npx drizzle-kit generate

🎉 Generating migrations...

📦 Reading schema from ./src/lib/db/schema.ts
✅ Schema loaded successfully

📝 Generating migration file...
✅ Migration file created: ./drizzle/0000_initial_schema.sql

✨ Done! Migration files generated in ./drizzle
```

#### ステップ2: 生成されたファイルを確認

```bash
# drizzleフォルダの内容を確認
ls -la drizzle/
```

生成されるファイル:
```
drizzle/
├── 0000_initial_schema.sql       # SQL マイグレーションファイル
└── meta/
    ├── _journal.json              # マイグレーション履歴
    └── 0000_snapshot.json         # スキーマスナップショット
```

#### ステップ3: SQLファイルの内容確認

```bash
cat drizzle/0000_initial_schema.sql
```

期待される内容:
```sql
CREATE TABLE IF NOT EXISTS "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "canvas_data" jsonb DEFAULT '{"components":[]}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_projects_created_at" ON "projects" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_projects_updated_at" ON "projects" ("updated_at" DESC);
```

### 3.3 マイグレーション実行（データベースに反映）

#### ステップ1: `drizzle-kit push` コマンド実行

```bash
# マイグレーションをデータベースに適用
npx drizzle-kit push
```

**実行例**:
```
$ npx drizzle-kit push

🚀 Pushing schema to database...

📡 Connecting to database...
✅ Connected to Neon PostgreSQL

📋 Applying migrations...
  → Creating table "projects"
  → Creating index "idx_projects_created_at"
  → Creating index "idx_projects_updated_at"

✅ Schema pushed successfully!
```

#### ステップ2: 実行結果の確認

成功メッセージが表示されればOK:
```
✅ Schema pushed successfully!
```

### 3.4 エラー対処法

#### エラー1: `DATABASE_URL is not defined`

**原因**: 環境変数が読み込まれていない

**解決方法**:
```bash
# .env.local ファイルが存在するか確認
ls -la .env.local

# 環境変数を手動で設定
export DATABASE_URL="postgresql://..."

# 再実行
npx drizzle-kit push
```

#### エラー2: `Connection timeout`

**原因**: ネットワーク接続の問題またはNeonサービスの一時的な問題

**解決方法**:
```bash
# 1. インターネット接続を確認
ping neon.tech

# 2. Neonダッシュボードでサービス状態を確認
# https://neon.tech/status

# 3. 数分待って再実行
npx drizzle-kit push
```

#### エラー3: `SSL certificate verification failed`

**原因**: SSL証明書の検証問題

**解決方法**:

接続文字列に `sslmode=require` が含まれているか確認:
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

それでも解決しない場合は一時的に無効化:
```env
DATABASE_URL="postgresql://...?sslmode=no-verify"
```

#### エラー4: `permission denied for schema public`

**原因**: データベース権限の問題

**解決方法**:

Neonダッシュボードで:
1. **SQL Editor** を開く
2. 以下のSQLを実行:

```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO <username>;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <username>;
```

---

## 4. Drizzle Studio使用方法

Drizzle Studioは、データベースをGUIで管理できる強力なツールです。

### 4.1 Drizzle Studio起動

#### ステップ1: コマンド実行

```bash
npx drizzle-kit studio
```

#### ステップ2: ブラウザで開く

実行すると、以下のメッセージが表示されます:

```
🎨 Drizzle Studio is running on https://local.drizzle.studio

📊 Connected to: neon postgresql database
📂 Schema: ./src/lib/db/schema.ts

🚀 Press Ctrl+C to stop
```

自動的にブラウザで `https://local.drizzle.studio` が開きます。

### 4.2 Drizzle Studioの機能

#### 機能1: テーブル一覧表示

左サイドバーに `projects` テーブルが表示されます。

#### 機能2: データの閲覧

1. `projects` テーブルをクリック
2. 全レコードがテーブル形式で表示される
3. カラムごとにソート可能

#### 機能3: データの追加

1. 右上の **Add Row** ボタンをクリック
2. フォームにデータを入力:

```yaml
name: "テストプロジェクト"
description: "Drizzle Studioからのテスト作成"
canvas_data:
  {
    "components": [
      {
        "id": "test-1",
        "type": "Text",
        "position": { "x": 100, "y": 100 },
        "size": { "width": 200, "height": 50 },
        "props": { "content": "Hello from Drizzle Studio!" }
      }
    ]
  }
```

3. **Save** ボタンをクリック

#### 機能4: データの編集

1. 編集したい行をクリック
2. フィールドを直接編集
3. 自動保存される

#### 機能5: データの削除

1. 削除したい行を選択
2. **Delete** アイコンをクリック
3. 確認ダイアログで **Confirm** をクリック

#### 機能6: SQLクエリ実行

1. 上部の **SQL** タブをクリック
2. SQLクエリを入力:

```sql
SELECT * FROM projects WHERE name LIKE '%テスト%';
```

3. **Run** ボタンをクリック

### 4.3 Drizzle Studioの便利な使い方

#### JSONBデータの編集

`canvas_data` カラムはJSONB型なので、JSON Editorが表示されます:

1. `canvas_data` フィールドをクリック
2. JSONエディタが開く
3. 構文ハイライトとバリデーション機能付き
4. 編集後、**Apply** をクリック

#### フィルタリング

1. カラムヘッダーの横のフィルタアイコンをクリック
2. 条件を設定:

```
name contains "プロジェクト"
created_at > 2025-10-20
```

3. **Apply** をクリック

---

## 5. データベース接続テスト

### 5.1 簡易接続テストスクリプト

`scripts/test-db-connection.ts` を作成:

```typescript
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    console.log('🔌 データベース接続テスト開始...\n');

    const sql = neon(process.env.DATABASE_URL!);

    // 1. 基本接続テスト
    console.log('1️⃣ 基本接続テスト');
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ 接続成功!');
    console.log('   サーバー時刻:', result[0].current_time);
    console.log('   PostgreSQLバージョン:', result[0].pg_version.split(',')[0]);
    console.log('');

    // 2. テーブル存在確認
    console.log('2️⃣ テーブル存在確認');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('✅ テーブル一覧:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    console.log('');

    // 3. projectsテーブル構造確認
    console.log('3️⃣ projectsテーブル構造確認');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `;
    console.log('✅ カラム一覧:');
    columns.forEach(c => {
      console.log(`   - ${c.column_name}: ${c.data_type} ${c.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    console.log('');

    // 4. インデックス確認
    console.log('4️⃣ インデックス確認');
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'projects'
    `;
    console.log('✅ インデックス一覧:');
    indexes.forEach(i => console.log(`   - ${i.indexname}`));
    console.log('');

    console.log('🎉 すべてのテストが成功しました!');

  } catch (error) {
    console.error('❌ エラー発生:', error);
    process.exit(1);
  }
}

testConnection();
```

#### 実行:

```bash
npx tsx scripts/test-db-connection.ts
```

#### 期待される出力:

```
🔌 データベース接続テスト開始...

1️⃣ 基本接続テスト
✅ 接続成功!
   サーバー時刻: 2025-10-21T06:30:45.123Z
   PostgreSQLバージョン: PostgreSQL 16.0 on x86_64-pc-linux-gnu

2️⃣ テーブル存在確認
✅ テーブル一覧:
   - projects

3️⃣ projectsテーブル構造確認
✅ カラム一覧:
   - id: uuid (NOT NULL)
   - name: character varying (NOT NULL)
   - description: text
   - canvas_data: jsonb (NOT NULL)
   - created_at: timestamp with time zone (NOT NULL)
   - updated_at: timestamp with time zone (NOT NULL)

4️⃣ インデックス確認
✅ インデックス一覧:
   - projects_pkey
   - idx_projects_created_at
   - idx_projects_updated_at

🎉 すべてのテストが成功しました!
```

### 5.2 Drizzle ORMでの接続テスト

`scripts/test-drizzle.ts` を作成:

```typescript
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

async function testDrizzle() {
  try {
    console.log('🔧 Drizzle ORM接続テスト開始...\n');

    // 1. 全プロジェクト取得
    console.log('1️⃣ 全プロジェクト取得');
    const allProjects = await db.select().from(projects);
    console.log(`✅ ${allProjects.length}件のプロジェクトが見つかりました`);
    console.log('');

    // 2. テストプロジェクト作成
    console.log('2️⃣ テストプロジェクト作成');
    const newProject = await db.insert(projects).values({
      name: 'データベーステストプロジェクト',
      description: 'Drizzle ORMの接続テスト用プロジェクト',
      canvasData: {
        components: [
          {
            id: 'test-widget-1',
            type: 'Text',
            position: { x: 100, y: 100 },
            size: { width: 300, height: 50 },
            props: {
              content: 'データベース接続テスト成功!',
              fontSize: 24,
              color: '#10B981',
            },
          },
        ],
      },
    }).returning();
    console.log('✅ プロジェクト作成成功!');
    console.log(`   ID: ${newProject[0].id}`);
    console.log(`   名前: ${newProject[0].name}`);
    console.log('');

    // 3. 作成したプロジェクトを取得
    console.log('3️⃣ 作成したプロジェクトを取得');
    const { eq } = await import('drizzle-orm');
    const fetchedProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, newProject[0].id));
    console.log('✅ プロジェクト取得成功!');
    console.log(`   Canvas Data: ${JSON.stringify(fetchedProject[0].canvasData, null, 2)}`);
    console.log('');

    // 4. プロジェクト更新
    console.log('4️⃣ プロジェクト更新');
    const updatedProject = await db
      .update(projects)
      .set({
        description: '更新されたテストプロジェクト',
        updatedAt: new Date(),
      })
      .where(eq(projects.id, newProject[0].id))
      .returning();
    console.log('✅ プロジェクト更新成功!');
    console.log(`   新しい説明: ${updatedProject[0].description}`);
    console.log('');

    // 5. プロジェクト削除
    console.log('5️⃣ プロジェクト削除');
    await db.delete(projects).where(eq(projects.id, newProject[0].id));
    console.log('✅ プロジェクト削除成功!');
    console.log('');

    console.log('🎉 すべてのDrizzle ORMテストが成功しました!');

  } catch (error) {
    console.error('❌ エラー発生:', error);
    process.exit(1);
  }
}

testDrizzle();
```

#### 実行:

```bash
npx tsx scripts/test-drizzle.ts
```

---

## 6. API動作確認

### 6.1 API Routes動作確認

開発サーバーを起動:

```bash
npm run dev
```

### 6.2 プロジェクト作成テスト

#### curlコマンドでテスト:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "APIテストプロジェクト",
    "description": "API経由で作成されたテストプロジェクト",
    "canvasData": {
      "components": [
        {
          "id": "api-test-1",
          "type": "Button",
          "position": { "x": 150, "y": 150 },
          "size": { "width": 200, "height": 50 },
          "props": {
            "text": "Click Me!",
            "variant": "primary"
          }
        }
      ]
    }
  }'
```

#### 期待されるレスポンス:

```json
{
  "project": {
    "id": "550e8400-e29b-41d4-a716-446655440123",
    "name": "APIテストプロジェクト",
    "description": "API経由で作成されたテストプロジェクト",
    "canvasData": {
      "components": [...]
    },
    "createdAt": "2025-10-21T06:45:30.123Z",
    "updatedAt": "2025-10-21T06:45:30.123Z"
  }
}
```

### 6.3 プロジェクト一覧取得テスト

```bash
curl http://localhost:3000/api/projects
```

期待されるレスポンス:

```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440123",
      "name": "APIテストプロジェクト",
      "description": "API経由で作成されたテストプロジェクト",
      "canvasData": {...},
      "createdAt": "2025-10-21T06:45:30.123Z",
      "updatedAt": "2025-10-21T06:45:30.123Z"
    }
  ]
}
```

### 6.4 特定プロジェクト取得テスト

```bash
# 上記で取得したIDを使用
curl http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440123
```

### 6.5 プロジェクト更新テスト

```bash
curl -X PUT http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "更新されたプロジェクト名",
    "description": "API経由で更新されました"
  }'
```

### 6.6 プロジェクト削除テスト

```bash
curl -X DELETE http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440123
```

期待されるレスポンス:

```json
{
  "message": "Project deleted successfully"
}
```

### 6.7 Postmanでのテスト

より視覚的にテストする場合は、Postmanを使用:

#### 1. Postmanコレクション作成

```json
{
  "info": {
    "name": "NoCode UI Builder API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Projects",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects"
      }
    },
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/projects",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Postmanテストプロジェクト\",\n  \"description\": \"Postmanから作成\"\n}"
        }
      }
    }
  ]
}
```

---

## 7. トラブルシューティング

### 7.1 SSL証明書エラー

#### エラーメッセージ:

```
Error: self signed certificate in certificate chain
```

#### 原因:

- SSL証明書の検証に失敗
- ネットワーク環境のプロキシ設定

#### 解決方法:

**方法1: 接続文字列を修正**

```env
# sslmode=require を sslmode=no-verify に変更
DATABASE_URL="postgresql://...?sslmode=no-verify"
```

**方法2: Node.jsの環境変数を設定**

```bash
# 開発環境のみ
export NODE_TLS_REJECT_UNAUTHORIZED=0

# 再実行
npm run dev
```

### 7.2 タイムアウトエラー

#### エラーメッセージ:

```
Error: Connection timeout
Error: Failed to connect to database
```

#### 原因:

- ネットワーク接続の問題
- Neonサービスの一時的な障害
- ファイアウォール設定

#### 解決方法:

**ステップ1: ネットワーク確認**

```bash
# Neonへの接続確認
ping ep-xxxxx.us-east-2.aws.neon.tech
```

**ステップ2: Neonダッシュボードで確認**

1. Neonダッシュボードを開く
2. プロジェクトが **Active** 状態か確認
3. **Operations** タブでエラーログを確認

**ステップ3: タイムアウト時間を延長**

```typescript
// lib/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    timeout: 30000, // 30秒に延長
  },
});

export const db = drizzle(sql, { schema });
```

### 7.3 認証エラー

#### エラーメッセージ:

```
Error: password authentication failed for user "username"
Error: Invalid credentials
```

#### 原因:

- パスワードが間違っている
- ユーザー名が間違っている
- 接続文字列の形式が不正

#### 解決方法:

**ステップ1: 接続文字列の再確認**

Neonダッシュボードから接続文字列を再取得:

1. **Connection Details** を開く
2. **Reset Password** をクリック
3. 新しい接続文字列をコピー
4. `.env.local` を更新

**ステップ2: 環境変数の再読み込み**

```bash
# 開発サーバーを再起動
# Ctrl+C で停止
npm run dev
```

### 7.4 マイグレーション失敗

#### エラーメッセージ:

```
Error: relation "projects" already exists
```

#### 原因:

- テーブルが既に存在する
- マイグレーションの重複実行

#### 解決方法:

**方法1: テーブルを削除して再実行**

Neon SQL Editorで:

```sql
DROP TABLE IF EXISTS projects CASCADE;
```

その後、マイグレーションを再実行:

```bash
npx drizzle-kit push
```

**方法2: マイグレーション履歴をリセット**

```bash
# drizzleフォルダを削除
rm -rf drizzle/

# マイグレーションを再生成
npx drizzle-kit generate
npx drizzle-kit push
```

### 7.5 JSONB型のエラー

#### エラーメッセージ:

```
Error: invalid input syntax for type json
```

#### 原因:

- JSONデータの形式が不正
- エスケープ処理の問題

#### 解決方法:

**正しいJSONの形式を確認**:

```typescript
// ❌ 間違い
canvasData: '{"components": []}' // 文字列

// ✅ 正しい
canvasData: { components: [] }   // オブジェクト
```

### 7.6 デバッグモードの有効化

詳細なエラーログを確認:

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(sql, {
  schema,
  logger: true, // SQLクエリをログ出力
});
```

---

## まとめ

### 完了チェックリスト

- [ ] Neonアカウント作成完了
- [ ] プロジェクト作成完了
- [ ] 接続文字列取得完了
- [ ] `.env.local` ファイル作成完了
- [ ] `npx drizzle-kit generate` 成功
- [ ] `npx drizzle-kit push` 成功
- [ ] Drizzle Studio起動成功
- [ ] データベース接続テスト成功
- [ ] API動作確認完了

### 次のステップ

次は **UI/UXテスト** (Phase 11) に進みます:

```bash
# 次のドキュメント
docs/implementation/20251021_11-ui-ux-testing.md
```

---

**作成者**: Claude
**最終更新**: 2025年10月21日
