import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { getAuth } from "../../service/OsuwebService";
import {
  getAllBeatmapsNode,
  getBeatmapsets,
  getBeatmapsetsNode,
  insertBeatmapsetsIntoNode,
} from "../../service/BeatmapsService";
import {
  getUserScoreOnBeatmap,
  getUserScoresNode,
} from "../../service/UserService";
import { mapResponseArrayToUserScoreInfo } from "../../mappers/UserScoreMapper";
import { IBeatmapInfo } from "../../interfaces/IBeatmapInfo";

const AdminPanelPage = (props: {
  authToken: IAuthToken | undefined;
  setAuthToken: Function;
}) => {
  const [authUrl, setAuthUrl] = useState<string>(
    "https://osu.ppy.sh/oauth/authorize?client_id=30207&redirect_uri=http://localhost:3000&response_type=code&scope=public"
  );

  const [code, setCode] = useState<string | null>("");
  const userIdRef = useRef<any>();
  const [beatmapsYear, setBeatmapsYear] = useState<number | null>(null);
  const [selectedGamemode, setSelectedGamemode] = useState<string>("osu");
  const [unplayedOnly, setUnplayedOnly] = useState<boolean>(true);
  const [beatmapCountToCheck, setBeatmapCountToCheck] = useState<number>(0);
  const [checkedBeatmapCount, setCheckedBeatmapCount] = useState<number>(0);
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    setCode(code);
  }, []);

  const fetchAuthToken = async () => {
    props.setAuthToken(await getAuth(code!));
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("code");
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
    while (true) {
      const beatmapsetsWithCursorAndRatelimit: any =
        await fetchBeatmapsForYearFromOsuWebDateAsc(cursor);
      await insertBeatmapsetsIntoNode(
        beatmapsetsWithCursorAndRatelimit?.beatmapsets!
      );
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
    }
  };

  const fetchUserScoresAndUpload = async () => {
    if (!props.authToken) {
      return;
    }
    let beatmapsets: any[] | undefined = [];
    if (beatmapsYear) {
      beatmapsets = await fetchBeatmapsForYear(beatmapsYear);
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
          getUserScoreOnBeatmap(
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
          await new Promise((r) => setTimeout(r, 10000));
        }

        const resultsScores = results.map((x: any) => x.score!);

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
        count += 20;
        setCheckedBeatmapCount(count);
      }
    }
  };

  const fetchBeatmapsForYear = async (beatmapsYear: number) => {
    return await getBeatmapsetsNode(
      Number.isNaN(beatmapsYear) ? 2007 : beatmapsYear!
    );
  };

  return (
    <div className="admin-panel">
      <p>ADMIN PANEL</p>
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
          <button
            disabled={props.authToken === undefined}
            onClick={fetchUserScoresAndUpload}
          >
            Confirm
          </button>
        </div>

        <div className="main-page_menu-element">
          <label htmlFor="beatmapYear">Beatmaps For Year</label>
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
            onClick={fetchAndUploadBeatmapsDateAsc}
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
            {(beatmapCountToCheck - checkedBeatmapCount) / 800} minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
