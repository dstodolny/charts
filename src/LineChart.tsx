import { useEffect, useRef } from 'react';
import { map, range, extent, max, InternSet, group } from 'd3-array';
import { select } from 'd3-selection';
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

  const X = map(data, x);
  const Y = map(data, y);

  const xDomain = extent(X) as [Date, Date];
  const yDomain = [0, max(Y)] as [number, number];

  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  const xScale = scaleTime().domain(xDomain).range(xRange);
  const yScale = scaleLinear().domain(yDomain).range(yRange);

  const xAxis = axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = axisLeft(yScale).ticks(height / 60); // should be with yFormat

  useEffect(() => {
    const svg = select(svgRef.current);

    svg.style('-webkit-tap-highlight-color', 'transparent');
    // .on('pointerenter', pointerentered)
    // .on('pointermove', pointermoved)
    // .on('pointerleave', pointerleft)
    // .on('touchstart', (event) => event.preventDefault());

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

    const linePlot = line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.sales));

    svg
      .selectAll('path')
      .data(group(data, (d) => d.brand))
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('d', (d) => linePlot(d[1]));
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
}
