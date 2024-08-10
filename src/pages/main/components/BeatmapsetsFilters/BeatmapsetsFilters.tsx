import { useState } from "react";
import CompletionFilter from "./_partials/CompletionFilter";
import MissCountFilter from "./_partials/MissCountFilter";
import RankFilter from "./_partials/RankFilter";
import { Filter, FilterValue } from "../../../../interfaces/Types";
import { FiltersNames } from "../../../../interfaces/Enums";

const BeatmapsetsFilters = (props: {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) => {
  const pushFilter = (filterName: FiltersNames, values: FilterValue[]) => {
    props.setFilters((filters) => [
      ...filters?.filter((x) => x.name !== filterName),
      {
        name: filterName,
        values: values,
      },
    ]);
  };

  const removeFilter = (filterName: FiltersNames) => {
    props.setFilters((filters) => [
      ...filters?.filter((x) => x.name !== filterName),
    ]);
  };

  return (
    <div className="d-flex my-2">
      <CompletionFilter pushFilter={pushFilter} removeFilter={removeFilter} />
      <RankFilter pushFilter={pushFilter} removeFilter={removeFilter} />
      <MissCountFilter pushFilter={pushFilter} removeFilter={removeFilter} />
    </div>
  );
};

export default BeatmapsetsFilters;
