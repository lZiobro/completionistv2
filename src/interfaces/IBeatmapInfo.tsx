import { ISOTimestamp } from "osu-web.js";
import { IUserScoreInfo } from "./IUserScoreInfo";

export interface IBeatmapInfo {
  id: number; //int
  //from which set is the map - use for grouping maps(diffs) int sets
  beatmapset_id: number; //int
  difficulty_rating: number; //decimal
  mode: string;
  total_length: number; //int
  user_id: number; //int
  version: string;
  accuracy: number; //decimal
  ar: number; //decimal
  cs: number; //decimal
  drain: number; //decimal
  bpm: number; //decimal
  max_combo: number; //integer
  convert: boolean;
  count_circles: number; //integer
  count_sliders: number; //integer
  count_spinners: number; //integer
  hit_length: number; //integer
  is_scoreable: boolean;
  last_updated: ISOTimestamp;
  mode_int: number; //integer
  passcount: number; //integer
  playcount: number; //integer
  url: string;
  ranked: boolean;
  status: string;
  completed: boolean | undefined;
  userScore: IUserScoreInfo | undefined;
  //then a list of beatmaps in a set
}
