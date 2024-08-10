const FilterWrapper = (props: { label?: string; children }) => {
  return (
    <div>
      {props.label && (
        <p style={{ width: "auto", display: "inline-block" }}>{props.label}</p>
      )}
      {props.children}
    </div>
  );
};

export default FilterWrapper;
