import React, { Component } from 'react';
import { IFilter } from "../../interfaces";

interface IProps {
  readonly filteredBy: IFilter;
}

class GraphDescription extends Component<IProps> {
  get jobTitleFragment() {
    const { jobTitle } = this.props.filteredBy;
    let title;

    if (jobTitle === '*' || jobTitle === "other") {
      title = 'in tech';
    } else {
      title = `a Software ${jobTitle}`;
    }

    return title;
  }

  public render() {
    return (
      <div className='row'>
        <div className="col-md-6 text-center">
          <h3>Best places to be {this.jobTitleFragment}</h3>
          <small>Darker color means bigger difference between median household salary<br />and individual tech salary. Gray means lack of tech salary data.</small>
        </div>
        <div className="col-md-6 text-center">
          <h3>Salary distribution</h3>
          <small>Histogram shows tech salary distribution compared to median household income, which is a good proxy for cost of living.</small>
        </div>
      </div>
    )
  }
}

export default GraphDescription;
