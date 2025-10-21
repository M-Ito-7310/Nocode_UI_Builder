import React from 'react';
import type { Widget } from '@/types/widget';
import TextWidget from '@/components/widgets/Text';
import InputWidget from '@/components/widgets/Input';
import ButtonWidget from '@/components/widgets/Button';
import ImageWidget from '@/components/widgets/Image';
import TableWidget from '@/components/widgets/Table';
import SelectWidget from '@/components/widgets/Select';

/**
 * Widget種類に応じたコンポーネントをレンダリングする
 */
export function renderWidget(widget: Widget): React.ReactNode {
  switch (widget.type) {
    case 'Text':
      return <TextWidget widget={widget as any} />;

    case 'Input':
      return <InputWidget widget={widget as any} />;

    case 'Button':
      return <ButtonWidget widget={widget as any} />;

    case 'Image':
      return <ImageWidget widget={widget as any} />;

    case 'Table':
      return <TableWidget widget={widget as any} />;

    case 'Select':
      return <SelectWidget widget={widget as any} />;

    default:
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-sm">
          Unknown Widget
        </div>
      );
  }
}

/**
 * Widget種類ごとのデフォルトサイズを返す
 */
export function getDefaultSize(type: Widget['type']): { width: number; height: number } {
  switch (type) {
    case 'Text':
      return { width: 200, height: 40 };

    case 'Input':
      return { width: 250, height: 60 };

    case 'Button':
      return { width: 120, height: 40 };

    case 'Image':
      return { width: 300, height: 200 };

    case 'Table':
      return { width: 500, height: 300 };

    case 'Select':
      return { width: 250, height: 60 };

    default:
      return { width: 200, height: 100 };
  }
}
