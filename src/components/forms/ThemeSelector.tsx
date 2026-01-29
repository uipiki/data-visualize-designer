'use client';

import { ColorTheme } from '@/types/chart';
import { COLOR_THEMES, PresetColorTheme } from '@/constants/colorThemes';
import { generateColorGradient, isValidHexColor } from '@/utils/generateColorTheme';

interface ThemeSelectorProps {
  selected: ColorTheme;
  onChange: (theme: ColorTheme) => void;
  customBaseColor: string | null;
  onCustomBaseColorChange: (color: string | null) => void;
}

export default function ThemeSelector({
  selected,
  onChange,
  customBaseColor,
  onCustomBaseColorChange,
}: ThemeSelectorProps) {
  const themes = Object.entries(COLOR_THEMES) as [PresetColorTheme, typeof COLOR_THEMES[PresetColorTheme]][];

  // カスタムカラーから生成されるプレビュー色
  const customPreviewColors = customBaseColor && isValidHexColor(customBaseColor)
    ? generateColorGradient(customBaseColor).slice(0, 4)
    : null;

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onCustomBaseColorChange(color);
    // 有効な色の場合、カスタムテーマを選択
    if (isValidHexColor(color)) {
      onChange('custom');
    }
  };

  const handleCustomClick = () => {
    if (customBaseColor && isValidHexColor(customBaseColor)) {
      onChange('custom');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        カラーテーマ
      </label>
      <div className="grid grid-cols-5 gap-3">
        {themes.map(([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative group flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
              selected === key
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            aria-label={`${theme.label}テーマを選択`}
          >
            {/* カラープレビュー */}
            <div className="flex gap-0.5 mb-2">
              {theme.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-6 first:rounded-l last:rounded-r"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {/* ラベル */}
            <span className="text-xs font-medium text-gray-700">
              {theme.label}
            </span>
            {/* 選択インジケーター */}
            {selected === key && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* カスタムカラー */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">カスタム</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customBaseColor || '#3B82F6'}
              onChange={handleCustomColorChange}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
              aria-label="カスタムカラーを選択"
            />
            <input
              type="text"
              value={customBaseColor || ''}
              onChange={(e) => {
                const value = e.target.value;
                onCustomBaseColorChange(value);
                if (isValidHexColor(value)) {
                  onChange('custom');
                }
              }}
              placeholder="#3B82F6"
              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="カスタムカラーコードを入力"
            />
          </div>
          {/* カスタムカラーのプレビュー */}
          {customPreviewColors && (
            <button
              type="button"
              onClick={handleCustomClick}
              className={`relative flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                selected === 'custom'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              aria-label="カスタムテーマを選択"
            >
              <div className="flex gap-0.5">
                {customPreviewColors.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-6 first:rounded-l last:rounded-r"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {/* 選択インジケーター */}
              {selected === 'custom' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {selected === 'custom' && customBaseColor
          ? 'カスタムカラーを使用'
          : COLOR_THEMES[selected as PresetColorTheme]?.description || ''
        }
      </p>
    </div>
  );
}
