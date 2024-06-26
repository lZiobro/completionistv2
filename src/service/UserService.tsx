import { IAuthToken } from "../interfaces/IAuthToken";
import { IUserScoreInfo } from "../interfaces/IUserScoreInfo";

export const getUserScoresNode = async (userId: number, gamemode: string) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getAllUserScores?userId=${userId}&gamemode=${gamemode}`,
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

export const getUserScoresOnBeatmapsNode = async (
  userId: number,
  gamemode: string,
  beatmapsIds: number[]
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getUserScoresOnBeatmaps?userId=${userId}&gamemode=${gamemode}`,
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
      `${process.env.REACT_APP_BASE_API_URL}/getUserScoreOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
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
      `${
        process.env.REACT_APP_BASE_API_URL
      }/getUserCompletion?userId=${userId}&gamemode=${gamemode}&convertsOnly=${
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

export const getAllUserScoresOnBeatmap = async (
  beatmapId: number,
  userId: number,
  authToken: IAuthToken,
  gamemode: string
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getAllUserScoresOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
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
      if (respJson.error) {
        console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
        return { scores: "SC", beatmap: "ABC", rateLimitRemaining: -1 };
      }
      return {
        scores: respJson.response.scores,
        beatmap: respJson.response.beatmap,
        ratelimitRemaining: respJson.ratelimitRemaining,
      };
    } else {
      console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
      return { scores: "SC", beatmap: "ABC", rateLimitRemaining: -1 };
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
    return { scores: "SC", beatmap: "ABC", rateLimitRemaining: -1 };
  }
};

export const getUserId = async (authToken: IAuthToken) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getUserId?authTokenString=${authToken.access_token}`,
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
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
  }
};
