/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Modeを有効化（開発時の警告検出）
  reactStrictMode: true,

  // 画像最適化設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 環境変数の公開設定
  env: {
    NEXT_PUBLIC_APP_NAME: 'NoCode UI Builder',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },

  // 本番ビルド最適化
  swcMinify: true,

  // 実験的機能（必要に応じて有効化）
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },

  // 型チェックとLintをビルド時に実行
  typescript: {
    // 本番ビルド時に型エラーを無視しない
    ignoreBuildErrors: false,
  },
  eslint: {
    // 本番ビルド時にLintエラーを無視しない
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
