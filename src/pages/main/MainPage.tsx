import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../../interfaces/IBeatmapsetInfo";
import { IUserScoreInfo } from "../../interfaces/IUserScoreInfo";
import { getAuthTest } from "../../service/OsuwebService";
import { getUserScoresTestNode } from "../../service/UserService";
import { getBeatmapTestNode } from "../../service/BeatmapsService";

const MainPage = () => {
  const [authUrl, setAuthUrl] = useState<string>(
    "https://osu.ppy.sh/oauth/authorize?client_id=30207&redirect_uri=http://localhost:3000&response_type=code&scope=public"
  );
  const [authToken, setAuthToken] = useState<IAuthToken | undefined>(undefined);
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetInfo[] | undefined>(
    undefined
  );
  const [userScores, setUserScores] = useState<IUserScoreInfo[] | undefined>(
    undefined
  );
  const [code, setCode] = useState<string | null>("");
  const userIdRef = useRef<any>();
  const [beatmapsYear, setBeatmapsYear] = useState<number | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    setCode(code);
  }, []);

  useEffect(() => {
    if (authToken === undefined) {
      return;
    }

    // setBeatmapsets(await getBeatmapTestNode());
    // await getBeatmapTest(authToken);
    // await getUserScoreTest(authToken);
    // setUserScores(await getUserScoresTestNode());
  }, [authToken]);

  //update maps with scores from user
  const setUserScoresOnBeatmaps = () => {
    if (userScores === undefined) return;
    const beatmapsetsUpdated = beatmapsets?.map((beatmapset) =>
      checkForUserScoreOnMapSet(userScores, beatmapset)
    );
    setBeatmapsets(beatmapsetsUpdated);
  };

  //private funcs
  const handleRowClick = (e: any, param: number) => {
    var hiddenRows = Array.from(
      document.getElementsByClassName("hidden-row-" + param)
    );
    hiddenRows.forEach((element) => {
      if (element.classList.contains("make-row-visible")) {
        element.classList.remove("make-row-visible");
      } else {
        element.classList.add("make-row-visible");
      }
    });
  };

  const checkForUserScoreOnMapSet = (
    userScores: IUserScoreInfo[],
    beatmapset: IBeatmapsetInfo
  ) => {
    const diffCount = beatmapset.beatmaps.length;
    let completedDiffs = 0;
    beatmapset.beatmaps.forEach((beatmap) => {
      if (
        userScores?.some((score) => {
          return score.beatmap_id === beatmap.id;
        })
      ) {
        completedDiffs += 1;
        beatmap.completed = true;
      }
    });
    if (completedDiffs === 0) {
      beatmapset.completed = 0;
    } else if (completedDiffs < diffCount) {
      beatmapset.completed = 1;
    } else {
      beatmapset.completed = 2;
    }
    return beatmapset;
  };

  const fetchAuthToken = async () => {
    setAuthToken(await getAuthTest(code!));
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("code");
  };

  const fetchUserScores = async () => {
    // await getBeatmapTest(authToken);
    // await getUserScoreTest(authToken);
    const userId =
      userIdRef.current.value === "" ? 2163544 : userIdRef.current.value;
    setUserScores(await getUserScoresTestNode(userId));
    setUserScoresOnBeatmaps();
  };

  const fetchBeatmapsForYear = async () => {
    setBeatmapsets(
      await getBeatmapTestNode(
        Number.isNaN(beatmapsYear) ? 2007 : beatmapsYear!
      )
    );
  };

  return (
    <div>
      <p>completionist site</p>
      {code === null ? <a href={authUrl}>AUTHORIZE</a> : null}
      <div className="main-page_menu-wrapper">
        <div className="main-page_menu-element">
          <button
            disabled={code === null || authToken !== undefined}
            onClick={fetchAuthToken}
          >
            GetAuthToken
          </button>
        </div>
        <div className="main-page_menu-element">
          <label htmlFor="userId">UserId</label>
          <input
            disabled={authToken === undefined}
            name="userId"
            ref={userIdRef}
          ></input>
          <button disabled={authToken === undefined} onClick={fetchUserScores}>
            Confirm
          </button>
        </div>

        <div className="main-page_menu-element">
          <label htmlFor="beatmapYear">Beatmaps For Year</label>
          <input
            disabled={authToken === undefined}
            name="beatmapYear"
            onChange={(e) => {
              setBeatmapsYear(parseInt(e.target.value));
            }}
            type="numeric"
          ></input>
          <button
            disabled={authToken === undefined}
            onClick={fetchBeatmapsForYear}
          >
            Confirm
          </button>
        </div>
      </div>
      <table className="beatmap-table">
        <thead>
          <tr>
            <td>Beatmap Name</td>
            <td>Completion</td>
            <td>Ranked Date</td>
          </tr>
        </thead>
        <tbody>
          {beatmapsets?.map((x) => (
            <>
              <tr key={x.id} onClick={(e) => handleRowClick(e, x.id)}>
                <td>
                  {x.artist} - {x.title}
                </td>
                <td
                  className={
                    x.completed === 2
                      ? "beatmap-table-complete"
                      : x.completed === 1
                      ? "beatmap-table-partial"
                      : "beatmap-table-unplayed"
                  }
                >
                  {x.completed === 2
                    ? "Completed"
                    : x.completed === 1
                    ? "Partial"
                    : "Unplayed"}
                </td>
                <td>{x.ranked_date}</td>
              </tr>
              {x.beatmaps?.map((y) => (
                <tr
                  key={y.id}
                  className={"hidden-row hidden-row-" + y.beatmapset_id}
                >
                  <td>{y.version}</td>
                  <td
                    className={
                      y.completed
                        ? "beatmap-table-complete"
                        : "beatmap-table-unplayed"
                    }
                  >
                    {y.completed ? "Completed" : "Unplayed"}
                  </td>
                  <td>{y.last_updated}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainPage;
