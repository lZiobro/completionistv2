import { useEffect, useState } from "react";
import { IBeatmapsetView } from "../../../interfaces/IBeatmapsetView";
import { IBeatmapView } from "../../../interfaces/IBeatmapView";
import { IUserScoreView } from "../../../interfaces/IUserScoreView";
import BeatmapTable from "./BeatmapTable";
import {
  getBeatmapsForBeatmapsetNode,
  getFirstBeatmapsetBeatmapIdNode,
} from "../../../service/BeatmapsService";
import BeatmapsetsTableRow from "./BeatmapsetsTableRow";

const BeatmapsetsTable = (props: {
  gamemode: string;
  convertsOnly: boolean;
  userScores: IUserScoreView[] | undefined;
  beatmapsets: IBeatmapsetView[] | undefined;
  userId?: number;
  fetchedFull?: boolean;
}) => {
  const [beatmaps, setBeatmaps] = useState<IBeatmapView[]>([]);
  const [expandedBeatmapsets, setExpandedBeatmapsets] = useState<
    IBeatmapsetView[]
  >([]);

  useEffect(() => {
    setExpandedBeatmapsets([]);
  }, [props.beatmapsets]);

  const handleRowClick = async (e: any, beatmapset: IBeatmapsetView) => {
    if (expandedBeatmapsets?.some((x) => x.id === beatmapset.id)) {
      setExpandedBeatmapsets(
        expandedBeatmapsets.filter((x) => x.id !== beatmapset.id)
      );
      return;
    }
    if (
      !beatmaps.some((x) => x.beatmapset_id === beatmapset.id) &&
      !beatmapset.beatmaps
    ) {
      const newBeatmaps = await getBeatmapsForBeatmapsetNode(
        beatmapset.id,
        props.convertsOnly ? "osu" : props.gamemode
      );
      setBeatmaps((beatmaps) => [...beatmaps, ...newBeatmaps!]);
    }
    setExpandedBeatmapsets([...expandedBeatmapsets, beatmapset]);
  };

  const goToBeatmapsetDirect = async (beatmapsetId: number) => {
    const BeatmapsetFirstBeatmapId = await getFirstBeatmapsetBeatmapIdNode(
      beatmapsetId
    );
    const directLink = `osu://b/${BeatmapsetFirstBeatmapId}`;
    window.open(directLink, "_blank");
  };

  return (
    <table className="beatmap-table table-default" style={{ width: "100%" }}>
      <thead>
        <tr>
          <td>Beatmap name</td>
          <td>Completion</td>
          <td>Ranked date</td>
          <td>Download link</td>
          <td>Direct</td>
        </tr>
      </thead>
      <tbody>
        {props.beatmapsets?.map((x) => (
          <BeatmapsetsTableRow
            beatmapset={x}
            convertsOnly={props.convertsOnly}
            gamemode={props.gamemode}
            userScores={props.userScores?.filter(
              (y) => y.beatmapset_id === x.id
            )}
            userId={props.userId}
            fetchedFull={props.fetchedFull}
          />
        ))}
      </tbody>
    </table>
  );
};

export default BeatmapsetsTable;
