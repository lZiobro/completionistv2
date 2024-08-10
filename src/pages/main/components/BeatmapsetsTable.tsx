import { useEffect, useState } from "react";
import { IBeatmapsetView } from "../../../interfaces/IBeatmapsetView";
import { IBeatmapView } from "../../../interfaces/IBeatmapView";
import { IUserScoreView } from "../../../interfaces/IUserScoreView";
import BeatmapTable from "./BeatmapTable";
import {
  getBeatmapsForBeatmapsetNode,
  getFirstBeatmapsetBeatmapIdNode,
} from "../../../service/BeatmapsService";

const BeatmapsetsTable = (props: {
  gamemode: string;
  convertsOnly: boolean;
  userScores: IUserScoreView[] | undefined;
  beatmapsets: IBeatmapsetView[] | undefined;
  userId?: number;
  fetchedFull?: boolean;
}) => {
  const [beatmaps, setBeatmaps] = useState<IBeatmapView[]>([]);

  // useEffect(() => {
  //   if (!props.beatmapsets || !props.beatmapsets[0]) {
  //     setBeatmapsetsView([]);
  //     return;
  //   }
  //   setBeatmapsetsView(props.beatmapsets!);
  // }, [props.beatmapsets]);

  const handleRowClick = async (e: any, beatmapsetId: number) => {
    var hiddenRows = Array.from(
      document.getElementsByClassName("hidden-row-" + beatmapsetId)
    );
    hiddenRows.forEach((element) => {
      if (element.classList.contains("make-row-visible")) {
        element.classList.remove("make-row-visible");
      } else {
        element.classList.add("make-row-visible");
      }
    });
    if (
      !beatmaps.some((x) => x.beatmapset_id === beatmapsetId) &&
      !props.beatmapsets.find((x) => x.id === beatmapsetId).beatmaps
    ) {
      const newBeatmaps = await getBeatmapsForBeatmapsetNode(
        beatmapsetId,
        props.convertsOnly ? "osu" : props.gamemode
      );
      setBeatmaps((beatmaps) => [...beatmaps, ...newBeatmaps!]);
    }
  };

  const goToBeatmapsetDirect = async (beatmapsetId: number) => {
    const BeatmapsetFirstBeatmapId = await getFirstBeatmapsetBeatmapIdNode(
      beatmapsetId
    );
    const directLink = `osu://b/${BeatmapsetFirstBeatmapId}`;
    window.open(directLink, "_blank");
  };

  return (
    <table className="beatmap-table table-default" style={{ minWidth: "80%" }}>
      <thead>
        <tr>
          <td>Beatmap name</td>
          <td>Completion</td>
          <td>Ranked date</td>
          <td>Download link</td>
          <td>Direct</td>
          {/* <td>Check Beatmapset</td> */}
        </tr>
      </thead>
      <tbody>
        {props.beatmapsets?.map((x) => (
          <>
            <tr key={x.id} onClick={(e) => handleRowClick(e, x.id)}>
              <td>
                {x.artist} - {x.title}
              </td>
              <td
                className={
                  x.completed === 2
                    ? "beatmap-table-complete"
                    : x.completed === 1
                    ? "beatmap-table-partial"
                    : "beatmap-table-unplayed"
                }
              >
                {x.completed === 2
                  ? "Completed"
                  : x.completed === 1
                  ? "Partial"
                  : "Unplayed"}
              </td>
              <td>{x.ranked_date}</td>
              <td>
                <button
                  className="btn"
                  onClick={() =>
                    window.open(
                      `https://osu.ppy.sh/beatmapsets/${x.id}/download`,
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
                  onClick={() => goToBeatmapsetDirect(x.id)}
                  style={{
                    color: "white",
                    width: "100%",
                    backgroundColor: `var(--bs-secondary)`,
                  }}
                >
                  Direct
                </button>
              </td>
              {/* <td>
                <button
                  className="btn"
                  onClick={() => checkUserScoreOnBeatmapset(x.beatmaps)}
                  style={{
                    color: "white",
                    width: "100%",
                    backgroundColor: `var(--bs-secondary)`,
                  }}
                >
                  Check TODO
                </button>
              </td> */}
            </tr>
            <tr
              key={`btmap${x.id}`}
              className={"hidden-row hidden-row-" + x.id}
            >
              <td colSpan={6} className="bg-secondary" style={{ padding: 0 }}>
                <BeatmapTable
                  beatmaps={
                    x.beatmaps ??
                    beatmaps.filter((beatmap) => beatmap.beatmapset_id === x.id)
                  }
                  beatmapsetId={x.id}
                  gamemode={props.gamemode}
                  userId={props.userId}
                  userScores={props.userScores?.filter(
                    (y) => y.beatmapset_id === x.id
                  )}
                  fetchScores={!props.fetchedFull}
                />
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
};

export default BeatmapsetsTable;
