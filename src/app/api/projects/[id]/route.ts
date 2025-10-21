import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/queries';
import { z } from 'zod';

/**
 * プロジェクト更新時のバリデーションスキーマ
 */
const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'プロジェクト名は空にできません')
    .max(255, 'プロジェクト名は255文字以内で入力してください')
    .optional(),
  description: z.string().optional(),
  canvasData: z
    .object({
      components: z.array(z.any()),
      settings: z.object({}).optional(),
    })
    .optional(),
});

/**
 * RouteパラメータのContext型定義
 */
type RouteContext = {
  params: {
    id: string;
  };
};

/**
 * UUIDバリデーション
 */
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * GET /api/projects/[id]
 *
 * 指定されたIDのプロジェクトを取得します。
 *
 * @example
 * fetch('/api/projects/550e8400-e29b-41d4-a716-446655440000')
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    // UUIDバリデーション
    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error: '無効なプロジェクトIDです',
        },
        { status: 400 }
      );
    }

    // プロジェクト取得
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        {
          error: 'プロジェクトが見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        project,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to fetch project with id ${context.params.id}:`, error);

    return NextResponse.json(
      {
        error: 'プロジェクトの取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 *
 * 指定されたIDのプロジェクトを更新します。
 *
 * Request Body:
 * {
 *   "name": "Updated Name",
 *   "description": "Updated Description",
 *   "canvasData": { "components": [...] }
 * }
 *
 * @example
 * fetch('/api/projects/550e8400-e29b-41d4-a716-446655440000', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'New Name' })
 * })
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    // UUIDバリデーション
    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error: '無効なプロジェクトIDです',
        },
        { status: 400 }
      );
    }

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
    const validationResult = updateProjectSchema.safeParse(body);

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

    // 更新データが空の場合のチェック
    if (!name && !description && !canvasData) {
      return NextResponse.json(
        {
          error: '更新するデータが指定されていません',
        },
        { status: 400 }
      );
    }

    // プロジェクト更新
    const project = await updateProject(id, {
      name,
      description,
      canvasData,
    });

    if (!project) {
      return NextResponse.json(
        {
          error: 'プロジェクトが見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        project,
        message: 'プロジェクトを更新しました',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to update project with id ${context.params.id}:`, error);

    return NextResponse.json(
      {
        error: 'プロジェクトの更新に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 *
 * 指定されたIDのプロジェクトを削除します。
 *
 * @example
 * fetch('/api/projects/550e8400-e29b-41d4-a716-446655440000', {
 *   method: 'DELETE'
 * })
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params;

    // UUIDバリデーション
    if (!isValidUUID(id)) {
      return NextResponse.json(
        {
          error: '無効なプロジェクトIDです',
        },
        { status: 400 }
      );
    }

    // プロジェクト削除
    const project = await deleteProject(id);

    if (!project) {
      return NextResponse.json(
        {
          error: 'プロジェクトが見つかりません',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'プロジェクトを削除しました',
        deletedProject: {
          id: project.id,
          name: project.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to delete project with id ${context.params.id}:`, error);

    return NextResponse.json(
      {
        error: 'プロジェクトの削除に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
