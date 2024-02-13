import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../../interfaces/IBeatmapsetInfo";
import { IUserScoreInfo } from "../../interfaces/IUserScoreInfo";
import { getAuthTest } from "../../service/OsuwebService";
import { getUserScoresTestNode } from "../../service/UserService";
import { getBeatmapTestNode } from "../../service/BeatmapsService";

const MainPage = () => {
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetInfo[] | undefined>(
    undefined
  );
  const [userScores, setUserScores] = useState<IUserScoreInfo[] | undefined>(
    undefined
  );
  const userIdRef = useRef<any>();
  const [beatmapsYear, setBeatmapsYear] = useState<number | null>(null);

  //update maps with scores from user
  const setUserScoresOnBeatmaps = (userScores: IUserScoreInfo[]) => {
    if (userScores === undefined) return;
    const beatmapsetsUpdated = beatmapsets?.map((beatmapset) =>
      checkForUserScoreOnMapSet(userScores, beatmapset)
    );
    setBeatmapsets(beatmapsetsUpdated);
  };

  //private funcs
  const handleRowClick = async (e: any, beatmapsetId: number) => {
    //get detailed userScore for given beatmap and save it on the beatmap model
    const beatmapset = beatmapsets?.filter((x) => x.id == beatmapsetId).at(0);
    const beatmapsetIndex = beatmapsets?.map((x) => x.id).indexOf(beatmapsetId);

    for await (const beatmap of beatmapset?.beatmaps!) {
      const userScore = userScores
        ?.filter((x) => x.beatmap_id === beatmap.id)
        ?.at(0);
      beatmap.userScore = userScore;
      console.log(userScore);
    }
    console.log(beatmapset);
    const beatmapsetsUpdated = [
      ...beatmapsets!.slice(0, beatmapsetIndex),
      beatmapset,
      ...beatmapsets!.slice(beatmapsetIndex! + 1),
    ];

    setBeatmapsets(beatmapsetsUpdated as IBeatmapsetInfo[]);

    var hiddenRows = Array.from(
      document.getElementsByClassName("hidden-row-" + beatmapsetId)
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

  const fetchUserScores = async () => {
    const userId =
      userIdRef.current.value === "" ? 2163544 : userIdRef.current.value;
    const userScores = await getUserScoresTestNode(userId);
    if (userScores !== undefined && userScores !== null) {
      setUserScoresOnBeatmaps(userScores);
    }
    setUserScores(userScores);
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
      <div className="main-page_menu-wrapper">
        <div className="main-page_menu-element">
          <label htmlFor="userId">UserId</label>
          <input name="userId" ref={userIdRef}></input>
          <button onClick={fetchUserScores}>Confirm</button>
        </div>

        <div className="main-page_menu-element">
          <label htmlFor="beatmapYear">Beatmaps For Year</label>
          <input
            name="beatmapYear"
            onChange={(e) => {
              setBeatmapsYear(parseInt(e.target.value));
            }}
            type="numeric"
          ></input>
          <button onClick={fetchBeatmapsForYear}>Confirm</button>
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
              <tr className={"hidden-row hidden-row-" + x.id}>
                <td colSpan={3}>
                  <table>
                    <thead>
                      <tr>
                        <td>Difficulty</td>
                        <td>Rank</td>
                        <td>Accuracy</td>
                        <td>Miss count</td>
                        <td>Mods</td>
                        <td>Completion</td>
                        <td>Date played</td>
                      </tr>
                    </thead>
                    <tbody>
                      {x.beatmaps?.map((y) => (
                        <tr
                          key={y.id}
                          className={"hidden-row hidden-row-" + y.beatmapset_id}
                        >
                          <td>{y.version}</td>
                          <td>{y.userScore?.rank}</td>
                          <td>{(y.userScore?.accuracy! * 100).toFixed(2)}%</td>
                          <td>{y.userScore?.statistics_count_miss}</td>
                          <td></td>
                          <td
                            className={
                              y.completed
                                ? "beatmap-table-complete"
                                : "beatmap-table-unplayed"
                            }
                          >
                            {y.completed ? "Completed" : "Unplayed"}
                          </td>
                          <td>{y.userScore?.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainPage;
