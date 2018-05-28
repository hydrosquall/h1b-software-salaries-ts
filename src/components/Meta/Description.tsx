
import * as d3 from "d3";
import _ from "lodash";
import React, { Component } from 'react';
import S from "string";

import { IFilter, ISalary } from "../../interfaces";
import { valueAccessor } from "../../utils";
import USStatesMap from './USStatesMap';

interface IProps {
  readonly allData: ISalary[];
  readonly data: ISalary[];
  readonly filteredBy: IFilter;
  readonly medianIncomesByCounty: object;
}

class Description extends Component<IProps> {
  get yearsFragment() {
    const year = this.props.filteredBy.year;
    return year === "*" ? "" : `In ${year}`;
  }

  get USstateFragment() {
    const USstate = this.props.filteredBy.USstate;
    return USstate === "*" ? "" : USStatesMap[USstate.toUpperCase()];
  }

  get previousYearFragment() {
    const year = this.props.filteredBy.year;
    let fragment;

    if (year === "*") {
      fragment = "";
    } else if (year === "2012") { // TODO - investigate this special case
      fragment = "";
    } else {
      const { USstate, jobTitle } = this.props.filteredBy;
      let lastYear = this.allDataForYear(+year - 1);

      if (jobTitle !== "*") {
        lastYear = this.allDataForJobTitle(jobTitle, lastYear);
      }

      if (USstate !== "*") {
        lastYear = this.allDataForUSstate(USstate, lastYear);
      }

      if (this.props.data.length / lastYear.length > 2) {
        fragment =
          ", " +
          (this.props.data.length / lastYear.length).toFixed() +
          " times more than the year before";
      } else {
        const percent = +(
          (1 - lastYear.length / this.props.data.length) *
          100
        ).toFixed();

        fragment =
          ", " +
          Math.abs(percent) +
          "% " +
          (percent > 0 ? "more" : "less") +
          " than the year before";
      }
    }
    return fragment;
  }

  get jobTitleFragment() {
    const jobTitle = this.props.filteredBy.jobTitle;
    let fragment;

    if (jobTitle === "*" || jobTitle === "other") {
      fragment = "H1B work visas";
    } else {
      fragment = `H1B work visas for software ${jobTitle}s`;
    }

    return fragment;
  }

  get countyFragment() {
    const byCounty = _.groupBy(this.props.data, "countyID");
    const medians = this.props.medianIncomesByCounty;

    // TODO: these two sortby/key/map/filter sections look very similar.
    let ordered = _.sortBy(
      _.keys(byCounty)
        .map(county => byCounty[county])
        .filter(d => d.length / this.props.data.length > 0.01),
      items =>
        (d3.mean(items, valueAccessor) as number) -
        medians[items[0].countyID][0].medianIncome
    );

    let best = ordered[ordered.length - 1];
    const countyMedian = medians[best[0].countyID][0].medianIncome;
    const byCity = _.groupBy(best, "city");

    ordered = _.sortBy(
      _.keys(byCity)
        .map((cityKey) => byCity[cityKey])
        .filter(d => d.length / best.length > 0.01),
      items => d3.mean(items, valueAccessor) as number - countyMedian
    );

    best = ordered[ordered.length - 1];
    const city = S(best[0].city).titleCase().s + `, ${best[0].USstate}`;
    const mean = d3.mean(best, valueAccessor) as number;
    const jobFragment = this.jobTitleFragment
      .replace("H1B work visas for", "")
      .replace("H1B work visas", "");

    return (
      <span>
        The best city{" "}
        {jobFragment.length ? `for ${jobFragment} on an H1B` : "for an H1B"}{" "}
        {this.yearsFragment ? "was" : "is"} <b>{city}</b> with an average salary
        ${this.format(mean - countyMedian)} above the local household median.
        Median household income is a good proxy for cost of living in an area.{" "}
        <a href="https://en.wikipedia.org/wiki/Household_income">[1]</a>.
      </span>
    );
  }

  get format() {
    return d3
      .scaleLinear()
      .domain(d3.extent(this.props.data, valueAccessor) as [number, number])
      .tickFormat();
  }

  public render() {
    const format = this.format;
    const mean = d3.mean(this.props.data, valueAccessor) as number;
    const deviation = d3.deviation(this.props.data, valueAccessor) as number;

    return (
      <p className="lead">
        {this.yearsFragment ? this.yearsFragment : "Since 2012"} the{" "}
        {this.USstateFragment} tech industry{" "}
        {this.yearsFragment ? "sponsored" : "has sponsored"}{" "}
        <b>
          {format(this.props.data.length)} {this.jobTitleFragment}
        </b>
        {this.previousYearFragment}. Most of them paid{" "}
        <b>
          ${format(mean - deviation)} to ${format(mean + deviation)}
        </b>{" "}
        per year. {this.countyFragment}
      </p>
    );
  }
  private allDataForYear(year: number, data = this.props.allData) {
    return data.filter(d => d.submit_date.getFullYear() === year);
  }

  private allDataForJobTitle(jobTitle: string, data = this.props.allData) {
    return data.filter(d => d.clean_job_title === jobTitle);
  }

  private allDataForUSstate(USstate: string, data = this.props.allData) {
    return data.filter(d => d.USstate === USstate);
  }
}

export default Description;