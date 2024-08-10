import { useState } from "react";
import ByRankAchieved from "./pages/others/ByRankAchieved";

const Statistics = () => {
  const [byAchievedRankVisible, setByAchievedRankVisible] =
    useState<boolean>(false);

  return (
    <div className="container-fluid bg-dark App">
      <h1 style={{ color: "white" }}>Check additional statistics here!</h1>
      <div>
        <button
          className="btn btn-primary my-3"
          onClick={() => setByAchievedRankVisible((x) => !x)}
        >
          By achieved rank:
        </button>
        <div className={byAchievedRankVisible ? "" : "collapse"}>
          <ByRankAchieved />
        </div>
        <p style={{ color: "white" }}>Check other players (soonTM)</p>
        <p style={{ color: "white" }}>Collections(soonTM)</p>
        <p style={{ color: "white" }}>Rankings(soonTM)</p>
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
};

export default Statistics;
