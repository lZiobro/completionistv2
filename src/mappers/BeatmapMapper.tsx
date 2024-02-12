import { IBeatmapInfo } from "../interfaces/IBeatmapInfo";

export const mapResponseToBeatmapInfo = (response: any) => {
  const result: IBeatmapInfo = {
    accuracy: response.accuracy,
    ar: response.ar,
    beatmapset_id: response.beatmapset_id,
    bpm: response.bpm,
    completed: undefined,
    convert: response.conver,
    count_circles: response.count_circles,
    count_sliders: response.count_sliders,
    count_spinners: response.count_spinners,
    cs: response.cs,
    difficulty_rating: response.difficulty_ranking,
    drain: response.drain,
    hit_length: response.hit_length,
    id: response.id,
    is_scoreable: response.is_scoreable,
    last_updated: response.last_updated,
    max_combo: response.max_combo,
    mode: response.mode,
    mode_int: response.mode_int,
    passcount: response.passcount,
    playcount: response.playcount,
    ranked: response.ranked,
    status: response.status,
    total_length: response.total_length,
    url: response.url,
    user_id: response.user_id,
    version: response.version,
  };
  return result;
};

export const mapResponseArrayToBeatmapInfo = (responseArray: any) => {
  const resultArray: IBeatmapInfo[] = responseArray.map((response: any) => {
    return mapResponseToBeatmapInfo(response);
  });
  return resultArray;
};
