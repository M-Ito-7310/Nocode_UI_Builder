// 環境変数テストスクリプト
// DATABASE_URLが正しく読み込まれているか確認

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL が設定されていません');
  console.error('');
  console.error('以下の手順で設定してください:');
  console.error('1. プロジェクトルートに .env.local ファイルを作成');
  console.error('2. 以下の内容を記述:');
  console.error('   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"');
  console.error('');
  process.exit(1);
}

console.log('✅ DATABASE_URL が正しく読み込まれました');
console.log('');

// パスワード部分を隠して接続先を表示
const urlParts = process.env.DATABASE_URL.split('@');
if (urlParts.length === 2) {
  console.log('接続先:', urlParts[1]);
} else {
  console.log('接続文字列:', process.env.DATABASE_URL.substring(0, 20) + '...');
}

console.log('');
console.log('次のステップ:');
console.log('1. npx drizzle-kit generate  # マイグレーションファイル生成');
console.log('2. npx drizzle-kit push      # データベースに反映');
console.log('3. npx tsx scripts/test-db-connection.ts  # 接続テスト');
