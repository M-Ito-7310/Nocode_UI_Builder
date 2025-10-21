/**
 * Style Utilities
 *
 * CSSスタイル生成のためのヘルパー関数群
 */

/**
 * hex色をrgbaに変換
 *
 * @param {string} hex - 16進数カラーコード (#RRGGBB または #RGB)
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} rgba形式の色文字列
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  // #RGB 形式を #RRGGBB に展開
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    console.warn(`Invalid hex color: ${hex}, falling back to rgba(0, 0, 0, ${alpha})`);
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = parseInt(result[1]!, 16);
  const g = parseInt(result[2]!, 16);
  const b = parseInt(result[3]!, 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * CSSプロパティオブジェクトをインラインスタイル文字列に変換
 *
 * @param {Record<string, any>} styles - CSSプロパティオブジェクト
 * @returns {string} インラインスタイル文字列
 */
export function formatInlineStyle(styles: Record<string, any>): string {
  return Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // camelCase を kebab-case に変換
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

/**
 * 位置スタイルを生成
 *
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @returns {Record<string, string>} 位置スタイル
 */
export function generatePositionStyle(x: number, y: number): Record<string, string> {
  return {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  };
}

/**
 * サイズスタイルを生成
 *
 * @param {number} width - 幅
 * @param {number} height - 高さ
 * @returns {Record<string, string>} サイズスタイル
 */
export function generateSizeStyle(width: number, height: number): Record<string, string> {
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
}

/**
 * ボックスシャドウを生成
 *
 * @param {number} x - X オフセット
 * @param {number} y - Y オフセット
 * @param {number} blur - ぼかし
 * @param {number} spread - 広がり
 * @param {string} color - 色
 * @returns {string} box-shadow CSS値
 */
export function generateBoxShadow(
  x: number = 0,
  y: number = 2,
  blur: number = 4,
  spread: number = 0,
  color: string = 'rgba(0, 0, 0, 0.1)'
): string {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

/**
 * グラデーションを生成
 *
 * @param {string} direction - 方向 (to right, to bottom など)
 * @param {string[]} colors - 色の配列
 * @returns {string} linear-gradient CSS値
 */
export function generateLinearGradient(direction: string, colors: string[]): string {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
}

/**
 * フォントスタイルを生成
 *
 * @param {number} size - フォントサイズ (px)
 * @param {string} weight - フォントウェイト
 * @param {string} family - フォントファミリー
 * @returns {Record<string, string>} フォントスタイル
 */
export function generateFontStyle(
  size: number,
  weight: string = 'normal',
  family: string = 'inherit'
): Record<string, string> {
  return {
    fontSize: `${size}px`,
    fontWeight: weight,
    fontFamily: family,
  };
}

/**
 * ボーダースタイルを生成
 *
 * @param {number} width - ボーダー幅 (px)
 * @param {string} style - ボーダースタイル (solid, dashed, etc.)
 * @param {string} color - ボーダー色
 * @returns {string} border CSS値
 */
export function generateBorder(
  width: number = 1,
  style: string = 'solid',
  color: string = '#000000'
): string {
  return `${width}px ${style} ${color}`;
}

/**
 * パディングスタイルを生成
 *
 * @param {number | number[]} values - パディング値 (1-4個)
 * @returns {string} padding CSS値
 */
export function generatePadding(values: number | number[]): string {
  if (typeof values === 'number') {
    return `${values}px`;
  }

  return values.map((v) => `${v}px`).join(' ');
}

/**
 * マージンスタイルを生成
 *
 * @param {number | number[]} values - マージン値 (1-4個)
 * @returns {string} margin CSS値
 */
export function generateMargin(values: number | number[]): string {
  if (typeof values === 'number') {
    return `${values}px`;
  }

  return values.map((v) => `${v}px`).join(' ');
}
