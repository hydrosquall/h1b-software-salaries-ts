interface ICountyValue {
  // Rename later... this appears to be CountyDelta.
  readonly countyID: any | null;
  readonly value: number;
}

interface ICountyName {
  readonly id: string;
  readonly name: string;
};

interface ISalary {
  readonly base_salary: number;
  readonly submit_date: Date;
  readonly countyID: string;
  readonly clean_job_title: string;
  readonly USstate: string; // enum
  readonly city: string;
}

// Used for interactions
interface IFilter {
  USstate: string;
  year: string;
  jobTitle: string;
}

export { ICountyValue, ICountyName, IFilter, ISalary };
