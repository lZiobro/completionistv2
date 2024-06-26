import { IUserScoreImport } from "../interfaces/IScoreImport";
import { IUserScoreInfo } from "../interfaces/IUserScoreInfo";
import { IUserScoreView } from "../interfaces/IUserScoreView";

export const mapResponseToUserScoreInfo = (response: any) => {
  const result: IUserScoreInfo = {
    accuracy: response.accuracy,
    artist: response.artist,
    artist_unicode: response.artist_unicode,
    beatmap_id: response.beatmap.id,
    beatmapset_id: response.beatmap.beatmapset_id,
    best_id: response.best_id,
    created_at: response.created_at,
    id: response.id,
    max_combo: response.max_combo,
    mode: response.mode,
    mode_int: response.mode_int,
    mods: response.mods,
    passed: response.passed,
    perfect: response.perfect,
    pp: response.pp,
    rank: response.rank,
    replay: response.replay,
    score: response.score,
    statistics_count_100: response.statistics.count_100,
    statistics_count_300: response.statistics.count_300,
    statistics_count_50: response.statistics.count_50,
    statistics_count_geki: response.statistics.count_geki,
    statistics_count_katu: response.statistics.count_katu,
    statistics_count_miss: response.statistics.count_miss,
    table: response.table,
    type: response.type,
    username: response.user?.username,
    user_id: response.user_id,
  };
  return result;
};

export const mapResponseArrayToUserScoreInfo = (responseArray: any) => {
  const resultArray: IUserScoreInfo[] = responseArray.map((response: any) => {
    return mapResponseToUserScoreInfo(response);
  });
  return resultArray;
};

export const mapResponseToUserScoreView = (response: any) => {
  const result: IUserScoreView = {
    rank: response.rank,
    statistics_count_miss: response.statistics.count_miss,
    accuracy: response.accuracy,
    beatmap_id: response.beatmap.id,
    beatmapset_id: response.beatmap.id,
    created_at: response.created_at,
    id: response.id,
    mods: response.mods,
    score: response.score,
  };
  return result;
};

export const mapResponseArrayToUserScoreView = (responseArray: any) => {
  const resultArray: IUserScoreView[] = responseArray.map((response: any) => {
    return mapResponseToUserScoreView(response);
  });
  return resultArray;
};

// export const mapResponseToUserScoreImport = (response: any) => {
//   const result: IUserScoreImport = {
//     accuracy: response.accuracy,
//     artist: response.artist,
//     beatmap_id: response.beatmap_id,
//     beatmapset_id: response.set_id,
//     created_at: response.date_played,
//     id:
//       parseInt(response.beatmap_id) +
//       parseInt(response.user_id) +
//       1000000000000000,
//     max_combo: response.maxcombo,
//     mode: "osu", //for now we can hardcode osu there for easier access
//     mode_int: response.mode,
//     mods: response.mods,
//     passed: response.passed,
//     perfect: response.perfect,
//     pp: response.pp,
//     rank: response.rank,
//     replay: response.replay,
//     score: response.score,
//     statistics_count_100: response.statistics.count_100,
//     statistics_count_300: response.statistics.count_300,
//     statistics_count_50: response.statistics.count_50,
//     statistics_count_geki: response.statistics.count_geki,
//     statistics_count_katu: response.statistics.count_katu,
//     statistics_count_miss: response.statistics.count_miss,
//     table: response.table,
//     type: response.type,
//     username: response.user?.username,
//     user_id: response.user_id,
//   };
//   return result;
// };

// export const mapResponseArrayToUserScoreImport = (responseArray: any) => {
//   const resultArray: IUserScoreImport[] = responseArray.map((response: any) => {
//     return mapResponseToUserScoreImport(response);
//   });
//   return resultArray;
// };
