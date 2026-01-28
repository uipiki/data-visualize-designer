/**
 * 自然な目盛り間隔を計算する
 * 1, 2, 5, 10, 20, 50, 100... のような読みやすい間隔を返す
 */
export function calculateNiceTickInterval(maxValue: number, targetTickCount: number = 5): number {
  if (maxValue <= 0) return 1;

  const roughInterval = maxValue / targetTickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughInterval)));
  const normalized = roughInterval / magnitude;

  let niceNormalized: number;
  if (normalized <= 1) {
    niceNormalized = 1;
  } else if (normalized <= 2) {
    niceNormalized = 2;
  } else if (normalized <= 5) {
    niceNormalized = 5;
  } else {
    niceNormalized = 10;
  }

  return niceNormalized * magnitude;
}

/**
 * 自然な目盛り値の配列を生成する
 * 原点は必ず0から始まる
 */
export function calculateNiceTicks(maxValue: number, targetTickCount: number = 5): number[] {
  if (maxValue <= 0) return [0];

  const interval = calculateNiceTickInterval(maxValue, targetTickCount);
  const niceMax = Math.ceil(maxValue / interval) * interval;
  const ticks: number[] = [];

  for (let tick = 0; tick <= niceMax; tick += interval) {
    ticks.push(tick);
  }

  return ticks;
}

/**
 * 数値を適切にフォーマットする
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }
  return value.toFixed(1);
}
