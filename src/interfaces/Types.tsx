import { FiltersNames } from "./Enums";

export type FilterValue = {
  name?: string;
  value: any;
};

export type Filter = {
  name: FiltersNames;
  values: FilterValue[];
};

export type MissCountFilterValue = {
  name: "operator" | "val1" | "val2";
  value: any;
};
