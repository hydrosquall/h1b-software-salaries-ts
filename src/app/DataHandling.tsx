import * as d3 from 'd3';
import _ from 'lodash';

const cleanIncomes = (d: any) => ({
  /* tslint:disable:no-string-literal */
  USstate: d['State'],
  countyName: d['Name'],
  lowerBound: Number(d['90% CI Lower Bound']),
  medianIncome: Number(d['Median Household Income']),
  upperBound: Number(d['90% CI Upper Bound']),
  /* tslint:enable:no-string-literal */
});

const dateParse = d3.timeParse("%m/%d/%Y");

const cleanSalary = (d: any) => {
  const salaryIsInvalid = (!d['base salary'] || Number(d['base salary']) > 300000);
  if (salaryIsInvalid) {
    return null;
  }
  return {
    /* tslint:disable:no-string-literal */
    USstate: d['state'],
    base_salary: Number(d['base salary']),
    case_status: d['case status'],
    city: d['city'],
    clean_job_title: d['job title'],
    county: d['county'],
    countyID: d['countyID'],
    employer: d.employer,
    job_title: d['job title'],
    start_date: dateParse(d['start date']),
    submit_date: dateParse(d['submit date']),
    /* tslint:enable:no-string-literal */
  };
};

const cleanUSStateName = (d: any) => ({
  code: d.code,
  id: Number(d.id),
  name: d.name
});


interface ICountyName {
  name: string;
  id: string;
}

const cleanCountyNames = ({ id, name }: ICountyName) => ({
    id: Number(id),
    name
});

export const loadAllData = (callback = _.noop) => {
  d3.queue()
    .defer(d3.json,'data/us.json')
    .defer(d3.csv, 'data/us-county-names-normalized.csv', cleanCountyNames)
    .defer(d3.csv, 'data/county-median-incomes.csv', cleanIncomes)
    // .defer(d3.csv, 'data/h1bs-2012-2016-shortened.csv', cleanSalary) // Use during development
    .defer(d3.csv, 'data/h1bs-2012-2016.csv', cleanSalary)
    .defer(d3.tsv, 'data/us-state-names.tsv', cleanUSStateName)
    .await((error: any, us: any, countyNames: ICountyName[], medianIncomes: any, techSalaries: any, USstateNames) => {

    // Create a mapping between countyIDs and income data for that county.
    const medianIncomesMap = {};
    medianIncomes
    .filter((d: any) => _.find(countyNames,
                              {name: d.countyName})) // pull incomes where name matches
    .forEach((d: any) => {
      d.countyID = _.find(countyNames,
                          { name: d.countyName })!.id;
      medianIncomesMap[d.countyID] = d;
    });

    // Return an array of datasets
    callback({
      USstateNames,
      countyNames,
      medianIncomes: medianIncomesMap,
      medianIncomesByCounty: _.groupBy(medianIncomes, 'countyName'),
      medianIncomesByUSState: _.groupBy(medianIncomes, 'USstate'),
      techSalaries: techSalaries.filter((d: any) => !_.isNull(d)),
      usTopoJson: us,
    }); 
  }); 
};