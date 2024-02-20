import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../../interfaces/IBeatmapsetInfo";
import { IUserScoreInfo } from "../../interfaces/IUserScoreInfo";
import { getAuthTest } from "../../service/OsuwebService";
import {
  getUserScoresOnBeatmapsTestNode,
  getUserScoresTestNode,
} from "../../service/UserService";
import { getBeatmapTestNode } from "../../service/BeatmapsService";
import { IBeatmapInfo } from "../../interfaces/IBeatmapInfo";

const MainPage = () => {
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetInfo[] | undefined>(
    undefined
  );
  const [userScores, setUserScores] = useState<IUserScoreInfo[] | undefined>(
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
    userScores: IUserScoreInfo[],
    beatmapsets: IBeatmapsetInfo[]
  ) => {
    if (userScores === undefined) return;
    const beatmapsetsUpdated = beatmapsets.map((beatmapset) =>
      checkForUserScoreOnMapSet(userScores, beatmapset)
    );
    return beatmapsetsUpdated;
  };

  //private funcs
  const handleRowClick = async (e: any, beatmapsetId: number) => {
    //get detailed userScore for given beatmap and save it on the beatmap model
    // const beatmapset = beatmapsets?.filter((x) => x.id == beatmapsetId).at(0);
    // const beatmapsetIndex = beatmapsets?.map((x) => x.id).indexOf(beatmapsetId);

    // for await (const beatmap of beatmapset?.beatmaps!) {
    //   const userScore = userScores
    //     ?.filter((x) => x.beatmap_id === beatmap.id)
    //     ?.at(0);
    //   beatmap.userScore = userScore;
    //   console.log(userScore);
    // }
    // console.log(beatmapset);
    // const beatmapsetsUpdated = [
    //   ...beatmapsets!.slice(0, beatmapsetIndex),
    //   beatmapset,
    //   ...beatmapsets!.slice(beatmapsetIndex! + 1),
    // ];

    // setBeatmapsets(beatmapsetsUpdated as IBeatmapsetInfo[]);

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

  const fetchUserScores = async (beatmapsets: IBeatmapsetInfo[]) => {
    const userId =
      userIdRef.current.value === "" ? 2163544 : userIdRef.current.value;

    // const userScores = await getUserScoresTestNode(userId, selectedGamemode);

    const beatmaps = beatmapsets?.map((beatmapset) => {
      return beatmapset.beatmaps;
    });

    let beatmaps2: IBeatmapInfo[] = Array.prototype.concat.apply([], beatmaps!);

    const userScores = await getUserScoresOnBeatmapsTestNode(
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
    beatmapsets = (await getBeatmapTestNode(
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
    console.log(dupa);
    const blob = new Blob(dupa!.flat(2), { type: "octet/stream" });
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
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
              </tr>
              <tr className={"hidden-row hidden-row-" + x.id}>
                <td colSpan={4}>
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
