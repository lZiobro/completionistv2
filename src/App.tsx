import { useContext, useState } from "react";
import "./App.css";
import AdminPanelPage from "./pages/main/AdminPanelPage";
import UserStatistics from "./pages/main/UserStatistics";
import MainPage from "./pages/main/MainPage";
import Spacer from "./components/_partials/Spacer";
import FetchingModule from "./pages/main/FetchingModule";
import { IUserContext, UserContext } from "./UserContextWrapper";

function App() {
  const userContext = useContext<IUserContext>(UserContext);
  const [selectedGamemode, setSelectedGamemode] = useState<string>(
    userContext.playmode ?? "osu"
  );

  return (
    <div className="container-fluid bg-dark App">
      <div className="row no-gutters">
        <div
          id="admin-statistics"
          className="col-3 no-gutters"
          style={{ height: "fit-content", position: "sticky" }}
        >
          <AdminPanelPage
            selectedGamemode={selectedGamemode}
            setSelectedGamemode={setSelectedGamemode}
          />
          <Spacer />
          <UserStatistics selectedGamemode={selectedGamemode} />
          <Spacer />
          <FetchingModule selectedGamemode={selectedGamemode} />
        </div>
        <div
          className="col-9 no-gutters"
          style={{ borderLeft: "5px solid gray" }}
        >
          <MainPage selectedGamemode={selectedGamemode} />
        </div>
      </div>
      <p
        className="bg-dark"
        style={{
          display: "block",
          color: "white",
          margin: "auto",
          marginBottom: 0,
        }}
      >
        Created by <a href="https://osu.ppy.sh/users/2163544">Bowashe</a> for
        completionists and alike (and for{" "}
        <a href="https://www.youtube.com/watch?v=2i-CwpzULJ8">my sunshine</a>{" "}
        <a href="https://osu.ppy.sh/users/7552274">-ExGon-</a>)
      </p>
    </div>
  );
}

export default App;
