import { useEffect, useRef, useState } from "react";
import { IAuthToken } from "../../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../../interfaces/IBeatmapsetInfo";
import { getAuthTest } from "../../service/OsuwebService";
import {
  getBeatmapTest,
  getBeatmapTestNode,
  insertBeatmapsetsIntoNode,
} from "../../service/BeatmapsService";
import { getUserScoreOnBeatmap } from "../../service/UserService";
import { IUserScoreInfo } from "../../interfaces/IUserScoreInfo";
import { mapResponseArrayToUserScoreInfo } from "../../mappers/UserScoreMapper";

const AdminPanelPage = () => {
  const [authUrl, setAuthUrl] = useState<string>(
    "https://osu.ppy.sh/oauth/authorize?client_id=30207&redirect_uri=http://localhost:3000&response_type=code&scope=public"
  );
  const [authToken, setAuthToken] = useState<IAuthToken | undefined>(undefined);
  const [code, setCode] = useState<string | null>("");
  const userIdRef = useRef<any>();
  const [beatmapsYear, setBeatmapsYear] = useState<number | null>(null);
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetInfo[] | undefined>(
    undefined
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    setCode(code);
  }, []);

  const fetchAuthToken = async () => {
    setAuthToken(await getAuthTest(code!));
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("code");
  };

  const fetchBeatmapsForYearFromOsuWebDateAsc = async (
    cursor: string | null
  ) => {
    if (authToken === undefined) {
      return;
    }
    const resp = await getBeatmapTest(authToken, cursor);
    return resp;
  };

  const fetchAndUploadBeatmapsDateAsc = async () => {
    let cursor = null;
    while (true) {
      const beatmapsetsWithCursor: any =
        await fetchBeatmapsForYearFromOsuWebDateAsc(cursor);
      await insertBeatmapsetsIntoNode(beatmapsetsWithCursor?.beatmapsets!);
      cursor = beatmapsetsWithCursor?.cursor_string;

      const selectedYear = new Date("2009-01-01T00:00:00.000");
      if (
        beatmapsetsWithCursor?.beatmapsets.some(
          (x: any) => new Date(x.ranked_date) >= selectedYear
        )
      ) {
        return;
      }
    }
  };

  const testss = async () => {
    if (authToken === null || authToken === undefined) {
      return;
    }

    const beatmapsets = await fetchBeatmapsForYear(2007);

    const userScoresArray: IUserScoreInfo[] = [];

    // const beatmaps = beatmapsets?.slice(0, 5).map((beatmapset) => {
    const beatmaps = beatmapsets?.map((beatmapset) => {
      return beatmapset.beatmaps;
    });

    var beatmaps2: IUserScoreInfo[] = Array.prototype.concat.apply(
      [],
      beatmaps!
    );

    for await (const beatmap of beatmaps2!) {
      const resp = (await getUserScoreOnBeatmap(
        beatmap.id,
        7552274,
        authToken
      ))!;
      if (resp !== null && resp !== undefined) {
        userScoresArray.push(resp);
      }
      //   await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(userScoresArray);

    const mapped = mapResponseArrayToUserScoreInfo(userScoresArray);
    await fetch("http://localhost:21727/insertUserScores", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapped),
    });

    // try {
    //   let resp = await fetch(
    //     "https://corsproxy.io/?" +
    //       encodeURIComponent(
    //         `https://osu.ppy.sh/api/v2/users/39828/scores/firsts?include_fails=0&mode=osu&limit=17&offset=0`
    //       ),
    //     {
    //       method: "GET",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${authToken.access_token}`,
    //       },
    //     }
    //   );
    //   if (resp.ok) {
    //     const respJson = await resp.json();
    //     console.log(respJson.score);
    //   }
    // } catch (err) {
    //   console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
    // }
  };

  const fetchBeatmapsForYear = async (beatmapsYear: number) => {
    return await getBeatmapTestNode(
      Number.isNaN(beatmapsYear) ? 2007 : beatmapsYear!
    );
  };

  return (
    <div className="admin-panel">
      <p>ADMIN PANEL</p>
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
          <button disabled={authToken === undefined} onClick={testss}>
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
            onClick={fetchAndUploadBeatmapsDateAsc}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
