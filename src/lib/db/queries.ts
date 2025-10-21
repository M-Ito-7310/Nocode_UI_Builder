import { db } from './index';
import { projects, type Project } from './schema';
import { eq, desc, asc, sql } from 'drizzle-orm';

/**
 * プロジェクト一覧取得（最新順）
 *
 * @param limit - 取得件数（デフォルト: 10）
 * @returns プロジェクト配列
 *
 * @example
 * const recentProjects = await getRecentProjects(20);
 */
export async function getRecentProjects(limit: number = 10): Promise<Project[]> {
  try {
    const result = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to fetch recent projects:', error);
    throw new Error('プロジェクト一覧の取得に失敗しました');
  }
}

/**
 * プロジェクト一覧取得（作成日時順）
 *
 * @param limit - 取得件数（デフォルト: 10）
 * @param order - ソート順序（'asc' | 'desc'、デフォルト: 'desc'）
 * @returns プロジェクト配列
 *
 * @example
 * const oldestProjects = await getProjects(5, 'asc');
 */
export async function getProjects(
  limit: number = 10,
  order: 'asc' | 'desc' = 'desc'
): Promise<Project[]> {
  try {
    const orderFunction = order === 'asc' ? asc : desc;

    const result = await db
      .select()
      .from(projects)
      .orderBy(orderFunction(projects.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('プロジェクト一覧の取得に失敗しました');
  }
}

/**
 * プロジェクト取得（ID指定）
 *
 * @param id - プロジェクトID（UUID）
 * @returns プロジェクトオブジェクト、または null
 *
 * @example
 * const project = await getProjectById('550e8400-e29b-41d4-a716-446655440000');
 * if (!project) {
 *   console.log('プロジェクトが見つかりません');
 * }
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to fetch project with id ${id}:`, error);
    throw new Error('プロジェクトの取得に失敗しました');
  }
}

/**
 * プロジェクト作成
 *
 * @param data - プロジェクトデータ
 * @returns 作成されたプロジェクト
 *
 * @example
 * const newProject = await createProject({
 *   name: 'My First Project',
 *   description: 'This is a test project',
 *   canvasData: { components: [] }
 * });
 */
export async function createProject(data: {
  name: string;
  description?: string;
  canvasData?: any;
}): Promise<Project> {
  try {
    // 入力バリデーション
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('プロジェクト名は必須です');
    }

    if (data.name.length > 255) {
      throw new Error('プロジェクト名は255文字以内で入力してください');
    }

    const result = await db
      .insert(projects)
      .values({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        canvasData: data.canvasData || { components: [] },
      })
      .returning();

    if (!result[0]) {
      throw new Error('プロジェクトの作成に失敗しました');
    }

    return result[0];
  } catch (error) {
    console.error('Failed to create project:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('プロジェクトの作成中に予期しないエラーが発生しました');
  }
}

/**
 * プロジェクト更新
 *
 * @param id - プロジェクトID
 * @param data - 更新データ
 * @returns 更新されたプロジェクト、またはnull（見つからない場合）
 *
 * @example
 * const updated = await updateProject('550e8400-e29b-41d4-a716-446655440000', {
 *   name: 'Updated Project Name',
 *   canvasData: { components: [...] }
 * });
 */
export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    canvasData?: any;
  }
): Promise<Project | null> {
  try {
    // 入力バリデーション
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new Error('プロジェクト名は空にできません');
      }
      if (data.name.length > 255) {
        throw new Error('プロジェクト名は255文字以内で入力してください');
      }
    }

    // 更新データの準備
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }

    if (data.canvasData !== undefined) {
      updateData.canvasData = data.canvasData;
    }

    const result = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to update project with id ${id}:`, error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('プロジェクトの更新中に予期しないエラーが発生しました');
  }
}

/**
 * プロジェクト削除
 *
 * @param id - プロジェクトID
 * @returns 削除されたプロジェクト、またはnull（見つからない場合）
 *
 * @example
 * const deleted = await deleteProject('550e8400-e29b-41d4-a716-446655440000');
 * if (deleted) {
 *   console.log('プロジェクトを削除しました:', deleted.name);
 * }
 */
export async function deleteProject(id: string): Promise<Project | null> {
  try {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error(`Failed to delete project with id ${id}:`, error);
    throw new Error('プロジェクトの削除に失敗しました');
  }
}

/**
 * プロジェクト総数取得
 *
 * @returns プロジェクト総数
 *
 * @example
 * const count = await getProjectCount();
 * console.log(`合計 ${count} 件のプロジェクトがあります`);
 */
export async function getProjectCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);

    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Failed to get project count:', error);
    throw new Error('プロジェクト数の取得に失敗しました');
  }
}

/**
 * プロジェクト名で検索
 *
 * @param searchTerm - 検索キーワード
 * @param limit - 取得件数（デフォルト: 10）
 * @returns マッチしたプロジェクト配列
 *
 * @example
 * const results = await searchProjectsByName('landing');
 */
export async function searchProjectsByName(
  searchTerm: string,
  limit: number = 10
): Promise<Project[]> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const result = await db
      .select()
      .from(projects)
      .where(sql`${projects.name} ILIKE ${'%' + searchTerm.trim() + '%'}`)
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('Failed to search projects:', error);
    throw new Error('プロジェクトの検索に失敗しました');
  }
}

/**
 * プロジェクトの存在確認
 *
 * @param id - プロジェクトID
 * @returns 存在する場合true
 *
 * @example
 * const exists = await projectExists('550e8400-e29b-41d4-a716-446655440000');
 */
export async function projectExists(id: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error(`Failed to check if project exists with id ${id}:`, error);
    return false;
  }
}
