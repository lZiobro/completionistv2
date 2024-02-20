import React, { useState } from "react";
import logo from "./logo.svg";
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
      <MainPage />
    </div>
  );
}

export default App;
