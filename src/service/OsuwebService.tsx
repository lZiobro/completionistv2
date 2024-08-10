import { IAuthToken } from "../interfaces/IAuthToken";

export const fetchAuth = async (code: string) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/fetchToken?code=${code}&returnUrl=${process.env.REACT_APP_RETUR_URL}`,
      {
        method: "GET",
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

export const fetchSearchUserNode = async (
  authTokenString: string,
  username: string
) => {
  try {
    let resp = await fetch(
      `${process.env.REACT_APP_BASE_API_URL}/fetchSearchUser?authTokenString=${authTokenString}&username=${username}`,
      {
        method: "GET",
      }
    );
    if (resp.ok) {
      resp = await resp.json();
      return resp;
    }
  } catch (err) {
    console.log(err);
  }
};
