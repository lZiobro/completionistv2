import { useState } from "react";
import SearchOtherPlayers from "../pages/main/components/SearchOtherPlayers";

const CheckOtherPlayer = (props: {
  username: string | null;
  setUserId: Function;
  setUsername: Function;
}) => {
  const [showPlayerSearch, setShowPlayerSearch] = useState<boolean>(false);

  const clearSearchedUser = () => {
    props.setUserId(null);
    props.setUsername(null);
  };

  return (
    <>
      {showPlayerSearch && (
        <SearchOtherPlayers
          closeModal={() => setShowPlayerSearch(false)}
          setUserId={props.setUserId}
          setUsername={props.setUsername}
        />
      )}
      <ul
        className="inline-list bg-secondary"
        style={{
          overflow: "hidden",
          borderRadius: 5,
          margin: 0,
          padding: 0,
          width: "fit-content",
        }}
        data-html2canvas-ignore="true"
      >
        <button
          className={
            `btn yes-no-button` + (props.username ? " icon-selected" : "")
          }
          style={{}}
          onClick={() => setShowPlayerSearch((x) => !x)}
        >
          {props.username ? props.username : "Check other players"}
        </button>
        {props.username && (
          <button
            className="btn btn-secondary"
            style={{
              padding: "auto",
              height: "100%",
              paddingLeft: 5,
              paddingRight: 5,
            }}
            onClick={() => clearSearchedUser()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
        )}
      </ul>
    </>
  );
};

export default CheckOtherPlayer;
