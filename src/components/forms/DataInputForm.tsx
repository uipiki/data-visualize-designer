'use client';

import { DataItem, ColorMode } from '@/types/chart';

interface DataInputFormProps {
  title: string;
  items: DataItem[];
  colorMode?: ColorMode;
  highlightedIndices?: number[];
  onTitleChange: (title: string) => void;
  onItemsChange: (items: DataItem[]) => void;
  onHighlightedIndicesChange?: (indices: number[]) => void;
}

export default function DataInputForm({
  title,
  items,
  colorMode = 'gradient',
  highlightedIndices = [],
  onTitleChange,
  onItemsChange,
  onHighlightedIndicesChange,
}: DataInputFormProps) {
  const addItem = () => {
    const newItem: DataItem = {
      id: crypto.randomUUID(),
      label: '',
      value: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: 'label' | 'value', value: string | number) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
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
      {/* メッセージ入力（原則1） */}
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
          placeholder="例：売上が昨年比150%に成長"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* データ入力（原則2: 比較対象を用意） */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            比較データ
          </label>
          <button
            type="button"
            onClick={addItem}
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

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3">
              {colorMode === 'emphasis' && (
                <button
                  type="button"
                  onClick={() => toggleHighlight(index)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    highlightedIndices.includes(index)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 text-transparent hover:border-gray-400'
                  }`}
                  aria-label={highlightedIndices.includes(index) ? '強調を解除' : '強調する'}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              )}
              {colorMode !== 'emphasis' && (
                <span className="text-sm text-gray-400 w-6">{index + 1}</span>
              )}
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                placeholder="ラベル"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
              <input
                type="number"
                value={item.value || ''}
                onChange={(e) =>
                  updateItem(item.id, 'value', parseFloat(e.target.value) || 0)
                }
                placeholder="数値"
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-right"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="削除"
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
          ))}
        </div>
      </div>
    </div>
  );
}
