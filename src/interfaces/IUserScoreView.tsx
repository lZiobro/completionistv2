export interface IUserScoreView {
  id: number; //int
  accuracy: number; //decimal
  created_at: string; //ISOTimestamp
  mods: string[];
  beatmapset_id: number; //int
  beatmap_id: number; //int
  rank: string;
  statistics_count_miss: number; //integer
}
