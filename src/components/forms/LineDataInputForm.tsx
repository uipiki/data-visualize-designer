'use client';

import { useState } from 'react';
import { SeriesData, ColorMode } from '@/types/chart';
import CSVImportButton from '@/components/ui/CSVImportButton';
import { parseLineChartCSV } from '@/utils/csvParser';

interface LineDataInputFormProps {
  title: string;
  xLabels: string[];
  series: SeriesData[];
  colorMode?: ColorMode;
  highlightedIndices?: number[];
  onTitleChange: (title: string) => void;
  onXLabelsChange: (labels: string[]) => void;
  onSeriesChange: (series: SeriesData[]) => void;
  onHighlightedIndicesChange?: (indices: number[]) => void;
}

export default function LineDataInputForm({
  title,
  xLabels,
  series,
  colorMode = 'gradient',
  highlightedIndices = [],
  onTitleChange,
  onXLabelsChange,
  onSeriesChange,
  onHighlightedIndicesChange,
}: LineDataInputFormProps) {
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleCSVImport = (content: string) => {
    setCsvError(null);
    const result = parseLineChartCSV(content);
    if (result.success) {
      onXLabelsChange(result.xLabels);
      onSeriesChange(result.series);
    } else {
      setCsvError(result.error.message);
    }
  };

  const addXLabel = () => {
    onXLabelsChange([...xLabels, '']);
    onSeriesChange(
      series.map((s) => ({ ...s, values: [...s.values, 0] }))
    );
  };

  const removeXLabel = (index: number) => {
    if (xLabels.length <= 2) return;
    onXLabelsChange(xLabels.filter((_, i) => i !== index));
    onSeriesChange(
      series.map((s) => ({
        ...s,
        values: s.values.filter((_, i) => i !== index),
      }))
    );
  };

  const updateXLabel = (index: number, value: string) => {
    onXLabelsChange(xLabels.map((l, i) => (i === index ? value : l)));
  };

  const addSeries = () => {
    const newSeries: SeriesData = {
      id: crypto.randomUUID(),
      name: '',
      values: xLabels.map(() => 0),
    };
    onSeriesChange([...series, newSeries]);
  };

  const removeSeries = (id: string) => {
    if (series.length <= 1) return;
    onSeriesChange(series.filter((s) => s.id !== id));
  };

  const updateSeriesName = (id: string, name: string) => {
    onSeriesChange(
      series.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const updateSeriesValue = (id: string, index: number, value: number) => {
    onSeriesChange(
      series.map((s) =>
        s.id === id
          ? { ...s, values: s.values.map((v, i) => (i === index ? value : v)) }
          : s
      )
    );
  };

  const toggleHighlight = (index: number) => {
    if (!onHighlightedIndicesChange) return;
    if (highlightedIndices.includes(index)) {
      onHighlightedIndicesChange(highlightedIndices.filter((i) => i !== index));
    } else {
      onHighlightedIndicesChange([...highlightedIndices, index]);
    }
  };

  return (
    <div className="space-y-6">
      {/* メッセージ入力 */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          伝えたいメッセージ
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="例：売上が右肩上がりで成長"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* X軸ラベル */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            X軸ラベル（時系列など）
          </label>
          <div className="flex items-center gap-2">
            <CSVImportButton
              onImport={handleCSVImport}
              onError={(msg) => setCsvError(msg)}
            />
            <button
              type="button"
              onClick={addXLabel}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              追加
            </button>
          </div>
        </div>

        {csvError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {csvError}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {xLabels.map((label, index) => (
            <div key={index} className="flex items-center gap-1">
              <input
                type="text"
                value={label}
                onChange={(e) => updateXLabel(index, e.target.value)}
                placeholder={`${index + 1}`}
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeXLabel(index)}
                disabled={xLabels.length <= 2}
                className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 系列データ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            データ系列
          </label>
          <button
            type="button"
            onClick={addSeries}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            系列追加
          </button>
        </div>

        <div className="space-y-4">
          {series.map((s, seriesIndex) => (
            <div
              key={s.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                {colorMode === 'emphasis' && (
                  <button
                    type="button"
                    onClick={() => toggleHighlight(seriesIndex)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      highlightedIndices.includes(seriesIndex)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 text-transparent hover:border-gray-400'
                    }`}
                    aria-label={highlightedIndices.includes(seriesIndex) ? '強調を解除' : '強調する'}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
                <span className="text-sm font-medium text-gray-500">
                  系列 {seriesIndex + 1}
                </span>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSeriesName(s.id, e.target.value)}
                  placeholder="系列名"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeSeries(s.id)}
                  disabled={series.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">
                      {xLabels[valueIndex] || valueIndex + 1}
                    </span>
                    <input
                      type="number"
                      value={value || ''}
                      onChange={(e) =>
                        updateSeriesValue(
                          s.id,
                          valueIndex,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
