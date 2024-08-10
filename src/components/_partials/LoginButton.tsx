import { useContext, useEffect } from "react";
import { IUserContext, UserContext } from "../../UserContextWrapper";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAuth } from "../../service/OsuwebService";

const LoginButton = () => {
  const userContext = useContext<IUserContext>(UserContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const authUrl = `https://osu.ppy.sh/oauth/authorize?client_id=30207&redirect_uri=${process.env.REACT_APP_RETUR_URL}&response_type=code&scope=public`;

  const fetchAuthToken = async (code: string) => {
    const auth = await fetchAuth(code);
    if (auth) {
      userContext.setContextValue({ authToken: auth });
    } else {
      alert("cant authorize!");
    }
  };
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetchAuthToken(code);
      searchParams.delete("code");
      setSearchParams(searchParams);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    userContext.setContextValue({
      authToken: undefined,
      userId: undefined,
      username: undefined,
    });
  };

  return userContext.authToken !== undefined ? (
    <button
      onClick={logout}
      className="btn btn-primary m-2"
      data-html2canvas-ignore="true"
    >
      Logout
    </button>
  ) : (
    <a
      href={authUrl}
      className="btn btn-primary m-2"
      data-html2canvas-ignore="true"
    >
      Login
    </a>
  );
};

export default LoginButton;
