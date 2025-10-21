import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * 環境変数の検証
 *
 * DATABASE_URLが設定されていない場合はエラーを投げます。
 * ビルド時はスキップします。
 */
const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL && process.env.NODE_ENV !== 'production') {
  // ビルド時やテスト時はワーニングのみ
  if (typeof window === 'undefined' && !process.env.NEXT_PHASE) {
    console.warn(
      'DATABASE_URL is not defined. Please set it in .env.local file.\n' +
      'Example: DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"'
    );
  }
}

/**
 * Neon SQLクライアント
 *
 * HTTPベースのPostgreSQLクライアント。
 * Vercel Edge Functionsやその他のエッジ環境で動作します。
 */
const sql = DATABASE_URL ? neon(DATABASE_URL) : neon('postgresql://dummy:dummy@localhost/dummy');

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
