import { IBeatmapsetDbModel } from "./IBeatmapsetDbModel";
import { IUserScoreDbModel } from "./IUserScoreDbModel";

export interface IBeatmapDbModel {
  id: number;
  beatmapset_id: number;
  beatmapset?: IBeatmapsetDbModel;
  user_scores?: IUserScoreDbModel[];
  difficulty_rating: number;
  mode: string;
  total_length: number;
  user_id: number;
  version: string;
  accuracy: number;
  ar: number;
  cs: number;
  drain: number;
  bpm: number;
  max_combo: number;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string;
  mode_int: number;
  passcount: number;
  playcount: number;
  url: string;
  ranked: number;
  status: string;
}
