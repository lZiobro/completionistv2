import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { getAuth } from "../../service/OsuwebService";
import {
  fetchBeatmapsetById,
  getAllBeatmapsNode,
  getAllBeatmapsetsNode,
  getBeatmapsets,
  getBeatmapsetsNode,
  insertBeatmapsetIntoNode,
  insertBeatmapsetsIntoNode,
} from "../../service/BeatmapsService";
import {
  getAllUserScoresOnBeatmap,
  getUserScoresNode,
} from "../../service/UserService";
import { mapResponseArrayToUserScoreInfo } from "../../mappers/UserScoreMapper";
import { IBeatmapInfo } from "../../interfaces/IBeatmapInfo";
import { beatmapsetsIdsArray } from "../../misc/beatmapsetsList";

const AdminPanelPage = (props: {
  authToken: IAuthToken | undefined;
  setAuthToken: Function;
}) => {
  const [authUrl, setAuthUrl] = useState<string>(
    `https://osu.ppy.sh/oauth/authorize?client_id=30207&redirect_uri=${window.location.href.slice(
      0,
      window.location.href.lastIndexOf("/")
    )}&response_type=code&scope=public`
  );

  const [code, setCode] = useState<string | null>("");
  const userIdRef = useRef<any>();
  const [beatmapsYear, setBeatmapsYear] = useState<number | null>(null);
  const [selectedGamemode, setSelectedGamemode] = useState<string>("osu");
  const [unplayedOnly, setUnplayedOnly] = useState<boolean>(true);
  const [beatmapCountToCheck, setBeatmapCountToCheck] = useState<number>(0);
  const [checkedBeatmapCount, setCheckedBeatmapCount] = useState<number>(0);
  const [beatmapDbOverlapCount, setBeatmapDbOverlapCount] = useState<number>(0);
  const [beatmapsToFetchCount, setBeatmapsToFetchCount] = useState<number>(0);
  const [fetchedBeatmapsetsCount, setFetchedBeatmapsetsCount] =
    useState<number>(0);
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const [
    autoStopFetchingBeatmapsOnConsecutiveOverlap,
    setAutoStopFetchingBeatmapsOnConsecutiveOverlap,
  ] = useState<boolean>(true);

  const [autoStopTextVisible, setAutoStopTextVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    setCode(code);
  }, []);

  const fetchAuthToken = async () => {
    const auth = await getAuth(code!);
    if (auth) {
      props.setAuthToken(auth);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete("code");
    } else {
      alert("cant authorize!");
    }
  };

  const fetchBeatmapsForYearFromOsuWebDateAsc = async (
    cursor: string | null
  ) => {
    if (props.authToken === undefined) {
      return;
    }
    const resp = await getBeatmapsets(props.authToken, cursor);
    return resp;
  };

  const fetchAndUploadBeatmapsDateAsc = async () => {
    let cursor = null;
    let totalMaps = 0;
    let fetchedMaps = 0;
    let consecutiveOverlaps = 0;

    setAutoStopTextVisible(false);
    while (true) {
      const beatmapsetsWithCursorAndRatelimit: any =
        await fetchBeatmapsForYearFromOsuWebDateAsc(cursor);
      await insertBeatmapsetsIntoNode(
        beatmapsetsWithCursorAndRatelimit?.beatmapsets!
      );
      if (cursor === null) {
        setBeatmapsToFetchCount(beatmapsetsWithCursorAndRatelimit.totalMaps);
        totalMaps = beatmapsetsWithCursorAndRatelimit.totalMaps;
      }
      fetchedMaps += 50;
      setFetchedBeatmapsetsCount(fetchedMaps);
      setBeatmapDbOverlapCount(beatmapsetsWithCursorAndRatelimit.overlapCount);
      if (beatmapsetsWithCursorAndRatelimit.overlapCount === 50) {
        consecutiveOverlaps += 1;
      } else {
        consecutiveOverlaps = 0;
      }
      if (beatmapsetsWithCursorAndRatelimit?.ratelimitRemaining < 100) {
        await new Promise((r) => setTimeout(r, 60000));
      }
      cursor = beatmapsetsWithCursorAndRatelimit?.cursor_string;

      const selectedYear = new Date(`${beatmapsYear! + 1}-01-01T00:00:00.000`);

      if (
        beatmapsetsWithCursorAndRatelimit?.beatmapsets.some(
          (x: any) => new Date(x.ranked_date) >= selectedYear
        )
      ) {
        return;
      }

      // console.log(fetchedMaps);
      // console.log(totalMaps);

      if (fetchedMaps > totalMaps + 200) {
        return;
      }
      if (
        autoStopFetchingBeatmapsOnConsecutiveOverlap &&
        consecutiveOverlaps > 9
      ) {
        setAutoStopTextVisible(true);
        return;
      }
    }
  };

  const fetchUserScoresAndUpload = async () => {
    if (!props.authToken) {
      return;
    }
    let beatmapsets: any[] | undefined = [];
    if (beatmapsYear) {
      beatmapsets = await getBeatmapsetsNode(
        beatmapsYear!,
        null,
        convertsOnly ? "osu" : selectedGamemode
      );
    } else {
      beatmapsets = await getAllBeatmapsNode(
        convertsOnly ? "osu" : selectedGamemode
      );
    }

    const beatmaps = beatmapsets?.map((beatmapset) => {
      return beatmapset.beatmaps;
    });

    let beatmaps2: IBeatmapInfo[] = Array.prototype.concat.apply([], beatmaps!);

    if (unplayedOnly) {
      const userId =
        userIdRef.current.value === "" ? 2163544 : userIdRef.current.value;
      const userScores = await getUserScoresNode(userId, selectedGamemode);

      beatmaps2 = beatmaps2?.filter(
        (x) => !userScores!.some((y) => y.beatmap_id === x.id)
      );
    }

    setBeatmapCountToCheck(beatmaps2.length);

    const beatmaps3 = [];
    while (beatmaps2.length) {
      beatmaps3.push(beatmaps2.splice(0, 20));
    }
    let count = 0;
    for await (const beatmapsSlice of beatmaps3!) {
      const promiseArray: Promise<any>[] = [];
      beatmapsSlice.forEach((beatmap) => {
        promiseArray.push(
          getAllUserScoresOnBeatmap(
            beatmap.id,
            7552274,
            props.authToken!,
            selectedGamemode
          )
        );
      });

      let results = await Promise.all(promiseArray);

      if (results && results[0]) {
        if (results.at(-1).ratelimitRemaining < 100) {
          await new Promise((r) => setTimeout(r, 15000));
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
        await fetch(`${process.env.REACT_APP_BASE_API_URL}/insertUserScores`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mapped),
        });
        count += 20;
        setCheckedBeatmapCount(count);
      }
    }
  };

  // const fetchBeatmapsForYear = async (beatmapsYear: number) => {
  //   return await getBeatmapsetsNode(
  //     Number.isNaN(beatmapsYear) ? 2007 : beatmapsYear!
  //   );
  // };

  //DO NOT DELETE
  const fetchMissingBeatmapsets = async () => {
    const dupa = await getAllBeatmapsetsNode();
    // console.log(beatmapsetsIdsArray.filter((x) => dupa?.some((y) => y === x)));
    // console.log(beatmapsetsIdsArray.filter((x) => !dupa?.some((y) => y === x)));
    // console.log(beatmapsetsIdsArray);

    // var dupa2 = beatmapsetsIdsArray.filter((x) => !dupa?.some((y) => y === x));
    //uncomment this to get it working ^^
    var dupa2: number[] = [];
    // console.log(dupa2);

    for await (const beatmapsetId of dupa2) {
      const beatmapsetWithRateLimit: any = await fetchBeatmapsetById(
        props.authToken!,
        beatmapsetId
      );
      await insertBeatmapsetIntoNode(beatmapsetWithRateLimit?.beatmapset!);
      setFetchedBeatmapsetsCount((x) => x + 1);
      setBeatmapsToFetchCount(dupa2.length);
      if (beatmapsetWithRateLimit?.ratelimitRemaining < 100) {
        await new Promise((r) => setTimeout(r, 60000));
      }
    }
  };

  return (
    <div className="admin-panel">
      <p>ADMIN PANEL</p>
      {/* <button onClick={fetchMissingBeatmapsets}>ASDASDASD</button> */}
      {code === null || true ? <a href={authUrl}>AUTHORIZE</a> : null}
      <div className="main-page_menu-wrapper">
        <div className="main-page_menu-element">
          <button
            disabled={code === null || props.authToken !== undefined}
            onClick={fetchAuthToken}
          >
            GetAuthToken
          </button>
        </div>
        <div className="main-page_menu-element">
          <label htmlFor="userId">UserId</label>
          <input
            disabled={props.authToken === undefined}
            name="userId"
            ref={userIdRef}
          ></input>
          <label htmlFor="beatmapYear">Scores For Year</label>
          <input
            disabled={props.authToken === undefined}
            name="beatmapYear"
            onChange={(e) => {
              setBeatmapsYear(parseInt(e.target.value));
            }}
            type="numeric"
          ></input>
          <button
            disabled={props.authToken === undefined}
            onClick={fetchUserScoresAndUpload}
          >
            Confirm
          </button>
        </div>

        <div className="main-page_menu-element">
          <button
            disabled={props.authToken === undefined}
            onClick={fetchAndUploadBeatmapsDateAsc}
          >
            Fetch new beatmapsets from osu site
          </button>
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
          <label htmlFor="unplayedOnly">Unplayed only</label>
          <input
            type="checkbox"
            name="unplayedOnly"
            checked={unplayedOnly}
            onClick={() => {
              setUnplayedOnly(!unplayedOnly);
            }}
          />
          <label htmlFor="convertMode">Converts only: </label>
          <input
            type="checkbox"
            id="convertMode"
            name="convertMode"
            onClick={(e) => {
              setConvertsOnly(!convertsOnly);
            }}
            checked={convertsOnly}
          />
        </div>
        <div>
          <p>
            Checked {checkedBeatmapCount} out of {beatmapCountToCheck} beatmaps.
            Estimated time remaining:{" "}
            {(beatmapCountToCheck - checkedBeatmapCount) / 800} minutes.
          </p>
          <label htmlFor="autoStopBeatmapFetch">
            Automatically stop fetching beatmaps on 10 consecutive overlaps
          </label>
          <input
            name="autoStopBeatmapFetch"
            type="checkbox"
            checked={autoStopFetchingBeatmapsOnConsecutiveOverlap}
            onClick={() => {
              setAutoStopFetchingBeatmapsOnConsecutiveOverlap(
                !autoStopFetchingBeatmapsOnConsecutiveOverlap
              );
            }}
          />
          <p>
            Fetched {fetchedBeatmapsetsCount}/
            {beatmapsToFetchCount === 0 ? "?" : beatmapsToFetchCount}{" "}
            beatmapsets... (Overlap with database entries:{" "}
            {beatmapDbOverlapCount})
            <br />
            {autoStopTextVisible && (
              <span>
                Auto stopped fetching due to 10 consecutive overlap count!
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
