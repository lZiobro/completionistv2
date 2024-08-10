export enum ScoresVariant {
  ALL = 0,
  SPECIFIC = 1,
  CONVERT = 2,
  SPECIFICCONVERT = 3,
}

export enum Completion {
  Unplayed = 0,
  Partial = 1,
  Completed = 2,
}

export enum CompareOperator {
  greater = "gt",
  less = "lt",
  equals = "eq",
  between = "between",
}

export enum FiltersNames {
  Misscount = "misscount",
  Rank = "rank",
  Completion = "completion",
}
