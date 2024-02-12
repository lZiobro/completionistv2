import { IAuthToken } from "../interfaces/IAuthToken";

export const getAuthTest = async (code: string) => {
  try {
    let resp = await fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent("https://osu.ppy.sh/oauth/token"),
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: "30207",
          client_secret: "MEZAoG94qa89hiwwtUicU66qx7yxNfbOAhpErLOK",
          code: code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:3000",
          scope: "public",
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as IAuthToken;
    }
  } catch (err) {
    console.log("CANT FETCH AUTH TOKEN FROM OSU WEB");
  }
};
