const RadioGroupButton = (props: {
  value: any;
  selectedValue: any;
  setValue: Function;
  id?: number;
  children: string;
}) => {
  const checked = props.selectedValue === props.value;
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        checked={checked}
        id={`btnradio${props.id ?? 1}`}
        value={props.value}
        onChange={() => props.setValue(props.value)}
      />
      <label
        className={`btn btn-outline-primary ${
          checked ? "bg-dark" : "bg-secondary"
        }`}
        htmlFor={`btnradio${props.id}`}
        style={{ borderColor: "black", color: "white" }}
      >
        {props.children}
      </label>
    </>
  );
};

export default RadioGroupButton;
