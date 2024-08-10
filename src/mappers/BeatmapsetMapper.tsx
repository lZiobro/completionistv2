import { IBeatmapsetView } from "../interfaces/IBeatmapsetView";
import { mapResponseArrayToBeatmapView } from "./BeatmapMapper";

export const mapResponseToBeatmapsetView = (response: any) => {
  const result: IBeatmapsetView = {
    artist: response.artist,
    completed: undefined,
    id: response.id,
    ranked_date: response.ranked_date,
    status: response.status,
    title: response.title,
    // beatmaps: response.beatmaps,
    beatmaps: mapResponseArrayToBeatmapView(response.beatmaps),
  };
  return result;
};

export const mapResponseArrayToBeatmapsetView = (responseArray: any) => {
  const resultArray: IBeatmapsetView[] = responseArray.map((response: any) => {
    return mapResponseToBeatmapsetView(response);
  });
  return resultArray;
};
