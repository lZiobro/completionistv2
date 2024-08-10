import { arrayRange } from "../../misc/utils";

const RangeSelect = (props: {
  start: number;
  end: number;
  selectRef: React.MutableRefObject<any>;
  default: string;
}) => {
  return (
    <select
      className="form-select mx-2 my-2"
      ref={props.selectRef}
      style={{ width: "auto", display: "inline-block" }}
    >
      <option value={undefined}>{props.default}</option>
      {arrayRange(props.start, props.end, 1).map((opt) => (
        <option value={opt} key={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default RangeSelect;
