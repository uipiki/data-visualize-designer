'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData, ColorTheme, ColorMode } from '@/types/chart';
import { getColorsForData } from '@/constants/colorThemes';
import { calculateNiceTicks, formatNumber } from '@/utils/calculateTicks';

interface VerticalBarChartProps {
  data: ChartData;
  theme: ColorTheme;
  colorMode?: ColorMode;
  highlightedIndices?: number[];
  customColors?: string[];
  width?: number;
  height?: number;
  fontFamily?: string;
}

export default function VerticalBarChart({
  data,
  theme,
  colorMode = 'gradient',
  highlightedIndices,
  customColors,
  width = 600,
  height = 400,
  fontFamily = 'system-ui, -apple-system, sans-serif',
}: VerticalBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.items.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // レスポンシブマージン設定
    const isSmall = width < 400;
    const isMedium = width < 500;
    const margin = {
      top: isSmall ? 45 : 60,
      right: isSmall ? 20 : 40,
      bottom: isSmall ? 45 : 60,
      left: isSmall ? 35 : 50,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 色の取得
    const colors = getColorsForData(theme, data.items.length, colorMode, highlightedIndices, customColors);

    // スケール設定
    const maxValue = Math.max(...data.items.map((d) => d.value));
    const ticks = calculateNiceTicks(maxValue, 5);
    const yMax = ticks[ticks.length - 1];

    const xScale = d3
      .scaleBand()
      .domain(data.items.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax]) // 原点は必ずゼロ（原則3）
      .range([innerHeight, 0]);

    // メイングループ
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // タイトル（原則1: 伝えたいメッセージを明確に）
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

    // Y軸（目盛りは最小限 - 原則4）
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

    // 上側だけ角丸のパスを生成
    const radius = 4;
    const createBarPath = (w: number, h: number) => {
      if (h <= 0) return '';
      const r = Math.min(radius, w / 2, h);
      return `M0,${h} L0,${r} Q0,0 ${r},0 L${w - r},0 Q${w},0 ${w},${r} L${w},${h} Z`;
    };

    // 棒グラフ
    const bars = g
      .selectAll('.bar')
      .data(data.items)
      .enter()
      .append('path')
      .attr('class', 'bar')
      .attr('transform', (d) => `translate(${xScale(d.label) || 0},${innerHeight})`)
      .attr('d', createBarPath(xScale.bandwidth(), 0))
      .attr('fill', (_, i) => colors[i]);

    // アニメーション
    bars
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('transform', (d) => `translate(${xScale(d.label) || 0},${yScale(d.value)})`)
      .attr('d', (d) => createBarPath(xScale.bandwidth(), innerHeight - yScale(d.value)));

    // データラベル（棒の上に表示）
    const labels = g
      .selectAll('.label')
      .data(data.items)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.value) - (isSmall ? 4 : 8))
      .attr('text-anchor', 'middle')
      .attr('font-size', isSmall ? '11px' : isMedium ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('fill', '#374151')
      .attr('font-family', fontFamily)
      .attr('opacity', 0)
      .text((d) => formatNumber(d.value));

    labels
      .transition()
      .duration(800)
      .delay(400)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);
  }, [data, theme, colorMode, highlightedIndices, customColors, width, height, fontFamily]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ fontFamily }}
    />
  );
}
