import { IBeatmapDbModel } from "../../interfaces/db/IBeatmapDbModel";
export const mapResponseToBeatmapDbModel = (response: any) => {
  const result: IBeatmapDbModel = {
    bpm: response.bpm,
    id: response.id,
    is_scoreable: response.is_scoreable,
    last_updated: response.last_updated,
    ranked: response.ranked,
    status: response.status,
    user_id: response.user_id,
    user_scores: response.user_scores,
    accuracy: response.accuracy,
    ar: response.ar,
    beatmapset_id: response.beatmapset_id,
    convert: response.convert,
    count_circles: response.count_circles,
    count_sliders: response.count_sliders,
    count_spinners: response.count_spinners,
    cs: response.cs,
    difficulty_rating: response.difficulty_rating,
    drain: response.drain,
    hit_length: response.hit_length,
    max_combo: response.max_combo,
    mode: response.mode,
    mode_int: response.mode_int,
    passcount: response.passcount,
    playcount: response.playcount,
    total_length: response.total_length,
    url: response.url,
    version: response.version,
  };
  return result;
};

export const mapResponseArrayToBeatmapDbModel = (responseArray: any) => {
  const resultArray: IBeatmapDbModel[] = responseArray.map((response: any) => {
    return mapResponseToBeatmapDbModel(response);
  });
  return resultArray;
};
