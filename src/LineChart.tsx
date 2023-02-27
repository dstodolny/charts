import { useEffect, useRef } from 'react';
import { map, extent, max, group } from 'd3-array';
import { select, Selection } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';

interface DataPoint {
  brand: string;
  date: Date;
  sales: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Dimension {
  width: number;
  height: number;
  margin: Margin;
}

interface Config {
  x: (d: DataPoint) => Date;
  y: (d: DataPoint) => number;
  z: (d: DataPoint) => string;
  dimension: Dimension;
}

interface Props {
  data: DataPoint[];
  config: Config;
}

export function LineChart({ data, config }: Props) {
  const {
    x,
    y,
    z,
    dimension: { width, height, margin },
  } = config;
  const svgRef = useRef<SVGSVGElement>(null);

  const xScale = scaleTime()
    .domain(extent(map(data, x)) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const yScale = scaleLinear()
    .domain([0, max(map(data, y))] as [number, number])
    .range([height - margin.bottom, margin.top]);

  const setupSVG = (
    selection: Selection<SVGSVGElement | null, unknown, null, undefined>,
  ) => {
    selection
      .attr('width', width)
      .attr('height', height)
      .style('-webkit-tap-highlight-color', 'transparent');
  };

  const drawGrid = (
    selection: Selection<SVGSVGElement | null, unknown, null, undefined>,
  ) => {
    const xAxis = axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0);
    const yAxis = axisLeft(yScale).ticks(height / 60);
    selection
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);
    selection
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - margin.left - margin.right)
          .attr('stroke-opacity', 0.1),
      );
  };

  const drawLines = (
    selection: Selection<SVGSVGElement | null, unknown, null, undefined>,
  ) => {
    const generateLine = line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.sales));

    const lines = selection
      .selectAll('.line')
      .data(group(data, z))
      .join('path')
      .attr('class', 'line')
      .attr('d', (d) => generateLine(d[1]))
      .attr('fill', 'none')
      .attr('stroke', 'currentColor');
  };

  useEffect(() => {
    select(svgRef.current).call(setupSVG).call(drawGrid).call(drawLines);
  }, [data]);

  return <svg ref={svgRef} />;
}
