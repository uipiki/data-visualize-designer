'use client';

import { useRef, useState } from 'react';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import VerticalBarChart from '@/components/charts/VerticalBarChart';
import LineChart from '@/components/charts/LineChart';
import DataInputForm from '@/components/forms/DataInputForm';
import LineDataInputForm from '@/components/forms/LineDataInputForm';
import ChartTypeSelector from '@/components/forms/ChartTypeSelector';
import ThemeSelector from '@/components/forms/ThemeSelector';
import DownloadButtons from '@/components/ui/DownloadButtons';
import { ChartData, ChartType, ColorTheme, ColorMode, CurveType, LegendStyle, AspectRatio, DataItem, LineChartData, SeriesData } from '@/types/chart';
import { DEFAULT_THEME } from '@/constants/colorThemes';
import { generateColorGradient, isValidHexColor } from '@/utils/generateColorTheme';

// 棒グラフ用初期データ
const initialBarItems: DataItem[] = [
  { id: '1', label: 'フリーザ', value: 530000 },
  { id: '2', label: 'ギニュー', value: 120000 },
  { id: '3', label: 'リクーム', value: 71000 },
  { id: '4', label: 'ジース', value: 64000 },
  { id: '5', label: 'バータ', value: 68000 },
];

// 折れ線グラフ用初期データ
const initialXLabels = ['1月', '2月', '3月', '4月', '5月', '6月'];
const initialSeries: SeriesData[] = [
  { id: '1', name: '売上', values: [100, 120, 115, 140, 160, 180] },
  { id: '2', name: '利益', values: [30, 35, 32, 45, 55, 70] },
];

export default function Home() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('horizontal-bar');
  const [theme, setTheme] = useState<ColorTheme>(DEFAULT_THEME);
  const [customBaseColor, setCustomBaseColor] = useState<string | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>('gradient');
  const [highlightedBarIndices, setHighlightedBarIndices] = useState<number[]>([0]);
  const [highlightedLineIndices, setHighlightedLineIndices] = useState<number[]>([0]);
  const [settingsOpen, setSettingsOpen] = useState(true);

  // 棒グラフ用state
  const [barTitle, setBarTitle] = useState('私の戦闘力は53万です');
  const [barItems, setBarItems] = useState<DataItem[]>(initialBarItems);

  // 折れ線グラフ用state
  const [lineTitle, setLineTitle] = useState('売上と利益の推移');
  const [xLabels, setXLabels] = useState<string[]>(initialXLabels);
  const [series, setSeries] = useState<SeriesData[]>(initialSeries);
  const [curveType, setCurveType] = useState<CurveType>('curved');
  const [legendStyle, setLegendStyle] = useState<LegendStyle>('inline');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:3');

  const barChartData: ChartData = {
    title: barTitle,
    items: barItems.filter((item) => item.label && item.value > 0),
  };

  const lineChartData: LineChartData = {
    title: lineTitle,
    xLabels: xLabels.filter((l) => l),
    series: series.filter((s) => s.name && s.values.some((v) => v > 0)),
  };

  const hasValidData =
    chartType === 'line'
      ? lineChartData.xLabels.length > 0 && lineChartData.series.length > 0
      : barChartData.items.length > 0;

  const currentTitle = chartType === 'line' ? lineTitle : barTitle;

  // カスタムカラーの生成
  const customColors = customBaseColor && isValidHexColor(customBaseColor)
    ? generateColorGradient(customBaseColor)
    : undefined;

  const getChartHeight = (width: number): number => {
    switch (aspectRatio) {
      case '1:1':
        return width;
      case '4:3':
        return Math.round(width * 3 / 4);
      case '16:9':
        return Math.round(width * 9 / 16);
      default:
        return Math.round(width * 3 / 4);
    }
  };

  const renderChart = () => {
    const chartWidth = 540;
    const chartHeight = getChartHeight(chartWidth);

    switch (chartType) {
      case 'horizontal-bar':
        return (
          <HorizontalBarChart
            data={barChartData}
            theme={theme}
            colorMode={colorMode}
            highlightedIndices={highlightedBarIndices}
            customColors={customColors}
            width={chartWidth}
            height={chartHeight}
          />
        );
      case 'vertical-bar':
        return (
          <VerticalBarChart
            data={barChartData}
            theme={theme}
            colorMode={colorMode}
            highlightedIndices={highlightedBarIndices}
            customColors={customColors}
            width={chartWidth}
            height={chartHeight}
          />
        );
      case 'line':
        return (
          <LineChart
            data={lineChartData}
            theme={theme}
            colorMode={colorMode}
            highlightedIndices={highlightedLineIndices}
            customColors={customColors}
            curveType={curveType}
            legendStyle={legendStyle}
            width={chartWidth}
            height={chartHeight}
          />
        );
    }
  };

  const renderInputForm = () => {
    if (chartType === 'line') {
      return (
        <LineDataInputForm
          title={lineTitle}
          xLabels={xLabels}
          series={series}
          colorMode={colorMode}
          highlightedIndices={highlightedLineIndices}
          onTitleChange={setLineTitle}
          onXLabelsChange={setXLabels}
          onSeriesChange={setSeries}
          onHighlightedIndicesChange={setHighlightedLineIndices}
        />
      );
    }

    return (
      <DataInputForm
        title={barTitle}
        items={barItems}
        colorMode={colorMode}
        highlightedIndices={highlightedBarIndices}
        onTitleChange={setBarTitle}
        onItemsChange={setBarItems}
        onHighlightedIndicesChange={setHighlightedBarIndices}
      />
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Data Visualize Designer
          </h1>
          <p className="text-sm text-gray-500">
            本サイトの出力は
            <a
              href="https://note.com/goando/m/me00d3667f5ce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              goandoさんのデータ視覚化のデザイン
            </a>
            を参考にしています
          </p>
        </div>
      </header>

      {/* 設定エリア - sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 開閉ボタン */}
          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>グラフ設定</span>
            <svg
              className={`w-5 h-5 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 設定コンテンツ */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              settingsOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* 1行目: グラフ種類とカラーテーマ */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex-1">
                  <ChartTypeSelector selected={chartType} onChange={setChartType} />
                </div>
                <div className="flex-1">
                  <ThemeSelector
                    selected={theme}
                    onChange={setTheme}
                    customBaseColor={customBaseColor}
                    onCustomBaseColorChange={setCustomBaseColor}
                  />
                </div>
              </div>

              {/* 2行目: 配色モード */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  配色モード
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setColorMode('gradient')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      colorMode === 'gradient'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="4" height="16" fill="#1E40AF" rx="1" />
                      <rect x="10" y="4" width="4" height="16" fill="#3B82F6" rx="1" />
                      <rect x="16" y="4" width="4" height="16" fill="#93C5FD" rx="1" />
                    </svg>
                    <span className="text-sm font-medium">濃淡</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('monochrome')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      colorMode === 'monochrome'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="4" height="16" fill="#3B82F6" rx="1" />
                      <rect x="10" y="4" width="4" height="16" fill="#3B82F6" rx="1" />
                      <rect x="16" y="4" width="4" height="16" fill="#3B82F6" rx="1" />
                    </svg>
                    <span className="text-sm font-medium">同色</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('emphasis')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      colorMode === 'emphasis'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="4" height="16" fill="#2563EB" rx="1" />
                      <rect x="10" y="4" width="4" height="16" fill="#D1D5DB" rx="1" />
                      <rect x="16" y="4" width="4" height="16" fill="#D1D5DB" rx="1" />
                    </svg>
                    <span className="text-sm font-medium">強調</span>
                  </button>
                </div>
              </div>

              {/* アスペクト比 */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  画像比率
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      aspectRatio === '1:1'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" rx="2" fill="none" />
                    </svg>
                    <span className="text-sm font-medium">1:1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('4:3')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      aspectRatio === '4:3'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" stroke="currentColor" strokeWidth="2" rx="2" fill="none" />
                    </svg>
                    <span className="text-sm font-medium">4:3</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                      aspectRatio === '16:9'
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="1" y="7" width="22" height="10" stroke="currentColor" strokeWidth="2" rx="2" fill="none" />
                    </svg>
                    <span className="text-sm font-medium">16:9</span>
                  </button>
                </div>
              </div>

              {/* 折れ線グラフ専用設定 */}
              {chartType === 'line' && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 border-t border-gray-200">
                  {/* 線のスタイル */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      線のスタイル
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurveType('linear')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                          curveType === 'linear'
                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="4,18 10,10 14,14 20,6" />
                        </svg>
                        <span className="text-sm font-medium">直線</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurveType('curved')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                          curveType === 'curved'
                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M4,18 Q7,10 10,10 T14,14 T20,6" />
                        </svg>
                        <span className="text-sm font-medium">曲線</span>
                      </button>
                    </div>
                  </div>

                  {/* ラベル表示 */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ラベル表示
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLegendStyle('inline')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                          legendStyle === 'inline'
                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="4" y1="12" x2="16" y2="12" />
                          <text x="17" y="13" fontSize="6" fill="currentColor" stroke="none">A</text>
                        </svg>
                        <span className="text-sm font-medium">終端</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLegendStyle('legend')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                          legendStyle === 'legend'
                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="4" y1="8" x2="10" y2="8" />
                          <text x="12" y="9" fontSize="5" fill="currentColor" stroke="none">A</text>
                          <line x1="4" y1="14" x2="10" y2="14" />
                          <text x="12" y="15" fontSize="5" fill="currentColor" stroke="none">B</text>
                        </svg>
                        <span className="text-sm font-medium">凡例</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - 2カラム */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* 左側: 入力フォーム */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderInputForm()}
          </div>

          {/* 右側: プレビュー - sticky */}
          <div className="lg:sticky lg:top-[60px] space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  プレビュー
                </h2>
                {hasValidData && (
                  <DownloadButtons chartRef={chartRef} filename={currentTitle || 'chart'} />
                )}
              </div>

              {hasValidData ? (
                <div
                  ref={chartRef}
                  className="bg-white rounded-lg overflow-hidden"
                >
                  {renderChart()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <p>データを入力するとグラフが表示されます</p>
                </div>
              )}
            </div>

            {/* 原則の説明 */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <p className="text-sm text-blue-800">
                このグラフに適用されているデザイン原則について詳しく知りたい方は
                <a
                  href="https://note.com/goando/m/me00d3667f5ce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
                >
                  データ視覚化のデザイン｜goando
                </a>
                をご覧ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
