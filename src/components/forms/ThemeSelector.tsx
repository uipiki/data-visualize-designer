'use client';

import { ColorTheme } from '@/types/chart';
import { COLOR_THEMES } from '@/constants/colorThemes';

interface ThemeSelectorProps {
  selected: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

export default function ThemeSelector({ selected, onChange }: ThemeSelectorProps) {
  const themes = Object.entries(COLOR_THEMES) as [ColorTheme, typeof COLOR_THEMES[ColorTheme]][];

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
      <p className="mt-2 text-xs text-gray-500">
        {COLOR_THEMES[selected].description}
      </p>
    </div>
  );
}
