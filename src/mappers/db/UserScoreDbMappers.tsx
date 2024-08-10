import { IScoreModDbModel } from "../../interfaces/db/IScoreModDbModel";
import { IUserScoreDbModel } from "../../interfaces/db/IUserScoreDbModel";
export const mapResponseToUserScoreDbModel = (response: any) => {
  const result: IUserScoreDbModel = {
    accuracy: response.accuracy,
    beatmap_id: response.beatmap.id,
    beatmapset_id: response.beatmap.beatmapset_id,
    best_id: response.best_id,
    created_at: response.created_at,
    id: response.id,
    max_combo: response.max_combo,
    mode: response.mode,
    mode_int: response.mode_int,
    //TODO
    mods: mapModsFromScoreResponse(response),
    passed: response.passed,
    perfect: response.perfect,
    pp: response.pp,
    rank: response.rank,
    replay: response.replay,
    score: response.score,
    statistics_count_100: response.statistics_count_100,
    statistics_count_300: response.statistics_count_300,
    statistics_count_50: response.statistics_count_50,
    statistics_count_geki: response.statistics_count_geki,
    statistics_count_katu: response.statistics_count_katu,
    statistics_count_miss: response.statistics_count_miss,
    type: response.type,
    user_id: response.user_id,
    username: response.username,
  };
  return result;
};

export const mapResponseArrayToUserScoreDbModel = (responseArray: any) => {
  const resultArray: IUserScoreDbModel[] = responseArray.map(
    (response: any) => {
      return mapResponseToUserScoreDbModel(response);
    }
  );
  return resultArray;
};

export const mapModsFromScoreResponse = (response: any) => {
  const score_id = response.id;
  const resultArray: IScoreModDbModel[] = response.mods?.map((mod: string) => {
    return { mod: mod, score_id: score_id };
  });
  return resultArray ?? [];
};
