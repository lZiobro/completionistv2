import { IAuthToken } from "../interfaces/IAuthToken";

export const getAuth = async (code: string) => {
  try {
    let resp = await fetch(`http://localhost:21727/getToken?code=${code}`, {
      method: "GET",
    });
    if (resp.ok) {
      resp = await resp.json();
      return resp as unknown as IAuthToken;
    }
  } catch (err) {
    console.log("CANT FETCH AUTH TOKEN FROM OSU WEB");
  }
};
