import * as d3 from "d3";
import React, { Component, RefObject, SFC } from "react";
import {D3Blackbox, IBlackbox, IBlackboxProps }from "../D3blackbox";

interface IAxisProps {              // Properties used specifically by axis
  readonly data: object[];
  readonly scale: d3.AxisScale<number>;
}

// WARNING: Presently, only the properties from IBlackbox are validated.
// Unclear how to change D3BlackBox to use the items from IAxisProps too.
interface IAxis extends IBlackbox {
  readonly props: IBlackboxProps & IAxisProps;
}

// const basicAxis = function (this: IAxis) {
const basicAxis = function (this: IAxis) {
  // Goal: Need the Blackbox to be able to include the contents of IAxisProps.
  // Haven't been able to get this to work after a few hours.
  // ROI on this is diminishing, so I'm going to mark this for later.
  const axis = d3
    .axisLeft(this.props.scale)
    .tickFormat(d => `${d3.format(".2s")(d)}`)
    .ticks(this.props.data.length);
  d3.select(this.myRef.current)
    .call(axis as any); // Axis lacks "select" prop in TS definition, so this needs to be coerced

  return null;
}

const Axis = D3Blackbox(basicAxis);
export default Axis;
