import { ScoresVariant } from "../interfaces/Enums";
import RadioGroupButton from "./_partials/RadioGroupButton";
import RadioGroupButtons from "./RadioGroupButtons";

const ScoreVariantSelect = (props: {
  variant: ScoresVariant;
  setVariant: Function;
}) => {
  return (
    <RadioGroupButtons>
      <RadioGroupButton
        value={ScoresVariant.ALL}
        selectedValue={props.variant}
        setValue={props.setVariant}
      >
        All
      </RadioGroupButton>
      <RadioGroupButton
        value={ScoresVariant.SPECIFIC}
        selectedValue={props.variant}
        setValue={props.setVariant}
      >
        Specifics
      </RadioGroupButton>
      <RadioGroupButton
        value={ScoresVariant.CONVERT}
        selectedValue={props.variant}
        setValue={props.setVariant}
      >
        Converts
      </RadioGroupButton>
      <RadioGroupButton
        value={ScoresVariant.SPECIFICCONVERT}
        selectedValue={props.variant}
        setValue={props.setVariant}
      >
        Specifics+Converts
      </RadioGroupButton>
    </RadioGroupButtons>
  );
};

export default ScoreVariantSelect;
