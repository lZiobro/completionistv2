import { Auth, Client, buildUrl } from "osu-web.js";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

const MainPage = () => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [auth, setAuth] = useState<Auth | undefined>(undefined);
  const [authUrl, setAuthUrl] = useState<string>("");

  useEffect(() => {
    const url = buildUrl.authRequest(30207, "http://localhost:3000/");
    setAuthUrl(url);
    if (auth !== undefined) return;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code === null || code === undefined) {
      return;
    }
    // Client for the current API (API v2)
    // const au = new Auth(
    //   30207,
    //   "MEZAoG94qa89hiwwtUicU66qx7yxNfbOAhpErLOK",
    //   "http://localhost:3000"
    // );

    // const authCodeGrant = au.authorizationCodeGrant();
    const getAuthTest = async () => {
      // console.log(authCodeGrant);
      try {
        const resp = fetch(`https://osu.ppy.sh/oauth/token`, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            client_id: 30207,
            client_secret: "MEZAoG94qa89hiwwtUicU66qx7yxNfbOAhpErLOK",
            code: code,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/",
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        if (err instanceof TypeError) {
          throw new Error("network_error");
        }
      }
      //console.log(token);
    };

    getAuthTest();

    // const cl = new Client("MsOXFea5HlclfmCojiboTCPNY2ZWnHs1r5GkBHvV");
    // setClient(cl);
    // setAuth(au);
    // console.log(cl);
    // console.log(au);
    // au.authorizationCodeGrant().requestToken();

    // const url = buildUrl.authRequest(30201, "localhost:3000");
    // redirect(url); // Redirect the user to the URL. Different libraries and frameworks will have different ways to do this
    // console.log(url);

    // redirect("url"); // Redirect the user to the URL. Different libraries and frameworks will have different ways to do this
  }, []);

  // useEffect(() => {
  //   if (client === undefined) {
  //     return;
  //   }
  //   const lookupTest = async () => {
  //     console.log(client.beatmaps);
  //     await client.beatmaps.lookupBeatmap({
  //       query: {
  //         id: 1031991,
  //       },
  //     });
  //   };

  //   lookupTest().catch(console.error);
  // }, [client]);

  return (
    <div>
      <p>MAINPAGE</p>
      <a href={authUrl}>AUTHORIZE</a>
    </div>
  );
};

export default MainPage;
