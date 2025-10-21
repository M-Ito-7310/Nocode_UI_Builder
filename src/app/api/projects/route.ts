import { NextRequest, NextResponse } from 'next/server';
import { getRecentProjects, createProject } from '@/lib/db/queries';
import { z } from 'zod';

/**
 * プロジェクト作成時のバリデーションスキーマ
 */
const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'プロジェクト名は必須です')
    .max(255, 'プロジェクト名は255文字以内で入力してください'),
  description: z.string().optional(),
  canvasData: z
    .object({
      components: z.array(z.any()),
      settings: z.object({}).optional(),
    })
    .optional(),
});

/**
 * GET /api/projects
 *
 * プロジェクト一覧を取得します。
 *
 * Query Parameters:
 * - limit: 取得件数(デフォルト: 10)
 *
 * @example
 * fetch('/api/projects?limit=20')
 */
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // バリデーション: limitは1〜100の範囲
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          error: 'limitは1から100の間で指定してください',
        },
        { status: 400 }
      );
    }

    // データベースからプロジェクト取得
    const projects = await getRecentProjects(limit);

    return NextResponse.json(
      {
        projects,
        count: projects.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch projects:', error);

    return NextResponse.json(
      {
        error: 'プロジェクト一覧の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 *
 * 新しいプロジェクトを作成します。
 *
 * Request Body:
 * {
 *   "name": "Project Name",
 *   "description": "Project Description",
 *   "canvasData": { "components": [] }
 * }
 *
 * @example
 * fetch('/api/projects', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'My Project' })
 * })
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: '無効なJSONフォーマットです',
        },
        { status: 400 }
      );
    }

    // バリデーション
    const validationResult = createProjectSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'バリデーションエラー',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, description, canvasData } = validationResult.data;

    // プロジェクト作成
    const project = await createProject({
      name,
      description,
      canvasData: canvasData || { components: [] },
    });

    return NextResponse.json(
      {
        project,
        message: 'プロジェクトを作成しました',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create project:', error);

    return NextResponse.json(
      {
        error: 'プロジェクトの作成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
