import Link from 'next/link';
import type { Metadata } from 'next';
import ParticleBackground from '@/components/ParticleBackground';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'ホーム',
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ParticleBackground />
      <Header variant="transparent" />

      {/* ヒーローセクション */}
      <section className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* バッジ */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>ノーコードで簡単UI作成</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            プログラミング不要で
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              美しいUIを作成
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            ドラッグ&ドロップの直感的な操作でWebUIを作成。
            プロトタイピングから本番環境まで、あらゆるシーンで活用できます。
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              無料で始める
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              機能を見る
            </a>
          </div>

          {/* スクリーンショット */}
          <div className="mt-16 rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <img
              src="/ビルダースクリーンショット.png"
              alt="NoCode UI Builder スクリーンショット"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* 主要機能セクション */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            主要機能
          </h2>
          <p className="text-xl text-gray-600">
            直感的で強力な機能を搭載
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 機能1: ドラッグ&ドロップ */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ドラッグ&ドロップ
            </h3>
            <p className="text-gray-600 leading-relaxed">
              6種類のWidgetをキャンバスにドラッグするだけ。
              直感的な操作でUIを構築できます。
            </p>
          </div>

          {/* 機能2: リアルタイム編集 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              リアルタイム編集
            </h3>
            <p className="text-gray-600 leading-relaxed">
              プロパティパネルで色、サイズ、テキストを編集。
              変更は即座にキャンバスに反映されます。
            </p>
          </div>

          {/* 機能3: HTML/CSSエクスポート */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              HTML/CSS出力
            </h3>
            <p className="text-gray-600 leading-relaxed">
              作成したUIを標準的なHTML/CSSとして出力。
              既存のプロジェクトに組み込めます。
            </p>
          </div>

          {/* 機能4: 6種類のWidget */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              豊富なWidget
            </h3>
            <p className="text-gray-600 leading-relaxed">
              テキスト、ボタン、入力、画像、テーブル、セレクト。
              必要なコンポーネントが揃っています。
            </p>
          </div>

          {/* 機能5: 自由配置 */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              自由なレイアウト
            </h3>
            <p className="text-gray-600 leading-relaxed">
              ピクセル単位で自由に配置・リサイズ。
              あなたのアイデアを形にできます。
            </p>
          </div>

          {/* 機能6: プレビュー */}
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              リアルタイムプレビュー
            </h3>
            <p className="text-gray-600 leading-relaxed">
              いつでも実際の表示を確認可能。
              完成イメージを見ながら作業できます。
            </p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            登録不要、完全無料でご利用いただけます
          </p>
          <Link
            href="/builder"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ビルダーを開く →
          </Link>
        </div>
      </section>
    </div>
  );
}
