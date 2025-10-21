# Phase 8: ビルダーコンポーネント実装

**ステータス**: 🔴 未着手
**担当**: プロジェクトマネージャー + AIエージェント
**見積もり時間**: 60-90分
**実績時間**: -
**依存**: Phase 7
**優先度**: High

## 📋 概要

NoCode UI Builderのコア機能である、ビルダー画面の5つの主要コンポーネント（Canvas, WidgetPalette, WidgetWrapper, PropertiesPanel, Toolbar）を実装します。dnd-kitライブラリを使用したドラッグ&ドロップ、リサイズ、プロパティ編集、状態管理を含みます。

### 主要コンポーネント
1. **Canvas** - Widget配置エリア
2. **WidgetPalette** - Widgetパレット
3. **WidgetWrapper** - 個別Widget（選択、リサイズ、ドラッグ）
4. **PropertiesPanel** - プロパティ編集パネル
5. **Toolbar** - ツールバー（保存、プレビュー、エクスポート）

## ✅ タスクチェックリスト

### 準備・パッケージインストール
- [ ] `@dnd-kit/core` パッケージのインストール
- [ ] `@dnd-kit/utilities` パッケージのインストール
- [ ] ビルダーページ用のディレクトリ構造確認

### Canvas コンポーネント
- [ ] `src/components/builder/Canvas.tsx` 作成
- [ ] CanvasProps インターフェース定義
- [ ] useDroppable によるドロップ可能エリア設定
- [ ] グリッド背景表示実装
- [ ] 空状態表示実装
- [ ] キャンバスクリック時の選択解除実装
- [ ] ドロップハイライト実装（isOver状態）
- [ ] Widgetマッピングとレンダリング

### WidgetPalette コンポーネント
- [ ] `src/components/builder/WidgetPalette.tsx` 作成
- [ ] WidgetPaletteProps インターフェース定義
- [ ] 6種類のWidget定義（アイコン、ラベル、説明、色）
- [ ] DraggableWidgetItem コンポーネント実装
- [ ] useDraggable によるドラッグ可能設定
- [ ] ドラッグ中の視覚的フィードバック実装
- [ ] パレットレイアウト実装（スクロール対応）

### WidgetWrapper コンポーネント
- [ ] `src/components/builder/WidgetWrapper.tsx` 作成
- [ ] WidgetWrapperProps インターフェース定義
- [ ] useDraggable によるWidget移動実装
- [ ] 8方向リサイズハンドル実装（nw, ne, sw, se, n, s, e, w）
- [ ] リサイズロジック実装（最小サイズ制限）
- [ ] 選択状態の視覚表示（青い枠線）
- [ ] 削除ボタン実装
- [ ] キーボード操作実装（Delete/Backspace）
- [ ] Widget情報ツールチップ実装（ホバー時）
- [ ] Widgetレンダリング統合

### PropertiesPanel コンポーネント
- [ ] `src/components/builder/PropertiesPanel.tsx` 作成
- [ ] PropertiesPanelProps インターフェース定義
- [ ] 空状態表示実装
- [ ] 共通プロパティセクション実装（位置とサイズ）
- [ ] PropertySection コンポーネント実装
- [ ] 入力コンポーネント実装（TextInput, NumberInput等）
- [ ] ColorInput コンポーネント実装（カラーピッカー）
- [ ] SelectInput コンポーネント実装
- [ ] CheckboxInput コンポーネント実装
- [ ] RangeInput コンポーネント実装（スライダー）
- [ ] TextAreaInput コンポーネント実装

### PropertiesPanel - Widget別UI
- [ ] TextWidgetProperties コンポーネント実装
- [ ] InputWidgetProperties コンポーネント実装
- [ ] ButtonWidgetProperties コンポーネント実装
- [ ] ImageWidgetProperties コンポーネント実装
- [ ] TableWidgetProperties コンポーネント実装
- [ ] SelectWidgetProperties コンポーネント実装
- [ ] リアルタイム更新機能確認

### Toolbar コンポーネント
- [ ] `src/components/builder/Toolbar.tsx` 作成
- [ ] ToolbarProps インターフェース定義
- [ ] プロジェクト名表示と編集実装
- [ ] 保存ボタン実装（ローディング状態）
- [ ] 最終保存時刻表示実装（相対時間）
- [ ] プレビューボタン実装
- [ ] エクスポートボタン実装
- [ ] プロジェクト名インライン編集実装

### 状態管理とイベント処理
- [ ] Builder Page で状態管理実装（widgets, selectedWidgetId等）
- [ ] DndContext 統合実装
- [ ] handleDragStart イベント実装
- [ ] handleDragEnd イベント実装
- [ ] addWidget 関数実装
- [ ] updateWidget 関数実装
- [ ] deleteWidget 関数実装
- [ ] DragOverlay 実装

### ユーティリティとヘルパー
- [ ] `src/lib/widget-renderer.ts` 作成（Widget種類別レンダリング）
- [ ] getDefaultSize() 関数実装
- [ ] generateId() 関数実装（UUID生成）

### パフォーマンス最適化
- [ ] React.memo によるコンポーネント最適化
- [ ] useCallback によるイベントハンドラ最適化
- [ ] useMemo による計算結果キャッシュ
- [ ] カスタム比較関数実装（WidgetWrapper）

## 📦 成果物

### ビルダーコンポーネント（5種類）
- [ ] `src/components/builder/Canvas.tsx` - キャンバス
- [ ] `src/components/builder/WidgetPalette.tsx` - Widgetパレット
- [ ] `src/components/builder/WidgetWrapper.tsx` - Widgetラッパー
- [ ] `src/components/builder/PropertiesPanel.tsx` - プロパティパネル
- [ ] `src/components/builder/Toolbar.tsx` - ツールバー

### ページとユーティリティ
- [ ] `src/app/builder/page.tsx` - ビルダーページ（統合）
- [ ] `src/lib/widget-renderer.ts` - Widgetレンダラー

### スタイル
- [ ] `src/app/globals.css` - グリッド表示CSS（更新）

## 🔗 関連ドキュメント

- [実装ドキュメント](../implementation/20251021_08-builder-components.md)
- [アーキテクチャ](../idea/02-architecture.md)
- [Widget仕様書](../idea/03-widget-specifications.md)

## 📝 メモ・コメント

### 実装メモ
- dnd-kitの DndContext で全体を囲む
- Canvasは useDroppable、Paletteアイテムは useDraggable
- WidgetWrapperは移動とリサイズの両方を処理
- リサイズ中はドラッグを無効化（disabled）
- 最小サイズ: 幅50px、高さ30px

### dnd-kit イベントフロー
```
User Action (ドラッグ&ドロップ)
    ↓
DndContext イベント (onDragEnd)
    ↓
State 更新 (setWidgets)
    ↓
Canvas 再レンダリング
    ↓
WidgetWrapper 表示更新
```

### リサイズロジック
- 8方向のハンドル: 角4つ（nw, ne, sw, se）+ 辺4つ（n, s, e, w）
- マウスダウンで開始、マウスムーブで更新、マウスアップで終了
- deltaX, deltaY を計算してサイズと位置を更新
- 最小サイズに達したら位置を固定

### 状態管理
- widgets: Widget[] - すべてのWidget
- selectedWidgetId: string | null - 選択中のWidget ID
- activeId: string | null - ドラッグ中のWidget ID
- projectName: string - プロジェクト名

### パフォーマンス対策
- React.memo でコンポーネントをメモ化
- useCallback でイベントハンドラをメモ化
- useMemo で計算結果をキャッシュ
- カスタム比較関数で不要な再レンダリング防止

## ✅ 完了条件

- [ ] 全5つのビルダーコンポーネント（Canvas, WidgetPalette, WidgetWrapper, PropertiesPanel, Toolbar）実装完了
- [ ] ドラッグ&ドロップ動作確認（Paletteからcanvasへ）
- [ ] リサイズ動作確認（8方向すべて）
- [ ] プロパティ編集動作確認（リアルタイム更新）
- [ ] 選択・削除動作確認（クリック、キーボード）
- [ ] DndContext と dnd-kit 統合動作
- [ ] TypeScriptエラーなし
- [ ] パフォーマンス最適化実装（React.memo, useCallback, useMemo）
- [ ] 6種類すべてのWidgetがパレットに表示
- [ ] 各Widgetのプロパティパネルが動作
- [ ] Toolbarのすべてのボタンが動作（保存、プレビュー、エクスポート）
- [ ] レスポンシブレイアウト動作確認
