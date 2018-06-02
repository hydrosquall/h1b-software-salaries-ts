import { GeoPermissibleObjects } from "d3";
import { GeometryObject } from "geojson";
import _ from "lodash";
import React, { Component } from "react";


const BlankColor = "rgb(240,240,240)";

// REPLACE WITH D3-SCALE
const ChoroplethColors = _.reverse([
  "rgb(247,251,255)",
  "rgb(222,235,247)",
  "rgb(198,219,239)",
  "rgb(158,202,225)",
  "rgb(107,174,214)",
  "rgb(66,146,198)",
  "rgb(33,113,181)",
  "rgb(8,81,156)",
  "rgb(8,48,107)"
]);

interface IProps {
  readonly zoom: string | null;
  readonly value: number;
  readonly key: string | number | undefined;
  readonly geoPath: d3.GeoPath<any, GeoPermissibleObjects>;
  readonly quantize: d3.ScaleQuantize<number>;
  readonly feature: GeoJSON.Feature<GeometryObject, {}>;
}

class County extends Component<IProps, object> {
  public shouldComponentUpdate(nextProps: IProps, nextState: object) {
    const { zoom, value } = this.props;
    const { zoom: nextZoom, value: nextValue } = nextProps;
    return (zoom !== nextZoom) || (value !== nextValue);
  }

  public render() {
    const { value, geoPath, feature, quantize } = this.props;

    const color = value ? ChoroplethColors[quantize(value)]: BlankColor;
  
    const featurePath = geoPath(feature);
    if (!featurePath) {
      return null
    }  

    return (
      <path
        d={featurePath}
        style={{ fill: color }}
      />
    );
  }
}

export default County;
