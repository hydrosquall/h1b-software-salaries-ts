import React, { SFC } from 'react';

interface IProps {
  readonly percent: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const HistogramBar: SFC<IProps> = ({ x, y, percent, width, height }) => {
  const translate = `translate(${x},${y})`;
  let label = `${percent.toFixed(0)}%`;
  
  if (percent < 1) {
    label = `${percent.toFixed(2)}%`;
  }
  if (width < 20) {
    label = label.substring(0, -1); // Remove % sign
  }
  if (width < 10) {
    label = ""
  }

  // TODO: investigate these magic numbers
  const rectProps = {
    height: height - 2,
    transform: "translate(0,1)",
    width
  }
  const textProps = {
    x: width - 5,
    y: height / 2 + 3
  }
  return (
    <g transform={translate} className="bar">
      <rect {...rectProps} />
      <text {...textProps}>
        {label}
      </text>
    </g>)

};

export default HistogramBar;