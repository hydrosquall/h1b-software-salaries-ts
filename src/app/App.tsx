import * as d3 from "d3";
import _ from "lodash";
import * as React from "react";
import Preloader from "../components/Preloader";
import { loadAllData } from "./DataHandling";

import "./App.css";
import logo from "./logo.svg";

interface IState {
  techSalaries: string[];
}

const AppBody = (props: any) => (
  <div className="App">
  Loaded {props.nSalaries} Records
  </div>
);

class App extends React.Component {
  public state: IState = {
    techSalaries: []
  };

  public componentWillMount () {
    loadAllData((data: string[]) => this.setState(data))
  }
  public render() {
    const isDataLoaded = this.state.techSalaries.length > 1;
    return isDataLoaded ? <AppBody nSalaries={this.state.techSalaries.length}/> : <Preloader />;
  }
}

export default App;
