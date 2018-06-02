import * as d3 from "d3";
import _ from "lodash";
import React, { Component } from "react";
import * as topojson from "topojson";

import { ICountyValue, IStateName } from '../../interfaces';
import County from "./County";

interface IProps { // Reflect: better than React proptypes?
  readonly width: number;
  readonly height: number;
  readonly countyValues: ICountyValue[];
  readonly usTopoJson: topojson.UsAtlas | null;
  readonly x: number;
  readonly y: number;
  readonly zoom: string | null; // bool?
  readonly USstateNames: IStateName[];
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
      const us = this.props.usTopoJson;
      const statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
      const counties = topojson.feature(us, us.objects.counties).features;
      const countyValueMap = _.fromPairs(
        this.props.countyValues
          .map((d: ICountyValue) => [d.countyID, d.value])
      );

      return (
      <g transform={`translate(${this.props.x}, ${this.props.y})`}>
        {counties.map((feature) => (
          <County geoPath={this.geoPath}
                  key={feature.id}
                  feature={feature}
                  zoom={this.props.zoom}
                  quantize={this.quantize}
                  value={countyValueMap[feature.id as string]}
          />
        ))}
        {/* State Borders*/}
        <path d={this.geoPath(statesMesh) as string}
              className='stateBorder'
        />
        </g>
      );
    }
  }

  private updateD3(props: IProps) {
    // Adjust projection if the page dims have rescaled
    this.projection
      .translate([props.width / 2, props.height / 2])
      .scale(props.width * 1.3);

    if (props.zoom && props.usTopoJson) {
        const us = props.usTopoJson;
        const statePaths = topojson.feature(us, us.objects.states).features;
        const { id } = _.find(props.USstateNames, { code: props.zoom }) as IStateName;

      this.projection.scale(props.width * 4.5);

      const centroidId = _.find(statePaths, { id: id as string });
      if (centroidId) {
        const centroid = this.geoPath.centroid(centroidId);
        const translate = this.projection.translate();

        this.projection.translate([
          translate[0] - centroid[0] + props.width / 2,
          translate[1] - centroid[1] + props.height / 2
        ]);
      }
    }

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
