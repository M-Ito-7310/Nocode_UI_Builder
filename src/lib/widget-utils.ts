import type {
  WidgetType,
  TextWidgetProps,
  InputWidgetProps,
  ButtonWidgetProps,
  ImageWidgetProps,
  TableWidgetProps,
  SelectWidgetProps
} from '@/types/widget';

// ユニークID生成
export function generateId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 最小サイズ取得
export function getMinSize(type: WidgetType): { width: number; height: number } {
  const minSizes: Record<WidgetType, { width: number; height: number }> = {
    Text: { width: 50, height: 25 },
    Input: { width: 120, height: 60 },
    Button: { width: 80, height: 40 },
    Image: { width: 50, height: 50 },
    Table: { width: 200, height: 120 },
    Select: { width: 120, height: 60 },
  };

  return minSizes[type];
}

// デフォルトサイズ取得
export function getDefaultSize(type: WidgetType): { width: number; height: number } {
  const sizes: Record<WidgetType, { width: number; height: number }> = {
    Text: { width: 200, height: 40 },
    Input: { width: 250, height: 70 },
    Button: { width: 120, height: 40 },
    Image: { width: 300, height: 200 },
    Table: { width: 400, height: 250 },
    Select: { width: 250, height: 70 },
  };

  return sizes[type];
}

// デフォルトプロパティ取得
export function getDefaultProps(type: WidgetType): TextWidgetProps | InputWidgetProps | ButtonWidgetProps | ImageWidgetProps | TableWidgetProps | SelectWidgetProps {
  const props: Record<WidgetType, TextWidgetProps | InputWidgetProps | ButtonWidgetProps | ImageWidgetProps | TableWidgetProps | SelectWidgetProps> = {
    Text: {
      content: 'Text',
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
    },
    Input: {
      label: 'Input',
      placeholder: 'Enter text...',
      inputType: 'text',
      required: false,
    },
    Button: {
      text: 'Button',
      variant: 'primary',
      size: 'medium',
      color: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 6,
    },
    Image: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image',
      objectFit: 'cover',
      borderRadius: 0,
      opacity: 1,
    },
    Table: {
      columns: [
        { key: 'id', label: 'ID', width: 50 },
        { key: 'name', label: 'Name', width: 150 },
        { key: 'email', label: 'Email', width: 200 },
      ],
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
      striped: true,
      bordered: true,
      hoverable: true,
      headerBgColor: '#F3F4F6',
      headerTextColor: '#111827',
    },
    Select: {
      label: 'Select',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
      placeholder: 'Choose an option...',
      required: false,
    },
  };

  return props[type];
}
