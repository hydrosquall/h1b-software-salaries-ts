import _ from "lodash";
import React, { Component } from "react";

const BlankColor = "rgb(240,240,240)";

// REPLACE WITH D3-SCALE
const ChoroplethColors = _.reverse([
  'rgb(247,251,255)',
  'rgb(222,235,247)',
  'rgb(198,219,239)',
  'rgb(158,202,225)',
  'rgb(107,174,214)',
  'rgb(66,146,198)',
  'rgb(33,113,181)',
  'rgb(8,81,156)',
  'rgb(8,48,107)'
]);

class County extends Component<any, any> {
  public render() {
    const { value, geoPath, feature, quantize } = this.props;

    let color = BlankColor;

    if (value) {
      color = ChoroplethColors[quantize(value)];
    }

    return (<path
              d={geoPath(feature)}
              style={{fill: color}}
              // title={feature.id} // not supported 
            />)
  }
}

export default County;
