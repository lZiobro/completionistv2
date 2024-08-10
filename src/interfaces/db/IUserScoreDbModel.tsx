import { IBeatmapDbModel } from "./IBeatmapDbModel";
import { IBeatmapsetDbModel } from "./IBeatmapsetDbModel";
import { IScoreModDbModel } from "./IScoreModDbModel";

export interface IUserScoreDbModel {
  id: number;
  beatmapset_id: number;
  beatmapset?: IBeatmapsetDbModel;
  beatmap_id: number;
  beatmap?: IBeatmapDbModel;
  mods: IScoreModDbModel[];
  accuracy: number;
  best_id: number;
  created_at: string;
  max_combo: number;
  mode: string;
  mode_int: number;
  passed: boolean;
  perfect: boolean;
  pp: number;
  rank: string;
  replay: boolean;
  score: number;
  statistics_count_100: number;
  statistics_count_300: number;
  statistics_count_50: number;
  statistics_count_geki: number;
  statistics_count_katu: number;
  statistics_count_miss: number;
  type: string;
  user_id: number;
  username: string;
}
