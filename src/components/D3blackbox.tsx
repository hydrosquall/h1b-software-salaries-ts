// HOC by Swizec to help with auto-re-rendering when data changes
import React, { Component } from 'react';

interface IBlackbox {
  readonly x: number;
  readonly y: number;
}

const D3Blackbox = (D3render: any) => {
  return class Blackbox extends Component<any> {
    public myRef: React.RefObject<SVGAElement>;

    constructor(props: IBlackbox) {
      super(props);
      this.myRef = React.createRef();
    }

    public componentDidMount() {
      D3render.call(this);
    }
    public componentDidUpdate() {
      D3render.call(this);
    }

    public render() {
      const { x, y } = this.props;
      return <g transform={`translate(${x}, ${y})`} ref={this.myRef} />;
    }
  };
};

export default D3Blackbox;
export { D3Blackbox, IBlackbox };