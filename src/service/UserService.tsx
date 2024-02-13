import { IAuthToken } from "../interfaces/IAuthToken";
import { IUserScoreInfo } from "../interfaces/IUserScoreInfo";
import {
  mapResponseArrayToUserScoreInfo,
  mapResponseToUserScoreInfo,
} from "../mappers/UserScoreMapper";

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
      console.log(respJson);
      // const mapped = mapResponseArrayToUserScoreInfo(respJson);
      // console.log("mapped");
      // console.log(JSON.stringify(mapped));
      // await fetch("http://localhost:21727/insertUserScores", {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(mapped),
      // });
      return respJson;
    }
  } catch (err) {
    console.log("CANT GET USER SCORES FROM OSU WEBSITE");
  }
};

export const getUserScoresTestNode = async (userId: number) => {
  console.log(`http://localhost:21727/getAllUserScores?userId=${userId}`);
  try {
    let resp = await fetch(
      `http://localhost:21727/getAllUserScores?userId=${userId}`,
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

export const getUserScoreOnBeatmap = async (
  beatmapId: number,
  userId: number,
  authToken: IAuthToken
) => {
  try {
    let resp = await fetch(
      `http://localhost:21727/getUserScoreOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}`,
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
      return respJson.score;
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
  }
};
