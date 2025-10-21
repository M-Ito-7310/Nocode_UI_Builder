// データベース接続テストスクリプト
// Neon PostgreSQLへの基本接続、テーブル確認、構造確認を実行

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

// .env.local を読み込み
config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔌 データベース接続テスト開始...\n');

    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL が設定されていません');
      console.error('まず npx tsx scripts/test-env.ts を実行してください');
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

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
    if (tables.length === 0) {
      console.log('   (テーブルなし - マイグレーションを実行してください)');
    } else {
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    }
    console.log('');

    // 3. projectsテーブル構造確認
    console.log('3️⃣ projectsテーブル構造確認');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `;
    if (columns.length === 0) {
      console.log('⚠️  projectsテーブルが存在しません');
      console.log('   マイグレーションを実行してください:');
      console.log('   npx drizzle-kit generate');
      console.log('   npx drizzle-kit push');
    } else {
      console.log('✅ カラム一覧:');
      columns.forEach(c => {
        console.log(`   - ${c.column_name}: ${c.data_type} ${c.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    }
    console.log('');

    // 4. インデックス確認
    console.log('4️⃣ インデックス確認');
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'projects'
    `;
    if (indexes.length === 0) {
      console.log('   (インデックスなし)');
    } else {
      console.log('✅ インデックス一覧:');
      indexes.forEach(i => console.log(`   - ${i.indexname}`));
    }
    console.log('');

    console.log('🎉 すべてのテストが成功しました!');
    console.log('');
    console.log('次のステップ:');
    console.log('1. npx tsx scripts/test-drizzle.ts  # Drizzle ORM接続テスト');
    console.log('2. npm run dev  # 開発サーバー起動');
    console.log('3. API動作確認 (curl http://localhost:3000/api/projects)');

  } catch (error) {
    console.error('❌ エラー発生:', error);
    console.error('');
    console.error('トラブルシューティング:');
    console.error('1. DATABASE_URLが正しいか確認してください');
    console.error('2. Neonダッシュボードでデータベースがアクティブか確認してください');
    console.error('3. インターネット接続を確認してください');
    process.exit(1);
  }
}

testConnection();
