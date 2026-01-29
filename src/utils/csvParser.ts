import { DataItem, SeriesData } from '@/types/chart';

export interface CSVParseError {
  type: 'empty' | 'no-data' | 'invalid-number' | 'insufficient-columns';
  message: string;
  row?: number;
  value?: string;
}

export interface BarChartCSVResult {
  success: true;
  items: DataItem[];
}

export interface LineChartCSVResult {
  success: true;
  xLabels: string[];
  series: SeriesData[];
}

export interface CSVErrorResult {
  success: false;
  error: CSVParseError;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSVLines(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');
  return lines.map(parseCSVLine);
}

/**
 * 棒グラフ用CSVをパースする
 * フォーマット:
 * ラベル,値
 * フリーザ,530000
 * ギニュー,120000
 */
export function parseBarChartCSV(
  content: string
): BarChartCSVResult | CSVErrorResult {
  const trimmed = content.trim();
  if (!trimmed) {
    return {
      success: false,
      error: { type: 'empty', message: 'CSVファイルが空です' },
    };
  }

  const rows = parseCSVLines(trimmed);

  if (rows.length < 2) {
    return {
      success: false,
      error: { type: 'no-data', message: 'データ行がありません' },
    };
  }

  // ヘッダー行をスキップしてデータ行をパース
  const items: DataItem[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) {
      return {
        success: false,
        error: {
          type: 'insufficient-columns',
          message: `${i + 1}行目: 列数が不足しています`,
          row: i + 1,
        },
      };
    }

    const label = row[0];
    const valueStr = row[1];
    const value = parseFloat(valueStr);

    if (isNaN(value)) {
      return {
        success: false,
        error: {
          type: 'invalid-number',
          message: `${i + 1}行目: 「${valueStr}」は数値ではありません`,
          row: i + 1,
          value: valueStr,
        },
      };
    }

    items.push({
      id: crypto.randomUUID(),
      label,
      value,
    });
  }

  return { success: true, items };
}

/**
 * 折れ線グラフ用CSVをパースする
 * フォーマット（横持ち形式）:
 * 系列名,1月,2月,3月,4月,5月,6月
 * 売上,100,120,115,140,160,180
 * 利益,30,35,32,45,55,70
 */
export function parseLineChartCSV(
  content: string
): LineChartCSVResult | CSVErrorResult {
  const trimmed = content.trim();
  if (!trimmed) {
    return {
      success: false,
      error: { type: 'empty', message: 'CSVファイルが空です' },
    };
  }

  const rows = parseCSVLines(trimmed);

  if (rows.length < 2) {
    return {
      success: false,
      error: { type: 'no-data', message: 'データ行がありません' },
    };
  }

  // ヘッダー行からX軸ラベルを取得（最初の列は「系列名」などのヘッダーなのでスキップ）
  const headerRow = rows[0];
  if (headerRow.length < 2) {
    return {
      success: false,
      error: {
        type: 'insufficient-columns',
        message: '1行目: 列数が不足しています',
        row: 1,
      },
    };
  }

  const xLabels = headerRow.slice(1);

  // データ行から系列を作成
  const series: SeriesData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) {
      return {
        success: false,
        error: {
          type: 'insufficient-columns',
          message: `${i + 1}行目: 列数が不足しています`,
          row: i + 1,
        },
      };
    }

    const name = row[0];
    const values: number[] = [];

    for (let j = 1; j < row.length && j <= xLabels.length; j++) {
      const valueStr = row[j];
      const value = parseFloat(valueStr);

      if (isNaN(value)) {
        return {
          success: false,
          error: {
            type: 'invalid-number',
            message: `${i + 1}行目: 「${valueStr}」は数値ではありません`,
            row: i + 1,
            value: valueStr,
          },
        };
      }

      values.push(value);
    }

    // 不足している値は0で埋める
    while (values.length < xLabels.length) {
      values.push(0);
    }

    series.push({
      id: crypto.randomUUID(),
      name,
      values,
    });
  }

  return { success: true, xLabels, series };
}
