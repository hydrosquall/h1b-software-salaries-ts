import * as d3 from "d3"; // TODO: Modularize D3 imports
import React, { Component } from "react";

import { ISalary } from "../../interfaces";
import Axis from './Axis';
import HistogramBar from './Bar';

interface IProps {
  readonly bins: number;
  readonly valueAccessor: (d: ISalary) => number; // accessor function
  readonly data: ISalary[];
  readonly width: number;
  readonly height: number;
  readonly axisMargin: number;
  readonly bottomMargin: number;
  readonly x: number;
  readonly y: number;
}

class Histogram extends Component<IProps, any> {
  private histogram: d3.HistogramGenerator<ISalary, number>;
  private widthScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  constructor(props: IProps) {
    super(props);
    // TODO: figure out how to get compiler to let first argument by ISalary instead of "any". 
    this.histogram = d3.histogram() as d3.HistogramGenerator<any, number>; 
    this.widthScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.updateD3(props);
  }

  public componentWillReceiveProps(newProps: IProps) {
    return 1;
  }

  public render() {
    const translate = `translate(${this.props.x},${this.props.y})`;
    const bars = this.histogram(this.props.data); // note this is duped in updateD3?

    return <g className="histogram" transform={translate}>
        <g className="bars">{bars.map(this.makeBar)}</g>
        <Axis x={this.props.axisMargin - 3} y={0} scale={this.yScale} data={bars} />
      </g>;
  }

  private makeBar = (bar: d3.Bin<ISalary, number>) => {
    const percent = bar.length / this.props.data.length * 100;

    const props = {
      // tslint:disable:object-literal-sort-keys
      x: this.props.axisMargin,
      y: this.yScale(bar.x0),
      width: this.widthScale(bar.length),
      height: this.yScale(bar.x1 - bar.x0),
      key: `histogram-bar-${bar.x0}`,
      percent
      // tslint:enable:object-literal-sort-keys
    }

    return <HistogramBar {...props}/>
  }

  private updateD3(props: IProps) {
    this.histogram
      .thresholds(props.bins)
      .value(props.valueAccessor);
    const bars = this.histogram(props.data);
    const counts = bars.map(d => d.length);

    const xRangeMax = props.width - props.axisMargin;
    this.widthScale
      .domain(d3.extent(counts) as number[]) // Note: we don't floor this to 0?
      .range([0, xRangeMax]);

    const yDomainMax = d3.max(bars, d => d.x1) as number;
    const yRangeMax = props.height - props.y - props.bottomMargin;
    this.yScale
      .domain([0, yDomainMax])
      .range([0, yRangeMax]);
  }
}

export default Histogram;
