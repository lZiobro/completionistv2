export interface IUserScoreImport {
  artist: string;
  id: number; //int doesnt come back from osu!alt - idk what to do 10^15 + userid+beatmapid should do it (we using sqshit3, so its okay)
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
