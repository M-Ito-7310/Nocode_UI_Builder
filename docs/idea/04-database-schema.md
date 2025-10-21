# Database Schema

## データベース概要

NoCode UI Builderは、Neon PostgreSQLをデータベースとして使用します。プロジェクトデータを永続化し、再編集やエクスポートを可能にします。

### 使用技術
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Migration**: Drizzle Kit

---

## テーブル設計

### 1. projects テーブル

プロジェクトの基本情報とキャンバスデータを保存します。

#### スキーマ定義

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  canvas_data JSONB NOT NULL DEFAULT '{"components": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
```

#### カラム詳細

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| id | UUID | NO | gen_random_uuid() | プロジェクト一意識別子 |
| name | VARCHAR(255) | NO | - | プロジェクト名 |
| description | TEXT | YES | NULL | プロジェクト説明 |
| canvas_data | JSONB | NO | {"components": []} | キャンバス上のWidget配置情報 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | NOW() | 更新日時 |

---

## canvas_data (JSONB) 構造

### スキーマ

```typescript
interface CanvasData {
  components: CanvasComponent[];
  settings?: CanvasSettings;
}

interface CanvasComponent {
  id: string;                    // Widget固有ID (UUID)
  type: WidgetType;              // Widget種類
  position: {
    x: number;                   // X座標 (px)
    y: number;                   // Y座標 (px)
  };
  size: {
    width: number;               // 幅 (px)
    height: number;              // 高さ (px)
  };
  props: Record<string, any>;    // Widget固有のプロパティ
  zIndex?: number;               // 重なり順序（将来的）
}

interface CanvasSettings {
  backgroundColor?: string;      // 背景色
  width?: number;                // キャンバス幅
  height?: number;               // キャンバス高さ
}

type WidgetType = 'Text' | 'Input' | 'Button' | 'Image' | 'Table' | 'Select';
```

### 例: canvas_data の実データ

```json
{
  "components": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "Text",
      "position": { "x": 100, "y": 50 },
      "size": { "width": 200, "height": 30 },
      "props": {
        "content": "Welcome to NoCode UI Builder",
        "fontSize": 24,
        "color": "#1F2937",
        "fontWeight": "bold",
        "textAlign": "center"
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "Button",
      "position": { "x": 120, "y": 120 },
      "size": { "width": 160, "height": 48 },
      "props": {
        "text": "Get Started",
        "variant": "primary",
        "size": "medium",
        "color": "#3B82F6",
        "textColor": "#FFFFFF",
        "borderRadius": 8
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "type": "Input",
      "position": { "x": 100, "y": 200 },
      "size": { "width": 300, "height": 40 },
      "props": {
        "label": "Email Address",
        "placeholder": "Enter your email...",
        "inputType": "email",
        "required": true,
        "width": 300
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "type": "Table",
      "position": { "x": 50, "y": 300 },
      "size": { "width": 500, "height": 200 },
      "props": {
        "columns": [
          { "key": "id", "label": "ID", "width": 60 },
          { "key": "name", "label": "Name", "width": 200 },
          { "key": "status", "label": "Status", "width": 120 }
        ],
        "data": [
          { "id": 1, "name": "Project Alpha", "status": "Active" },
          { "id": 2, "name": "Project Beta", "status": "Pending" },
          { "id": 3, "name": "Project Gamma", "status": "Completed" }
        ],
        "striped": true,
        "bordered": true,
        "hoverable": true,
        "headerBgColor": "#F3F4F6",
        "headerTextColor": "#111827"
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

---

## Drizzle ORM スキーマ定義

### lib/db/schema.ts

```typescript
import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  canvasData: jsonb('canvas_data').notNull().default({ components: [] }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
```

---

## データベース接続設定

### 環境変数 (.env.local)

```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Neon無料枠の制限
- **Storage**: 最大 0.5 GB
- **Compute**: 191.9 時間/月
- **Branches**: 10個まで
- **Connections**: 制限あり

### lib/db/index.ts

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Neon SQL Client
const sql = neon(process.env.DATABASE_URL!);

// Drizzle ORM Instance
export const db = drizzle(sql, { schema });
```

---

## マイグレーション

### drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### マイグレーションコマンド

```bash
# スキーマからマイグレーションファイル生成
npx drizzle-kit generate:pg

# マイグレーション実行
npx drizzle-kit push:pg

# Drizzle Studio起動（GUI管理ツール）
npx drizzle-kit studio
```

---

## CRUD操作例

### lib/db/queries.ts

```typescript
import { db } from './index';
import { projects } from './schema';
import { eq, desc } from 'drizzle-orm';

// プロジェクト一覧取得（最新10件）
export async function getRecentProjects(limit = 10) {
  return await db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt))
    .limit(limit);
}

// プロジェクト取得（ID指定）
export async function getProjectById(id: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return result[0] || null;
}

// プロジェクト作成
export async function createProject(data: {
  name: string;
  description?: string;
  canvasData?: any;
}) {
  const result = await db
    .insert(projects)
    .values({
      name: data.name,
      description: data.description,
      canvasData: data.canvasData || { components: [] },
    })
    .returning();

  return result[0];
}

// プロジェクト更新
export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    canvasData?: any;
  }
) {
  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  return result[0] || null;
}

// プロジェクト削除
export async function deleteProject(id: string) {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  return result[0] || null;
}
```

---

## API Route実装例

### app/api/projects/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getRecentProjects, createProject } from '@/lib/db/queries';

// GET /api/projects - プロジェクト一覧取得
export async function GET() {
  try {
    const projects = await getRecentProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - プロジェクト作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, canvasData } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const project = await createProject({ name, description, canvasData });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

### app/api/projects/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/queries';

// GET /api/projects/[id] - プロジェクト取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - プロジェクト更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, canvasData } = body;

    const project = await updateProject(params.id, {
      name,
      description,
      canvasData,
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - プロジェクト削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await deleteProject(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
```

---

## 将来的な拡張（スコープ外）

### 1. users テーブル（認証機能追加時）

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- projectsにuser_id追加
ALTER TABLE projects ADD COLUMN user_id UUID REFERENCES users(id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
```

### 2. project_versions テーブル（バージョン管理）

```sql
CREATE TABLE project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  canvas_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, version_number)
);

CREATE INDEX idx_versions_project_id ON project_versions(project_id);
```

### 3. templates テーブル（テンプレート機能）

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  canvas_data JSONB NOT NULL,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category);
```

---

## パフォーマンス最適化

### JSONBクエリ最適化

```sql
-- canvas_data内の特定Widget種類を検索
CREATE INDEX idx_canvas_components_type
  ON projects USING GIN ((canvas_data -> 'components'));

-- 例: Buttonウィジェットを含むプロジェクトを検索
SELECT * FROM projects
WHERE canvas_data @> '{"components": [{"type": "Button"}]}';
```

### 自動更新タイムスタンプ

```sql
-- updated_at自動更新トリガー
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

---

## データバックアップ戦略

### Neonの自動バックアップ
- Neonは自動的にポイントインタイムリカバリをサポート
- 過去7日間のデータを復元可能（有料プランでは30日間）

### 手動バックアップ

```bash
# pg_dumpでバックアップ
pg_dump $DATABASE_URL > backup.sql

# リストア
psql $DATABASE_URL < backup.sql
```
