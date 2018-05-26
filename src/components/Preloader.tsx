import React from "react";

import PreloaderImg from '../assets/preloading.png';

const Preloader = () => (
  <div className="App container">
    <h1>The average H1B Visa pays $86,000 per year</h1>
    <p className="lead">Since 2012, the US tech industry has sponsored X tech visas
    Most them paid <b>50 to 60</b> per year (1 standard deviation). 
    <span>
      The best city for an H1B is <b>Kirkland, WA</b> with an average individual salary  <b>$39,000</b> above the hoseuhold median. Median household salary is a good proxy for cost of living in an area.
    </span>
    </p>
    <img src={PreloaderImg} style={{ width: "100%" }} role="presentation" />
    <h2 className="text-center">Loading data...</h2>
  </div>
  
)

export default Preloader;