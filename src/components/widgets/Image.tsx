'use client';

import React, { memo, CSSProperties, useState } from 'react';
import { ImageWidget, WidgetComponentProps } from '@/types/widget';

/**
 * Image Widget Component
 *
 * 画像を表示するWidget。
 * object-fit、borderRadius、opacityなどの調整が可能。
 *
 * @param {WidgetComponentProps<ImageWidget>} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レンダリングされた画像Widget
 */
const Image: React.FC<WidgetComponentProps<ImageWidget>> = ({
  widget,
  isSelected = false,
  isHovered = false,
  onSelect,
  onHover,
}) => {
  const { src, alt, objectFit, borderRadius, opacity } = widget.props;

  // 画像読み込み状態
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * コンテナスタイル
   */
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  /**
   * 画像スタイル
   */
  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    borderRadius: `${borderRadius}px`,
    opacity: opacity,
    transition: 'opacity 0.3s ease',
    display: imageLoaded ? 'block' : 'none',
  };

  /**
   * プレースホルダー/エラー表示スタイル
   */
  const placeholderStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#9CA3AF',
    textAlign: 'center',
    padding: '16px',
    boxSizing: 'border-box',
  };

  /**
   * 選択状態のスタイル
   */
  const selectedStyle: CSSProperties = isSelected
    ? {
        outline: '2px solid #3B82F6',
        outlineOffset: '2px',
      }
    : {};

  /**
   * ホバー状態のスタイル
   */
  const hoverStyle: CSSProperties = isHovered && !isSelected
    ? {
        outline: '1px dashed #93C5FD',
        outlineOffset: '2px',
      }
    : {};

  /**
   * 最終的なコンテナスタイル
   */
  const finalContainerStyle: CSSProperties = {
    ...containerStyle,
    ...selectedStyle,
    ...hoverStyle,
  };

  /**
   * クリックハンドラ
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  /**
   * マウスエンターハンドラ
   */
  const handleMouseEnter = () => {
    onHover?.();
  };

  /**
   * 画像読み込み成功ハンドラ
   */
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  /**
   * 画像読み込みエラーハンドラ
   */
  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  return (
    <div
      style={finalContainerStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-widget-type="Image"
      data-widget-id={widget.id}
      role="img"
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={imageStyle}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {!imageLoaded && !imageError && (
        <div style={placeholderStyle}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
            <div>画像を読み込み中...</div>
          </div>
        </div>
      )}

      {imageError && (
        <div style={placeholderStyle}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <div>画像の読み込みに失敗しました</div>
            <div style={{ fontSize: '12px', marginTop: '4px', color: '#6B7280' }}>
              URLを確認してください
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * メモ化によるパフォーマンス最適化
 */
export default memo(Image, (prevProps, nextProps) => {
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    JSON.stringify(prevProps.widget.props) === JSON.stringify(nextProps.widget.props)
  );
});
