import { useEffect, useRef } from 'react';
import { map, range, extent, max, InternSet, group } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleUtc } from 'd3-scale';
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

interface Config {
  x: (d: DataPoint) => Date;
  y: (d: DataPoint) => number;
  z: (d: DataPoint) => string;
  width: number;
  height: number;
  margin?: Margin;
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
    width,
    height,
    margin = { top: 20, right: 30, bottom: 30, left: 40 },
  } = config;

  const svgRef = useRef<SVGSVGElement>(null);

  const X = map(data, x);
  const Y = map(data, y);
  const Z = map(data, z);
  const O = map(data, (d) => d);

  const xDomain = extent(X, (d) => d) as [Date, Date];
  const yDomain = [0, max(Y)] as [number, number];
  const zDomain = new InternSet(Z);

  // Omit any data not present in the z-domain.
  const I = range(X.length).filter((i) => zDomain.has(Z[i]));

  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];

  const xScale = scaleUtc().domain(xDomain).range(xRange);
  const yScale = scaleLinear().domain(yDomain).range(yRange);

  const xAxis = axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = axisLeft(yScale).ticks(height / 60); // should be with yFormat

  useEffect(() => {
    const svg = select(svgRef.current);

    const linePlot = line()
      .x((i) => xScale(X[i]))
      .y((i) => yScale(Y[i]));

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

    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-opacity', 1)
      .selectAll('path')
      .data(group(I, (i) => Z[i]))
      .join('path')
      .attr('stroke', 'currentColor')
      .style('mix-blend-mode', 'multiply')
      .attr('d', ([, I]) => linePlot(I));

    const dot = svg.append('g').attr('display', 'none');
    dot.append('circle').attr('r', 2.5);
  }, [data]);

  return <svg ref={svgRef} width={width} height={height} />;
}
