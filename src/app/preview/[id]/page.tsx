'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Widget } from '@/types/widget';
import { renderWidget } from '@/lib/widget-renderer';

interface PreviewData {
  projectName: string;
  widgets: Widget[];
}

export default function PreviewPage() {
  const params = useParams();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreviewData();
  }, [params.id]);

  const loadPreviewData = async () => {
    try {
      setIsLoading(true);

      // 一時プレビューの場合
      if (params.id === 'temp') {
        const data = sessionStorage.getItem('preview-data');
        if (data) {
          setPreviewData(JSON.parse(data));
        } else {
          setError('プレビューデータが見つかりません');
        }
        setIsLoading(false);
        return;
      }

      // データベースからの読み込み（将来的な実装）
      // const response = await fetch(`/api/projects/${params.id}`);
      // if (!response.ok) {
      //   throw new Error('プロジェクトが見つかりません');
      // }
      // const data = await response.json();
      // setPreviewData({
      //   projectName: data.name,
      //   widgets: data.canvas_data.components,
      // });

      // 現在はローカルストレージからフォールバック
      const localData = localStorage.getItem('nocode-builder-project');
      if (localData) {
        const parsed = JSON.parse(localData);
        setPreviewData({
          projectName: parsed.projectName,
          widgets: parsed.widgets,
        });
      } else {
        setError('プロジェクトデータが見つかりません');
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '読み込みエラー');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* プレビューヘッダー */}
      <header className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">プレビューモード</span>
          </div>
          <span className="text-gray-400">|</span>
          <h1 className="text-lg font-semibold">{previewData.projectName}</h1>
        </div>

        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          閉じる
        </button>
      </header>

      {/* プレビューコンテンツ */}
      <main className="p-6">
        <div className="relative min-h-[600px] bg-white border border-gray-200 rounded-lg">
          {previewData.widgets.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-sm">Widget が配置されていません</p>
              </div>
            </div>
          ) : (
            previewData.widgets.map((widget) => (
              <div
                key={widget.id}
                className="absolute"
                style={{
                  left: widget.position.x,
                  top: widget.position.y,
                  width: widget.size.width,
                  height: widget.size.height,
                }}
              >
                {renderWidget(widget)}
              </div>
            ))
          )}
        </div>
      </main>

      {/* プレビュー情報 */}
      <footer className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Widget数:</strong> {previewData.widgets.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            このプレビューは実際のレンダリング結果を示しています。
            エクスポートしたHTMLファイルとは若干異なる場合があります。
          </p>
        </div>
      </footer>
    </div>
  );
}
