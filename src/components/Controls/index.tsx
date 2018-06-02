import _ from 'lodash';
import React, { Component } from 'react';

import { ISalary } from "../../interfaces";
import ControlRow from './ControlRow';

type filterFunctionType = (d: ISalary) => boolean;

// Extra temporary interfaces until all the metadata shows up
interface IFilterParams {
  readonly jobTitle: string;
  readonly year: string;
  readonly USstate: string;
}
//

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

  public componentDidMount() {
    // Basic way to implement routing
    const [year, USstate, jobTitle] = window.location.hash
                                                      .replace('#', '')
                                                      .split("-");
    if (year !== '*' && year) {
      this.updateYearFilter(year, false);
    }
    if (USstate !== '*' && USstate) {
      this.updateUSstateFilter(USstate, false);
    }
    if (jobTitle !== '*' && jobTitle) {
      this.updateJobTitleFilter(jobTitle, false);
    }
  }
  public componentDidUpdate(prevProps: any, prevState: IState) {
    window.location.hash = [this.state.year || '*',
                            this.state.USstate || '*', 
                            this.state.jobTitle || '*'].join("-");

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
          updateDataFilter={this.updateJobTitleFilter}
          />
        <ControlRow
          toggleNames={Array.from(USstates.values())}
          picked={this.state.USstate}
          updateDataFilter={this.updateUSstateFilter} 
          capitalize={true} />
      </div>
    );
  }

  private reportUpdateUpTheChain() {
    // This feels convoluted, and I think that centralizing this logic in a reducer will be beneficial.

    this.props.updateDataFilter(
      () => true,
      { // Criteria that comes out of the filter function
        USstate: this.state.USstate,
        jobTitle: this.state.jobTitle,
        year: this.state.year,
      }
    );
  }

  // TODO: Refactor these filters to eliminate code duplication
  private updateYearFilter = (year: string, reset: boolean) => {
    if (reset || !year) {
      year = "*";
    }

    this.setState({
      year,
      yearFilter: () => true
    });
  };
  private updateJobTitleFilter = (title: string, reset: boolean) => {
    if (reset || !title) {
      title = "*";
    }
    this.setState({
      jobTitle: title,
      jobTitleFilter: () => true
      
    });
  }
  private updateUSstateFilter = (USstate: string, reset: boolean) => {
    if (reset || !USstate) {
      USstate = "*";
    }
    this.setState({
      USstate,
      USstateFilter: () => true,
    });
  }
}
export default Controls;