import Link from 'next/link';

/**
 * Footer Component
 * 全ページ共通で表示されるフッターコンポーネント
 * Kaleido Futureが運営する旨と、利用規約・プライバシーポリシーへのリンクを表示
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* ブランド情報 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-white font-semibold text-lg">
                NoCode UI Builder
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              プログラミング不要でWebUIを作成できる
              <br />
              ノーコードビルダー
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="text-white font-semibold mb-4">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="text-sm hover:text-white transition-colors"
                >
                  ビルダー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* 運営情報 */}
          <div>
            <h3 className="text-white font-semibold mb-4">運営</h3>
            <p className="text-sm text-gray-400">
              <span className="text-white font-medium">Kaleido Future</span>
              <br />
              本サービスはKaleido Futureが運営しています。
            </p>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} NoCode UI Builder. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Operated by{' '}
              <span className="text-white font-medium">Kaleido Future</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
