import React, { useEffect, useState } from "react";
import CustomSelect, {
  CustomSelectValues,
} from "../../../../../components/_partials/CustomSelect";
import FilterWrapper from "./FilterWrapper";
import { CompareOperator, FiltersNames } from "../../../../../interfaces/Enums";
import {
  Filter,
  FilterValue,
  MissCountFilterValue,
} from "../../../../../interfaces/Types";

const MissCountFilter = (props: {
  pushFilter: (filterName: string, values: FilterValue[]) => void;
  removeFilter: (filterName: string) => void;
}) => {
  const filterName = FiltersNames.Misscount;
  const [filterValue, setFilterValue] = useState<CompareOperator | "Any">(
    "Any"
  );
  const [inputOneValue, setInputOneValue] = useState(null);
  const [inputTwoValue, setInputTwoValue] = useState(null);

  const filterValues: CustomSelectValues[] = [
    { value: "Any", label: "Any" },
    { value: CompareOperator.greater, label: ">" },
    { value: CompareOperator.less, label: "<" },
    { value: CompareOperator.equals, label: "=" },
    { value: CompareOperator.between, label: "between" },
  ];
  useEffect(() => {
    if (filterValue === "Any") {
      props.removeFilter(filterName);
      return;
    }
    const values: MissCountFilterValue[] = [
      { name: "operator", value: filterValue },
      { name: "val1", value: Number(inputOneValue) },
      { name: "val2", value: Number(inputTwoValue) },
    ];
    props.pushFilter(filterName, values);
  }, [filterValue, inputOneValue, inputTwoValue]);
  return (
    <FilterWrapper label="Miss count">
      <CustomSelect
        values={filterValues}
        selectState={filterValue}
        setSelectState={setFilterValue}
      />
      {filterValue !== "Any" && (
        <input
          className="form-control"
          style={{ width: "60px", display: "inline-block" }}
          onChange={(e) => setInputOneValue(e.target.value)}
        />
      )}
      {filterValue === "between" && (
        <>
          <span> AND </span>
          <input
            className="form-control"
            style={{ width: "60px", display: "inline-block" }}
            onChange={(e) => setInputTwoValue(e.target.value)}
          />
        </>
      )}
    </FilterWrapper>
  );
};

export default MissCountFilter;
