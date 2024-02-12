import { IAuthToken } from "../interfaces/IAuthToken";
import { IBeatmapsetInfo } from "../interfaces/IBeatmapsetInfo";
import { mapResponseArrayToBeatmapsetInfo } from "../mappers/BeatmapsetMapper";

export const getBeatmapTest = async (authToken: IAuthToken) => {
  try {
    let resp = await fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent("https://osu.ppy.sh/api/v2/beatmapsets/search"),
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
      const mapped = mapResponseArrayToBeatmapsetInfo(respJson.beatmapsets);
      await fetch("http://localhost:21727/insertBeatmapsets", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mapped),
      });
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
  }
};

export const getBeatmapTestNode = async (year: number) => {
  console.log(`http://localhost:21727/getBeatmapsetsForYear?year=${year}`);
  try {
    let resp = await fetch(
      `http://localhost:21727/getBeatmapsetsForYear?year=${year}`,
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
