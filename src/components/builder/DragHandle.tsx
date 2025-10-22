'use client';

import { useDraggable } from '@dnd-kit/core';
import type { Widget } from '@/types/widget';

interface DragHandleProps {
  widgetId: string;
  widget: Widget;
}

export function DragHandle({ widgetId, widget }: DragHandleProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widgetId,
    data: { widget },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="absolute -top-6 left-0 right-0 h-6 bg-blue-500 text-white text-xs flex items-center justify-center cursor-move rounded-t shadow-md"
      onClick={(e) => e.stopPropagation()}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
      </svg>
      <span className="ml-1">移動</span>
    </div>
  );
}
