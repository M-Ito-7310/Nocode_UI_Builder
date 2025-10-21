/**
 * Validator - データバリデーション
 *
 * エクスポート前のデータ検証を行います。
 */

import { CanvasData, HTMLGenerationError } from '@/types/export';
import { Widget } from '@/types/widget';

/**
 * Canvas データのバリデーション
 *
 * @param {CanvasData} canvasData - 検証するキャンバスデータ
 * @throws {HTMLGenerationError} バリデーションエラー
 */
export function validateCanvasData(canvasData: CanvasData): void {
  if (!canvasData) {
    throw new HTMLGenerationError('Canvas data is required');
  }

  if (!Array.isArray(canvasData.components)) {
    throw new HTMLGenerationError('Canvas components must be an array');
  }

  // 各Widgetを検証
  canvasData.components.forEach((widget, index) => {
    try {
      validateWidget(widget);
    } catch (error) {
      throw new HTMLGenerationError(
        `Validation failed for widget at index ${index}: ${(error as Error).message}`,
        widget.id,
        widget.type
      );
    }
  });
}

/**
 * Widget データのバリデーション
 *
 * @param {Widget} widget - 検証するWidget
 * @throws {HTMLGenerationError} バリデーションエラー
 */
export function validateWidget(widget: Widget): void {
  if (!widget) {
    throw new HTMLGenerationError('Widget is required');
  }

  if (!widget.id || typeof widget.id !== 'string') {
    throw new HTMLGenerationError('Widget ID is required and must be a string');
  }

  if (!widget.type || typeof widget.type !== 'string') {
    throw new HTMLGenerationError('Widget type is required and must be a string', (widget as any).id);
  }

  if (!widget.position || typeof widget.position.x !== 'number' || typeof widget.position.y !== 'number') {
    throw new HTMLGenerationError('Widget position must have numeric x and y coordinates', (widget as any).id, (widget as any).type);
  }

  if (!widget.size || typeof widget.size.width !== 'number' || typeof widget.size.height !== 'number') {
    throw new HTMLGenerationError('Widget size must have numeric width and height', (widget as any).id, (widget as any).type);
  }

  if (!widget.props || typeof widget.props !== 'object') {
    throw new HTMLGenerationError('Widget props is required and must be an object', (widget as any).id, (widget as any).type);
  }

  // Widget種類別のバリデーション
  validateWidgetProps(widget);
}

/**
 * Widget種類別のプロパティバリデーション
 */
function validateWidgetProps(widget: Widget): void {
  switch (widget.type) {
    case 'Text':
      validateTextProps(widget);
      break;
    case 'Input':
      validateInputProps(widget);
      break;
    case 'Button':
      validateButtonProps(widget);
      break;
    case 'Image':
      validateImageProps(widget);
      break;
    case 'Table':
      validateTableProps(widget);
      break;
    case 'Select':
      validateSelectProps(widget);
      break;
    default:
      throw new HTMLGenerationError(`Unknown widget type: ${(widget as any).type}`, (widget as any).id, (widget as any).type);
  }
}

function validateTextProps(widget: any): void {
  const { content, fontSize, color } = widget.props;

  if (typeof content !== 'string') {
    throw new HTMLGenerationError('Text content must be a string', widget.id, widget.type);
  }

  if (typeof fontSize !== 'number' || fontSize <= 0) {
    throw new HTMLGenerationError('Font size must be a positive number', widget.id, widget.type);
  }

  if (typeof color !== 'string') {
    throw new HTMLGenerationError('Color must be a string', widget.id, widget.type);
  }
}

function validateInputProps(widget: any): void {
  const { label, inputType } = widget.props;

  if (typeof label !== 'string') {
    throw new HTMLGenerationError('Input label must be a string', widget.id, widget.type);
  }

  const validInputTypes = ['text', 'email', 'password', 'number', 'tel'];
  if (!validInputTypes.includes(inputType)) {
    throw new HTMLGenerationError(`Invalid input type: ${inputType}`, widget.id, widget.type);
  }
}

function validateButtonProps(widget: any): void {
  const { text, variant, size } = widget.props;

  if (typeof text !== 'string') {
    throw new HTMLGenerationError('Button text must be a string', widget.id, widget.type);
  }

  const validVariants = ['primary', 'secondary', 'outline', 'ghost'];
  if (!validVariants.includes(variant)) {
    throw new HTMLGenerationError(`Invalid button variant: ${variant}`, widget.id, widget.type);
  }

  const validSizes = ['small', 'medium', 'large'];
  if (!validSizes.includes(size)) {
    throw new HTMLGenerationError(`Invalid button size: ${size}`, widget.id, widget.type);
  }
}

function validateImageProps(widget: any): void {
  const { src, alt } = widget.props;

  if (typeof src !== 'string' || src.trim() === '') {
    throw new HTMLGenerationError('Image src must be a non-empty string', widget.id, widget.type);
  }

  if (typeof alt !== 'string') {
    throw new HTMLGenerationError('Image alt must be a string', widget.id, widget.type);
  }
}

function validateTableProps(widget: any): void {
  const { columns, data } = widget.props;

  if (!Array.isArray(columns) || columns.length === 0) {
    throw new HTMLGenerationError('Table columns must be a non-empty array', widget.id, widget.type);
  }

  if (!Array.isArray(data)) {
    throw new HTMLGenerationError('Table data must be an array', widget.id, widget.type);
  }
}

function validateSelectProps(widget: any): void {
  const { label, options } = widget.props;

  if (typeof label !== 'string') {
    throw new HTMLGenerationError('Select label must be a string', widget.id, widget.type);
  }

  if (!Array.isArray(options) || options.length === 0) {
    throw new HTMLGenerationError('Select options must be a non-empty array', widget.id, widget.type);
  }
}
