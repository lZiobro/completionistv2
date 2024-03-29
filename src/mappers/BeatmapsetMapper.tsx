import { IBeatmapsetInfo } from "../interfaces/IBeatmapsetInfo";
import { IBeatmapsetView } from "../interfaces/IBeatmapsetView";
import {
  mapResponseArrayToBeatmapInfo,
  mapResponseArrayToBeatmapView,
} from "./BeatmapMapper";

export const mapResponseToBeatmapsetInfo = (response: any) => {
  const result: IBeatmapsetInfo = {
    artist: response.artist,
    artist_unicode: response.artist_unicode,
    bpm: response.bpm,
    completed: undefined,
    cover: response.covers.cover,
    creator: response.creator,
    favourite_count: response.favourite_count,
    id: response.id,
    is_scoreable: response.is_scorable,
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
    // beatmaps: response.beatmaps,
    beatmaps: mapResponseArrayToBeatmapInfo(response.beatmaps),
  };
  return result;
};

export const mapResponseArrayToBeatmapsetInfo = (responseArray: any) => {
  const resultArray: IBeatmapsetInfo[] = responseArray.map((response: any) => {
    return mapResponseToBeatmapsetInfo(response);
  });
  return resultArray;
};

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
