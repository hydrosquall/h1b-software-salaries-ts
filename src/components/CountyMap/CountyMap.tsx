import * as d3 from "d3";
import _ from "lodash";
import React, { Component } from "react";
import * as topojson from "topojson";

import { ICountyValue } from '../../interfaces';
import County from "./County";

interface IProps { // Reflect: better than React proptypes?
  readonly width: number;
  readonly height: number;
  readonly countyValues: ICountyValue[];
  readonly usTopoJson: object;
  readonly x: number;
  readonly y: number;
  readonly zoom: object | null;
  readonly USstateNames: object[];
};

const initialState = {
  USstateNames: [],
  countyNames: [],
  medianIncomes: {},
  techSalaries: [],
  usTopoJson: {}
};

type State = Readonly<typeof initialState>;

class CountyMap extends Component<IProps, State> {
  public state = initialState;
  private projection: d3.GeoProjection;
  private geoPath: d3.GeoPath;
  private quantize: d3.ScaleQuantize<number>; // Alternate: string

  constructor(props: IProps) {
    super(props);

    this.projection = d3.geoAlbersUsa().scale(1280); // TODO: magic number
    this.geoPath = d3.geoPath().projection(this.projection);
    this.quantize = d3.scaleQuantize().range(d3.range(9));

    this.updateD3(props);
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.updateD3(newProps);
  }

  public render() {
    if (!this.props.usTopoJson) {
      return null;
    } else {
      return <div>hello</div>;
    }
  }

  private updateD3(props: IProps) {
    // Adjust projection if the page dims have rescaled
    this.projection
      .translate([props.width / 2, props.height / 2])
      .scale(props.width * 1.3);

    // TODO: Add some code for zooming

    // Adjust domain to avoid the skew from outliers... note these are magic numbers.
    const values = this.props.countyValues;
    if (values) {
      const valueAccessor = (d: ICountyValue) => d.value;
      const scaleLower = d3.quantile(values, 0.15, valueAccessor) || 0; // guard against "undefined"
      const scaleUpper = d3.quantile(values, 0.85, valueAccessor) || 100;
      this.quantize.domain([scaleLower, scaleUpper]);
    }
  }
};

export default CountyMap;
