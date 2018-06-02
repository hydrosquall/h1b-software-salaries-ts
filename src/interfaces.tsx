interface ICountyValue {
  // Rename later... this appears to be CountyDelta.
  readonly countyID: any | null;
  readonly value: number;
}

interface ICountyName {
  readonly id: string;
  readonly name: string;
};

// h1bs-2012-2016.csv
interface ISalary {
  readonly base_salary: number;
  readonly submit_date: Date;
  readonly countyID: string;
  readonly clean_job_title: string;
  readonly USstate: string; // enum
  readonly city: string;
}

// us-state-names.tsv
interface IStateName {
  readonly id: string;  // number as string
  readonly code: string; // 2 letter abbreviation
  readonly name: string;
}

// Used for interactions
interface IFilter {
  USstate: string;
  year: string;
  jobTitle: string;
}

export { ICountyValue, ICountyName, IFilter, ISalary, IStateName };
