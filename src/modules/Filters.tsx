import { CompareOperator } from "../interfaces/Enums";
import { IBeatmapsetView } from "../interfaces/IBeatmapsetView";
import { IUserScoreView } from "../interfaces/IUserScoreView";
import { Filter, MissCountFilterValue } from "../interfaces/Types";

type ApplyFilterFunction = (
  beatmapsets: IBeatmapsetView[],
  filter: Filter,
  userScores?: IUserScoreView[]
) => IBeatmapsetView[];

type ApplyUserFilterFunction = (
  filter: Filter,
  userScores?: IUserScoreView[]
) => IUserScoreView[];

export const applyUserMissCountFilter: ApplyUserFilterFunction = (
  filter: Filter,
  userScores: IUserScoreView[]
) => {
  const filterValues = filter.values as MissCountFilterValue[];
  const operator = filterValues.find((x) => x.name === "operator")?.value;
  const val1 = filterValues.find((x) => x.name === "val1")?.value;
  const val2 = filterValues.find((x) => x.name === "val2")?.value;
  switch (operator) {
    case CompareOperator.between:
      return userScores?.filter(
        (x) => x.statistics_count_miss > val1 && x.statistics_count_miss < val2
      );

    case CompareOperator.equals:
      return userScores?.filter((x) => x.statistics_count_miss === val1);

    case CompareOperator.greater:
      return userScores?.filter((x) => x.statistics_count_miss > val1);

    case CompareOperator.less:
      return userScores?.filter((x) => x.statistics_count_miss < val1);
  }
};

export const applyUserRankFilter: ApplyUserFilterFunction = (
  filter: Filter,
  userScores: IUserScoreView[]
) => {
  const filterValues = filter.values;
  const filterValue = filterValues.find((x) => x.name === "value")?.value;
  return userScores?.filter((x) => x.rank === filterValue);
};

export const applyCompletionFilter: ApplyFilterFunction = (
  beatmapsets: IBeatmapsetView[],
  filter: Filter
) => {
  const filterValues = filter.values;
  const filterValue = filterValues.find((x) => x.name === "value")?.value;
  return beatmapsets.filter((x) => x.completed === filterValue);
};
