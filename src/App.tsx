import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainPage from "./pages/main/MainPage";
import AdminPanelPage from "./pages/main/AdminPanelPage";

function App() {
  return (
    <div className="App">
      <AdminPanelPage />
      <MainPage />
    </div>
  );
}

export default App;
