'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * Conditional Footer Component
 * パスに応じてフッターの表示を制御するコンポーネント
 * プレビュー画面ではフッターを表示しない
 */
export function ConditionalFooter() {
  const pathname = usePathname();

  // プレビュー画面ではフッターを表示しない
  if (pathname?.startsWith('/preview')) {
    return null;
  }

  return <Footer />;
}
