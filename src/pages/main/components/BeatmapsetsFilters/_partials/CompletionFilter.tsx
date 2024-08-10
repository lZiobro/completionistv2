import { useEffect, useState } from "react";
import CustomSelect, {
  CustomSelectValues,
} from "../../../../../components/_partials/CustomSelect";
import FilterWrapper from "./FilterWrapper";
import {
  CompareOperator,
  Completion,
  FiltersNames,
} from "../../../../../interfaces/Enums";
import { FilterValue } from "../../../../../interfaces/Types";

const CompletionFilter = (props: {
  pushFilter: (filterName: string, values: FilterValue[]) => void;
  removeFilter: (filterName: string) => void;
}) => {
  const filterName = FiltersNames.Completion;
  const [filterValue, setFilterValue] = useState<number | "Any">("Any");

  const filterValues: CustomSelectValues[] = [
    { value: "Any", label: "Any" },
    { value: Completion.Unplayed, label: "Unplayed" },
    { value: Completion.Partial, label: "Partial" },
    { value: Completion.Completed, label: "Completed" },
  ];

  useEffect(() => {
    if (filterValue === "Any") {
      props.removeFilter(filterName);
      return;
    }
    props.pushFilter(filterName, [
      { name: "value", value: Number(filterValue) },
    ]);
  }, [filterValue]);

  return (
    <FilterWrapper label="Completion">
      <CustomSelect
        values={filterValues}
        selectState={filterValue}
        setSelectState={setFilterValue}
      />
    </FilterWrapper>
  );
};

export default CompletionFilter;
