/**
 * ユーティリティ関数
 *
 * プロジェクト全体で使用する汎用的なヘルパー関数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

// =====================================================
// クラス名結合
// =====================================================

/**
 * Tailwind CSSクラス名を結合し、重複を解決
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// =====================================================
// UUID生成
// =====================================================

/**
 * ユニークIDを生成（UUID v4）
 *
 * @example
 * generateId() // => '550e8400-e29b-41d4-a716-446655440000'
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * プレフィックス付きIDを生成
 *
 * @example
 * generatePrefixedId('widget') // => 'widget-550e8400-e29b-41d4-a716-446655440000'
 */
export function generatePrefixedId(prefix: string): string {
  return `${prefix}-${uuidv4()}`;
}

// =====================================================
// 座標計算
// =====================================================

/**
 * グリッドにスナップした座標を取得
 *
 * @param value - 座標値
 * @param gridSize - グリッドサイズ
 * @returns スナップ後の座標
 *
 * @example
 * snapToGrid(123, 10) // => 120
 * snapToGrid(127, 10) // => 130
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * 2点間の距離を計算
 *
 * @param x1 - 始点X
 * @param y1 - 始点Y
 * @param x2 - 終点X
 * @param y2 - 終点Y
 * @returns 距離
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 矩形が範囲内にあるか判定
 *
 * @param rect - 矩形（位置とサイズ）
 * @param bounds - 範囲（位置とサイズ）
 * @returns 範囲内ならtrue
 */
export function isWithinBounds(
  rect: { x: number; y: number; width: number; height: number },
  bounds: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect.x >= bounds.x &&
    rect.y >= bounds.y &&
    rect.x + rect.width <= bounds.x + bounds.width &&
    rect.y + rect.height <= bounds.y + bounds.height
  );
}

// =====================================================
// 文字列処理
// =====================================================

/**
 * 文字列を切り詰める
 *
 * @param str - 文字列
 * @param maxLength - 最大長
 * @param suffix - 末尾に追加する文字列（デフォルト: '...'）
 * @returns 切り詰めた文字列
 *
 * @example
 * truncate('Hello World', 8) // => 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * キャメルケースをスペース区切りに変換
 *
 * @example
 * camelToWords('backgroundColor') // => 'Background Color'
 */
export function camelToWords(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

// =====================================================
// 数値処理
// =====================================================

/**
 * 数値を範囲内にクランプ
 *
 * @param value - 値
 * @param min - 最小値
 * @param max - 最大値
 * @returns クランプ後の値
 *
 * @example
 * clamp(150, 0, 100) // => 100
 * clamp(-10, 0, 100) // => 0
 * clamp(50, 0, 100)  // => 50
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 小数点を指定桁数で丸める
 *
 * @param value - 値
 * @param decimals - 小数点以下の桁数
 * @returns 丸めた値
 *
 * @example
 * round(3.14159, 2) // => 3.14
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// =====================================================
// オブジェクト処理
// =====================================================

/**
 * オブジェクトのディープコピー
 *
 * @param obj - コピーするオブジェクト
 * @returns コピーされたオブジェクト
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * オブジェクトから未定義のプロパティを除去
 *
 * @param obj - オブジェクト
 * @returns 未定義プロパティが除去されたオブジェクト
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}

// =====================================================
// 配列処理
// =====================================================

/**
 * 配列から重複を除去
 *
 * @param arr - 配列
 * @returns 重複が除去された配列
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 配列をシャッフル
 *
 * @param arr - 配列
 * @returns シャッフルされた配列
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j] as T;
    result[j] = temp as T;
  }
  return result;
}

// =====================================================
// 日時処理
// =====================================================

/**
 * 日時を相対表現で取得
 *
 * @param date - 日時
 * @returns 相対表現（例: '2時間前'）
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'たった今';
  } else if (diffMins < 60) {
    return `${diffMins}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP');
  }
}

/**
 * 日時をフォーマット
 *
 * @param date - 日時
 * @param format - フォーマット（'date' | 'datetime' | 'time'）
 * @returns フォーマットされた文字列
 */
export function formatDate(date: Date, format: 'date' | 'datetime' | 'time' = 'datetime'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (format === 'datetime' || format === 'time') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  if (format === 'time') {
    delete options.year;
    delete options.month;
    delete options.day;
  }

  return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

// =====================================================
// デバウンス・スロットル
// =====================================================

/**
 * デバウンス関数
 *
 * @param func - 実行する関数
 * @param wait - 待機時間（ms）
 * @returns デバウンス関数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * スロットル関数
 *
 * @param func - 実行する関数
 * @param limit - 制限時間（ms）
 * @returns スロットル関数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
