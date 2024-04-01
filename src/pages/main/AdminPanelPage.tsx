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
import CsvFileParser from "../../tools/csvFileParser";
import { IUserScoreImport } from "../../interfaces/IScoreImport";
import HowToUseAdminModal from "../modals/Modal";
import Modal from "../modals/Modal";
import { beatmapsetsIdsArray } from "../../misc/beatmapsetsList";

const AdminPanelPage = (props: {
  authToken: IAuthToken | undefined;
  setAuthToken: Function;
  userId: number | undefined;
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
  const [fetchingPanelVisible, setFetchingPanelVisible] =
    useState<boolean>(false);

  const [autoStopTextVisible, setAutoStopTextVisible] =
    useState<boolean>(false);
  const [scoresImportResult, setScoresImportResult] = useState<
    IUserScoreImport[]
  >([] as IUserScoreImport[]);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    setCode(code);
    window.addEventListener("keydown", (e) => {
      if (e.key === "p") {
        console.log("dupa");
        setFetchingPanelVisible(true);
      }
    });
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
      const userId = userIdRef.current.value;
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
    for (let i = 0; i < beatmaps3.length; i++) {
      const beatmapsSlice = beatmaps3[i];
      const bodyShit = {
        userId: userIdRef.current.value,
        authTokenString: props.authToken?.access_token,
        gamemode: selectedGamemode ?? "osu",
        beatmapsIds: beatmapsSlice.map((x) => x.id),
      };
      const fetchResult: any = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/fetchUserScoresOnBeatmaps`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyShit),
        }
      );

      const fetchResultsJson = await fetchResult.json();

      if (
        fetchResultsJson &&
        fetchResultsJson.results &&
        fetchResultsJson.results[0]
      ) {
        if (fetchResultsJson.rateLimitRemaining === -1) {
          //repeat this iteration
          i--;
          continue;
        }
        if (fetchResultsJson.ratelimitRemaining < 30) {
          await new Promise((r) => setTimeout(r, 20000));
        } else if (fetchResultsJson.ratelimitRemaining < 100) {
          await new Promise((r) => setTimeout(r, 10000));
        } else if (fetchResultsJson.ratelimitRemaining < 200) {
          await new Promise((r) => setTimeout(r, 2000));
        }

        const results = fetchResultsJson.results;

        const resultsScores = results.map((x: any) => {
          if (!x.scores || !x.scores[0]) return undefined;
          const score = x.scores?.reduce((maxScore: any, currentScore: any) =>
            maxScore.score > currentScore.score ? maxScore : currentScore
          );
          score["beatmap"] = x.beatmap[0];
          return score;
        });

        const mapped = mapResponseArrayToUserScoreInfo(
          resultsScores.filter((x: any) => x !== undefined && x !== null)
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

    var dupa2 = beatmapsetsIdsArray.filter((x) => !dupa?.some((y) => y === x));
    //uncomment this to get it working ^^ and comment this \/\/
    // var dupa2: number[] = [];

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
      {showHelp && (
        <Modal>
          {" "}
          <p>HOW TO USE</p>
          <p>
            To do anything, you must authorize your osu account to get to the
            osu api. <br />
            To do that, you need to first click "Authorize" text, then make sure
            your server is running and click the GetAuthToken
            <br />
            If everything went well, you are now authenticated and can use osu
            api \o/
          </p>
          <p>
            <b>
              TL;DR
              <br />
              Authorize =&gt; getAuthToken =&gt; Fetch scores in admin panel
              <br />
              (if you leave year empty itll fetch scores for all years)
              <br />
              Use the rest of the app as is
            </b>
          </p>
          <p>
            After authenticating you get access to a few things: <br />
            1. Fetching scores from osu website <br />
            1.1 MAKE SURE YOU'VE SELECTED CORRECT GAMEMODE - IF YOU WANT
            CONVERTS, CHECK THE CONVERTS ONLY <br />
            1.2 After selecting the gamemode insert your userId and optionally a
            year from which you want to fetch scores
            <br />
            1.3 Your scores for given gamemode is now fetching \o/
            <br />
            <br />
            1.4 The first fetch will probably take a long time (bout 2 hours for
            std, or some less for other gamemodes)
            <br />
            <br />
            1.4.1 After the initial fetch, you can just check the "unplayed
            only", which will reduce the amount of time drastically
            <br />
            1.4.2 You will see the progress on the label Checked x out of y
            beatmaps.
            <br />
            1.4.3 The scores will be only fetched for the maps in
            database(should be complete as of 27.02.2024)
            <br />
            1.4.4 Soon there will be an option to just fetch scores from the
            past 24H, which will work instantly most likely
            <br />
            1.4.5 You can also check for new scores on the main panel below
            (white section), but still need to authenticate first.
          </p>
          <button onClick={() => setShowHelp(false)}>CLOSE</button>
        </Modal>
      )}
      <p>ADMIN PANEL</p>
      <button onClick={() => setShowHelp(true)}>HOW TO USE</button>
      <br />
      <br />
      {/* <CsvFileParser setResult={setScoresImportResult} /> */}
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
            defaultValue={props.userId}
          ></input>
          <label htmlFor="beatmapYear">Scores For Year</label>
          <input
            disabled={props.authToken === undefined}
            name="beatmapYear"
            onChange={(e) => {
              setBeatmapsYear(parseInt(e.target.value));
            }}
            type="numeric"
            placeholder="(optional)"
          ></input>
          <button
            disabled={props.authToken === undefined}
            onClick={fetchUserScoresAndUpload}
          >
            Confirm
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
            {(beatmapCountToCheck - checkedBeatmapCount) / 1000} minutes.
          </p>
          {fetchingPanelVisible && (
            <>
              <div className="main-page_menu-element">
                <button
                  disabled={props.authToken === undefined}
                  onClick={fetchAndUploadBeatmapsDateAsc}
                >
                  Fetch new beatmapsets from osu site
                </button>
              </div>
              <p>
                Fetched {fetchedBeatmapsetsCount}/
                {beatmapsToFetchCount === 0 ? "?" : beatmapsToFetchCount}{" "}
                beatmapsets... (Overlap with database entries:{" "}
                {beatmapDbOverlapCount})
                <br />
                <label htmlFor="autoStopBeatmapFetch">
                  Automatically stop fetching beatmaps on 10 consecutive
                  overlaps
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
                <br />
                {autoStopTextVisible && (
                  <span>
                    Auto stopped fetching due to 10 consecutive overlap count!
                  </span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
