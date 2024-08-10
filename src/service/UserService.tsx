import { IUserScoreDbModel } from "../interfaces/db/IUserScoreDbModel";
import { IAuthToken } from "../interfaces/IAuthToken";
import { IUserScoreInfo } from "../interfaces/IUserScoreInfo";
import { IUserScoreView } from "../interfaces/IUserScoreView";

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
      return resp as unknown as IUserScoreDbModel[];
    }
  } catch (err) {
    console.log("CANT GET USER SCORES FROM NODE SERVER");
  }
};

// export const getUserScoreOnBeatmap = async (
//   beatmapId: number,
//   userId: number,
//   authToken: IAuthToken,
//   gamemode: string
// ) => {
//   try {
//     let resp = await fetch(
//       `${process.env.REACT_APP_BASE_API_URL}/getUserScoreOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken.access_token}`,
//         },
//       }
//     );
//     if (resp.ok) {
//       const respJson = await resp.json();
//       return {
//         score: respJson.response.score,
//         ratelimitRemaining: respJson.ratelimitRemaining,
//       };
//     }
//   } catch (err) {
//     console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
//   }
// };

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

export const fetchUserScoresOnBeatmapsNode = async (
  userId: number,
  authTokenString: string,
  gamemode: string,
  beatmapsIds: number[]
) => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/fetchUserScoresOnBeatmaps`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        authTokenString: authTokenString,
        gamemode: gamemode ?? "osu",
        beatmapsIds: beatmapsIds,
      }),
    }
  );

  if (response.ok) {
    const responseJson = await response.json();

    return responseJson;
  } else {
    alert(
      "Couldnt fetch scores.... You could've hit query limit on osu api or the server isnt responding/throwing errors... Retrying..."
    );
    return { rateLimitRemaining: -1 };
  }
};

export const fetchUserScoresOnBeatmapsetNode = async (
  beatmapId: number,
  userId: number,
  authToken: IAuthToken,
  gamemode: string
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/fetchUserScoresOnBeatmapset?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
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
      return respJson;
    }
  } catch (err) {}
};

export const getUserScoresBeatmapIdsNode = async (
  userId: number,
  gamemode: string,
  convertsOnly: boolean,
  year?: number
) => {
  try {
    let resp = await fetch(
      `${
        process.env.REACT_APP_BASE_API_URL
      }/getUserScoresBeatmapIds?userId=${userId}&gamemode=${gamemode}&convertsOnly=${convertsOnly}${
        year && `&year=${year}`
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
      resp = await resp.json();
      return resp as unknown as number[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};

// export const getAllUserScoresOnBeatmap = async (
//   beatmapId: number,
//   userId: number,
//   authToken: IAuthToken,
//   gamemode: string
// ) => {
//   try {
//     let resp = await fetch(
//       `${process.env.REACT_APP_BASE_API_URL}/getAllUserScoresOnBeatmap?authTokenString=${authToken.access_token}&beatmapId=${beatmapId}&userId=${userId}&gamemode=${gamemode}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken.access_token}`,
//         },
//       }
//     );
//     if (resp.ok) {
//       const respJson = await resp.json();
//       if (respJson.error) {
//         console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
//         return { scores: "SC", beatmap: "ABC", rateLimitRemaining: -1 };
//       }
//       return {
//         scores: respJson.response.scores,
//         beatmap: respJson.response.beatmap,
//         ratelimitRemaining: respJson.ratelimitRemaining,
//       };
//     } else {
//       console.log("CANT FETCH BEATMAPS FROM OSU WEBSITE");
//       return { scores: "SC", beatmap: "ABC", rateLimitRemaining: -1 };
//     }
//   } catch (err) {}
// };

export const fetchUserMe = async (authToken: IAuthToken) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/fetchUserMe?authTokenString=${authToken.access_token}`,
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

export const getUserScoresOnBeatmapsetNode = async (
  userId: number,
  beatmapsetId: number,
  gamemode: string
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getUserScoresOnBeatmapset?userId=${userId}&beatmapsetId=${beatmapsetId}&gamemode=${gamemode}`,
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
      return resp as unknown as IUserScoreView[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};

export const getUserScoresForYearNode = async (
  userId: number,
  year: number,
  gamemode: string
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getUserScoresForYear?userId=${userId}&year=${year}&gamemode=${gamemode}`,
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
      return resp as unknown as IUserScoreView[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};

export const getUsersScoresCountNode = async (userIds: number[]) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/getUsersScoresCount`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: userIds,
        }),
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as any[];
    }
  } catch (err) {
    console.log("CANT FETCH BEATMAPS FROM NODE SERVER");
  }
};
