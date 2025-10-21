/**
 * Project型定義
 *
 * プロジェクト（保存されたUI設計）の型定義
 * データベーススキーマと対応
 */

import { Widget } from './widget';

// =====================================================
// Canvas Data
// =====================================================

/**
 * Canvas Data（キャンバスの状態）
 *
 * データベースにJSON形式で保存される
 */
export interface CanvasData {
  components: Widget[];      // キャンバス上のWidget配列
  version: string;           // データ形式バージョン（将来の互換性のため）
  settings?: CanvasSettings; // キャンバス設定（オプション）
}

/**
 * Canvas設定
 */
export interface CanvasSettings {
  backgroundColor?: string;  // 背景色
  backgroundImage?: string;  // 背景画像URL
  gridSize?: number;         // グリッドサイズ（px）
  snapToGrid?: boolean;      // グリッドスナップ有効/無効
  width?: number;            // キャンバス幅（固定幅の場合）
  height?: number;           // キャンバス高さ（固定高の場合）
}

// =====================================================
// Project（データベースモデル）
// =====================================================

/**
 * Project（データベースから取得した状態）
 */
export interface Project {
  id: number;                // プロジェクトID（自動採番）
  name: string;              // プロジェクト名
  description: string | null; // プロジェクト説明
  canvasData: CanvasData;    // Canvas Data（JSON）
  createdAt: Date;           // 作成日時
  updatedAt: Date;           // 更新日時
  userId?: string | null;    // ユーザーID（将来の認証機能用、現在はnull）
  isPublic?: boolean;        // 公開フラグ（将来の機能用）
  tags?: string[];           // タグ配列（将来の機能用）
}

/**
 * Project作成時のInput（IDや日時は自動生成されるため不要）
 */
export interface CreateProjectInput {
  name: string;
  description?: string;
  canvasData: CanvasData;
}

/**
 * Project更新時のInput
 */
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  canvasData?: CanvasData;
}

/**
 * Project一覧取得時のフィルタ
 */
export interface ProjectListFilter {
  limit?: number;            // 取得件数（デフォルト: 10）
  offset?: number;           // オフセット（ページネーション用）
  sortBy?: 'createdAt' | 'updatedAt' | 'name'; // ソート項目
  sortOrder?: 'asc' | 'desc'; // ソート順
  search?: string;           // 検索キーワード（名前・説明で検索）
}

/**
 * Project一覧のレスポンス
 */
export interface ProjectListResponse {
  projects: Project[];
  total: number;             // 総件数
  limit: number;
  offset: number;
}

// =====================================================
// API Response型
// =====================================================

/**
 * API成功レスポンス
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;            // エラーコード（例: PROJECT_NOT_FOUND）
    message: string;         // エラーメッセージ
    details?: unknown;       // 追加のエラー詳細
  };
}

/**
 * API レスポンス（成功 or エラー）
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// =====================================================
// Type Guards
// =====================================================

/**
 * API成功レスポンスか判定
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * APIエラーレスポンスか判定
 */
export function isApiError(response: ApiResponse): response is ApiErrorResponse {
  return response.success === false;
}

// =====================================================
// バリデーション関数
// =====================================================

/**
 * プロジェクト名のバリデーション
 */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'プロジェクト名は必須です' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'プロジェクト名は100文字以内にしてください' };
  }
  return { valid: true };
}

/**
 * プロジェクト説明のバリデーション
 */
export function validateProjectDescription(description: string | undefined): { valid: boolean; error?: string } {
  if (description && description.length > 500) {
    return { valid: false, error: 'プロジェクト説明は500文字以内にしてください' };
  }
  return { valid: true };
}

/**
 * Canvas Dataのバリデーション
 */
export function validateCanvasData(canvasData: CanvasData): { valid: boolean; error?: string } {
  if (!canvasData) {
    return { valid: false, error: 'Canvas Dataは必須です' };
  }
  if (!Array.isArray(canvasData.components)) {
    return { valid: false, error: 'Canvas Data.componentsは配列である必要があります' };
  }
  if (!canvasData.version) {
    return { valid: false, error: 'Canvas Data.versionは必須です' };
  }
  return { valid: true };
}
