/**
 * Sanitizer - XSS対策のためのサニタイゼーション関数
 *
 * すべてのユーザー入力をエスケープし、XSS攻撃を防止します。
 */

/**
 * HTMLエスケープ
 *
 * HTMLコンテンツ内の特殊文字をエスケープします。
 *
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
export function escapeHTML(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'\/]/g, (char) => escapeMap[char] || char);
}

/**
 * HTML属性値エスケープ
 *
 * HTML属性値内の特殊文字をエスケープします。
 *
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
export function escapeAttribute(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * URLサニタイゼーション
 *
 * URLが安全かチェックし、危険なプロトコルを除外します。
 *
 * @param {string} url - チェックするURL
 * @returns {string} サニタイズされたURL（安全でない場合は空文字）
 */
export function sanitizeURL(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // 危険なプロトコルのブラックリスト
  const dangerousProtocols = [
    'javascript:',
    'data:text/html',
    'vbscript:',
    'file:',
    'about:',
  ];

  const lowerURL = trimmed.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerURL.startsWith(protocol)) {
      console.warn(`Dangerous URL protocol detected: ${protocol}`);
      return '';
    }
  }

  return trimmed;
}

/**
 * CSSサニタイゼーション
 *
 * CSSスタイル文字列から危険な値を除外します。
 *
 * @param {string} css - サニタイズするCSS文字列
 * @returns {string} サニタイズされたCSS
 */
export function sanitizeCSS(css: string): string {
  if (typeof css !== 'string') {
    return '';
  }

  // 危険なCSS値のブラックリスト
  const dangerousPatterns = [
    /javascript:/gi,
    /expression\(/gi,
    /import\s/gi,
    /\@import/gi,
    /behavior:/gi,
    /-moz-binding/gi,
  ];

  let sanitized = css;

  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized;
}

/**
 * ファイル名サニタイゼーション
 *
 * ファイル名から危険な文字を除外します。
 *
 * @param {string} filename - サニタイズするファイル名
 * @returns {string} サニタイズされたファイル名
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return 'download.html';
  }

  // 危険な文字を除外
  const sanitized = filename
    .replace(/[^a-zA-Z0-9-_\.]/g, '-')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .substring(0, 255);

  if (!sanitized) {
    return 'download.html';
  }

  // 拡張子がない場合は .html を追加
  if (!sanitized.endsWith('.html')) {
    return sanitized + '.html';
  }

  return sanitized;
}
