import d3 from "d3"; // TODO: Modularize D3 imports
import React, { Component } from "react";

interface IProps {
  readonly bins: number;
  readonly value: () => number; // accessor function
  readonly data: number[];
  readonly width: number;
  readonly height: number;
  readonly axisMargin: number;
  readonly bottomMargin: number;
  readonly x: number;
  readonly y: number;
}

class Histogram extends Component<IProps, any> {
  private histogram: d3.HistogramGenerator<number, number>;
  private widthScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;

  constructor(props: IProps) {
    super(props);
    this.histogram = d3.histogram();
    this.widthScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.updateD3(props);
  }

  public componentWillReceiveProps(newProps: IProps) {
    return 1;
  }

  public render() {
    return null;
  }

  private updateD3(props: IProps) {
    this.histogram
      .thresholds(props.bins)
      .value(props.value);
    const bars = this.histogram(props.data);
    const counts = bars.map(d => d.length);

    const xRangeMax = props.width - props.axisMargin;
    this.widthScale
      .domain(d3.extent(counts) as number[])
      .range([0, xRangeMax]);

    const yDomainMax = d3.max(bars, d => d.x1) as number;
    const yRangeMax = props.height - props.y - props.bottomMargin;
    this.yScale
      .domain([0, yDomainMax])
      .range([0, yRangeMax]);
  }
}

export default Histogram;
