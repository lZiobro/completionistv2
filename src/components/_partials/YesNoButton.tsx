const YesNoButton = (props: {
  value: boolean;
  setValue: Function;
  children: any;
}) => {
  return (
    <button
      className={
        "btn yes-no-button mx-2" + (props.value ? " icon-selected" : "")
      }
      onClick={() => {
        props.setValue(!props.value);
      }}
    >
      {props.children}
    </button>
  );
};

export default YesNoButton;
