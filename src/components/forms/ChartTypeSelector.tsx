'use client';

import { ChartType } from '@/types/chart';

interface ChartTypeSelectorProps {
  selected: ChartType;
  onChange: (type: ChartType) => void;
}

const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'horizontal-bar',
    label: '横棒',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="16" height="4" rx="1" />
        <rect x="2" y="10" width="12" height="4" rx="1" />
        <rect x="2" y="16" width="20" height="4" rx="1" />
      </svg>
    ),
  },
  {
    type: 'vertical-bar',
    label: '縦棒',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="8" width="4" height="14" rx="1" />
        <rect x="10" y="4" width="4" height="18" rx="1" />
        <rect x="16" y="12" width="4" height="10" rx="1" />
      </svg>
    ),
  },
  {
    type: 'line',
    label: '折れ線',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,18 9,10 14,14 20,6" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
        <circle cx="20" cy="6" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ChartTypeSelector({
  selected,
  onChange,
}: ChartTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        グラフタイプ
      </label>
      <div className="flex gap-2">
        {chartTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              selected === type
                ? 'border-gray-900 bg-gray-50 text-gray-900'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
