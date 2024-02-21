import { IAuthToken } from "../interfaces/IAuthToken";

export const getAuth = async (code: string) => {
  try {
    const dupa = window.location.href;
    const dupa2 = dupa.slice(0, dupa.lastIndexOf("/"));
    let resp = await fetch(
      `http://localhost:21727/getToken?code=${code}&returnUrl=${dupa2}`,
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
