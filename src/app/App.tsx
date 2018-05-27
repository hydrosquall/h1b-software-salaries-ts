import * as d3 from "d3";
import _ from "lodash";
import  React, { Component } from "react";
import * as topojson from "topojson";

import CountyMap from "../components/CountyMap";
import Histogram from "../components/Histogram";
import Preloader from "../components/Preloader";
import { ICountyName, ICountyValue, ISalary }from '../interfaces';
import "./App.css";
import { loadAllData } from "./DataHandling";
import logo from "./logo.svg";

interface IState {
  medianIncomes: object; // Mapping from county.id to d county data
  techSalaries: ISalary[];
  countyNames: ICountyName[]; // name, id
  USstateNames: object[],
  usTopoJson: topojson.UsAtlas | null,
};

// TODO: Pull utils into a general shared file
const valueAccessor = (d: ISalary) => d.base_salary;

class App extends Component<any, IState> {
  public state: IState = {
    USstateNames: [],
    countyNames: [],
    medianIncomes: {},
    techSalaries: [],
    usTopoJson: null
  };

  public componentWillMount() {
    loadAllData((data: IState) => this.setState(data));
  };

  public render() {
    const isDataLoaded = this.state.techSalaries.length > 1;
    if (!isDataLoaded) {
      return <Preloader />;
    }
  
    const filteredSalaries = this.state.techSalaries;
    const filteredSalariesMap = _.groupBy(filteredSalaries, "countyID");
    const countyValues = this.getCountyValues(this.state.countyNames, filteredSalariesMap);
    const zoom = null;

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

    const histogramProps = {
      axisMargin: 83,
      bins: 10,
      bottomMargin: 5,
      data: filteredSalaries,
      height: 500,
      valueAccessor, // function to access a property in "data"
      width: 500,
      x: 500,
      y: 10,
    }
  
    return (
      <svg height="500" width="1100">
        <CountyMap {...mapProps} />
        <Histogram {...histogramProps} />
      </svg>
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
}

export default App;
