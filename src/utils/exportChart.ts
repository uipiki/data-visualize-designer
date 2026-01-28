import { toPng, toSvg } from 'html-to-image';

export interface ExportOptions {
  filename?: string;
  backgroundColor?: string;
  pixelRatio?: number;
}

/**
 * DOM要素をPNG画像としてダウンロードする
 */
export async function exportToPng(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { filename = 'chart', backgroundColor = '#ffffff', pixelRatio = 2 } = options;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor,
      pixelRatio,
      cacheBust: true,
    });

    downloadFile(dataUrl, `${filename}.png`);
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error('PNG出力に失敗しました');
  }
}

/**
 * DOM要素をSVG画像としてダウンロードする
 */
export async function exportToSvg(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { filename = 'chart', backgroundColor = '#ffffff' } = options;

  try {
    const dataUrl = await toSvg(element, {
      backgroundColor,
      cacheBust: true,
    });

    downloadFile(dataUrl, `${filename}.svg`);
  } catch (error) {
    console.error('SVG export failed:', error);
    throw new Error('SVG出力に失敗しました');
  }
}

/**
 * Data URLをファイルとしてダウンロードする
 */
function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
