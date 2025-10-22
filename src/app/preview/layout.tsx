/**
 * Preview Layout
 * プレビュー画面専用のレイアウト
 * 共通フッターを表示せず、プレビューに集中できるシンプルなレイアウト
 */
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
