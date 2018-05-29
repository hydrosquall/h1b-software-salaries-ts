import * as d3 from "d3";
import React, { Component } from 'react'; 
import { ISalary } from "../interfaces";

interface IProps {
  readonly data: ISalary[];
  readonly valueAccessor: (d: ISalary) => number;
  readonly y: number;
  readonly x: number;
  readonly median?: number;
  readonly height: number;
  readonly width: number;
  readonly bottomMargin: number;
}

class MedianLine extends Component<IProps> {
  private yScale: d3.ScaleLinear<number, number>;

  public componentWillMount() {
    this.yScale = d3.scaleLinear(); 
    this.yScale.clamp(true);
    this.updateD3(this.props);
  }
  public componentWillReceiveProps(newProps: IProps) {
    this.updateD3(newProps);
  }
  
  public render() {
    if (this.props.data.length === 0) {
      return null;
    }

    const median = this.props.median || d3.median(this.props.data, this.props.valueAccessor) as number;
    const yStart = 5;
    const line = d3.line()([[0, yStart], // Draws a line starting at point 0,5, and ending at (width, 5)
                            [this.props.width, yStart]]); // 5 px are for the label!
    const tickFormat = this.yScale.tickFormat();

    const translate = `translate(${this.props.x},${this.yScale(median)})`;
    const medianLabel = `Median Household: $${tickFormat(median)}`;

    return (
      <g className="mean" transform={translate}>
        <text x={this.props.width - 5} y="0">
          {medianLabel}
        </text>
        <path d={line as string} />
      </g>
    );
  }

  private updateD3(props: IProps) {
    const yDomainMax = d3.max(props.data, props.valueAccessor) as number;
    const yRangeMax = props.height - props.y - props.bottomMargin;
    this.yScale
      .domain([0, yDomainMax])
      .range([0, yRangeMax]);
  } 
}
export default MedianLine;
