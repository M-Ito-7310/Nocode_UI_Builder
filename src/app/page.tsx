import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary-600">
          NoCode UI Builder
        </h1>
        <p className="mb-8 text-xl text-secondary-600">
          ドラッグ&ドロップでWebインターフェースを作成
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/builder"
            className="rounded-lg bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl"
          >
            ビルダーを開く
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-2 border-primary-500 px-8 py-4 text-lg font-semibold text-primary-500 transition-all hover:bg-primary-50"
          >
            GitHub
          </a>
        </div>

        <div className="mt-16 grid gap-6 text-left md:grid-cols-3">
          <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-primary-600">
              🎨 ドラッグ&ドロップ
            </h2>
            <p className="text-secondary-600">
              直感的なインターフェースでコンポーネントを配置
            </p>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-primary-600">
              📦 6種類のWidget
            </h2>
            <p className="text-secondary-600">
              Text、Input、Button、Image、Table、Select
            </p>
          </div>

          <div className="rounded-lg border border-secondary-200 bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-primary-600">
              💾 データベース連携
            </h2>
            <p className="text-secondary-600">
              Neon PostgreSQLでプロジェクトを保存
            </p>
          </div>
        </div>

        <footer className="mt-16 text-sm text-secondary-400">
          <p>Powered by Next.js 14 + TypeScript + Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
