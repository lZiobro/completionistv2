import { IBeatmapView } from "../interfaces/IBeatmapView";

export const mapResponseToBeatmapView = (response: any) => {
  const result: IBeatmapView = {
    accuracy: response.accuracy,
    beatmapset_id: response.beatmapset_id,
    completed: undefined,
    convert: response.conver,
    id: response.id,
    ranked: response.ranked,
    url: response.url,
    mode: response.mode,
    version: response.version,
  };
  return result;
};

export const mapResponseArrayToBeatmapView = (responseArray: any) => {
  const resultArray: IBeatmapView[] = responseArray.map((response: any) => {
    return mapResponseToBeatmapView(response);
  });
  return resultArray;
};
