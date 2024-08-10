import { IBeatmapsetDbModel } from "../../interfaces/db/IBeatmapsetDbModel";
import { mapResponseArrayToBeatmapDbModel } from "./BeatmapDbMapper";

export const mapResponseToBeatmapsetDbModel = (response: any) => {
  const result: IBeatmapsetDbModel = {
    artist: response.artist,
    artist_unicode: response.artist_unicode,
    beatmaps: mapResponseArrayToBeatmapDbModel(response.beatmaps),
    bpm: response.bpm,
    cover: response.covers.cover,
    creator: response.creator,
    favourite_count: response.favourite_count,
    id: response.id,
    is_scoreable: response.is_scoreable,
    last_updated: response.last_updated,
    offset: response.offset,
    play_count: response.play_count,
    ranked: response.ranked,
    ranked_date: response.ranked_date,
    source: response.source,
    spotlight: response.spotlight,
    status: response.status,
    submitted_date: response.submitted_date,
    tags: response.tags,
    title: response.title,
    title_unicode: response.title_unicode,
    track_id: response.track_id,
    user_id: response.user_id,
    user_scores: response.user_scores,
  };
  return result;
};

export const mapResponseArrayToBeatmapsetDbModel = (responseArray: any) => {
  const resultArray: IBeatmapsetDbModel[] = responseArray.map(
    (response: any) => {
      return mapResponseToBeatmapsetDbModel(response);
    }
  );
  return resultArray;
};
