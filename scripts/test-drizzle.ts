// Drizzle ORM接続テストスクリプト
// CRUD操作の完全なテスト (Create, Read, Update, Delete)

import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testDrizzle() {
  try {
    console.log('🔧 Drizzle ORM接続テスト開始...\n');

    // 1. 全プロジェクト取得
    console.log('1️⃣ 全プロジェクト取得');
    const allProjects = await db.select().from(projects);
    console.log(`✅ ${allProjects.length}件のプロジェクトが見つかりました`);
    if (allProjects.length > 0) {
      console.log('   最新のプロジェクト:');
      console.log(`   - ${allProjects[0].name} (${allProjects[0].id})`);
    }
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
          {
            id: 'test-widget-2',
            type: 'Button',
            position: { x: 100, y: 200 },
            size: { width: 200, height: 50 },
            props: {
              text: 'クリック',
              variant: 'primary',
            },
          },
        ],
      },
    }).returning();
    console.log('✅ プロジェクト作成成功!');
    console.log(`   ID: ${newProject[0].id}`);
    console.log(`   名前: ${newProject[0].name}`);
    console.log(`   説明: ${newProject[0].description}`);
    console.log(`   Widget数: ${newProject[0].canvasData.components.length}`);
    console.log('');

    // 3. 作成したプロジェクトを取得
    console.log('3️⃣ 作成したプロジェクトを取得');
    const fetchedProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, newProject[0].id));
    console.log('✅ プロジェクト取得成功!');
    console.log(`   名前: ${fetchedProject[0].name}`);
    console.log(`   Canvas Data:`, JSON.stringify(fetchedProject[0].canvasData, null, 2));
    console.log('');

    // 4. プロジェクト更新
    console.log('4️⃣ プロジェクト更新');
    const updatedProject = await db
      .update(projects)
      .set({
        description: '更新されたテストプロジェクト - CRUD操作テスト完了',
        canvasData: {
          components: [
            ...fetchedProject[0].canvasData.components,
            {
              id: 'test-widget-3',
              type: 'Input',
              position: { x: 100, y: 300 },
              size: { width: 300, height: 40 },
              props: {
                placeholder: '新しいWidget追加',
                inputType: 'text',
              },
            },
          ],
        },
        updatedAt: new Date(),
      })
      .where(eq(projects.id, newProject[0].id))
      .returning();
    console.log('✅ プロジェクト更新成功!');
    console.log(`   新しい説明: ${updatedProject[0].description}`);
    console.log(`   Widget数: ${updatedProject[0].canvasData.components.length} (1つ追加)`);
    console.log('');

    // 5. 検索テスト
    console.log('5️⃣ 検索テスト');
    const searchResults = await db
      .select()
      .from(projects)
      .where(eq(projects.name, 'データベーステストプロジェクト'));
    console.log(`✅ 検索成功: ${searchResults.length}件見つかりました`);
    console.log('');

    // 6. プロジェクト削除
    console.log('6️⃣ プロジェクト削除');
    await db.delete(projects).where(eq(projects.id, newProject[0].id));
    console.log('✅ プロジェクト削除成功!');

    // 削除確認
    const deletedCheck = await db
      .select()
      .from(projects)
      .where(eq(projects.id, newProject[0].id));
    if (deletedCheck.length === 0) {
      console.log('   削除確認: プロジェクトが正しく削除されました');
    }
    console.log('');

    console.log('🎉 すべてのDrizzle ORMテストが成功しました!');
    console.log('');
    console.log('次のステップ:');
    console.log('1. npm run dev  # 開発サーバー起動');
    console.log('2. ブラウザで http://localhost:3000 を開く');
    console.log('3. ビルダーページでプロジェクトを作成・保存してみる');
    console.log('4. Drizzle Studioで確認: npx drizzle-kit studio');

  } catch (error) {
    console.error('❌ エラー発生:', error);
    console.error('');
    console.error('トラブルシューティング:');
    console.error('1. マイグレーションが完了しているか確認してください');
    console.error('   npx drizzle-kit push');
    console.error('2. DATABASE_URLが正しいか確認してください');
    console.error('   npx tsx scripts/test-env.ts');
    console.error('3. 基本接続テストを実行してください');
    console.error('   npx tsx scripts/test-db-connection.ts');
    process.exit(1);
  }
}

testDrizzle();
