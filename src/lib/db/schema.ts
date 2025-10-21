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
      // インデックス: 作成日時でソート最適化
      createdAtIdx: index('idx_projects_created_at').on(table.createdAt),

      // インデックス: 更新日時でソート最適化
      updatedAtIdx: index('idx_projects_updated_at').on(table.updatedAt),
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
