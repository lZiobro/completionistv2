import osuIcon from "../assets/mode-osu.png";
import taikoIcon from "../assets/mode-taiko.png";
import maniaIcon from "../assets/mode-mania.png";
import fruitsIcon from "../assets/mode-fruits.png";

export const GamemodeSelect = (props: {
  gamemode: string;
  setGamemode: Function;
  disabled?: boolean;
  style?: {};
}) => {
  return (
    <div className="d-flex justify-content-center my-2" style={props.style}>
      <img
        className={
          "img-fluid gamemode-icon px-2" +
          (props.gamemode === "osu" ? " icon-selected" : "") +
          (props.disabled ? " icon-disabled" : "")
        }
        src={osuIcon}
        alt="osu-icon"
        onClick={() => {
          props.setGamemode("osu");
        }}
      />
      <img
        className={
          "img-fluid gamemode-icon px-2" +
          (props.gamemode === "taiko" ? " icon-selected" : "") +
          (props.disabled ? " icon-disabled" : "")
        }
        src={taikoIcon}
        alt="taiko-icon"
        onClick={() => {
          props.setGamemode("taiko");
        }}
      />
      <img
        className={
          "img-fluid gamemode-icon px-2" +
          (props.gamemode === "mania" ? " icon-selected" : "") +
          (props.disabled ? " icon-disabled" : "")
        }
        src={maniaIcon}
        alt="mania-icon"
        onClick={() => {
          props.setGamemode("mania");
        }}
      />
      <img
        className={
          "img-fluid gamemode-icon px-2" +
          (props.gamemode === "fruits" ? " icon-selected" : "") +
          (props.disabled ? " icon-disabled" : "")
        }
        src={fruitsIcon}
        alt="fruits-icon"
        onClick={() => {
          props.setGamemode("fruits");
        }}
      />
    </div>
  );
};

export default GamemodeSelect;
