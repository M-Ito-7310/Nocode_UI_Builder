import { Widget } from './widget';

/**
 * キャンバスデータ
 */
export interface CanvasData {
  components: Widget[];
  settings?: CanvasSettings;
}

/**
 * キャンバス設定
 */
export interface CanvasSettings {
  backgroundColor?: string;
  width?: number;
  height?: number;
  title?: string;
}

/**
 * エクスポートオプション
 */
export interface ExportOptions {
  projectName: string;
  includeComments?: boolean;
  prettify?: boolean;
  doctype?: 'html5' | 'html4';
}

/**
 * エクスポート結果
 */
export interface ExportResult {
  html: string;
  size: number;
  widgetCount: number;
  generatedAt: Date;
}

/**
 * HTML生成エラー
 */
export class HTMLGenerationError extends Error {
  constructor(
    message: string,
    public readonly widgetId?: string,
    public readonly widgetType?: string
  ) {
    super(message);
    this.name = 'HTMLGenerationError';
  }
}
