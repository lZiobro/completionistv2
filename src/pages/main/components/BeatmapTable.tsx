import { useContext, useEffect, useState } from "react";
import { IBeatmapView } from "../../../interfaces/IBeatmapView";
import { IUserScoreView } from "../../../interfaces/IUserScoreView";
import { getUserScoresOnBeatmapsetNode } from "../../../service/UserService";
import { IUserContext, UserContext } from "../../../UserContextWrapper";

const BeatmapTable = (props: {
  beatmapsetId: number;
  beatmaps: IBeatmapView[] | undefined;
  gamemode: string;
  userId?: number;
  userScores?: IUserScoreView[];
  fetchScores?: boolean;
}) => {
  const userContext = useContext<IUserContext>(UserContext);
  const [userScores, setUserScores] = useState<IUserScoreView[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      !props.beatmaps ||
      !props.beatmaps[0] ||
      (userScores && userScores[0]) ||
      !props.fetchScores
    ) {
      return;
    }
    if (props.userId || userContext.userId) {
      fetchUserScoresForBeatmapset(
        props.userId ?? userContext.userId,
        props.beatmapsetId
      );
    }
  }, [props.beatmaps]);

  useEffect(() => {
    if (!(userScores && userScores[0]) && props.userScores) {
      setUserScores(props.userScores);
    }
  }, [props.userScores]);

  const fetchUserScoresForBeatmapset = async (
    userId: number,
    beatmapsetId: number
  ) => {
    const scores = await getUserScoresOnBeatmapsetNode(
      userId!,
      beatmapsetId,
      props.gamemode
    );
    setUserScores(scores!);
  };

  //   const checkUserScoreOnBeatmapset = async (beatmapsetId: number) => {
  //     if (!props.authToken) {
  //       alert("Authorize first!");
  //       return;
  //     }
  //     if (!props.userId) {
  //       alert("Set UserId first!");
  //       return;
  //     }

  //     const result = await fetchUserScoresOnBeatmapsetNode(
  //       beatmapsetId,
  //       props.userId,
  //       props.authToken!,
  //       props.gamemode
  //     );
  //     if(result) {

  //     }
  //   };

  return (
    <table className="table-default beatmap-table-subtable">
      <thead>
        <tr>
          <td>Difficulty</td>
          <td>Rank</td>
          <td>Accuracy</td>
          <td>Miss count</td>
          <td>Mods</td>
          <td>Completion</td>
          <td>Date played</td>
        </tr>
      </thead>
      <tbody>
        {props.beatmaps?.map((y) => {
          const userScoresMap = userScores?.filter(
            (score) => score.beatmap_id === y.id
          )!;
          let userScore = null;
          if (userScoresMap && userScoresMap[0]) {
            userScore = userScoresMap?.reduce((max, score) =>
              max.score > score.score ? max : score
            );
          }
          return (
            <tr key={y.id}>
              <td>{y.version}</td>
              <td>
                {userScore?.rank === "S" && userScore.accuracy === 1
                  ? "X"
                  : userScore?.rank === "SH" && userScore.accuracy === 1
                  ? "XH"
                  : userScore?.rank}
              </td>
              <td>
                {userScore?.accuracy
                  ? `${(userScore?.accuracy * 100).toFixed(2)}%`
                  : ""}
              </td>
              <td>{userScore?.statistics_count_miss}</td>
              <td>{userScore?.mods?.map((x) => `${x.mod} `)}</td>
              <td
                className={
                  userScore
                    ? "beatmap-table-complete"
                    : "beatmap-table-unplayed"
                }
              >
                {userScore ? "Completed" : "Unplayed"}
              </td>
              <td>{userScore?.created_at}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BeatmapTable;
