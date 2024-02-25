import { useState } from "react";
import "./App.css";
import MainPage from "./pages/main/MainPage";
import AdminPanelPage from "./pages/main/AdminPanelPage";
import { IAuthToken } from "./interfaces/IAuthToken";
import UserStatistics from "./pages/main/UserStatistics";

function App() {
  const [authToken, setAuthToken] = useState<IAuthToken | undefined>(undefined);

  return (
    <div className="App">
      <AdminPanelPage authToken={authToken} setAuthToken={setAuthToken} />
      <UserStatistics />
      <MainPage authToken={authToken} />
      <p>
        Created by <a href="https://osu.ppy.sh/users/2163544">Bowashe</a> for
        completionists and alike (and for my sunshine{" "}
        <a href="https://osu.ppy.sh/users/7552274">-ExGon-</a>)
      </p>
    </div>
  );
}

export default App;
