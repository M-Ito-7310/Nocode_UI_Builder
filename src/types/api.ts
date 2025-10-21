/**
 * API型定義
 */

import { Project } from '@/lib/db/schema';

/**
 * API成功レスポンスの基本型
 */
export interface ApiSuccessResponse<T = any> {
  data?: T;
  message?: string;
}

/**
 * APIエラーレスポンスの型
 */
export interface ApiErrorResponse {
  error: string;
  details?: any;
}

/**
 * プロジェクト一覧取得レスポンス
 */
export interface GetProjectsResponse {
  projects: Project[];
  count: number;
}

/**
 * プロジェクト作成リクエスト
 */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  canvasData?: {
    components: any[];
    settings?: Record<string, any>;
  };
}

/**
 * プロジェクト作成レスポンス
 */
export interface CreateProjectResponse {
  project: Project;
  message: string;
}

/**
 * プロジェクト取得レスポンス
 */
export interface GetProjectResponse {
  project: Project;
}

/**
 * プロジェクト更新リクエスト
 */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  canvasData?: {
    components: any[];
    settings?: Record<string, any>;
  };
}

/**
 * プロジェクト更新レスポンス
 */
export interface UpdateProjectResponse {
  project: Project;
  message: string;
}

/**
 * プロジェクト削除レスポンス
 */
export interface DeleteProjectResponse {
  message: string;
  deletedProject: {
    id: string;
    name: string;
  };
}
