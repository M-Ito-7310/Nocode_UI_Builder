# Git管理とコミット戦略ガイド

**作成日**: 2025年10月21日
**Phase**: 13 - Git管理とバージョン管理戦略
**所要時間**: 1-2時間

---

## 目次

1. [Git管理の重要性](#1-git管理の重要性)
2. [コミットメッセージ規約](#2-コミットメッセージ規約)
3. [各Phase完了時のコミット](#3-各phase完了時のコミット)
4. [ブランチ戦略](#4-ブランチ戦略)
5. [.gitignore詳細設定](#5-gitignore詳細設定)
6. [コミット例集](#6-コミット例集)
7. [Git操作コマンド集](#7-git操作コマンド集)
8. [プルリクエストガイドライン](#8-プルリクエストガイドライン)
9. [緊急対応フロー](#9-緊急対応フロー)

---

## 1. Git管理の重要性

### 1.1 なぜGit管理が重要か

```
✅ バージョン管理
- コードの変更履歴を追跡
- いつでも過去の状態に戻せる
- 何が変更されたかが明確

✅ コラボレーション
- チームでの共同開発が可能
- コンフリクトの管理
- コードレビューの実施

✅ バックアップ
- リモートリポジトリに保存
- 複数の場所にコードが保管される
- データ損失のリスクを軽減

✅ デプロイの自動化
- GitHubとVercelの連携
- mainブランチへのマージで自動デプロイ
- CI/CDパイプラインの構築
```

### 1.2 本プロジェクトでのGit運用方針

| 項目 | 方針 |
|-----|------|
| メインブランチ | `main` (本番環境) |
| 開発ブランチ | `develop` (開発環境) |
| 機能ブランチ | `feature/*` (機能追加) |
| 修正ブランチ | `fix/*` (バグ修正) |
| コミット頻度 | こまめにコミット（1機能1コミット） |
| コミットメッセージ | Conventional Commits準拠 |
| プルリクエスト | 必須（セルフレビュー可） |

---

## 2. コミットメッセージ規約

### 2.1 Conventional Commits準拠

Conventional Commitsは、コミットメッセージの標準化されたフォーマットです。

#### 基本フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

**例**:

```
feat(builder): ドラッグ&ドロップ機能を実装

- dnd-kitライブラリを使用
- Widget一覧からキャンバスへのドロッグをサポート
- ドロップ位置の計算ロジックを追加

Closes #12
```

### 2.2 Type（種類）

| Type | 説明 | 使用例 |
|------|------|--------|
| `feat` | 新機能の追加 | 新しいWidgetの追加、新API実装 |
| `fix` | バグ修正 | ドラッグ位置のずれ修正、API エラー修正 |
| `docs` | ドキュメントのみの変更 | README更新、コメント追加 |
| `style` | コードの意味に影響しない変更 | フォーマット、セミコロン追加 |
| `refactor` | リファクタリング | コードの整理、関数の分割 |
| `perf` | パフォーマンス改善 | React.memo追加、最適化 |
| `test` | テストの追加・修正 | ユニットテスト追加 |
| `build` | ビルドシステムの変更 | package.json更新、webpack設定 |
| `ci` | CI/CD設定の変更 | GitHub Actions設定 |
| `chore` | その他の変更 | 依存関係更新、設定ファイル変更 |
| `revert` | 以前のコミットを取り消し | 特定機能の削除 |

### 2.3 Scope（範囲）

スコープは、変更が影響する範囲を示します。

**推奨スコープ一覧**:

```
- builder: ビルダー画面関連
- widget: Widget関連
- canvas: キャンバス関連
- properties: プロパティパネル関連
- project: プロジェクト管理関連
- api: API Routes関連
- db: データベース関連
- export: エクスポート機能関連
- ui: UIコンポーネント関連
- deps: 依存関係関連
- config: 設定ファイル関連
```

### 2.4 Subject（件名）

- **現在形**を使用: 「追加する」ではなく「追加」
- **日本語**または**英語**（プロジェクトで統一）
- **50文字以内**を目安
- **大文字で開始しない**（小文字で開始）
- **末尾にピリオドを付けない**

**良い例**:

```
feat(builder): ドラッグ&ドロップ機能を追加
fix(canvas): Widget位置計算のバグを修正
docs(readme): セットアップ手順を更新
```

**悪い例**:

```
feat: いろいろ変更した
fix: バグ直し
update: ファイル更新
```

### 2.5 Body（本文）

- 詳細な説明が必要な場合に記述
- **何を**変更したかではなく、**なぜ**変更したかを説明
- 空行で件名と区切る
- 箇条書き可

**例**:

```
feat(export): HTML/CSSエクスポート機能を実装

キャンバス上のWidget配置情報を元に、
スタンドアロンで動作するHTML/CSSファイルを生成する。

- Widget → HTML要素への変換ロジック
- インラインCSSの生成
- ファイルダウンロード機能
- エクスポートプレビュー機能

Refs: #23
```

### 2.6 Footer（フッター）

- Issue番号の参照
- Breaking Changes（破壊的変更）の記述

**例**:

```
Closes #42
Fixes #56
Refs #23

BREAKING CHANGE: Widget型の定義を変更
従来のWidgetDataインターフェースは非推奨
```

---

## 3. 各Phase完了時のコミット

### Phase 1: プロジェクトセットアップ

```bash
git add .
git commit -m "chore(setup): Next.js 14プロジェクトを初期化

- create-next-appでプロジェクト作成
- TypeScript、Tailwind CSS、ESLint設定
- プロジェクト構造の整備
- 初期依存パッケージのインストール

Phase 1完了"
```

### Phase 2: データベーススキーマ設計

```bash
git add src/lib/db/
git commit -m "feat(db): Drizzle ORMとNeon PostgreSQL統合

- Drizzle ORM設定ファイル追加
- projectsテーブルスキーマ定義
- データベース接続ファイル作成
- マイグレーション実行

Phase 2完了"
```

### Phase 3: 基本レイアウト実装

```bash
git add src/app/ src/components/layout/
git commit -m "feat(layout): ビルダー画面の基本レイアウトを実装

- 3カラムレイアウト構築
  - 左: Widget一覧サイドバー
  - 中央: キャンバス領域
  - 右: プロパティパネル
- レスポンシブ対応
- ヘッダーコンポーネント追加

Phase 3完了"
```

### Phase 4: Widget基本実装

```bash
git add src/components/widgets/ src/types/
git commit -m "feat(widget): 6種類の基本Widgetを実装

実装したWidget:
- TextWidget: テキスト表示
- InputWidget: 入力フィールド
- ButtonWidget: ボタン
- ImageWidget: 画像表示
- TableWidget: データテーブル
- SelectWidget: ドロップダウン

各Widgetに対応するプロパティ定義も追加

Phase 4完了"
```

### Phase 5: ドラッグ&ドロップ実装

```bash
git add src/components/builder/ src/hooks/
git commit -m "feat(builder): dnd-kitを使用したドラッグ&ドロップ機能を実装

- Widget一覧からキャンバスへのドラッグ
- キャンバス上でのWidget移動
- ドロップ位置の計算ロジック
- ドラッグ中の視覚的フィードバック
- useDndKitフックの作成

Phase 5完了"
```

### Phase 6: プロパティパネル実装

```bash
git add src/components/properties/
git commit -m "feat(properties): Widget編集プロパティパネルを実装

- 各Widget種類ごとの専用プロパティエディタ
- リアルタイムプレビュー機能
- フォームバリデーション
- プロパティ変更の即座反映

Phase 6完了"
```

### Phase 7: 状態管理実装

```bash
git add src/store/ src/hooks/
git commit -m "feat(state): Zustandを使用した状態管理を実装

- キャンバス状態管理ストア
- Widget追加/更新/削除アクション
- 選択状態の管理
- undo/redo機能の基盤

Phase 7完了"
```

### Phase 8: API Routes実装

```bash
git add src/app/api/
git commit -m "feat(api): プロジェクト管理API Routesを実装

実装したエンドポイント:
- GET /api/projects: プロジェクト一覧取得
- POST /api/projects: プロジェクト作成
- GET /api/projects/[id]: 特定プロジェクト取得
- PUT /api/projects/[id]: プロジェクト更新
- DELETE /api/projects/[id]: プロジェクト削除

エラーハンドリングとバリデーション追加

Phase 8完了"
```

### Phase 9: プロジェクト管理画面実装

```bash
git add src/app/projects/ src/components/project/
git commit -m "feat(project): プロジェクト管理画面を実装

- プロジェクト一覧表示
- プロジェクト作成モーダル
- プロジェクト編集機能
- プロジェクト削除機能（確認ダイアログ付き）
- 検索・フィルタ機能

Phase 9完了"
```

### Phase 10: エクスポート機能実装

```bash
git add src/lib/export/ src/components/export/
git commit -m "feat(export): HTML/CSSエクスポート機能を実装

- Widget → HTML要素への変換ロジック
- インラインCSSスタイル生成
- スタンドアロンHTMLファイル生成
- ファイルダウンロード機能
- エクスポートプレビュー

Phase 10完了"
```

### Phase 11: UI/UXテストと改善

```bash
git add src/components/ src/app/
git commit -m "style(ui): UI/UXの調整と改善

実施内容:
- レスポンシブデザインの最適化
- アニメーションとトランジションの追加
- エラーメッセージの改善
- ローディング状態の追加
- フォームバリデーション強化
- アクセシビリティ対応

Phase 11完了"
```

### Phase 12: Vercelデプロイ

```bash
git add .vercel/ vercel.json
git commit -m "chore(deploy): Vercelデプロイ設定を追加

- Vercelプロジェクト設定
- 環境変数設定
- ビルド設定最適化
- デプロイフックの追加

Phase 12完了"
```

---

## 4. ブランチ戦略

### 4.1 Git Flow方式

本プロジェクトでは、簡略化したGit Flowを採用します。

```
main (本番環境)
  ↑
develop (開発環境)
  ↑
feature/* (機能開発)
fix/* (バグ修正)
hotfix/* (緊急修正)
```

### 4.2 ブランチの種類

#### mainブランチ

- **用途**: 本番環境
- **保護**: 直接コミット禁止
- **デプロイ**: Vercel本番環境に自動デプロイ
- **マージ元**: `develop` または `hotfix/*`

#### developブランチ

- **用途**: 開発環境
- **保護**: 直接コミット可（小規模なら）
- **デプロイ**: Vercelプレビュー環境
- **マージ元**: `feature/*`, `fix/*`

#### feature/*ブランチ

- **用途**: 新機能開発
- **命名規則**: `feature/[機能名]`
- **作成元**: `develop`
- **マージ先**: `develop`

**例**:

```
feature/drag-and-drop
feature/export-html
feature/widget-table
```

#### fix/*ブランチ

- **用途**: バグ修正
- **命名規則**: `fix/[バグ内容]`
- **作成元**: `develop`
- **マージ先**: `develop`

**例**:

```
fix/canvas-position-bug
fix/api-error-handling
fix/responsive-layout
```

#### hotfix/*ブランチ

- **用途**: 本番環境の緊急修正
- **命名規則**: `hotfix/[修正内容]`
- **作成元**: `main`
- **マージ先**: `main` と `develop`

**例**:

```
hotfix/database-connection-error
hotfix/critical-security-patch
```

### 4.3 ブランチ操作フロー

#### 新機能開発の流れ

```bash
# 1. developブランチに移動
git checkout develop

# 2. 最新状態を取得
git pull origin develop

# 3. 機能ブランチを作成
git checkout -b feature/widget-table

# 4. 実装作業
# ... コーディング ...

# 5. コミット
git add .
git commit -m "feat(widget): Tableウィジェットを実装"

# 6. リモートにプッシュ
git push origin feature/widget-table

# 7. プルリクエスト作成（GitHub上で）

# 8. レビュー後、developにマージ

# 9. ローカルのdevelopブランチを更新
git checkout develop
git pull origin develop

# 10. 機能ブランチを削除
git branch -d feature/widget-table
```

#### バグ修正の流れ

```bash
# 1. developブランチから修正ブランチを作成
git checkout develop
git pull origin develop
git checkout -b fix/canvas-position-bug

# 2. バグ修正
# ... 修正作業 ...

# 3. コミット
git add .
git commit -m "fix(canvas): Widget位置計算のバグを修正

ドラッグ時のオフセット計算が不正確だった問題を修正"

# 4. プッシュ
git push origin fix/canvas-position-bug

# 5. プルリクエスト → マージ
```

#### 本番環境への反映

```bash
# 1. developからmainにマージ準備
git checkout main
git pull origin main

# 2. developをmainにマージ
git merge develop

# 3. タグ付け（バージョン管理）
git tag -a v1.0.0 -m "Release v1.0.0: 初期リリース"

# 4. プッシュ
git push origin main
git push origin v1.0.0

# 5. Vercelが自動的に本番デプロイ
```

---

## 5. .gitignore詳細設定

### 5.1 完全版.gitignore

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem
Thumbs.db

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env
.env*.local
.env.development
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Desktop.ini

# logs
logs/
*.log

# temporary files
tmp/
temp/
*.tmp

# database
*.db
*.sqlite

# backups
*.bak
*.backup

# drizzle
drizzle/*.sql
!drizzle/0000_*.sql

# custom
/scripts/test-*.ts
/public/exports/*
```

### 5.2 .gitignoreの確認

```bash
# .gitignoreが正しく動作しているか確認
git status

# 特定のファイルが無視されているか確認
git check-ignore -v .env.local
```

**期待される出力**:

```
.gitignore:23:.env*.local    .env.local
```

---

## 6. コミット例集

### 6.1 機能追加（feat）

```bash
# Example 1: Widget追加
git commit -m "feat(widget): Imageウィジェットを追加

- 画像URL入力フィールド
- 画像サイズ調整機能
- alt属性設定
- プレビュー機能"

# Example 2: API追加
git commit -m "feat(api): プロジェクトエクスポートAPIを追加

POST /api/projects/[id]/export エンドポイントを実装
HTML/CSSファイルを生成して返す"

# Example 3: UI機能追加
git commit -m "feat(ui): モーダルコンポーネントを追加

- アニメーション付きモーダル
- オーバーレイクリックで閉じる
- ESCキーで閉じる
- フォーカストラップ機能"

# Example 4: フック追加
git commit -m "feat(hooks): useLocalStorageフックを追加

プロジェクトデータのローカル保存用カスタムフック"

# Example 5: ページ追加
git commit -m "feat(page): ダッシュボードページを追加

/dashboardルートに統計情報表示ページを追加"
```

### 6.2 バグ修正（fix）

```bash
# Example 6: レンダリングバグ修正
git commit -m "fix(canvas): Widgetの重なり順序が正しく表示されない問題を修正

z-indexの計算ロジックを修正"

# Example 7: API エラー修正
git commit -m "fix(api): プロジェクト削除時の404エラーを修正

存在しないプロジェクトに対するエラーハンドリングを追加"

# Example 8: スタイル修正
git commit -m "fix(ui): ボタンのホバー色が正しく表示されない問題を修正"

# Example 9: データ保存バグ修正
git commit -m "fix(db): プロジェクト更新時にupdated_atが更新されない問題を修正

更新時に明示的にupdatedAtフィールドを設定"

# Example 10: レスポンシブバグ修正
git commit -m "fix(layout): モバイル表示時にサイドバーが表示されない問題を修正

ブレークポイント設定を修正"
```

### 6.3 ドキュメント（docs）

```bash
# Example 11: README更新
git commit -m "docs(readme): セットアップ手順を追加"

# Example 12: コメント追加
git commit -m "docs(widget): Widget型の詳細な説明コメントを追加"

# Example 13: API ドキュメント追加
git commit -m "docs(api): API仕様ドキュメントを追加

docs/api-specification.md を追加"

# Example 14: 実装ガイド追加
git commit -m "docs(implementation): Phase 10の実装ドキュメントを追加"
```

### 6.4 スタイル（style）

```bash
# Example 15: フォーマット修正
git commit -m "style: Prettierでコードフォーマットを統一"

# Example 16: インデント修正
git commit -m "style(widget): インデントを2スペースに統一"

# Example 17: import順序修正
git commit -m "style: import文の順序を整理

React → Next.js → サードパーティ → 内部モジュールの順に整理"
```

### 6.5 リファクタリング（refactor）

```bash
# Example 18: コンポーネント分割
git commit -m "refactor(builder): CanvasコンポーネントをWidgetLayerとGridLayerに分割

可読性とメンテナンス性の向上"

# Example 19: 関数抽出
git commit -m "refactor(export): HTML生成ロジックを別ファイルに抽出

lib/export/htmlGenerator.tsを作成"

# Example 20: 型定義整理
git commit -m "refactor(types): Widget型定義を再構成

各Widget固有の型を分離"
```

### 6.6 パフォーマンス（perf）

```bash
# Example 21: メモ化追加
git commit -m "perf(canvas): Widgetコンポーネントにmemoを適用

不要な再レンダリングを防止"

# Example 22: 遅延ローディング
git commit -m "perf(builder): プロパティパネルを遅延ローディング化

初期ロード時間を短縮"

# Example 23: 最適化
git commit -m "perf(export): HTML生成処理を最適化

生成時間を50%短縮"
```

### 6.7 テスト（test）

```bash
# Example 24: テスト追加
git commit -m "test(widget): TextWidgetのユニットテストを追加"

# Example 25: テスト修正
git commit -m "test(api): APIエンドポイントのテストを修正"
```

### 6.8 ビルド（build）

```bash
# Example 26: 依存関係更新
git commit -m "build(deps): 依存パッケージを最新版に更新"

# Example 27: webpack設定変更
git commit -m "build: next.config.jsにSWCminifyを追加"
```

### 6.9 CI/CD（ci）

```bash
# Example 28: GitHub Actions追加
git commit -m "ci: GitHub Actionsでテストワークフローを追加

プルリクエスト時に自動テスト実行"

# Example 29: Vercelデプロイ設定
git commit -m "ci(vercel): vercel.jsonにビルド設定を追加"
```

### 6.10 その他（chore）

```bash
# Example 30: 設定ファイル追加
git commit -m "chore: PrettierとESLint設定を追加"

# Example 31: 環境変数テンプレート追加
git commit -m "chore: .env.exampleファイルを追加"

# Example 32: ライセンス追加
git commit -m "chore: MITライセンスを追加"
```

---

## 7. Git操作コマンド集

### 7.1 基本操作

#### リポジトリ初期化

```bash
# 新規リポジトリ作成
git init

# リモートリポジトリをクローン
git clone https://github.com/username/nocode-ui-builder.git
```

#### ステージング

```bash
# 全ファイルをステージング
git add .

# 特定ファイルをステージング
git add src/components/Widget.tsx

# 特定ディレクトリをステージング
git add src/app/api/

# パターンマッチでステージング
git add src/**/*.tsx
```

#### コミット

```bash
# コミット
git commit -m "feat(widget): Textウィジェットを追加"

# ステージングとコミットを同時に
git commit -am "fix(ui): スタイル修正"

# コミットメッセージを修正
git commit --amend -m "新しいメッセージ"
```

#### 状態確認

```bash
# 現在の状態を確認
git status

# 変更差分を確認
git diff

# ステージング済みの差分を確認
git diff --staged

# コミット履歴を確認
git log

# コミット履歴を1行表示
git log --oneline

# グラフ表示
git log --graph --oneline --all
```

### 7.2 ブランチ操作

```bash
# ブランチ一覧
git branch

# リモートブランチも含めて一覧表示
git branch -a

# 新しいブランチを作成
git branch feature/new-feature

# ブランチを作成して切り替え
git checkout -b feature/new-feature

# ブランチ切り替え
git checkout develop

# ブランチ名変更
git branch -m old-name new-name

# ブランチ削除
git branch -d feature/completed-feature

# 強制削除
git branch -D feature/abandoned-feature
```

### 7.3 リモート操作

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/username/nocode-ui-builder.git

# リモート一覧を表示
git remote -v

# リモートから最新を取得
git fetch origin

# リモートから取得してマージ
git pull origin develop

# リモートにプッシュ
git push origin feature/new-feature

# 初回プッシュ（upstream設定）
git push -u origin feature/new-feature

# 全ブランチをプッシュ
git push --all

# タグをプッシュ
git push --tags
```

### 7.4 マージ操作

```bash
# developブランチにマージ
git checkout develop
git merge feature/new-feature

# マージコミットを作成（fast-forwardしない）
git merge --no-ff feature/new-feature

# マージの中止
git merge --abort

# コンフリクト解決後
git add .
git commit -m "Merge feature/new-feature into develop"
```

### 7.5 リベース操作

```bash
# developブランチの変更を取り込む
git checkout feature/new-feature
git rebase develop

# インタラクティブリベース（コミット履歴整理）
git rebase -i HEAD~3

# リベースの中止
git rebase --abort

# リベース続行
git rebase --continue
```

### 7.6 取り消し操作

```bash
# ステージングを取り消し（ファイルは残る）
git reset HEAD src/file.tsx

# 最新コミットを取り消し（ファイルは残る）
git reset --soft HEAD~1

# 最新コミットを取り消し（ファイルも戻す）
git reset --hard HEAD~1

# 特定のコミットまで戻す
git reset --hard abc123

# 変更を破棄（まだコミットしていない）
git checkout -- src/file.tsx

# 全ての変更を破棄
git checkout -- .

# コミットを打ち消す新しいコミットを作成
git revert abc123
```

### 7.7 スタッシュ操作

```bash
# 変更を一時保存
git stash

# メッセージ付きでスタッシュ
git stash save "WIP: 作業中の変更"

# スタッシュ一覧
git stash list

# スタッシュを適用（残る）
git stash apply

# スタッシュを適用（削除）
git stash pop

# 特定のスタッシュを適用
git stash apply stash@{1}

# スタッシュを削除
git stash drop stash@{0}

# 全スタッシュを削除
git stash clear
```

### 7.8 タグ操作

```bash
# タグ一覧
git tag

# タグを作成
git tag v1.0.0

# 注釈付きタグを作成
git tag -a v1.0.0 -m "Release version 1.0.0"

# 特定のコミットにタグを付ける
git tag -a v1.0.0 abc123 -m "Release version 1.0.0"

# タグを削除
git tag -d v1.0.0

# リモートのタグを削除
git push origin --delete v1.0.0

# タグの詳細を表示
git show v1.0.0
```

### 7.9 履歴確認

```bash
# コミット履歴を表示
git log

# 特定ファイルの履歴
git log src/components/Widget.tsx

# 差分付きで表示
git log -p

# 統計情報付きで表示
git log --stat

# 特定作者のコミット
git log --author="Your Name"

# 日付範囲で絞り込み
git log --since="2025-10-01" --until="2025-10-21"

# ファイルの変更履歴を詳細表示
git log --follow src/components/Widget.tsx

# 誰がいつ変更したか確認
git blame src/components/Widget.tsx
```

---

## 8. プルリクエストガイドライン

### 8.1 プルリクエストテンプレート

GitHub上に `.github/pull_request_template.md` を作成:

```markdown
## 概要
<!-- このプルリクエストの目的を簡潔に説明 -->

## 変更内容
<!-- 何を変更したか -->
-
-
-

## テスト内容
<!-- どのようにテストしたか -->
- [ ] ローカルでビルドが成功
- [ ] 機能が正常に動作することを確認
- [ ] 既存機能への影響がないことを確認

## スクリーンショット
<!-- UIの変更がある場合はスクリーンショットを添付 -->

## 関連Issue
<!-- 関連するIssue番号 -->
Closes #

## チェックリスト
- [ ] コードレビューを依頼済み
- [ ] ドキュメントを更新済み
- [ ] テストを追加済み
- [ ] コミットメッセージがConventional Commits準拠
```

### 8.2 プルリクエストの作成手順

```bash
# 1. 機能ブランチをプッシュ
git push origin feature/new-feature

# 2. GitHubでプルリクエストを作成
# ブラウザでリポジトリを開く → "Compare & pull request" をクリック

# 3. タイトルと説明を記入
# タイトル: feat(widget): Selectウィジェットを追加
# 説明: テンプレートに従って記入

# 4. レビュワーを指定（チームの場合）

# 5. ラベルを追加
# - enhancement（機能追加）
# - bug（バグ修正）
# - documentation（ドキュメント）

# 6. "Create pull request" をクリック
```

### 8.3 コードレビューのポイント

#### レビュー観点

```
✅ 機能要件
- 実装が要件を満たしているか
- エッジケースが考慮されているか

✅ コード品質
- 可読性が高いか
- 適切な命名か
- 重複コードがないか

✅ パフォーマンス
- 不要な再レンダリングがないか
- 最適化の余地はないか

✅ セキュリティ
- XSS対策がされているか
- 環境変数が適切に管理されているか

✅ テスト
- 十分なテストがあるか
- エラーケースがテストされているか
```

---

## 9. 緊急対応フロー

### 9.1 本番環境で緊急バグ発見

```bash
# 1. mainブランチからhotfixブランチを作成
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. バグ修正
# ... 修正作業 ...

# 3. コミット
git add .
git commit -m "fix(api): 本番環境でのデータベース接続エラーを緊急修正

接続タイムアウトの設定を追加"

# 4. プッシュ
git push origin hotfix/critical-bug

# 5. mainにマージ（緊急のため直接マージも可）
git checkout main
git merge hotfix/critical-bug
git push origin main

# 6. developにもマージ（重要）
git checkout develop
git merge hotfix/critical-bug
git push origin develop

# 7. タグ付け
git tag -a v1.0.1 -m "Hotfix: データベース接続エラー修正"
git push origin v1.0.1

# 8. hotfixブランチ削除
git branch -d hotfix/critical-bug
git push origin --delete hotfix/critical-bug
```

### 9.2 誤ったコミットを本番環境にプッシュした場合

```bash
# 方法1: revertコミットを作成（推奨）
git revert abc123
git push origin main

# 方法2: 強制プッシュ（非推奨、最終手段）
git reset --hard HEAD~1
git push --force origin main
```

---

## まとめ

### Git管理チェックリスト

#### 初期設定

- [ ] Gitリポジトリ初期化
- [ ] .gitignore設定
- [ ] リモートリポジトリ追加
- [ ] 初回コミット

#### 日常作業

- [ ] こまめにコミット
- [ ] Conventional Commits準拠
- [ ] 適切なブランチ名
- [ ] プッシュ前にpull

#### リリース前

- [ ] 全機能のテスト完了
- [ ] ドキュメント更新
- [ ] コミット履歴の整理
- [ ] タグ付け

### 便利なGitエイリアス

`.gitconfig` に追加:

```ini
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
  amend = commit --amend --no-edit
```

使用例:

```bash
git st  # git statusの短縮形
git co develop  # git checkout developの短縮形
git visual  # ツリー表示
```

---

**作成者**: Claude
**最終更新**: 2025年10月21日
