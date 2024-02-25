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
    </div>
  );
}

export default App;
