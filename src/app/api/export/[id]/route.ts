import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/lib/db/queries';
import { generateHTML } from '@/lib/export/html-generator';

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
 * GET /api/export/[id]
 *
 * 指定されたプロジェクトをHTML/CSSとしてエクスポートします。
 *
 * Query Parameters:
 * - format: エクスポート形式('html' | 'zip'、デフォルト: 'html')
 *
 * @example
 * // 単一HTMLファイルとして取得
 * fetch('/api/export/550e8400-e29b-41d4-a716-446655440000?format=html')
 *
 * // ZIPファイルとして取得(将来的)
 * fetch('/api/export/550e8400-e29b-41d4-a716-446655440000?format=zip')
 */
export async function GET(
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

    // クエリパラメータの取得
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'html';

    // formatバリデーション
    if (format !== 'html' && format !== 'zip') {
      return NextResponse.json(
        {
          error: 'formatは "html" または "zip" を指定してください',
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

    // canvas_dataの検証
    if (!project.canvasData || typeof project.canvasData !== 'object') {
      return NextResponse.json(
        {
          error: 'プロジェクトデータが不正です',
        },
        { status: 500 }
      );
    }

    // componentsの検証
    const canvasData = project.canvasData as any;
    if (!canvasData.components || !Array.isArray(canvasData.components)) {
      return NextResponse.json(
        {
          error: 'プロジェクトデータが不正です',
        },
        { status: 500 }
      );
    }

    // HTML生成
    const html = generateHTML(canvasData, {
      title: project.name,
      description: project.description || undefined,
    });

    // HTMLレスポンスを返す
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          project.name
        )}.html"`,
      },
    });
  } catch (error) {
    console.error(`Failed to export project with id ${context.params.id}:`, error);

    return NextResponse.json(
      {
        error: 'プロジェクトのエクスポートに失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
