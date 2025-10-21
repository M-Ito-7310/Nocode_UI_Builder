/**
 * Canvas DataからHTMLを生成するユーティリティ
 */

interface CanvasData {
  components: CanvasComponent[];
  settings?: CanvasSettings;
}

interface CanvasComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props: Record<string, any>;
}

interface CanvasSettings {
  backgroundColor?: string;
  width?: number;
  height?: number;
}

interface GenerateHTMLOptions {
  title?: string;
  description?: string;
}

/**
 * Canvas DataからHTML文字列を生成
 *
 * @param canvasData - Canvas Data
 * @param options - 生成オプション
 * @returns HTML文字列
 */
export function generateHTML(
  canvasData: CanvasData,
  options: GenerateHTMLOptions = {}
): string {
  const { title = 'NoCode UI Builder - Exported Page', description = '' } = options;
  const { components, settings } = canvasData;

  // CSSスタイルの生成
  const styles = generateCSS(components, settings);

  // HTMLボディの生成
  const bodyHTML = components
    .map((component) => generateComponentHTML(component))
    .join('\n');

  // 完全なHTMLドキュメント
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(description)}">
  <title>${escapeHTML(title)}</title>
  <style>
${styles}
  </style>
</head>
<body>
  <div class="canvas-container">
${bodyHTML}
  </div>
</body>
</html>`;
}

/**
 * CSSスタイルの生成
 */
function generateCSS(
  components: CanvasComponent[],
  settings?: CanvasSettings
): string {
  const backgroundColor = settings?.backgroundColor || '#ffffff';
  const canvasWidth = settings?.width || 1200;
  const canvasHeight = settings?.height || 800;

  let css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
    }

    .canvas-container {
      position: relative;
      width: ${canvasWidth}px;
      height: ${canvasHeight}px;
      margin: 0 auto;
      background-color: ${backgroundColor};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .widget {
      position: absolute;
    }
  `;

  // 各コンポーネントのスタイル
  components.forEach((component) => {
    css += `\n${generateComponentCSS(component)}\n`;
  });

  return css;
}

/**
 * コンポーネントのHTML生成
 */
function generateComponentHTML(component: CanvasComponent): string {
  const { id, type, props } = component;

  switch (type) {
    case 'Text':
      return `    <div id="${id}" class="widget widget-text">${escapeHTML(
        props.content || ''
      )}</div>`;

    case 'Button':
      return `    <button id="${id}" class="widget widget-button">${escapeHTML(
        props.text || 'Button'
      )}</button>`;

    case 'Input':
      return `    <div id="${id}" class="widget widget-input">
      <label>${escapeHTML(props.label || '')}</label>
      <input type="${props.inputType || 'text'}" placeholder="${escapeHTML(
        props.placeholder || ''
      )}" ${props.required ? 'required' : ''}>
    </div>`;

    case 'Image':
      return `    <img id="${id}" class="widget widget-image" src="${escapeHTML(
        props.src || ''
      )}" alt="${escapeHTML(props.alt || '')}">`;

    case 'Table':
      return generateTableHTML(id, props);

    case 'Select':
      return generateSelectHTML(id, props);

    default:
      return `    <div id="${id}" class="widget">Unsupported widget: ${type}</div>`;
  }
}

/**
 * コンポーネントのCSS生成
 */
function generateComponentCSS(component: CanvasComponent): string {
  const { id, type, position, size, props } = component;

  let css = `    #${id} {
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${size.width}px;
      height: ${size.height}px;`;

  switch (type) {
    case 'Text':
      css += `
      font-size: ${props.fontSize || 16}px;
      color: ${props.color || '#000000'};
      font-weight: ${props.fontWeight || 'normal'};
      text-align: ${props.textAlign || 'left'};
      line-height: ${size.height}px;`;
      break;

    case 'Button':
      css += `
      background-color: ${props.color || '#3B82F6'};
      color: ${props.textColor || '#FFFFFF'};
      border: none;
      border-radius: ${props.borderRadius || 4}px;
      font-size: ${props.fontSize || 16}px;
      cursor: pointer;
      transition: background-color 0.2s;`;
      break;

    case 'Input':
      css += `
      display: flex;
      flex-direction: column;
      gap: 8px;`;
      break;

    case 'Image':
      css += `
      object-fit: ${props.objectFit || 'cover'};`;
      break;
  }

  css += `
    }`;

  return css;
}

/**
 * テーブルHTML生成
 */
function generateTableHTML(id: string, props: any): string {
  const columns = props.columns || [];
  const data = props.data || [];

  const headerHTML = columns
    .map((col: any) => `<th>${escapeHTML(col.label || col.key)}</th>`)
    .join('');

  const rowsHTML = data
    .map(
      (row: any) =>
        `<tr>${columns
          .map((col: any) => `<td>${escapeHTML(String(row[col.key] || ''))}</td>`)
          .join('')}</tr>`
    )
    .join('\n        ');

  return `    <div id="${id}" class="widget widget-table">
      <table>
        <thead>
          <tr>${headerHTML}</tr>
        </thead>
        <tbody>
        ${rowsHTML}
        </tbody>
      </table>
    </div>`;
}

/**
 * セレクトHTML生成
 */
function generateSelectHTML(id: string, props: any): string {
  const options = props.options || [];
  const optionsHTML = options
    .map(
      (opt: any) =>
        `<option value="${escapeHTML(opt.value)}">${escapeHTML(
          opt.label || opt.value
        )}</option>`
    )
    .join('\n        ');

  return `    <div id="${id}" class="widget widget-select">
      <label>${escapeHTML(props.label || '')}</label>
      <select>
        ${optionsHTML}
      </select>
    </div>`;
}

/**
 * HTMLエスケープ (XSS対策)
 */
function escapeHTML(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return String(str).replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
}
