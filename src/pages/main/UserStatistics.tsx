import { useContext, useState } from "react";
import { getUserCompletionNode } from "../../service/UserService";
import { IUserContext, UserContext } from "../../UserContextWrapper";
import CheckOtherPlayer from "../../components/CheckOtherPlayer";
import SaveScreenshot from "../../components/SaveScreenshot";

const UserStatistics = (props: { selectedGamemode: string }) => {
  const userContext = useContext<IUserContext>(UserContext);
  const [userCompletions, setUserCompletions] = useState<any>(null);
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const [totalCompletions, setTotalCompletions] = useState<number>(0);
  const [playedCompletions, setPlayedCompletions] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>();
  const [username, setUsername] = useState<string | null>();

  const getUserCompletion = async () => {
    const completions = await getUserCompletionNode(
      userId ?? userContext.userId!,
      props.selectedGamemode,
      convertsOnly
    );

    setUserCompletions(completions);

    setTotalCompletions(0);
    setPlayedCompletions(0);
    Object.keys(completions?.completions ?? {})?.map((item, i) => {
      setTotalCompletions(
        (x) => x + parseInt(completions.completions[item].total)
      );
      setPlayedCompletions(
        (x) => x + parseInt(completions.completions[item].completed)
      );
    });
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
      <div className="d-flex">
        <CheckOtherPlayer
          username={username}
          setUserId={setUserId}
          setUsername={setUsername}
        />
        <SaveScreenshot />
      </div>

      <div className="d-flex flex-column my-2" data-html2canvas-ignore="true">
        <button
          className={
            "btn yes-no-button my-2" + (convertsOnly ? " icon-selected" : "")
          }
          style={{ color: "white" }}
          onClick={() => {
            setConvertsOnly(!convertsOnly);
          }}
        >
          Converts only
        </button>
        <button className="btn btn-primary my-2" onClick={getUserCompletion}>
          Get User Completion
        </button>
      </div>
      <ul className="list-group bg-secondary" style={{ overflow: "hidden" }}>
        {Object.keys(userCompletions?.completions ?? {})?.map((item, i) => {
          const completed = userCompletions.completions[item].completed;
          const total = userCompletions.completions[item].total;
          const x = completed / total;
          const r = (1.0 - x) * 1.0;
          const g = x * 1.0;
          const b = 0;
          const percentageCompleted = (x * 100).toFixed(2);
          const emptyYear = percentageCompleted === "NaN";

          return (
            <>
              <li
                className="list-group-item"
                style={{ margin: 0, padding: 0, border: 0 }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    position: "absolute",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {completed}/{total} ({percentageCompleted}%)
                </span>
                <div
                  className="progress"
                  style={{
                    height: 24,
                    borderRadius: 0,
                    backgroundColor: `var(--bs-secondary)`,
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${emptyYear ? 100 : percentageCompleted}%`,
                      overflow: "visible",
                      backgroundColor: emptyYear
                        ? `var(--bs-secondary)`
                        : `rgb(${r * 255}, ${g * 255}, ${b})`,
                    }}
                  ></div>
                </div>
              </li>
            </>
          );
        })}
      </ul>
      {userCompletions?.completions && (
        <>
          <h5 className="my-3">
            <center>Total:</center>
          </h5>

          <li
            className="list-group-item"
            style={{ margin: 0, padding: 0, border: 0, height: 36 }}
          >
            <span
              style={{
                position: "absolute",
                textAlign: "center",
                top: 5,
                width: "100%",
                height: "100%",
                fontSize: 18,
                fontWeight: 700,
                color: "black",
                textShadow:
                  "0 0 5px #FFF, 0 0 5px #FFF, 0 0 5px #FFF, 0 0 5px #FFF",
              }}
            >
              {playedCompletions}/{totalCompletions} (
              {((playedCompletions / totalCompletions) * 100).toFixed(2)}%)
            </span>
            <div
              className="progress"
              style={{
                height: 36,
                backgroundColor: `var(--bs-secondary)`,
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${(playedCompletions / totalCompletions) * 100}%`,
                  overflow: "visible",
                  backgroundColor: `rgb(${
                    (1.0 - playedCompletions / totalCompletions) * 1.0 * 255
                  }, ${(playedCompletions / totalCompletions) * 1.0 * 255}, 0)`,
                }}
              ></div>
            </div>
          </li>
        </>
      )}
    </div>
  );
};

export default UserStatistics;
