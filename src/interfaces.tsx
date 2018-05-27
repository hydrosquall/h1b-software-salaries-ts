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
}

export { ICountyValue, ICountyName, ISalary };
