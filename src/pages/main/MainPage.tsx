import { useRef, useState } from "react";
import { IBeatmapsetInfo } from "../../interfaces/IBeatmapsetInfo";
import { IUserScoreInfo } from "../../interfaces/IUserScoreInfo";
import { IBeatmapInfo } from "../../interfaces/IBeatmapInfo";
import { IUserScoreView } from "../../interfaces/IUserScoreView";
import { IBeatmapsetView } from "../../interfaces/IBeatmapsetView";
import {
  getAllUserScoresOnBeatmap,
  getUserScoresOnBeatmapsNode,
} from "../../service/UserService";
import {
  fetchBeatmapsetById,
  getBeatmapsetsNode,
  insertBeatmapsetIntoNode,
} from "../../service/BeatmapsService";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { IBeatmapView } from "../../interfaces/IBeatmapView";
import { mapResponseArrayToUserScoreInfo } from "../../mappers/UserScoreMapper";

const MainPage = (props: { authToken: IAuthToken | undefined }) => {
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetView[] | undefined>(
    undefined
  );
  const [userScores, setUserScores] = useState<IUserScoreView[] | undefined>(
    undefined
  );
  const userIdRef = useRef<any>();
  const beatmapsYearRef = useRef<any>();
  const beatmapsMonthRef = useRef<any>();
  const [selectedGamemode, setSelectedGamemode] = useState<string>("osu");
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const [unplayedOnly, setUnplayedOnly] = useState<boolean>(false);
  const [exportUrl, setExportUrl] = useState<string>("");

  //update maps with scores from user
  const setUserScoresOnBeatmaps = (
    userScores: IUserScoreView[],
    beatmapsets: IBeatmapsetView[]
  ) => {
    if (userScores === undefined) return;
    const beatmapsetsUpdated = beatmapsets.map((beatmapset) =>
      checkForUserScoreOnMapSet(userScores, beatmapset)
    );
    return beatmapsetsUpdated;
  };

  const checkForUserScoreOnMapSet = (
    userScores: IUserScoreView[],
    beatmapset: IBeatmapsetView
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

  const fetchUserScores = async (beatmapsets: IBeatmapsetView[]) => {
    const userId =
      userIdRef.current.value === "" ? 2163544 : userIdRef.current.value;

    const beatmaps = beatmapsets?.map((beatmapset) => {
      return beatmapset.beatmaps;
    });

    let beatmaps2: IBeatmapsetView[] = Array.prototype.concat.apply(
      [],
      beatmaps!
    );

    const userScores = await getUserScoresOnBeatmapsNode(
      userId,
      selectedGamemode,
      beatmaps2.map((x) => x.id)
    );

    if (userScores !== undefined && userScores !== null) {
      return [userScores, setUserScoresOnBeatmaps(userScores, beatmapsets)!];
    }
  };

  const fetchBeatmapsForYear = async () => {
    const gameMode = convertsOnly ? "osu" : selectedGamemode;
    let userScores: any[] = [];
    let beatmapsets: any[] = [];
    const beatmapsYear = Number.isNaN(parseInt(beatmapsYearRef.current.value))
      ? 2007
      : parseInt(beatmapsYearRef.current.value)!;
    const beatmapsMonth = Number.isNaN(parseInt(beatmapsMonthRef.current.value))
      ? null
      : parseInt(beatmapsMonthRef.current.value)!;
    beatmapsets = (await getBeatmapsetsNode(
      beatmapsYear,
      beatmapsMonth,
      gameMode
    ))!;

    if (userIdRef.current.value && userIdRef.current.value !== "") {
      [userScores, beatmapsets] = (await fetchUserScores(beatmapsets!))!;
    }

    if (unplayedOnly) {
      beatmapsets = beatmapsets.filter(
        (beatmapset) => beatmapset.completed !== 2
      );
    }

    setUserScores(userScores!);
    setBeatmapsets(beatmapsets);
  };

  const exportMaps = () => {
    const dupa = beatmapsets?.map((x) =>
      x.beatmaps.map((y) => {
        const userScore = userScores?.find(
          (score) => score.beatmap_id === y.id
        )!;
        return `"${x.artist} - ${x.title} [${y.version}]",${
          userScore?.created_at ?? ""
        },${
          (userScore?.rank === "S" && userScore.accuracy === 1
            ? "X"
            : userScore?.rank === "SH" && userScore.accuracy === 1
            ? "XH"
            : userScore?.rank) ?? ""
        },${
          userScore?.accuracy
            ? `${(userScore?.accuracy * 100).toFixed(2)}%`
            : ""
        },${userScore?.mods?.join(" ") ?? ""},${
          x.completed === 2
            ? "Completed"
            : x.completed === 1
            ? "Partial"
            : "Unplayed"
        },${
          x.ranked_date
        },${`https://osu.ppy.sh/beatmapsets/${x.id}#${y.mode}/${y.id}`},
          `;
      })
    );

    const blob = new Blob(dupa!.flat(2), { type: "octet/stream" });
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
  };

  const handleRowClick = async (e: any, beatmapsetId: number) => {
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

  const checkUserScoreOnBeatmapset = async (
    beatmapsToCheck: IBeatmapView[]
  ) => {
    if (!props.authToken) {
      alert("Authorize first!");
      return;
    }

    const results: any[] = [];
    for await (const bm of beatmapsToCheck) {
      results.push(
        await getAllUserScoresOnBeatmap(
          bm.id,
          userIdRef.current.value ?? 7552274,
          props.authToken!,
          selectedGamemode
        )
      );
    }

    const resultsScores = results.map((x: any) => {
      if (!x.scores || !x.scores[0]) return undefined;
      const score = x.scores?.reduce((maxScore: any, currentScore: any) =>
        maxScore.score > currentScore.score ? maxScore : currentScore
      );
      score["beatmap"] = x.beatmap[0];
      return score;
    });

    const mapped = mapResponseArrayToUserScoreInfo(
      resultsScores.filter((x) => x !== undefined && x !== null)
    );
    await fetch("http://localhost:21727/insertUserScores", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapped),
    });

    await fetchBeatmapsForYear();
  };

  return (
    <div>
      <p>completionist site</p>
      <button onClick={exportMaps}>Export as .csv</button>
      {exportUrl !== "" && (
        <a
          href={exportUrl}
          target="_blank"
          download={`Export${beatmapsYearRef.current.value ?? ""}.csv`}
        >
          Download
        </a>
      )}
      <div className="main-page_menu-wrapper">
        <div className="main-page_menu-element">
          <label htmlFor="userId">UserId</label>
          <input name="userId" ref={userIdRef}></input>
          {/* <button onClick={fetchUserScores}>Confirm</button> */}
        </div>

        <div className="main-page_menu-element">
          <label htmlFor="beatmapYear">Beatmaps For</label>
          <input
            name="beatmapYear"
            ref={beatmapsYearRef}
            type="numeric"
            placeholder="year"
          />
          <input
            name="beatmapMonth"
            ref={beatmapsMonthRef}
            type="numeric"
            placeholder="month"
          />
          <label htmlFor="unplayedOnly">Only unplayed</label>
          <input
            name="unplayedOnly"
            onChange={(e) => {
              setUnplayedOnly(!unplayedOnly);
            }}
            type="checkbox"
            checked={unplayedOnly}
          />
          <button onClick={fetchBeatmapsForYear}>Confirm</button>
        </div>
        <div className="main-page_menu-element">
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
        </div>
      </div>
      <table className="beatmap-table">
        <thead>
          <tr>
            <td>Beatmap name</td>
            <td>Completion</td>
            <td>Ranked date</td>
            <td>Download link</td>
            <td>Direct</td>
            <td>Check Beatmapset</td>
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
                <td>
                  <a
                    href={`https://osu.ppy.sh/beatmapsets/${x.id}`}
                    target="_blank"
                  >
                    Download
                  </a>
                </td>
                <td>
                  <a href={`osu://b/${x.id}`} target="_blank">
                    Direct
                  </a>
                </td>
                <td>
                  <button
                    onClick={(e) => checkUserScoreOnBeatmapset(x.beatmaps)}
                    style={{ width: "100%" }}
                  >
                    Check
                  </button>
                </td>
              </tr>
              <tr className={"hidden-row hidden-row-" + x.id}>
                <td colSpan={6}>
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
                      {x.beatmaps?.map((y) => {
                        const userScore = userScores?.find(
                          (score) => score.beatmap_id === y.id
                        )!;
                        return (
                          <tr
                            key={y.id}
                            className={
                              "hidden-row hidden-row-" + y.beatmapset_id
                            }
                          >
                            <td>{y.version}</td>
                            <td>
                              {userScore?.rank === "S" &&
                              userScore.accuracy === 1
                                ? "X"
                                : userScore?.rank === "SH" &&
                                  userScore.accuracy === 1
                                ? "XH"
                                : userScore?.rank}
                            </td>
                            <td>{(userScore?.accuracy! * 100).toFixed(2)}%</td>
                            <td>{userScore?.statistics_count_miss}</td>
                            <td>{userScore?.mods?.join(" ")}</td>
                            <td
                              className={
                                y.completed
                                  ? "beatmap-table-complete"
                                  : "beatmap-table-unplayed"
                              }
                            >
                              {y.completed ? "Completed" : "Unplayed"}
                            </td>
                            <td>{userScore?.created_at}</td>
                          </tr>
                        );
                      })}
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
