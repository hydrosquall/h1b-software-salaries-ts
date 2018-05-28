import _ from 'lodash';
import React, { Component } from 'react';

import { ISalary } from "../../interfaces";
import ControlRow from './ControlRow';

type filterFunctionType = (d: ISalary) => boolean;

// Extra temporary interfaces until all the metadata shows up
interface IFilterParams {
  jobTitle: string;
  year: string;
}
interface IFilters {
  yearFilter: filterFunctionType;
  jobTitleFilter: filterFunctionType;
}
// End Extra Interfaces

interface IProps {
  updateDataFilter: (filter: filterFunctionType, filteredBy: IFilterParams) => void;
  readonly data: ISalary[];
}

interface IState {
  year: string;
  yearFilter: filterFunctionType;
  jobTitle: string;
  jobTitleFilter: filterFunctionType;
  USstate: string;
  USstateFilter: filterFunctionType;
}

class Controls extends Component<IProps, IState> {
  public state = {
    USstate: "*",
    USstateFilter: () => true,
    jobTitle: "*",
    jobTitleFilter: () => true,
    year: "*",
    yearFilter: () => true
  };

  public componentDidUpdate(prevProps: any, prevState: IState) {
    this.reportUpdateUpTheChain();
  }

  public shouldComponentUpdate(nextProps: any, nextState: IState) {
    return !_.isEqual(this.state, nextState);
  }

  public render() {
    const { data } = this.props;
    const years = new Set(data.map(d => `${d.submit_date.getFullYear()}`));
    const jobTitles = new Set(data.map(d => d.clean_job_title));
    const USstates = new Set(data.map(d => d.USstate));

    return (
      <div>
        <ControlRow
          toggleNames={Array.from(years.values())}
          picked={this.state.year}
          updateDataFilter={this.updateYearFilter}/>
        <ControlRow
          toggleNames={Array.from(jobTitles.values())}
          picked={this.state.jobTitle}
          updateDataFilter={this.updateJobTitleFilter} />
      </div>
    );
  }

  private reportUpdateUpTheChain() {
    // This feels convoluted, and I think that centralizing this logic in a reducer will be beneficial.

    const filterFunction = (filters: IFilters) => {
      // If something is clicked, apply the year filter only
      return (d: any) => filters.yearFilter(d) && filters.jobTitleFilter(d);
    };

    this.props.updateDataFilter(
      filterFunction(this.state), // Filter functions
      { // Criteria that comes out of the filter function
        jobTitle: this.state.jobTitle,
        year: this.state.year,
      }
    );
  }

  // TODO: Refactor these filters to eliminate code duplication
  private updateYearFilter = (year: string, reset: boolean) => {
    let filter = (d: ISalary) => d.submit_date.getFullYear() === +year;
    if (reset || !year) {
      filter = () => true;
      year = "*";
    }

    this.setState({
      year,
      yearFilter: filter
    });
  };
  private updateJobTitleFilter = (title: string, reset: boolean) => {
    let filter = (d: ISalary) => d.clean_job_title === title;
    if (reset || !title) {
      filter = () => true;
      title = "*";
    }
    this.setState({
      jobTitle: title,
      jobTitleFilter: filter,
      
    });
  }
  private updateUSstateFilter = (USstate: string, reset: boolean) => {
    let filter = (d: ISalary) => d.USstate === USstate;
    if (reset || !USstate) {
      filter = () => true;
      USstate = "*";
    }
    this.setState({
      USstate,
      USstateFilter: filter,
    });
  }
}
export default Controls;