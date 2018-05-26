import * as React from "react";
import Preloader from "../components/Preloader";

import "./App.css";
import logo from './logo.svg';

interface IState {
  techSalaries: string[];
}

const AppBody = () => (
  <div className="App">
    "Foobar"
  </div>
)

class App extends React.Component {
  public state: IState = {
    techSalaries: []
  }

  public render() {
    const isDataLoaded = this.state.techSalaries.length > 1;
    return isDataLoaded ? 
            <Preloader/> : 
            <AppBody/> ;
  }
}

export default App;
