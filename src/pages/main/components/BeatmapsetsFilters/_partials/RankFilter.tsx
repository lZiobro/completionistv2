import { useEffect, useRef, useState } from "react";
import CustomSelect, {
  CustomSelectValues,
} from "../../../../../components/_partials/CustomSelect";
import FilterWrapper from "./FilterWrapper";
import { Filter, FilterValue } from "../../../../../interfaces/Types";
import { FiltersNames } from "../../../../../interfaces/Enums";

const RankFilter = (props: {
  pushFilter: (filterName: string, values: FilterValue[]) => void;
  removeFilter: (filterName: string) => void;
}) => {
  const filterName = FiltersNames.Rank;
  const [filterValue, setFilterValue] = useState<string | "Any">("Any");

  const filterValues: CustomSelectValues[] = [
    { value: "Any", label: "Any" },
    { value: "SS", label: "SS" },
    { value: "S", label: "S" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  useEffect(() => {
    if (filterValue === "Any") {
      props.removeFilter(filterName);
      return;
    }
    props.pushFilter(filterName, [{ name: "value", value: filterValue }]);
  }, [filterValue]);

  return (
    <FilterWrapper label="Rank">
      <CustomSelect
        values={filterValues}
        selectState={filterValue}
        setSelectState={setFilterValue}
      />
    </FilterWrapper>
  );
};

export default RankFilter;
