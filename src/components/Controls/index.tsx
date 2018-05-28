import _ from 'lodash';
import React, { Component } from 'react';

import { ISalary } from "../../interfaces";
import ControlRow from './ControlRow';



// Extra temporary interfaces until all the metadata shows up
interface IYearFilter { // Temporary because we only filter 1 thing at a time right now
  year: string;
}
interface IFilters {
  yearFilter: (d: any) => boolean;
}
// End Extra Interfaces

interface IProps {
  updateDataFilter: (filter: (d: any) => boolean, filteredBy: IYearFilter) => void;
}

interface IState {
  year: string;
  yearFilter: (d?: ISalary) => boolean;
}

class Controls extends Component<IProps, IState> {
  public state = {
    year: "*",
    yearFilter: () => true,
  }

  public componentDidUpdate(prevProps: any, prevState: IState) {
    this.reportUpdateUpTheChain();
  }

  public shouldComponentUpdate(nextProps: any, nextState: IState) {
    return !_.isEqual(this.state, nextState);
  }

  public render() { 
    return (null);
  }

  private reportUpdateUpTheChain() {
    // This feels convoluted, and I think that centralizing this logic in a reducer will be beneficial.
    
    const filterFunction = (filters: IFilters) => { // If something is clicked, apply the year filter only
      return (d: any) => filters.yearFilter(d);
    };

    this.props.updateDataFilter(
      filterFunction(this.state), // Filter funcionts
      {                           // Filter params
        year: this.state.year
      }
    );
  }

  private updateYearFilter(year: string, reset: boolean) {
    let filter = (d: ISalary) => d.submit_date.getFullYear() === +year;

    if (reset || !year) {
      filter = () => true;
      year = "*";
    }

    this.setState({
      year,
      yearFilter: filter,
    });
  }
}
export default Controls;