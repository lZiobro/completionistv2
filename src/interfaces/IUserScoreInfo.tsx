export interface IUserScoreInfo {
  artist: string;
  artist_unicode: string;
  id: number; //int
  accuracy: number; //decimal
  best_id: number; //integer
  created_at: string; //ISOTimestamp
  max_combo: number; //int
  mode: string;
  mode_int: number; //integer
  mods: string[];
  passed: boolean;
  perfect: boolean;
  pp: number; //decimal
  rank: string;
  replay: boolean;
  score: number; //BigInt
  statistics_count_100: number; //integer
  statistics_count_300: number; //integer
  statistics_count_50: number; //integer
  statistics_count_geki: number; //integer
  statistics_count_katu: number; //integer
  statistics_count_miss: number; //integer
  type: string;
  table: number; //int
  beatmapset_id: number; //int
  beatmap_id: number; //int
  username: string;
  user_id: number; //int
}
