import { Children, cloneElement, ReactElement } from "react";

const RadioGroupButtons = ({ children }) => {
  return (
    <div className="btn-group" role="group">
      {Children.map(children, (child, idx) => {
        return cloneElement(child as ReactElement<any>, {
          id: idx,
        });
      })}
    </div>
  );
};

export default RadioGroupButtons;
