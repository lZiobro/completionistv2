import { useEffect, useState } from "react";
import { IBeatmapsetView } from "../../../interfaces/IBeatmapsetView";
import { IBeatmapView } from "../../../interfaces/IBeatmapView";
import { IUserScoreView } from "../../../interfaces/IUserScoreView";
import BeatmapTable from "./BeatmapTable";
import {
  getBeatmapsForBeatmapsetNode,
  getFirstBeatmapsetBeatmapIdNode,
} from "../../../service/BeatmapsService";

const BeatmapsetsTableRow = (props: {
  gamemode: string;
  convertsOnly: boolean;
  userScores: IUserScoreView[] | undefined;
  beatmapset: IBeatmapsetView | undefined;
  userId?: number;
  fetchedFull?: boolean;
}) => {
  const [beatmaps, setBeatmaps] = useState<IBeatmapView[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };
  }, []);

  const handleRowClick = async (e: any, beatmapset: IBeatmapsetView) => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }
    if (
      !beatmapset.beatmaps &&
      !beatmaps.some((x) => x.beatmapset_id === beatmapset.id)
    ) {
      const newBeatmaps = await getBeatmapsForBeatmapsetNode(
        beatmapset.id,
        props.convertsOnly ? "osu" : props.gamemode
      );
      setBeatmaps(newBeatmaps);
    }
    setIsExpanded(true);
  };

  const goToBeatmapsetDirect = async (beatmapsetId: number) => {
    const BeatmapsetFirstBeatmapId = await getFirstBeatmapsetBeatmapIdNode(
      beatmapsetId
    );
    const directLink = `osu://b/${BeatmapsetFirstBeatmapId}`;
    window.open(directLink, "_blank");
  };

  return (
    <>
      <tr
        key={props.beatmapset.id}
        onClick={(e) => handleRowClick(e, props.beatmapset)}
      >
        <td>
          {props.beatmapset.artist} - {props.beatmapset.title}
        </td>
        <td
          className={
            props.beatmapset.completed === 2
              ? "beatmap-table-complete"
              : props.beatmapset.completed === 1
              ? "beatmap-table-partial"
              : "beatmap-table-unplayed"
          }
        >
          {props.beatmapset.completed === 2
            ? "Completed"
            : props.beatmapset.completed === 1
            ? "Partial"
            : "Unplayed"}
        </td>
        <td>{props.beatmapset.ranked_date}</td>
        <td>
          <button
            className="btn"
            onClick={() =>
              window.open(
                `https://osu.ppy.sh/beatmapsets/${props.beatmapset.id}/download`,
                "_blank"
              )
            }
            style={{
              color: "white",
              width: "100%",
              backgroundColor: `var(--bs-secondary)`,
            }}
          >
            Download
          </button>
        </td>
        <td>
          <button
            className="btn"
            onClick={() => goToBeatmapsetDirect(props.beatmapset.id)}
            style={{
              color: "white",
              width: "100%",
              backgroundColor: `var(--bs-secondary)`,
            }}
          >
            Direct
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="bg-secondary" style={{ padding: 0 }}>
            <BeatmapTable
              beatmaps={props.beatmapset.beatmaps ?? beatmaps}
              beatmapsetId={props.beatmapset.id}
              gamemode={props.gamemode}
              userId={props.userId}
              userScores={props.userScores?.filter(
                (y) => y.beatmapset_id === props.beatmapset.id
              )}
              fetchScores={!props.fetchedFull}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default BeatmapsetsTableRow;
