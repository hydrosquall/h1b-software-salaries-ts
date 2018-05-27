import * as d3 from "d3";
import React, { Component, RefObject, SFC } from "react";

import {D3Blackbox, IBlackbox }from "../D3blackbox";

interface IProps { // Properties used specifically by axis
  readonly data: object[];
  readonly scale: d3.AxisScale<number>;
}

interface IAxis { // Properties needed to work with the HOC
  readonly props: IProps;
  readonly myRef: React.RefObject<SVGAElement>;
}

const Axis = D3Blackbox(function (this: IAxis) {
  const axis = d3.axisLeft(this.props.scale);
  d3
    .select(this.myRef.current)
    .call(axis as any); // Axis lacks "select" property in TS definition
});

// class Axis extends Component<IProps> {
//   public myRef: React.RefObject<SVGGElement>;

//   constructor(props: IProps) {
//     super(props);
//     this.myRef = React.createRef();
//   }
//   public componentDidMount() {
//     this.renderAxis();
//   }
//   public componentDidUpdate() {
//     this.renderAxis();
//   }
//   public renderAxis() {
//     const axis = d3.axisLeft(this.props.scale);
//     d3.select(this.myRef.current)
//       .call(axis);
//   }
//   public render() {
//     const translate = `translate(${this.props.x}, ${this.props.y})`;
//     return <g transform={translate} ref={this.myRef} />;
//   }
// }

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
