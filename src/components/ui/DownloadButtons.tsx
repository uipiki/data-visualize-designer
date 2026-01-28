'use client';

import { useState } from 'react';
import { exportToPng, exportToSvg } from '@/utils/exportChart';

interface DownloadButtonsProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function DownloadButtons({
  chartRef,
  filename = 'chart',
}: DownloadButtonsProps) {
  const [isExporting, setIsExporting] = useState<'png' | 'svg' | null>(null);

  const handleExport = async (format: 'png' | 'svg') => {
    if (!chartRef.current || isExporting) return;

    setIsExporting(format);
    try {
      if (format === 'png') {
        await exportToPng(chartRef.current, { filename, pixelRatio: 3 });
      } else {
        await exportToSvg(chartRef.current, { filename });
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('ダウンロードに失敗しました');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => handleExport('png')}
        disabled={isExporting !== null}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'png' ? (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        PNG
      </button>
      <button
        type="button"
        onClick={() => handleExport('svg')}
        disabled={isExporting !== null}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'svg' ? (
          <svg
            className="w-4 h-4 mr-2 animate-spin"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        SVG
      </button>
    </div>
  );
}
