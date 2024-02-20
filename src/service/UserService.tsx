import { IAuthToken } from "../interfaces/IAuthToken";
import { IUserScoreInfo } from "../interfaces/IUserScoreInfo";

export const getUserScoreTest = async (authToken: IAuthToken) => {
  try {
    let resp = await fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent(
          "https://osu.ppy.sh/api/v2/users/2163544/scores/recent?mode=osu&limit=100&offset=0"
        ),
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
      return respJson;
    }
  } catch (err) {
    console.log("CANT GET USER SCORES FROM OSU WEBSITE");
  }
};

export const getUserScoresTestNode = async (
  userId: number,
  gamemode: string
) => {
  console.log(
    `http://localhost:21727/getAllUserScores?userId=${userId}&gamemode=${gamemode}`
  );
  try {
    let resp = await fetch(
      `http://localhost:21727/getAllUserScores?userId=${userId}&gamemode=${gamemode}`,
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
      return resp as unknown as IUserScoreInfo[];
    }
  } catch (err) {
    console.log("CANT GET USER SCORES FROM NODE SERVER");
  }
};

export const getUserScoresOnBeatmapsTestNode = async (
  userId: number,
  gamemode: string,
  beatmapsIds: number[]
) => {
  console.log(
    `http://localhost:21727/getUserScoresOnBeatmaps?userId=${userId}&gamemode=${gamemode}`
  );
  try {
    let resp = await fetch(
      `http://localhost:21727/getUserScoresOnBeatmaps?userId=${userId}&gamemode=${gamemode}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ beatmapsIds: beatmapsIds }),
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as IUserScoreInfo[];
    }
  } catch (err) {
    console.log("CANT GET USER SCORES FROM NODE SERVER");
  }
};

export const getUserScoreOnBeatmap = async (
  beatmapId: number,
  userId: number,
  authToken: IAuthToken,
  gamemode: string
) => {
  try {
    let resp = await fetch(
      `http://localhost:21727/getUserScoreOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
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
        score: respJson.response.score,
        ratelimitRemaining: respJson.ratelimitRemaining,
      };
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
  }
};

export const getUserCompletionNode = async (
  userId: number,
  gamemode: string,
  convertsOnly: boolean
) => {
  try {
    let resp = await fetch(
      `http://localhost:21727/getUserCompletion?userId=${userId}&gamemode=${gamemode}&convertsOnly=${
        convertsOnly ? "true" : "false"
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.ok) {
      const respJson = await resp.json();
      return respJson;
    }
  } catch (err) {
    console.log("CANT FETCH USER COMPLETION FROM NODE");
  }
};
