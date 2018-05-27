// HOC by Swizec to help with auto-re-rendering when data changes
import React, { Component } from 'react';

// TODO: Learn how to pass-in an interface from the wrapped child too
// medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
// https://www.triplet.fi/blog/react-higher-order-components-hoc-using-typescript/
// https://dev.to/danhomola/react-higher-order-components-in-typescript-made-simple
// Promising, but the wrapper needs to know about the wrapped item's props in advance, which won't scale.
// gist.github.com/rosskevin/6c103846237ecbc77862ea0f3218187d

// About "this"
// https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript

// Swizec and the latest HOC technique
// https://swizec.com/blog/livecoding-recap-new-more-versatile-react-pattern/swizec/8302

interface IBlackboxProps {
  // ExternalProps
  readonly x: number;
  readonly y: number;
  // HACK: Permit additional properties through unconditionally. See TODO at page top
  // for investigating how to make HOC validate using the interface of the thing that is being
  // wrapped, too.
  [extras: string]: any;
}
interface IBlackbox extends Component<IBlackboxProps> {
  myRef: React.RefObject<SVGAElement>;
}

const D3Blackbox = (D3render: (props: any) => void) => {
  return class Blackbox extends Component<IBlackboxProps> implements IBlackbox {
    public myRef: React.RefObject<SVGAElement>;

    constructor(props: IBlackboxProps) {
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
export { D3Blackbox, IBlackbox, IBlackboxProps };