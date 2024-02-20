import { useRef, useState } from "react";
import { getUserCompletionNode } from "../../service/UserService";

const UserStatistics = () => {
  const [userCompletions, setUserCompletions] = useState<any>(null);
  const [selectedGamemode, setSelectedGamemode] = useState<string>("osu");
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const userIdRef = useRef<any>();

  const getUserCompletion = async () => {
    setUserCompletions(
      await getUserCompletionNode(
        userIdRef.current.value,
        selectedGamemode,
        convertsOnly
      )
    );
  };

  return (
    <div className="user-statistics">
      <div className="main-page_menu-element">
        <label htmlFor="userId">UserId</label>
        <input name="userId" ref={userIdRef}></input>
        {/* <button onClick={fetchUserScores}>Confirm</button> */}
      </div>
      <p>Selected gamemode: {selectedGamemode}</p>
      <button
        onClick={() => {
          setSelectedGamemode("osu");
        }}
      >
        osu!
      </button>
      <button
        onClick={() => {
          setSelectedGamemode("taiko");
        }}
      >
        taiko
      </button>
      <button
        onClick={() => {
          setSelectedGamemode("mania");
        }}
      >
        mania
      </button>
      <button
        onClick={() => {
          setSelectedGamemode("fruits");
        }}
      >
        catch
      </button>
      <label htmlFor="convertsOnly">Converts only: </label>
      <input
        type="checkbox"
        id="convertsOnly"
        name="convertsOnly"
        onClick={(e) => {
          setConvertsOnly(!convertsOnly);
        }}
        checked={convertsOnly}
      />
      <br />
      <br />
      <button onClick={getUserCompletion}>Get User Completion</button>
      <br />
      <span>Completion by Year:</span>
      <br />
      {Object.keys(userCompletions?.completions ?? {})?.map((item, i) => {
        const completed = userCompletions.completions[item].completed;
        const total = userCompletions.completions[item].total;
        const x = completed / total;
        const r = (1.0 - x) * 1.0;
        const g = x * 1.0;
        const b = 0;
        const percentageCompleted = (x * 100).toFixed(2);

        return (
          <>
            <span
              style={{
                color: `rgb(${r * 255}, ${g * 255}, ${b})`,
                background: `black`,
              }}
            >
              {item} : {completed}/{total} ({percentageCompleted}%)
            </span>
            <br />
          </>
        );
      })}
    </div>
  );
};

export default UserStatistics;
