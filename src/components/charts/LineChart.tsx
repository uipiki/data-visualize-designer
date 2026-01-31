'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LineChartData, ColorTheme, ColorMode, CurveType, LegendStyle } from '@/types/chart';
import { getColorsForLine } from '@/constants/colorThemes';
import { calculateNiceTicks, formatNumber } from '@/utils/calculateTicks';

interface LineChartProps {
  data: LineChartData;
  theme: ColorTheme;
  colorMode?: ColorMode;
  highlightedIndices?: number[];
  customColors?: string[];
  curveType?: CurveType;
  legendStyle?: LegendStyle;
  width?: number;
  height?: number;
  fontFamily?: string;
}

export default function LineChart({
  data,
  theme,
  colorMode = 'gradient',
  highlightedIndices,
  customColors,
  curveType = 'curved',
  legendStyle = 'inline',
  width = 600,
  height = 400,
  fontFamily = 'system-ui, -apple-system, sans-serif',
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.series.length === 0 || data.xLabels.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // レスポンシブマージン設定
    const isSmall = width < 400;
    const isMedium = width < 500;
    const margin = {
      top: isSmall ? 45 : 60,
      right: legendStyle === 'inline'
        ? (isSmall ? 50 : 80)
        : (isSmall ? 80 : 120),
      bottom: isSmall ? 45 : 60,
      left: isSmall ? 35 : 50,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 色の取得（折れ線は濃い色のみ使用）
    const colors = getColorsForLine(theme, data.series.length, colorMode, highlightedIndices, customColors);

    // スケール設定
    const allValues = data.series.flatMap((s) => s.values);
    const maxValue = Math.max(...allValues);
    const ticks = calculateNiceTicks(maxValue, 5);
    const yMax = ticks[ticks.length - 1];

    const xScale = d3
      .scalePoint()
      .domain(data.xLabels)
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // メイングループ
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // タイトル
    if (data.title) {
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', isSmall ? 24 : 32)
        .attr('text-anchor', 'middle')
        .attr('font-size', isSmall ? '14px' : isMedium ? '16px' : '18px')
        .attr('font-weight', '600')
        .attr('fill', '#1f2937')
        .attr('font-family', fontFamily)
        .text(data.title);
    }

    // X軸
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(isSmall ? 8 : 12);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('font-size', isSmall ? '11px' : isMedium ? '12px' : '14px')
          .attr('fill', '#374151')
          .attr('font-weight', '500')
          .attr('font-family', fontFamily)
      );

    // Y軸
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(ticks)
      .tickFormat((d) => formatNumber(d as number))
      .tickSize(0)
      .tickPadding(isSmall ? 4 : 8);

    g.append('g')
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('font-size', isSmall ? '10px' : '12px')
          .attr('fill', '#6b7280')
          .attr('font-family', fontFamily)
      );

    // 0の基準線
    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight)
      .attr('x2', innerWidth)
      .attr('y2', innerHeight)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 1);

    // 折れ線のパス生成
    const curve = curveType === 'linear' ? d3.curveLinear : d3.curveMonotoneX;
    const line = d3
      .line<number>()
      .x((_, i) => xScale(data.xLabels[i]) || 0)
      .y((d) => yScale(d))
      .curve(curve);

    // 各系列を描画
    data.series.forEach((series, seriesIndex) => {
      const color = colors[seriesIndex];
      const lastValue = series.values[series.values.length - 1];
      const lastX = xScale(data.xLabels[data.xLabels.length - 1]) || 0;
      const lastY = yScale(lastValue);

      // 折れ線
      const path = g
        .append('path')
        .datum(series.values)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', isSmall ? 2 : 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line);

      // 線のアニメーション
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .delay(seriesIndex * 200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // インラインラベル（線の終端）
      if (legendStyle === 'inline') {
        g.append('text')
          .attr('x', lastX + (isSmall ? 4 : 8))
          .attr('y', lastY)
          .attr('dy', '0.35em')
          .attr('font-size', isSmall ? '10px' : isMedium ? '11px' : '13px')
          .attr('font-weight', '600')
          .attr('fill', color)
          .attr('font-family', fontFamily)
          .attr('opacity', 0)
          .text(series.name || `系列${seriesIndex + 1}`)
          .transition()
          .duration(400)
          .delay(1000 + seriesIndex * 200)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1);
      }
    });

    // 凡例（legendモードのみ）
    if (legendStyle === 'legend') {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${width - margin.right + (isSmall ? 10 : 20)}, ${margin.top})`);

      data.series.forEach((series, i) => {
        const legendRow = legend
          .append('g')
          .attr('transform', `translate(0, ${i * (isSmall ? 18 : 24)})`);

        legendRow
          .append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', isSmall ? 14 : 20)
          .attr('y2', 0)
          .attr('stroke', colors[i])
          .attr('stroke-width', isSmall ? 2 : 3)
          .attr('stroke-linecap', 'round');

        legendRow
          .append('text')
          .attr('x', isSmall ? 18 : 28)
          .attr('y', 0)
          .attr('dy', '0.35em')
          .attr('font-size', isSmall ? '10px' : '12px')
          .attr('fill', '#374151')
          .attr('font-family', fontFamily)
          .text(series.name || `系列${i + 1}`);
      });
    }
  }, [data, theme, colorMode, highlightedIndices, customColors, curveType, legendStyle, width, height, fontFamily]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ fontFamily }}
    />
  );
}
