import { IAuthToken } from "../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../interfaces/IBeatmapsetInfo";
import { mapResponseArrayToBeatmapsetInfo } from "../mappers/BeatmapsetMapper";

export const getBeatmapsets = async (
  authToken: IAuthToken,
  cursor_string: string | null
) => {
  try {
    let resp = await fetch(
      `http://localhost:21727/getBeatmapsets?authTokenString=${authToken.access_token}&cursorString=${cursor_string}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken.access_token}`,
        },
      }
    );
    if (resp.ok) {
      const respJson = await resp.json();
      return {
        beatmapsets: mapResponseArrayToBeatmapsetInfo(
          respJson.response.beatmapsets
        ),
        cursor_string: respJson.response.cursor_string,
        ratelimitRemaining: respJson.ratelimitRemaining,
      };
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
  }
};

export const insertBeatmapsetsIntoNode = async (
  beatmapsets: IBeatmapsetInfo[]
) => {
  await fetch("http://localhost:21727/insertBeatmapsets", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(beatmapsets),
  });
};

export const getBeatmapsetsNode = async (
  year: number,
  month: number | null = null,
  selectedGamemode: string | null = null
) => {
  try {
    let resp = await fetch(
      `http://localhost:21727/getBeatmapsetsForYear?year=${year}${
        month !== null ? `&month=${month}` : ""
      }${selectedGamemode !== null ? `&gamemode=${selectedGamemode}` : ""}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as IBeatmapsetInfo[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};

export const getAllBeatmapsNode = async (
  selectedGamemode: string | null = null
) => {
  try {
    let resp = await fetch(
      selectedGamemode
        ? `http://localhost:21727/getBeatmapsetsForYear?gamemode=${selectedGamemode}`
        : `http://localhost:21727/getBeatmapsetsForYear?`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as IBeatmapsetInfo[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};
