# データベース基盤実装ガイド

## 目次
1. [Drizzle ORM 概要](#drizzle-orm-概要)
2. [Neon PostgreSQL 概要](#neon-postgresql-概要)
3. [データベーススキーマ実装](#データベーススキーマ実装)
4. [データベース接続設定](#データベース接続設定)
5. [クエリ関数実装](#クエリ関数実装)
6. [Neon PostgreSQL セットアップ手順](#neon-postgresql-セットアップ手順)
7. [環境変数設定](#環境変数設定)
8. [トラブルシューティング](#トラブルシューティング)

---

## Drizzle ORM 概要

### Drizzle ORMとは

Drizzle ORMは、TypeScriptファーストの軽量で高速なORMです。型安全性とパフォーマンスを重視して設計されています。

### 選定理由

#### 1. **型安全性**
- TypeScriptの型推論を最大限活用
- コンパイル時にSQLクエリのエラーを検出
- IntelliSenseによる自動補完サポート

#### 2. **パフォーマンス**
- 軽量なランタイム（Prismaの約10分の1のサイズ）
- オーバーヘッドが少ない
- ビルドステップ不要

#### 3. **開発者体験**
- シンプルなAPI
- SQLに近い記述方法
- マイグレーションツール（Drizzle Kit）が付属

#### 4. **Next.js 14との相性**
- Server Componentsで直接使用可能
- エッジランタイム対応
- Vercelでの動作が最適化されている

### 他のORMとの比較

| 特徴 | Drizzle ORM | Prisma | TypeORM |
|------|-------------|--------|---------|
| 型安全性 | ★★★★★ | ★★★★★ | ★★★☆☆ |
| パフォーマンス | ★★★★★ | ★★★☆☆ | ★★★★☆ |
| バンドルサイズ | 7.4kb | 70kb+ | 30kb+ |
| 学習曲線 | 緩やか | 中程度 | 急 |
| エッジ対応 | ○ | △ | × |

---

## Neon PostgreSQL 概要

### Neon PostgreSQLとは

Neonは、サーバーレスアーキテクチャのPostgreSQLサービスです。自動スケーリング、ブランチング機能、高速なコールドスタートが特徴です。

### 主な特徴

#### 1. **サーバーレスアーキテクチャ**
- 使用しないときは自動的にスリープ
- 必要に応じて瞬時に起動
- コストの最適化

#### 2. **ブランチング**
- Gitのようにデータベースをブランチ化
- 開発環境、テスト環境を簡単に作成
- 本番環境に影響を与えずに実験可能

#### 3. **HTTPベースの接続**
- WebSocketやTCPソケット不要
- エッジ環境（Cloudflare Workers等）でも動作
- Vercel Edge Functionsと完全互換

#### 4. **PostgreSQL完全互換**
- 標準のPostgreSQL 16を使用
- すべてのPostgreSQL機能が利用可能
- 既存のツールやライブラリがそのまま使える

### 無料枠の詳細

Neonの無料枠（Free Tier）は、プロトタイプやサイドプロジェクトに最適です。

#### 無料枠のスペック

| リソース | 制限 |
|---------|------|
| **ストレージ** | 0.5 GB |
| **コンピュート時間** | 191.9時間/月（約8日） |
| **プロジェクト数** | 1個 |
| **ブランチ数** | 10個/プロジェクト |
| **データベース数** | 無制限 |
| **同時接続数** | 100接続 |
| **自動サスペンド** | 5分間非アクティブで自動スリープ |

#### 無料枠で十分な理由

本プロジェクトの想定データ量:
- **プロジェクト数**: 100件程度
- **1プロジェクトの平均サイズ**: 10KB（canvas_data）
- **合計データ量**: 約1MB

→ **0.5GBの制限は十分に余裕があります**

#### コンピュート時間の計算

自動サスペンド機能により、使用していない時間はカウントされません:
- **アクティブ時間**: 開発中のみ（1日2時間 × 30日 = 60時間）
- **191.9時間の制限**: 余裕で収まる

---

## データベーススキーマ実装

### スキーマファイル: `src/lib/db/schema.ts`

このファイルでは、Drizzle ORMを使用してデータベーステーブルを定義します。

```typescript
import { pgTable, uuid, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * プロジェクトテーブル
 *
 * NoCode UI Builderで作成されたプロジェクトの情報を保存します。
 * canvas_dataにはJSONB型でWidget配置情報が格納されます。
 */
export const projects = pgTable(
  'projects',
  {
    // プライマリキー: UUID型、自動生成
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),

    // プロジェクト名: 最大255文字、必須
    name: varchar('name', { length: 255 }).notNull(),

    // プロジェクトの説明: テキスト型、任意
    description: text('description'),

    // キャンバスデータ: JSONB型、デフォルトは空の配列
    canvasData: jsonb('canvas_data')
      .notNull()
      .default(sql`'{"components": []}'::jsonb`),

    // 作成日時: タイムゾーン付きタイムスタンプ、自動設定
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),

    // 更新日時: タイムゾーン付きタイムスタンプ、自動設定
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      // インデックス: 作成日時の降順でソート最適化
      createdAtIdx: index('idx_projects_created_at').on(table.createdAt.desc()),

      // インデックス: 更新日時の降順でソート最適化
      updatedAtIdx: index('idx_projects_updated_at').on(table.updatedAt.desc()),
    };
  }
);

/**
 * 型定義: データベースから取得するProject型
 *
 * Drizzleの型推論により自動生成されます。
 * すべてのフィールドが含まれます。
 */
export type Project = typeof projects.$inferSelect;

/**
 * 型定義: 新規Project作成時の型
 *
 * idやタイムスタンプは自動生成されるため、
 * name, description, canvasDataのみを指定します。
 */
export type NewProject = typeof projects.$inferInsert;

/**
 * 型定義: Project更新時の型
 *
 * すべてのフィールドがオプショナルです。
 */
export type UpdateProject = Partial<Omit<Project, 'id' | 'createdAt'>>;
```

### データベーススキーマ設計の解説

#### 1. **UUIDの使用**

```typescript
id: uuid('id').default(sql`gen_random_uuid()`).primaryKey()
```

**理由:**
- グローバルに一意な識別子
- セキュリティ向上（連番IDと異なり推測不可能）
- 分散システムでの衝突を回避
- URLで公開しても情報漏洩のリスクが低い

#### 2. **JSONB型の活用**

```typescript
canvasData: jsonb('canvas_data')
  .notNull()
  .default(sql`'{"components": []}'::jsonb`)
```

**JSONB型の利点:**
- **柔軟性**: Widgetの構造変更に強い
- **クエリ可能**: JSON内の特定要素で検索可能
- **圧縮保存**: バイナリ形式で効率的に保存
- **インデックス対応**: GINインデックスで高速検索

**canvas_dataの構造例:**

```json
{
  "components": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "Button",
      "position": { "x": 100, "y": 50 },
      "size": { "width": 120, "height": 40 },
      "props": {
        "text": "Click Me",
        "variant": "primary",
        "color": "#3B82F6"
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "Text",
      "position": { "x": 50, "y": 150 },
      "size": { "width": 200, "height": 30 },
      "props": {
        "content": "Hello World",
        "fontSize": 24,
        "color": "#000000"
      }
    }
  ],
  "settings": {
    "backgroundColor": "#FFFFFF",
    "width": 1200,
    "height": 800
  }
}
```

#### 3. **タイムスタンプの自動管理**

```typescript
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
```

**withTimezone: true の重要性:**
- グローバル展開時のタイムゾーン問題を回避
- UTCで統一的に保存
- クライアント側で適切にローカル時刻に変換可能

#### 4. **インデックス設計**

```typescript
createdAtIdx: index('idx_projects_created_at').on(table.createdAt.desc()),
updatedAtIdx: index('idx_projects_updated_at').on(table.updatedAt.desc()),
```

**インデックスの目的:**
- **最新プロジェクト一覧の高速取得**
- `ORDER BY created_at DESC LIMIT 10` のクエリを最適化
- ダッシュボードでの表示速度向上

**インデックスのトレードオフ:**
- ✅ 読み取り速度が向上
- ⚠️ 書き込み速度がわずかに低下
- ⚠️ ストレージ容量が増加

→ 本プロジェクトは読み取り頻度が高いため、インデックスの利点が大きい

---

## データベース接続設定

### 接続ファイル: `src/lib/db/index.ts`

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * 環境変数の検証
 *
 * DATABASE_URLが設定されていない場合はエラーを投げます。
 * これにより、実行時エラーを早期に検出できます。
 */
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Please set it in .env.local file.\n' +
    'Example: DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"'
  );
}

/**
 * Neon SQLクライアント
 *
 * HTTPベースのPostgreSQLクライアント。
 * Vercel Edge Functionsやその他のエッジ環境で動作します。
 */
const sql = neon(process.env.DATABASE_URL);

/**
 * Drizzle ORMインスタンス
 *
 * データベース操作の中心となるオブジェクト。
 * スキーマを渡すことで、型推論が有効になります。
 *
 * @example
 * import { db } from '@/lib/db';
 * const projects = await db.select().from(schema.projects);
 */
export const db = drizzle(sql, { schema });

/**
 * スキーマのエクスポート
 *
 * クエリ関数で使用するため、スキーマをエクスポートします。
 */
export { schema };

/**
 * 型定義のエクスポート
 *
 * アプリケーション全体で使用できるように型をエクスポートします。
 */
export type { Project, NewProject, UpdateProject } from './schema';
```

### 接続設定の詳細解説

#### 1. **Neon Serverlessドライバー**

```typescript
import { neon } from '@neondatabase/serverless';
```

**特徴:**
- HTTPベースの接続（WebSocketやTCP不要）
- エッジ環境対応
- 自動接続プーリング
- コールドスタート最適化

#### 2. **環境変数の早期検証**

```typescript
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined...');
}
```

**理由:**
- 実行時エラーの早期発見
- 明確なエラーメッセージで問題解決が容易
- デプロイ前にCI/CDで検出可能

#### 3. **スキーマ付きDrizzle初期化**

```typescript
export const db = drizzle(sql, { schema });
```

**利点:**
- リレーショナルクエリが可能
- 型推論が強化される
- クエリビルダーの自動補完が向上

---

## クエリ関数実装

### クエリファイル: `src/lib/db/queries.ts`

このファイルには、すべてのCRUD操作を行う関数を定義します。

```typescript
import { db } from './index';
import { projects, type Project, type NewProject, type UpdateProject } from './schema';
import { eq, desc, asc, sql } from 'drizzle-orm';

/**
 * プロジェクト一覧取得（最新順）
 *
 * @param limit - 取得件数（デフォルト: 10）
 * @returns プロジェクト配列
 *
 * @example
 * const recentProjects = await getRecentProjects(20);
 */
export async function getRecentProjects(limit: number = 10): Promise<Project[]> {
  try {
    const result = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to fetch recent projects:', error);
    throw new Error('プロジェクト一覧の取得に失敗しました');
  }
}

/**
 * プロジェクト一覧取得（作成日時順）
 *
 * @param limit - 取得件数（デフォルト: 10）
 * @param order - ソート順序（'asc' | 'desc'、デフォルト: 'desc'）
 * @returns プロジェクト配列
 *
 * @example
 * const oldestProjects = await getProjects(5, 'asc');
 */
export async function getProjects(
  limit: number = 10,
  order: 'asc' | 'desc' = 'desc'
): Promise<Project[]> {
  try {
    const orderFunction = order === 'asc' ? asc : desc;

    const result = await db
      .select()
      .from(projects)
      .orderBy(orderFunction(projects.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('プロジェクト一覧の取得に失敗しました');
  }
}

/**
 * プロジェクト取得（ID指定）
 *
 * @param id - プロジェクトID（UUID）
 * @returns プロジェクトオブジェクト、または null
 *
 * @example
 * const project = await getProjectById('550e8400-e29b-41d4-a716-446655440000');
 * if (!project) {
 *   console.log('プロジェクトが見つかりません');
 * }
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to fetch project with id ${id}:`, error);
    throw new Error('プロジェクトの取得に失敗しました');
  }
}

/**
 * プロジェクト作成
 *
 * @param data - プロジェクトデータ
 * @returns 作成されたプロジェクト
 *
 * @example
 * const newProject = await createProject({
 *   name: 'My First Project',
 *   description: 'This is a test project',
 *   canvasData: { components: [] }
 * });
 */
export async function createProject(data: {
  name: string;
  description?: string;
  canvasData?: any;
}): Promise<Project> {
  try {
    // 入力バリデーション
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('プロジェクト名は必須です');
    }

    if (data.name.length > 255) {
      throw new Error('プロジェクト名は255文字以内で入力してください');
    }

    const result = await db
      .insert(projects)
      .values({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        canvasData: data.canvasData || { components: [] },
      })
      .returning();

    if (!result[0]) {
      throw new Error('プロジェクトの作成に失敗しました');
    }

    return result[0];
  } catch (error) {
    console.error('Failed to create project:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('プロジェクトの作成中に予期しないエラーが発生しました');
  }
}

/**
 * プロジェクト更新
 *
 * @param id - プロジェクトID
 * @param data - 更新データ
 * @returns 更新されたプロジェクト、またはnull（見つからない場合）
 *
 * @example
 * const updated = await updateProject('550e8400-e29b-41d4-a716-446655440000', {
 *   name: 'Updated Project Name',
 *   canvasData: { components: [...] }
 * });
 */
export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    canvasData?: any;
  }
): Promise<Project | null> {
  try {
    // 入力バリデーション
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new Error('プロジェクト名は空にできません');
      }
      if (data.name.length > 255) {
        throw new Error('プロジェクト名は255文字以内で入力してください');
      }
    }

    // 更新データの準備
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }

    if (data.canvasData !== undefined) {
      updateData.canvasData = data.canvasData;
    }

    const result = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to update project with id ${id}:`, error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('プロジェクトの更新中に予期しないエラーが発生しました');
  }
}

/**
 * プロジェクト削除
 *
 * @param id - プロジェクトID
 * @returns 削除されたプロジェクト、またはnull（見つからない場合）
 *
 * @example
 * const deleted = await deleteProject('550e8400-e29b-41d4-a716-446655440000');
 * if (deleted) {
 *   console.log('プロジェクトを削除しました:', deleted.name);
 * }
 */
export async function deleteProject(id: string): Promise<Project | null> {
  try {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to delete project with id ${id}:`, error);
    throw new Error('プロジェクトの削除に失敗しました');
  }
}

/**
 * プロジェクト総数取得
 *
 * @returns プロジェクト総数
 *
 * @example
 * const count = await getProjectCount();
 * console.log(`合計 ${count} 件のプロジェクトがあります`);
 */
export async function getProjectCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);

    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Failed to get project count:', error);
    throw new Error('プロジェクト数の取得に失敗しました');
  }
}

/**
 * プロジェクト名で検索
 *
 * @param searchTerm - 検索キーワード
 * @param limit - 取得件数（デフォルト: 10）
 * @returns マッチしたプロジェクト配列
 *
 * @example
 * const results = await searchProjectsByName('landing');
 */
export async function searchProjectsByName(
  searchTerm: string,
  limit: number = 10
): Promise<Project[]> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const result = await db
      .select()
      .from(projects)
      .where(sql`${projects.name} ILIKE ${'%' + searchTerm.trim() + '%'}`)
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to search projects:', error);
    throw new Error('プロジェクトの検索に失敗しました');
  }
}

/**
 * プロジェクトの存在確認
 *
 * @param id - プロジェクトID
 * @returns 存在する場合true
 *
 * @example
 * const exists = await projectExists('550e8400-e29b-41d4-a716-446655440000');
 */
export async function projectExists(id: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error(`Failed to check if project exists with id ${id}:`, error);
    return false;
  }
}
```

### クエリ関数の詳細解説

#### 1. **エラーハンドリングパターン**

すべての関数で一貫したエラーハンドリングを実装:

```typescript
try {
  // データベース操作
} catch (error) {
  console.error('エラー詳細:', error);
  throw new Error('ユーザーフレンドリーなエラーメッセージ');
}
```

**利点:**
- デバッグ時に詳細なエラーログが残る
- ユーザーには適切なエラーメッセージを表示
- エラーの伝播を制御できる

#### 2. **入力バリデーション**

```typescript
if (!data.name || data.name.trim().length === 0) {
  throw new Error('プロジェクト名は必須です');
}
```

**バリデーション項目:**
- 必須チェック
- 長さ制限チェック
- 空白のトリミング
- データ型の検証

#### 3. **returning()の活用**

```typescript
.returning();
```

**利点:**
- 作成/更新/削除したデータを即座に取得
- 追加のSELECTクエリ不要
- パフォーマンス向上

---

## Neon PostgreSQL セットアップ手順

### ステップ1: Neonアカウント作成

1. **Neon公式サイトにアクセス**
   - URL: https://neon.tech

2. **サインアップ**
   - GitHubアカウントで登録（推奨）
   - または、メールアドレスで登録

3. **アカウント認証**
   - メール認証を完了

### ステップ2: プロジェクト作成

1. **ダッシュボードにログイン**
   - https://console.neon.tech

2. **「Create a project」をクリック**

3. **プロジェクト設定**
   - **Project name**: `nocode-ui-builder`
   - **PostgreSQL version**: `16`（最新版を選択）
   - **Region**: `US East (Ohio)` または 最寄りのリージョン
     - **日本から近いリージョン:**
       - `Asia Pacific (Singapore)` - 推奨
       - `Asia Pacific (Sydney)`

4. **「Create project」をクリック**

### ステップ3: 接続文字列の取得

プロジェクト作成後、自動的に接続情報が表示されます。

1. **Connection Stringをコピー**

   表示例:
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. **接続情報の構成要素**

   ```
   postgresql://[username]:[password]@[host]/[database]?sslmode=require
   ```

   - **username**: Neonが自動生成したユーザー名
   - **password**: Neonが自動生成したパスワード
   - **host**: Neonエンドポイント
   - **database**: データベース名（デフォルト: `neondb`）
   - **sslmode=require**: SSL接続必須

### ステップ4: データベース作成（オプション）

デフォルトの`neondb`を使用する場合はスキップできます。

1. **SQL Editorを開く**
   - ダッシュボードの「SQL Editor」タブをクリック

2. **データベース作成**

   ```sql
   CREATE DATABASE nocode_ui_builder;
   ```

3. **接続文字列を更新**

   データベース名を変更:
   ```
   postgresql://username:password@host/nocode_ui_builder?sslmode=require
   ```

### ステップ5: テーブル作成

1. **SQL Editorで実行**

   ```sql
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     description TEXT,
     canvas_data JSONB NOT NULL DEFAULT '{"components": []}'::jsonb,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
   );

   -- インデックス作成
   CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
   CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);

   -- 更新日時自動更新トリガー
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER update_projects_updated_at
     BEFORE UPDATE ON projects
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```

2. **実行確認**

   ```sql
   -- テーブル確認
   \dt

   -- テーブル構造確認
   \d projects
   ```

### ステップ6: Drizzle Kitでマイグレーション（推奨方法）

SQL Editorの代わりに、Drizzle Kitを使用する方法:

1. **Drizzle設定ファイル作成: `drizzle.config.ts`**

   ```typescript
   import type { Config } from 'drizzle-kit';
   import * as dotenv from 'dotenv';

   dotenv.config({ path: '.env.local' });

   export default {
     schema: './src/lib/db/schema.ts',
     out: './drizzle',
     driver: 'pg',
     dbCredentials: {
       connectionString: process.env.DATABASE_URL!,
     },
   } satisfies Config;
   ```

2. **マイグレーションファイル生成**

   ```bash
   npx drizzle-kit generate:pg
   ```

   `drizzle/`ディレクトリにSQLファイルが生成されます。

3. **マイグレーション実行**

   ```bash
   npx drizzle-kit push:pg
   ```

4. **Drizzle Studio起動（GUI管理）**

   ```bash
   npx drizzle-kit studio
   ```

   ブラウザで `https://local.drizzle.studio` が開きます。

---

## 環境変数設定

### `.env.local` ファイル作成

プロジェクトルートに`.env.local`ファイルを作成します。

```env
# Neon PostgreSQL接続文字列
DATABASE_URL="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Node環境
NODE_ENV="development"

# Next.js設定（オプション）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 環境変数の検証

`.env.local`が正しく読み込まれているか確認:

```bash
# .env.localの内容を表示（パスワードは隠される）
npm run env-check
```

`package.json`に追加:

```json
{
  "scripts": {
    "env-check": "node -e \"console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':****@'))\""
  }
}
```

### Vercelへの環境変数設定

1. **Vercelダッシュボードを開く**
   - https://vercel.com/dashboard

2. **プロジェクトを選択**

3. **Settings → Environment Variables**

4. **環境変数を追加**
   - **Key**: `DATABASE_URL`
   - **Value**: Neonの接続文字列
   - **Environment**: すべてを選択（Production, Preview, Development）

5. **Save**

### `.gitignore`の確認

機密情報がGitにコミットされないよう確認:

```gitignore
# 環境変数
.env
.env.local
.env.*.local

# Drizzleマイグレーション（オプション）
drizzle/*.sql
```

---

## トラブルシューティング

### 問題1: DATABASE_URL is not defined

**エラーメッセージ:**
```
Error: DATABASE_URL is not defined. Please set it in .env.local file.
```

**解決方法:**

1. `.env.local`ファイルが存在するか確認
   ```bash
   ls -la .env.local
   ```

2. ファイルが存在しない場合は作成
   ```bash
   touch .env.local
   ```

3. DATABASE_URLを設定
   ```env
   DATABASE_URL="postgresql://..."
   ```

4. 開発サーバーを再起動
   ```bash
   npm run dev
   ```

### 問題2: SSL接続エラー

**エラーメッセージ:**
```
Error: no pg_hba.conf entry for host "xxx.xxx.xxx.xxx", user "username", database "neondb", SSL off
```

**原因:**
Neonは常にSSL接続を要求します。

**解決方法:**

接続文字列に`?sslmode=require`を追加:

```env
DATABASE_URL="postgresql://username:password@host/db?sslmode=require"
```

### 問題3: 接続タイムアウト

**エラーメッセージ:**
```
Error: connect ETIMEDOUT
```

**原因:**
- ネットワークの問題
- ファイアウォールのブロック
- Neonプロジェクトがサスペンド状態

**解決方法:**

1. **Neonダッシュボードでプロジェクトを確認**
   - プロジェクトが「Active」状態か確認
   - サスペンド状態の場合、アクセスすると自動的に起動

2. **接続文字列を再確認**
   - Neonダッシュボードから最新の接続文字列をコピー

3. **ネットワーク確認**
   ```bash
   ping ep-cool-darkness-123456.us-east-2.aws.neon.tech
   ```

4. **VPNやプロキシの無効化**
   - 企業ネットワークの場合、PostgreSQLポート（5432）がブロックされている可能性

### 問題4: テーブルが見つからない

**エラーメッセージ:**
```
Error: relation "projects" does not exist
```

**原因:**
テーブルがまだ作成されていません。

**解決方法:**

1. **Drizzle Kitでマイグレーション実行**
   ```bash
   npx drizzle-kit push:pg
   ```

2. **または、SQL Editorで直接作成**
   - Neonダッシュボード → SQL Editor
   - テーブル作成SQLを実行

3. **テーブルの存在確認**
   ```bash
   npx drizzle-kit studio
   ```

### 問題5: 認証エラー

**エラーメッセージ:**
```
Error: password authentication failed for user "username"
```

**原因:**
パスワードが間違っているか、接続文字列が古い。

**解決方法:**

1. **Neonダッシュボードで接続文字列を再取得**
   - Project → Connection Details
   - 「Generate new password」をクリック（必要に応じて）

2. **`.env.local`を更新**

3. **特殊文字のエスケープ確認**
   - パスワードに`@`、`:`、`/`などの特殊文字が含まれる場合、URLエンコードが必要

   例:
   ```
   パスワード: p@ss:word/123
   エンコード後: p%40ss%3Aword%2F123
   ```

### 問題6: JSONBデータの取得エラー

**エラーメッセージ:**
```
Error: invalid input syntax for type json
```

**原因:**
canvas_dataに無効なJSON文字列が保存されている。

**解決方法:**

1. **データの検証**
   ```sql
   SELECT id, name, canvas_data FROM projects WHERE id = 'your-project-id';
   ```

2. **JSONの修正**
   ```sql
   UPDATE projects
   SET canvas_data = '{"components": []}'::jsonb
   WHERE id = 'your-project-id';
   ```

3. **アプリケーション側でバリデーション追加**
   ```typescript
   // queries.tsのcreateProject関数
   if (data.canvasData) {
     try {
       JSON.stringify(data.canvasData);
     } catch {
       throw new Error('無効なcanvasDataです');
     }
   }
   ```

### 問題7: Drizzle Kitコマンドが動作しない

**エラーメッセージ:**
```
Error: Cannot find module 'drizzle-kit'
```

**解決方法:**

1. **パッケージのインストール確認**
   ```bash
   npm install drizzle-orm drizzle-kit @neondatabase/serverless -D
   ```

2. **バージョン確認**
   ```bash
   npx drizzle-kit --version
   ```

3. **node_modulesの再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### デバッグのヒント

#### 1. **Drizzle Studioでデータ確認**

```bash
npx drizzle-kit studio
```

ブラウザでデータベースの内容を視覚的に確認できます。

#### 2. **SQLクエリのログ出力**

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(sql, {
  schema,
  logger: true, // SQLクエリをコンソールに出力
});
```

#### 3. **接続テストスクリプト**

`scripts/test-db-connection.ts`:

```typescript
import { db } from '../src/lib/db';
import { projects } from '../src/lib/db/schema';

async function testConnection() {
  try {
    console.log('Testing database connection...');

    const result = await db.select().from(projects).limit(1);

    console.log('✅ Connection successful!');
    console.log('Projects count:', result.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
```

実行:
```bash
npx tsx scripts/test-db-connection.ts
```

---

## まとめ

このドキュメントでは、Drizzle ORMとNeon PostgreSQLを使用したデータベース基盤の完全な実装方法を解説しました。

### 実装したファイル

1. **`src/lib/db/schema.ts`** - データベーススキーマ定義
2. **`src/lib/db/index.ts`** - データベース接続設定
3. **`src/lib/db/queries.ts`** - CRUD操作関数

### 主要な概念

- **型安全性**: TypeScriptの型推論を活用
- **JSONB活用**: 柔軟なデータ構造の保存
- **エラーハンドリング**: 一貫したエラー処理パターン
- **インデックス最適化**: クエリパフォーマンスの向上

### 次のステップ

次のドキュメント「20251021_04-api-routes.md」では、これらのクエリ関数を使用してRESTful APIを実装します。
