import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./pages/main/MainPage";
import AdminPanelPage from "./pages/main/AdminPanelPage";
import { IAuthToken } from "./interfaces/IAuthToken";
import UserStatistics from "./pages/main/UserStatistics";
import { getUserId } from "./service/UserService";

function App() {
  const [authToken, setAuthToken] = useState<IAuthToken | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (authToken === undefined || authToken === null) {
      return;
    }
    const innerFunc = async () => {
      const userIdFromApi = await getUserId(authToken);
      if (userIdFromApi !== undefined && userIdFromApi !== null) {
        setUserId(userIdFromApi);
      }
    };
    innerFunc();
  }, [authToken]);

  return (
    <div className="App">
      <AdminPanelPage
        authToken={authToken}
        setAuthToken={setAuthToken}
        userId={userId}
      />
      <UserStatistics userId={userId} />
      <MainPage authToken={authToken} userId={userId} />
      <p>
        Created by <a href="https://osu.ppy.sh/users/2163544">Bowashe</a> for
        completionists and alike (and for my sunshine{" "}
        <a href="https://osu.ppy.sh/users/7552274">-ExGon-</a>)
      </p>
    </div>
  );
}

export default App;
