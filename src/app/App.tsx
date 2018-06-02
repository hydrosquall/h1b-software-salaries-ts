import * as d3 from "d3";
import _ from "lodash";
import  React, { Component } from "react";
import * as topojson from "topojson";

import Controls from "../components/Controls";
import CountyMap from "../components/CountyMap";
import Histogram from "../components/Histogram";
import MedianLine from "../components/MedianLine";
import { Description, GraphDescription, Title } from "../components/Meta";
import Preloader from "../components/Preloader";

import { ICountyName, ICountyValue, IFilter, ISalary }from '../interfaces';

import USStatesMap from "../components/Meta/USStatesMap";
import { valueAccessor } from '../utils';
import "./App.css";
import { loadAllData } from "./DataHandling";
import logo from "./logo.svg";

interface IStateGroup {
  [key: string]: IMedian[];
}

interface IMedian {
  readonly medianIncome: number;
}

interface IState {
  medianIncomes: object; // Mapping from county.id to d county data
  medianIncomesByCounty: object;
  medianIncomesByUSState: IStateGroup;
  techSalaries: ISalary[];
  salariesFilter: (d: any) => boolean;
  countyNames: ICountyName[]; // name, id
  USstateNames: object[],
  usTopoJson: topojson.UsAtlas | null,
  filteredBy: IFilter,
};

class App extends Component<any, IState> {
  public state: IState = {
    USstateNames: [],
    countyNames: [],
    filteredBy: {
      USstate: '*',
      jobTitle: '*',
      year: '*',
    },
    medianIncomes: {},
    medianIncomesByCounty: {},
    medianIncomesByUSState: { 'US': []},
    salariesFilter: () => true,
    techSalaries: [],
    usTopoJson: null
  };

  public componentWillMount() {
    loadAllData((data: IState) => this.setState(data));
  };

  public shouldComponentUpdate(nextProps: any, nextState: IState) {
    // Going to redux might simplify this in the future
    const { techSalaries, filteredBy } = this.state;
    const changedSalaries = (techSalaries && techSalaries.length)
                            !== (nextState.techSalaries && nextState.techSalaries.length);
    const changedFilters = Object.keys(filteredBy).some(
      k => filteredBy[k]
        !== nextState.filteredBy[k]
    );
    return changedSalaries || changedFilters;
  }

  /**
   * salariesFilter
   *  Return a function which can be passed to array.filter to screen data that doesn't meet the filterCriteria
   */
  public buildSalariesFilter(filterCriteria: IFilter) {
    const { year, USstate, jobTitle } = filterCriteria;
    const baseFilter = (d: ISalary) => true; // Lets all data through

    const yearFilter = (d: ISalary) => d.submit_date && d.submit_date.getFullYear() === +year;
    const stateFilter = (d: ISalary) => d.USstate === USstate;
    const jobFilter = (d: ISalary) => d.clean_job_title === jobTitle;

    // Decide which curried functions to keep using
    const criteria = [year, USstate, jobTitle];
    const filters = [yearFilter, stateFilter, jobFilter];
    const pairs = _.zip(criteria, filters);
    const appliedFilters = [] as any;
    pairs.forEach((pair, index) => {
      const [condition, filter] = pair;
      if (condition !== '*') {
        appliedFilters.push(filter as (d: ISalary) => boolean);
      } 
    });

    // Combine all of the tests into a single function
    const globalFilter = (d: ISalary) => appliedFilters.every(
      (filter: (d: ISalary) => boolean) => {
      return filter(d);
    });

    return appliedFilters.length > 0 ? globalFilter : baseFilter;
  }

  public render() {
    const isDataLoaded = this.state.techSalaries.length > 1;
    if (!isDataLoaded) {
      return <Preloader />;
    }

    const combinedFilter = this.buildSalariesFilter(this.state.filteredBy);
    const filteredSalaries = this.state.techSalaries.filter(combinedFilter);
    const filteredSalariesMap = _.groupBy(filteredSalaries, "countyID");
    const countyValues = this.getCountyValues(this.state.countyNames, filteredSalariesMap);
    let zoom = null;
    let medianHousehold = this.state.medianIncomesByUSState.US[0].medianIncome;

    if (this.state.filteredBy.USstate !== '*') {
      zoom = this.state.filteredBy.USstate;
      medianHousehold = d3.mean(this.state.medianIncomesByUSState[zoom], d => d.medianIncome) as number;
    }

    const mapProps = {
      USstateNames: this.state.USstateNames,
      countyValues,
      height: 500,
      usTopoJson: this.state.usTopoJson,
      width: 500,
      x: 0,
      y: 0,
      zoom
    };

    const histogramBaseProps = {
      bottomMargin: 5,
      data: filteredSalaries,
      height: 500,
      valueAccessor, // function to access a property in "data"
      width: 500,
      x: 500,
      y: 10,
    }
    
    const histogramProps = {
      ...histogramBaseProps,
      axisMargin: 83,
      bins: 10,
    }

    const medianLineProps = {
      ...histogramBaseProps,
      median: medianHousehold,
    }
  
    return (
      <div className="App container">
        <Title
          data={filteredSalaries}
          filteredBy={this.state.filteredBy}
        />
        <Description
          data={filteredSalaries}
          allData={this.state.techSalaries}
          medianIncomesByCounty={this.state.medianIncomesByCounty}
          filteredBy={this.state.filteredBy}
        />
        <GraphDescription filteredBy={this.state.filteredBy} />
        <svg height="500" width="1100">
          <CountyMap {...mapProps} />
          <rect x="500"
                y="0"
                width="500"
                height="500"
                style={{ fill: 'white' }} />
          <Histogram {...histogramProps} />
          <MedianLine {...medianLineProps} />
        </svg>
        <Controls 
          data={this.state.techSalaries}
          updateDataFilter={this.updateDataFilter}
        />
      </div>
    );
  }
  /**
   * Calculate array of of CountyAccessors for a given list of CountyNames
   */
  private getCountyValues = (countyNames: ICountyName[], salariesMap: object): ICountyValue[] => {
    return (countyNames
      .map((county: ICountyName) => this.countyValue(county, salariesMap))
      .filter((d: ICountyValue | null) => !_.isNull(d)) as ICountyValue[]);
  };
  /**
   * Calculate delta between median income and median tech salaries for any county
   * TODO: Refactor to store this delta rather than recalculating on the fly
   * TODO: Refactor to remove dependence on state
   */
  private countyValue(county: ICountyName, salariesMap: object) {
    const medianHousehold = this.state.medianIncomes[county.id];
    const salaries = salariesMap[county.name];
    if (!medianHousehold || !salaries) {
      return null;
    }
    const medianSalary = d3.median(salaries, valueAccessor) || 0; // protect against undefined
    return {
      countyID: county.id,
      value: medianSalary - medianHousehold.medianIncome
    };
  }
  private updateDataFilter = (filter: (d: any) => boolean, filteredBy: IFilter) => {
    const newFilteredBy = {
      ...this.state.filteredBy, // old filter
      ...filteredBy
    }

    this.setState({
      filteredBy: newFilteredBy,
      salariesFilter: filter,
    });
  }
}

export default App;
