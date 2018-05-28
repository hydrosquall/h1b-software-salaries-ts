import _ from "lodash";
import React, { Component } from "react";
import Toggle from "./Toggle";

interface IYearFilter { // Temporary because we only filter 1 thing at a time
  year: string;
}

interface IProps {
  readonly capitalize: boolean;
  readonly toggleNames: string[];
  readonly picked: string;
  readonly updateDataFilter: (criteria: string, reset: boolean) => void; // diff from parent prop with same name
}

interface IState {
  readonly toggleValues: { [key: string]: boolean }
}

class ControlRow extends Component<IProps, IState> {
  public state = {
    toggleValues: {}
  }

  public componentWillMount() {
    const toggles = this.props.toggleNames;
    const toggleValues = _.zipObject(
      toggles,
      toggles.map((name) => name === this.props.picked)
    ); // dictionary where keys are toggleNames, and values are bools
    this.setState({ toggleValues })
  }

  public componentWillReceiveProps(nextProps: IProps) { // let global app state drive local state
    if (this.props.picked !== nextProps.picked) {
      this.makePick(nextProps.picked, true);
    }
  }

  /**
   * makePick Change state toggleValues when a button is clicked
   */
  public makePick = (picked: string, newPickStatus: boolean) => {
    const { toggleValues } = this.state;
    const newToggleValues = _.mapValues(
      toggleValues,
      (value, key) => newPickStatus && (key === picked) // flip pick status for just 1 item... optimize?
    );

    // Reset: "toggle was unclicked without a new one being selected"
    this.props.updateDataFilter(picked, !newPickStatus);
    this.setState({ toggleValues });
  }

  public render() { 
    return (
      <div className="row">
        <div className="col-md-12">
          {this.props.toggleNames.map(this.addToggle)}
        </div>
      </div>
    )
  }

  private addToggle = (name: string) => {
    const key = `toggle-${name}`;
    const label = (this.props.capitalize) ? name.toUpperCase() : name;
    const toggleProps = {
      key,
      label,
      name,
      onClick: this.makePick, // use arrow function?
      value: this.state.toggleValues[name],
    }
    return <Toggle {...toggleProps} />;
  }
}

export default ControlRow;
