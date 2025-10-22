import Link from 'next/link';

/**
 * Header Component
 * 全ページ共通で表示されるヘッダーコンポーネント
 *
 * @param variant - ヘッダーのスタイルバリエーション
 *   - 'transparent': トップページ用（背景なし、ビルダーボタン付き）
 *   - 'white': その他のページ用（白背景、ホームリンク付き）
 */

type HeaderProps = {
  variant?: 'transparent' | 'white';
};

export function Header({ variant = 'transparent' }: HeaderProps) {
  const isTransparent = variant === 'transparent';

  return (
    <header
      className={`relative z-10 ${
        isTransparent
          ? 'container mx-auto px-6 py-6'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className={isTransparent ? '' : 'container mx-auto px-6 py-4'}>
        <nav className="flex items-center justify-between">
          {/* ロゴとサービス名 */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div
              className={`${
                isTransparent ? 'w-10 h-10' : 'w-8 h-8'
              } bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center`}
            >
              <span
                className={`text-white font-bold ${
                  isTransparent ? 'text-xl' : 'text-lg'
                }`}
              >
                N
              </span>
            </div>
            <span
              className={`${
                isTransparent ? 'text-xl' : 'text-xl'
              } font-bold text-gray-900`}
            >
              NoCode UI Builder
            </span>
          </Link>

          {/* トップページの場合のみビルダーボタンを表示 */}
          {isTransparent && (
            <Link
              href="/builder"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              ビルダーを開く
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
