export interface DataItem {
  id: string;
  label: string;
  value: number;
}

export interface ChartData {
  title: string;
  items: DataItem[];
}

// 折れ線グラフ用（複数系列対応）
export interface SeriesData {
  id: string;
  name: string;
  values: number[];
}

export interface LineChartData {
  title: string;
  xLabels: string[];
  series: SeriesData[];
}

export type ChartType = 'horizontal-bar' | 'vertical-bar' | 'line';

export type ColorMode = 'gradient' | 'monochrome' | 'emphasis';

export type CurveType = 'linear' | 'curved';

export type LegendStyle = 'legend' | 'inline';

export type ColorTheme = 'blue' | 'green' | 'purple' | 'gray' | 'orange';

export interface ColorThemeConfig {
  name: string;
  label: string;
  colors: string[];
  description: string;
}
