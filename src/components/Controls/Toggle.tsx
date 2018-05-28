import React, { Component } from 'react';
// import _ from 'lodash';

interface IProps {
  readonly name: string;
  readonly label: string;
  readonly value: string;
  readonly onClick: (name: string, selected: boolean) => void;
}
class Toggle extends Component<IProps, any> {
  public handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onClick(this.props.name, !this.props.value); // toggle
  }

  public render() {
    let className = "btn btn-default";
    if (this.props.value) {
      className += ' btn-primary';
    }
    
    return (
      <button className={className} 
              onClick={this.handleClick}>
        {this.props.label}
      </button>
      )
  }
}

export default Toggle;