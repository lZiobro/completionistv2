export type CustomSelectValues = {
  value: number | string;
  label: string;
};

type CustomSelectRefProps = {
  values: CustomSelectValues[];
  selectRef: React.MutableRefObject<any>;
};
type CustomSelectStateProps = {
  values: CustomSelectValues[];
  selectState: number | string | any;
  setSelectState: React.Dispatch<number | string | any>;
};

type CustomSelectProps = CustomSelectRefProps | CustomSelectStateProps;

const CustomSelect = (props: CustomSelectProps) => {
  const refSelect = (
    <select
      className="form-select mx-2 my-2"
      ref={(props as CustomSelectRefProps).selectRef}
      style={{ width: "auto", display: "inline-block" }}
    >
      {props.values.map((opt) => (
        <option value={opt.value} key={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
  const stateSelect = (
    <select
      className="form-select mx-2 my-2"
      style={{ width: "auto", display: "inline-block" }}
      onChange={(e) =>
        (props as CustomSelectStateProps).setSelectState(e.target.value)
      }
    >
      {props.values.map((opt) => (
        <option
          value={opt.value}
          key={opt.label}
          selected={opt.value === (props as CustomSelectStateProps).selectState}
        >
          {opt.label}
        </option>
      ))}
    </select>
  );

  return (props as CustomSelectRefProps).selectRef ? refSelect : stateSelect;
};

export default CustomSelect;
