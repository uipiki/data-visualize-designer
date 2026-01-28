import { ColorTheme, ColorThemeConfig, ColorMode } from '@/types/chart';

export const COLOR_THEMES: Record<ColorTheme, ColorThemeConfig> = {
  blue: {
    name: 'blue',
    label: 'Blue',
    description: '汎用・ビジネス',
    colors: [
      '#1E40AF', // 最も濃い
      '#2563EB',
      '#3B82F6',
      '#60A5FA',
      '#93C5FD',
      '#BFDBFE',
      '#DBEAFE',
      '#EFF6FF', // 最も薄い
    ],
  },
  green: {
    name: 'green',
    label: 'Green',
    description: '成長・環境',
    colors: [
      '#166534',
      '#15803D',
      '#22C55E',
      '#4ADE80',
      '#86EFAC',
      '#BBF7D0',
      '#DCFCE7',
      '#F0FDF4',
    ],
  },
  purple: {
    name: 'purple',
    label: 'Purple',
    description: 'クリエイティブ',
    colors: [
      '#5B21B6',
      '#6D28D9',
      '#8B5CF6',
      '#A78BFA',
      '#C4B5FD',
      '#DDD6FE',
      '#EDE9FE',
      '#F5F3FF',
    ],
  },
  gray: {
    name: 'gray',
    label: 'Gray',
    description: 'ニュートラル',
    colors: [
      '#374151',
      '#4B5563',
      '#6B7280',
      '#9CA3AF',
      '#D1D5DB',
      '#E5E7EB',
      '#F3F4F6',
      '#F9FAFB',
    ],
  },
  orange: {
    name: 'orange',
    label: 'Orange',
    description: 'エネルギー',
    colors: [
      '#C2410C',
      '#EA580C',
      '#F97316',
      '#FB923C',
      '#FDBA74',
      '#FED7AA',
      '#FFEDD5',
      '#FFF7ED',
    ],
  },
};

export const DEFAULT_THEME: ColorTheme = 'blue';

/**
 * データ数に応じて適切な色を返す（棒グラフ用）
 * 濃い色から順に使用し、色覚異常にも配慮した明度差を確保
 */
export function getColorsForData(
  theme: ColorTheme,
  count: number,
  mode: ColorMode = 'gradient',
  highlightedIndices?: number[]
): string[] {
  const themeColors = COLOR_THEMES[theme].colors;

  if (count <= 0) return [];

  // 同色モード：中程度の濃さの色で統一
  if (mode === 'monochrome') {
    return Array(count).fill(themeColors[2]);
  }

  // 強調モード：選択されたインデックスは濃い色、それ以外はグレー
  if (mode === 'emphasis') {
    const emphasisColor = themeColors[1];
    const grayColor = '#D1D5DB'; // gray-300
    return Array.from({ length: count }, (_, i) =>
      highlightedIndices?.includes(i) ? emphasisColor : grayColor
    );
  }

  // グラデーションモード（既存ロジック）
  if (count === 1) return [themeColors[2]]; // 中間の濃さ
  if (count >= themeColors.length) {
    return themeColors.slice(0, count);
  }

  // データ数に応じて等間隔で色を選択（濃い方から）
  const step = (themeColors.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) =>
    themeColors[Math.round(i * step)]
  );
}

/**
 * 折れ線グラフ用の色を返す
 * 線は濃い色でないと見えないので、濃い色のみを使用
 */
export function getColorsForLine(
  theme: ColorTheme,
  count: number,
  mode: ColorMode = 'gradient',
  highlightedIndices?: number[]
): string[] {
  const themeColors = COLOR_THEMES[theme].colors;
  // 濃い方の4色のみ使用
  const darkColors = themeColors.slice(0, 4);

  if (count <= 0) return [];

  // 同色モード：すべて同じ濃い色
  if (mode === 'monochrome') {
    return Array(count).fill(darkColors[1]);
  }

  // 強調モード：選択されたインデックスは濃い色、それ以外はグレー
  if (mode === 'emphasis') {
    const emphasisColor = darkColors[1];
    const grayColor = '#9CA3AF'; // gray-400（線は濃いめのグレー）
    return Array.from({ length: count }, (_, i) =>
      highlightedIndices?.includes(i) ? emphasisColor : grayColor
    );
  }

  // グラデーションモード（既存ロジック）
  if (count === 1) return [darkColors[1]];
  if (count <= darkColors.length) {
    return darkColors.slice(0, count);
  }
  // 4系列以上は繰り返し
  return Array.from({ length: count }, (_, i) => darkColors[i % darkColors.length]);
}
