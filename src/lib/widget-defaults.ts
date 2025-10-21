import {
  TextWidgetProps,
  InputWidgetProps,
  ButtonWidgetProps,
  ImageWidgetProps,
  TableWidgetProps,
  SelectWidgetProps,
} from '@/types/widget';

/**
 * Text Widget のデフォルトプロパティ
 */
export const DEFAULT_TEXT_PROPS: TextWidgetProps = {
  content: 'Text',
  fontSize: 16,
  color: '#000000',
  fontWeight: 'normal',
  textAlign: 'left',
  fontFamily: 'inherit',
  lineHeight: 1.5,
};

/**
 * Input Widget のデフォルトプロパティ
 */
export const DEFAULT_INPUT_PROPS: InputWidgetProps = {
  label: 'Input',
  placeholder: 'Enter text...',
  inputType: 'text',
  required: false,
  defaultValue: '',
};

/**
 * Button Widget のデフォルトプロパティ
 */
export const DEFAULT_BUTTON_PROPS: ButtonWidgetProps = {
  text: 'Button',
  variant: 'primary',
  size: 'medium',
  color: '#3B82F6',
  textColor: '#FFFFFF',
  borderRadius: 6,
  disabled: false,
};

/**
 * Image Widget のデフォルトプロパティ
 */
export const DEFAULT_IMAGE_PROPS: ImageWidgetProps = {
  src: 'https://via.placeholder.com/300x200',
  alt: 'Image',
  objectFit: 'cover',
  borderRadius: 0,
  opacity: 1,
};

/**
 * Table Widget のデフォルトプロパティ
 */
export const DEFAULT_TABLE_PROPS: TableWidgetProps = {
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
};

/**
 * Select Widget のデフォルトプロパティ
 */
export const DEFAULT_SELECT_PROPS: SelectWidgetProps = {
  label: 'Select',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  placeholder: 'Choose an option...',
  required: false,
  defaultValue: '',
};

/**
 * Widget種類に応じたデフォルトプロパティを取得
 */
export function getDefaultProps(type: string): any {
  switch (type) {
    case 'Text':
      return DEFAULT_TEXT_PROPS;
    case 'Input':
      return DEFAULT_INPUT_PROPS;
    case 'Button':
      return DEFAULT_BUTTON_PROPS;
    case 'Image':
      return DEFAULT_IMAGE_PROPS;
    case 'Table':
      return DEFAULT_TABLE_PROPS;
    case 'Select':
      return DEFAULT_SELECT_PROPS;
    default:
      return {};
  }
}
