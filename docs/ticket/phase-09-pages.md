# Phase 9: ページ実装（Next.js App Router）

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 30-45分
**実績時間**: -
**依存**: Phase 8（ビルダーコンポーネント完了）
**優先度**: High

## 📋 概要

Next.js 14 App Routerを使用した全ページの実装を行います。ルートレイアウト、ランディングページ、ビルダーページ、プレビューページを作成し、SEO最適化とメタデータ設定を行います。

### 主な実装内容

- **layout.tsx**: ルートレイアウト、メタデータ、Google Fonts読み込み
- **page.tsx**: ランディングページ（ヒーロー、機能紹介、CTA）
- **builder/page.tsx**: ビルダーメインページ（完全な状態管理とdnd-kit統合）
- **preview/[id]/page.tsx**: プレビューページ（動的ルート、データ読み込み）
- **globals.css**: Tailwind設定とカスタムスタイル

## ✅ タスクチェックリスト

### 1. ルートレイアウト実装
- [ ] `src/app/layout.tsx` 作成
- [ ] メタデータ設定（title, description, OG tags）
- [ ] Google Fonts（Inter）読み込み設定
- [ ] グローバルCSS読み込み
- [ ] HTML lang属性設定（ja）
- [ ] Google Analytics設定（オプション）

### 2. ランディングページ実装
- [ ] `src/app/page.tsx` 作成
- [ ] ヘッダー実装（ロゴ、ナビゲーション）
- [ ] ヒーローセクション実装（キャッチコピー、CTA）
- [ ] 機能紹介セクション実装（6つの主要機能）
- [ ] CTAセクション実装（行動喚起）
- [ ] フッター実装
- [ ] レスポンシブ対応確認

### 3. ビルダーページ実装
- [ ] `src/app/builder/page.tsx` 作成
- [ ] Client Component設定（'use client'）
- [ ] 状態管理実装（widgets, selectedWidgetId, projectName）
- [ ] dnd-kit統合（DndContext, sensors）
- [ ] ドラッグ&ドロップハンドラ実装
- [ ] Widget追加ロジック実装
- [ ] Widget更新/削除ロジック実装
- [ ] ローカルストレージ連携（自動保存）
- [ ] 保存/プレビュー/エクスポート機能実装
- [ ] 3カラムレイアウト実装（パレット、キャンバス、プロパティ）

### 4. プレビューページ実装
- [ ] `src/app/preview/[id]/page.tsx` 作成
- [ ] 動的ルート設定
- [ ] プレビューデータ読み込み実装
- [ ] SessionStorage連携（一時プレビュー）
- [ ] Widget レンダリング実装
- [ ] ローディング状態実装
- [ ] エラーハンドリング実装
- [ ] プレビューヘッダー実装

### 5. グローバルスタイル設定
- [ ] `src/app/globals.css` 作成
- [ ] Tailwind ディレクティブ設定
- [ ] カスタムプロパティ定義
- [ ] スクロールバースタイル設定
- [ ] キャンバスグリッドスタイル設定
- [ ] リサイズハンドルスタイル設定
- [ ] アニメーション定義（fadeIn, slideIn）
- [ ] カスタムコンポーネントクラス定義

### 6. SEO最適化
- [ ] 各ページのメタデータ設定
- [ ] Open Graph画像設定
- [ ] Twitter Card設定
- [ ] robots.txt対応
- [ ] sitemap.xml生成設定
- [ ] favicon設定

### 7. ナビゲーション実装
- [ ] Next.js Linkコンポーネント使用
- [ ] プログラマティックナビゲーション実装
- [ ] 動的ルートパラメータ取得
- [ ] ページ間遷移確認

### 8. テスト・確認
- [ ] 各ページの表示確認
- [ ] ルーティング動作確認
- [ ] レスポンシブデザイン確認
- [ ] ビルダー統合テスト
- [ ] TypeScriptエラー解消
- [ ] ESLintエラー解消

## 📦 成果物

- [ ] `src/app/layout.tsx` (約200行)
- [ ] `src/app/page.tsx` (約520行、ランディングページ)
- [ ] `src/app/builder/page.tsx` (約860行、ビルダーメイン)
- [ ] `src/app/preview/[id]/page.tsx` (約130行)
- [ ] `src/app/globals.css` (約290行)
- [ ] `src/lib/widget-utils.ts` (ヘルパー関数)
- [ ] `src/lib/widget-renderer.tsx` (Widget レンダリング)

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_09-pages-implementation.md)
- [Next.js 14公式ドキュメント](https://nextjs.org/docs)
- [App Router移行ガイド](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

## 📝 メモ・コメント

### 実装時の注意点

1. **Server Components vs Client Components**
   - layout.tsxとpage.tsx（ランディング）はServer Component
   - builder/page.tsxとpreview/[id]/page.tsxはClient Component（'use client'必須）

2. **メタデータAPI**
   - 静的メタデータはexport const metadata
   - 動的メタデータはgenerateMetadata関数を使用

3. **ローカルストレージ**
   - Client Componentでのみ使用可能
   - useEffect内で安全に読み書き

4. **dnd-kit統合**
   - builder/page.tsxで完全なドラッグ&ドロップ実装
   - DndContext、DragOverlayコンポーネント使用

### 参考コード例

```typescript
// layout.tsx - メタデータ設定例
export const metadata: Metadata = {
  title: {
    default: 'NoCode UI Builder',
    template: '%s | NoCode UI Builder',
  },
  description: 'ドラッグ&ドロップでWebUIを作成',
};

// builder/page.tsx - 状態管理例
const [widgets, setWidgets] = useState<Widget[]>([]);
const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

// preview/[id]/page.tsx - 動的ルート例
const params = useParams();
const id = params.id;
```

### トラブルシューティング

- **Hydration Error**: Client Componentで useEffect を使用してローカルストレージにアクセス
- **メタデータが反映されない**: ビルド後に確認（dev環境では遅延する場合あり）
- **動的ルートが動作しない**: ファイル名が `[id]` になっているか確認

## ✅ 完了条件

- [ ] 全ページ（layout, page, builder, preview）が正常に表示される
- [ ] ルーティングが正しく動作する（/, /builder, /preview/[id]）
- [ ] ビルダーページでドラッグ&ドロップが動作する
- [ ] プレビューページでプロジェクトが正しく表示される
- [ ] レスポンシブデザインが適用されている（モバイル、タブレット、デスクトップ）
- [ ] SEO最適化が完了している（メタデータ、OGタグ）
- [ ] TypeScriptエラーが0件
- [ ] ESLintエラーが0件
- [ ] `npm run build` が成功する
- [ ] 実装ドキュメントの内容と一致している

---

**作成日**: 2025年10月21日
**最終更新**: 2025年10月21日
