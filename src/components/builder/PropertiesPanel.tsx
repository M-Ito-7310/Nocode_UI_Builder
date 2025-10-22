'use client';

import React from 'react';
import type { Widget } from '@/types/widget';
import { getMinSize } from '@/lib/widget-utils';

interface PropertiesPanelProps {
  selectedWidget: Widget | null;
  onUpdateWidget: (updates: Partial<Widget>) => void;
  className?: string;
}

export function PropertiesPanel({
  selectedWidget,
  onUpdateWidget,
  className = '',
}: PropertiesPanelProps) {
  if (!selectedWidget) {
    return (
      <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">プロパティ</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <p className="text-sm">Widgetを選択してください</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProps = (propUpdates: Record<string, any>) => {
    onUpdateWidget({
      props: { ...selectedWidget.props, ...propUpdates } as any,
    });
  };

  // ウィジェットタイプに基づいた最小サイズを取得
  const minSize = getMinSize(selectedWidget.type);

  return (
    <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">プロパティ</h2>
        <p className="text-xs text-gray-500 mt-1">
          {selectedWidget.type} Widget
        </p>
      </div>

      {/* プロパティフォーム */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 共通プロパティ: 位置とサイズ */}
        <PropertySection title="位置とサイズ">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="X"
              value={selectedWidget.position.x}
              onChange={(x) => onUpdateWidget({ position: { ...selectedWidget.position, x } })}
              min={0}
            />
            <NumberInput
              label="Y"
              value={selectedWidget.position.y}
              onChange={(y) => onUpdateWidget({ position: { ...selectedWidget.position, y } })}
              min={0}
            />
            <NumberInput
              label="幅"
              value={selectedWidget.size.width}
              onChange={(width) => {
                const validWidth = Math.max(minSize.width, width);
                onUpdateWidget({ size: { ...selectedWidget.size, width: validWidth } });
              }}
              min={minSize.width}
            />
            <NumberInput
              label="高さ"
              value={selectedWidget.size.height}
              onChange={(height) => {
                const validHeight = Math.max(minSize.height, height);
                onUpdateWidget({ size: { ...selectedWidget.size, height: validHeight } });
              }}
              min={minSize.height}
            />
          </div>
        </PropertySection>

        {/* Widget種類別プロパティ */}
        {selectedWidget.type === 'Text' && (
          <TextWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Input' && (
          <InputWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Button' && (
          <ButtonWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Image' && (
          <ImageWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Table' && (
          <TableWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
        {selectedWidget.type === 'Select' && (
          <SelectWidgetProperties props={selectedWidget.props} updateProps={updateProps} />
        )}
      </div>
    </div>
  );
}

// セクションコンポーネント
function PropertySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 border-b pb-2">{title}</h3>
      {children}
    </div>
  );
}

// 入力コンポーネント
function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-9 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <label className="ml-2 text-sm text-gray-700">{label}</label>
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step || 1}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

// Widget別プロパティコンポーネント

function TextWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="テキスト">
        <TextAreaInput
          label="内容"
          value={props.content || 'Text'}
          onChange={(content) => updateProps({ content })}
        />
        <RangeInput
          label="フォントサイズ"
          value={props.fontSize || 16}
          onChange={(fontSize) => updateProps({ fontSize })}
          min={8}
          max={72}
        />
        <ColorInput
          label="テキスト色"
          value={props.color || '#000000'}
          onChange={(color) => updateProps({ color })}
        />
        <SelectInput
          label="太さ"
          value={props.fontWeight || 'normal'}
          onChange={(fontWeight) => updateProps({ fontWeight })}
          options={[
            { value: 'normal', label: '標準' },
            { value: 'bold', label: '太字' },
            { value: '300', label: '細字' },
            { value: '500', label: '中字' },
            { value: '700', label: '太字' },
          ]}
        />
        <SelectInput
          label="配置"
          value={props.textAlign || 'left'}
          onChange={(textAlign) => updateProps({ textAlign })}
          options={[
            { value: 'left', label: '左揃え' },
            { value: 'center', label: '中央揃え' },
            { value: 'right', label: '右揃え' },
          ]}
        />
      </PropertySection>
    </>
  );
}

function InputWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="入力フィールド">
        <TextInput
          label="ラベル"
          value={props.label || 'Input'}
          onChange={(label) => updateProps({ label })}
        />
        <TextInput
          label="プレースホルダー"
          value={props.placeholder || 'Enter text...'}
          onChange={(placeholder) => updateProps({ placeholder })}
        />
        <SelectInput
          label="入力タイプ"
          value={props.inputType || 'text'}
          onChange={(inputType) => updateProps({ inputType })}
          options={[
            { value: 'text', label: 'テキスト' },
            { value: 'email', label: 'メール' },
            { value: 'password', label: 'パスワード' },
            { value: 'number', label: '数値' },
            { value: 'tel', label: '電話番号' },
          ]}
        />
        <CheckboxInput
          label="必須項目"
          value={props.required || false}
          onChange={(required) => updateProps({ required })}
        />
      </PropertySection>
    </>
  );
}

function ButtonWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="ボタン">
        <TextInput
          label="テキスト"
          value={props.text || 'Button'}
          onChange={(text) => updateProps({ text })}
        />
        <SelectInput
          label="バリアント"
          value={props.variant || 'primary'}
          onChange={(variant) => updateProps({ variant })}
          options={[
            { value: 'primary', label: 'プライマリ' },
            { value: 'secondary', label: 'セカンダリ' },
            { value: 'outline', label: 'アウトライン' },
            { value: 'ghost', label: 'ゴースト' },
          ]}
        />
        <SelectInput
          label="サイズ"
          value={props.size || 'medium'}
          onChange={(size) => updateProps({ size })}
          options={[
            { value: 'small', label: '小' },
            { value: 'medium', label: '中' },
            { value: 'large', label: '大' },
          ]}
        />
        <ColorInput
          label="背景色"
          value={props.color || '#3B82F6'}
          onChange={(color) => updateProps({ color })}
        />
        <ColorInput
          label="テキスト色"
          value={props.textColor || '#FFFFFF'}
          onChange={(textColor) => updateProps({ textColor })}
        />
        <RangeInput
          label="角丸"
          value={props.borderRadius || 6}
          onChange={(borderRadius) => updateProps({ borderRadius })}
          min={0}
          max={20}
        />
      </PropertySection>
    </>
  );
}

function ImageWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="画像">
        <TextInput
          label="画像URL"
          value={props.src || 'https://via.placeholder.com/300x200'}
          onChange={(src) => updateProps({ src })}
          placeholder="https://example.com/image.jpg"
        />
        <TextInput
          label="代替テキスト"
          value={props.alt || 'Image'}
          onChange={(alt) => updateProps({ alt })}
        />
        <SelectInput
          label="オブジェクトフィット"
          value={props.objectFit || 'cover'}
          onChange={(objectFit) => updateProps({ objectFit })}
          options={[
            { value: 'contain', label: '全体表示' },
            { value: 'cover', label: 'カバー' },
            { value: 'fill', label: '引き伸ばし' },
            { value: 'none', label: 'なし' },
          ]}
        />
        <RangeInput
          label="角丸"
          value={props.borderRadius || 0}
          onChange={(borderRadius) => updateProps({ borderRadius })}
          min={0}
          max={50}
        />
        <RangeInput
          label="不透明度"
          value={props.opacity || 1}
          onChange={(opacity) => updateProps({ opacity })}
          min={0}
          max={1}
          step={0.1}
        />
      </PropertySection>
    </>
  );
}

function TableWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="テーブル">
        <CheckboxInput
          label="ストライプ表示"
          value={props.striped ?? true}
          onChange={(striped) => updateProps({ striped })}
        />
        <CheckboxInput
          label="ボーダー表示"
          value={props.bordered ?? true}
          onChange={(bordered) => updateProps({ bordered })}
        />
        <CheckboxInput
          label="ホバー効果"
          value={props.hoverable ?? true}
          onChange={(hoverable) => updateProps({ hoverable })}
        />
        <ColorInput
          label="ヘッダー背景色"
          value={props.headerBgColor || '#F3F4F6'}
          onChange={(headerBgColor) => updateProps({ headerBgColor })}
        />
        <ColorInput
          label="ヘッダーテキスト色"
          value={props.headerTextColor || '#111827'}
          onChange={(headerTextColor) => updateProps({ headerTextColor })}
        />
      </PropertySection>
      <PropertySection title="データ">
        <p className="text-xs text-gray-500">
          テーブルデータの編集は将来のバージョンで実装予定です
        </p>
      </PropertySection>
    </>
  );
}

function SelectWidgetProperties({
  props,
  updateProps,
}: {
  props: any;
  updateProps: (updates: Record<string, any>) => void;
}) {
  return (
    <>
      <PropertySection title="セレクト">
        <TextInput
          label="ラベル"
          value={props.label || 'Select'}
          onChange={(label) => updateProps({ label })}
        />
        <TextInput
          label="プレースホルダー"
          value={props.placeholder || 'Choose an option...'}
          onChange={(placeholder) => updateProps({ placeholder })}
        />
        <CheckboxInput
          label="必須項目"
          value={props.required || false}
          onChange={(required) => updateProps({ required })}
        />
      </PropertySection>
      <PropertySection title="オプション">
        <p className="text-xs text-gray-500">
          オプションの編集は将来のバージョンで実装予定です
        </p>
      </PropertySection>
    </>
  );
}
