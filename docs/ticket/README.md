# チケット管理システム

NoCode UI Builderプロジェクトの開発進捗を管理するためのチケットシステムです。

## 📁 ディレクトリ構造

```
docs/ticket/
├── README.md                    # このファイル
├── initial/                     # 初期構築用チケット（Phase 1-12）
│   ├── README.md
│   ├── PROGRESS.md
│   └── phase-*.md (12ファイル)
├── bug/                         # バグ修正チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── bug-{番号}-{説明}.md
├── feature/                     # 機能追加チケット
│   ├── README.md
│   ├── PROGRESS.md
│   └── feature-{番号}-{説明}.md
└── enhancement/                 # 改善チケット
    ├── README.md
    ├── PROGRESS.md
    └── enhancement-{番号}-{説明}.md
```

## 📊 チケットカテゴリ

### 🏗️ [initial/](initial/) - 初期構築チケット
プロジェクトの初期構築時（2025年10月21-22日）に使用されたPhase 1-12のチケットです。
全て完了済みで、アーカイブとして保管されています。

- **対象**: Phase 1-12の初期構築タスク
- **状態**: 全て完了
- **参照**: [initial/README.md](initial/README.md)

### 🐛 [bug/](bug/) - バグ修正チケット
本番環境や開発中に発見されたバグの修正を管理します。

- **命名規則**: `bug-001-description.md`
- **優先度**: Critical / High / Medium / Low
- **参照**: [bug/README.md](bug/README.md)

### ✨ [feature/](feature/) - 機能追加チケット
新しい機能の追加や要望を管理します。

- **命名規則**: `feature-001-description.md`
- **優先度**: High / Medium / Low
- **参照**: [feature/README.md](feature/README.md)

### 🔧 [enhancement/](enhancement/) - 改善チケット
既存機能の改善・最適化・リファクタリングを管理します。

- **命名規則**: `enhancement-001-description.md`
- **カテゴリ**: Performance / Refactoring / UX / Security / Code Quality
- **参照**: [enhancement/README.md](enhancement/README.md)

## 📊 チケットステータス

各チケットは以下のステータスを持ちます：

- 🔴 **未着手 (TODO)**: まだ開始していない
- 🟡 **進行中 (IN PROGRESS)**: 現在作業中
- 🟢 **完了 (DONE)**: 実装・テスト完了
- 🔵 **レビュー待ち (REVIEW)**: レビュー依頼中
- ⚫ **ブロック (BLOCKED)**: 他の作業待ち

## 🚀 使い方

### 1. 新しいチケットの作成

#### バグを発見した場合
1. `docs/ticket/bug/` ディレクトリに移動
2. 最新の番号を確認（例: bug-001.md が最新なら次は bug-002）
3. `bug-{番号}-{簡潔な説明}.md` を作成
4. [bug/README.md](bug/README.md) のテンプレートに従って記入
5. `bug/PROGRESS.md` を更新

#### 新機能を追加する場合
1. `docs/ticket/feature/` ディレクトリに移動
2. 最新の番号を確認
3. `feature-{番号}-{簡潔な説明}.md` を作成
4. [feature/README.md](feature/README.md) のテンプレートに従って記入
5. `feature/PROGRESS.md` を更新

#### 既存機能を改善する場合
1. `docs/ticket/enhancement/` ディレクトリに移動
2. 最新の番号を確認
3. `enhancement-{番号}-{簡潔な説明}.md` を作成
4. [enhancement/README.md](enhancement/README.md) のテンプレートに従って記入
5. `enhancement/PROGRESS.md` を更新

### 2. チケットの更新

1. 該当するチケットファイルを開く
2. ステータスを更新（🔴 → 🟡 → 🟢）
3. タスクチェックリストを更新
4. 進捗メモを追記
5. 完了時は実績時間を記録
6. 対応するPROGRESS.mdを更新

### 3. 進捗の確認

- **カテゴリ別進捗**: 各ディレクトリの `PROGRESS.md` を確認
- **全体進捗**: 各カテゴリのPROGRESS.mdを参照

## 📝 チケット番号の採番ルール

各カテゴリで独立した連番を使用します：

```
bug-001-button-not-clickable.md
bug-002-export-error.md
feature-001-dark-mode.md
feature-002-undo-redo.md
enhancement-001-performance-optimization.md
enhancement-002-refactor-canvas.md
```

## 🔄 ワークフロー

### バグ修正フロー
1. バグ発見 → チケット作成 (🔴 未着手)
2. 再現確認・原因分析 → ステータス更新 (🟡 進行中)
3. 修正実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

### 機能追加フロー
1. 要望受付 → チケット作成 (🔴 未着手)
2. 仕様検討・設計 → ステータス更新 (🟡 進行中)
3. 実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

### 改善フロー
1. 改善点発見 → チケット作成 (🔴 未着手)
2. 影響範囲調査・方法検討 → ステータス更新 (🟡 進行中)
3. 実装 → テスト
4. 完了 → ステータス更新 (🟢 完了)
5. PROGRESS.md更新

## 📞 エスカレーション

問題が発生した場合：
1. チケットのステータスを ⚫ **ブロック** に変更
2. メモセクションに問題の詳細を記載
3. 関連する依存関係を記録
4. プロジェクトマネージャーに報告

## 🎯 進捗管理のベストプラクティス

1. **こまめな更新**: タスク完了時は即座にチェック
2. **詳細な記録**: メモセクションに問題点や解決策を記録
3. **実績時間の記録**: 見積精度向上のため実績時間を記録
4. **定期レビュー**: 週次でPROGRESS.mdを確認
5. **優先度の見直し**: 状況に応じて優先度を調整

## 📈 統計情報の確認

各カテゴリの `PROGRESS.md` で以下の情報を確認できます：

- 全体進捗率
- カテゴリ別/優先度別の件数
- 平均対応時間
- 現在対応中のタスク
- 完了済みタスク

## 🔗 関連ドキュメント

- [初期構築チケット](initial/README.md) - Phase 1-12のアーカイブ
- [バグ修正チケット](bug/README.md) - バグ管理ガイド
- [機能追加チケット](feature/README.md) - 機能追加ガイド
- [改善チケット](enhancement/README.md) - 改善管理ガイド
