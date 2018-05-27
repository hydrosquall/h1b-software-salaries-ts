import * as d3 from "d3";
import React, { Component, RefObject, SFC } from "react";

// import D3blackbox from "../D3blackbox";

interface IProps {
  readonly data: object[];
  readonly scale: d3.AxisScale<number>;
  readonly x: number;
  readonly y: number;
}

class Axis extends Component<IProps> {
  public myRef: React.RefObject<SVGGElement>;

  constructor(props: IProps) {
    super(props);
    this.myRef = React.createRef();
  }

  public componentDidMount() {
    this.renderAxis();
  }
  public componentDidUpdate() {
    this.renderAxis();
  }
  public renderAxis() {
    const axis = d3.axisLeft(this.props.scale);
    d3.select(this.refs.g as any).call(axis);
  }
  public render() {
    // tslint:disable-next-line:jsx-no-string-ref
    return <g transform="translate(10, 30)" ref="g" />;
  }
}

// const Axis = D3blackbox(function (this: any): Component<IProps & D3blackbox.IProps> {
//   const axis = d3.axisLeft(this.props.scale)
//     // .tickFormat(d => `${d3.format(".2s")(d)}`)
//     .ticks(this.props.data.length);
//   d3.select(this.myRef).call(axis);
// })

// interface IWrappedComponent = Component<IProps, any>;

// class Axis extends Component<IProps, any> {
//   public ref: RefObject<HTMLInputElement>;

//   public constructor(props: any) {
//     super(props);
//     this.ref = React.createRef();
//   }
//   public render() { 
    
//     return D3blackbox(function (this: IProps) {
//       const axis = d3.axisLeft(this.props.scale)
//         .tickFormat(d => `${d3.format(".2s")(d)}`)
//         .ticks(this.props.data.length);
//       d3.select(this.refs.anchor).call(axis);
//     });
//   }
// }


export default Axis;
