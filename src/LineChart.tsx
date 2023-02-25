import { useEffect, useRef } from 'react';
import { map, range, extent, max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

interface DataPoint {
  x: number;
  y: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Config {
  x?: (d: DataPoint) => number;
  y?: (d: DataPoint) => number;
  width?: number;
  height?: number;
  margin?: Margin;
}

interface Props {
  data: DataPoint[];
  config: Config;
}

export function LineChart({ data, config }: Props) {
  const {
    x = (d) => d.x,
    y = (d) => d.y,
    width = 640,
    height = 400,
    margin = { top: 20, right: 30, bottom: 30, left: 40 },
  } = config;

  const svgRef = useRef<SVGSVGElement>(null);

  const X = map(data, x);
  const Y = map(data, y);
  const I = range(X.length);

  const xDomain = extent(X) as [number, number];
  const yDomain = [0, max(Y)] as [number, number];

  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  const xScale = scaleLinear().domain(xDomain).range(xRange);
  const yScale = scaleLinear().domain(yDomain).range(yRange);

  const xAxis = axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = axisLeft(yScale).ticks(height / 40);

  useEffect(() => {
    const svg = select(svgRef.current);

    const coordinates = I.map((i) => ({ x: X[i], y: Y[i] }));
    const linePlot = line<DataPoint>()
      .x((d) => xScale(x(d)))
      .y((d) => yScale(y(d)));
    const pathData = linePlot(coordinates) || '';

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
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

    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-opacity', 1)
      .attr('d', pathData);
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
}
