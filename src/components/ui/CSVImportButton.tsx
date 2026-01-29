'use client';

import { useRef } from 'react';

interface CSVImportButtonProps {
  onImport: (content: string) => void;
  onError?: (message: string) => void;
}

export default function CSVImportButton({
  onImport,
  onError,
}: CSVImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImport(content);
      }
    };
    reader.onerror = () => {
      onError?.('ファイルの読み込みに失敗しました');
    };
    reader.readAsText(file, 'UTF-8');

    // 同じファイルを再度選択できるようにリセット
    e.target.value = '';
  };

  return (
    <div className="inline-flex items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        CSV取込
      </button>
      <a
        href="https://github.com/uipiki/data-visualize-designer/blob/main/docs/csv-format.md"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        title="CSVフォーマット仕様"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </a>
    </div>
  );
}
