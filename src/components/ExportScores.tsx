import { IBeatmapsetView } from "../interfaces/IBeatmapsetView";
import { IUserScoreView } from "../interfaces/IUserScoreView";

export const exportScores = (
  beatmapsets: IBeatmapsetView[],
  userScores: IUserScoreView[]
) => {
  const dupa = beatmapsets?.map((x) =>
    x.beatmaps.map((y) => {
      const userScore = userScores?.find((score) => score.beatmap_id === y.id)!;
      return `"${x.artist} - ${x.title} [${y.version}]",${
        userScore?.created_at ?? ""
      },${
        (userScore?.rank === "S" && userScore.accuracy === 1
          ? "X"
          : userScore?.rank === "SH" && userScore.accuracy === 1
          ? "XH"
          : userScore?.rank) ?? ""
      },${userScore?.statistics_count_miss ?? ""},${
        userScore?.accuracy ? `${(userScore?.accuracy * 100).toFixed(2)}%` : ""
      },${userScore?.mods?.join(" ") ?? ""},${
        x.completed === 2
          ? "Completed"
          : x.completed === 1
          ? "Partial"
          : "Unplayed"
      },${
        x.ranked_date
      },${`https://osu.ppy.sh/beatmapsets/${x.id}#${y.mode}/${y.id}`},
          `;
    })
  );

  const blob = new Blob(dupa!.flat(2), { type: "octet/stream" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", "export.csv");
  downloadLink.setAttribute("href", url);
  downloadLink.click();
};
