'use client';

import React, { useState } from 'react';

interface ToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function Toolbar({
  projectName,
  onProjectNameChange,
  onSave,
  onPreview,
  onExport,
  isSaving = false,
  lastSaved = null,
}: ToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempName(projectName);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      onProjectNameChange(tempName.trim());
    } else {
      setTempName(projectName);
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(projectName);
    setIsEditingName(false);
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) {
      return '未保存';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return 'たった今';
    }
    if (minutes < 60) {
      return `${minutes}分前`;
    }
    if (hours < 24) {
      return `${hours}時間前`;
    }

    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* 左側: プロジェクト名 */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSave();
                }
                if (e.key === 'Escape') {
                  handleNameCancel();
                }
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              style={{ width: '300px' }}
            />
            <button
              onClick={handleNameSave}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleNameCancel}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            onClick={handleNameEdit}
            className="flex items-center gap-2 group"
          >
            <h1 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {projectName}
            </h1>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {/* 最終保存時刻 */}
        {!isEditingName && (
          <span className="text-xs text-gray-500">
            {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>

      {/* 右側: アクションボタン */}
      <div className="flex items-center gap-3">
        {/* 保存ボタン */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              isSaving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }
          `}
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              保存中...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              保存
            </>
          )}
        </button>

        {/* プレビューボタン */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 hover:shadow-md transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          プレビュー
        </button>

        {/* エクスポートボタン */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 hover:shadow-md transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          エクスポート
        </button>
      </div>
    </div>
  );
}
