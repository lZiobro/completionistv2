import { IBeatmapDbModel } from "./IBeatmapDbModel";
import { IUserScoreDbModel } from "./IUserScoreDbModel";

export interface IBeatmapsetDbModel {
  id: number;
  user_scores?: IUserScoreDbModel[];
  beatmaps?: IBeatmapDbModel[];
  artist: string;
  artist_unicode: string;
  cover: string;
  creator: string;
  play_count: number;
  favourite_count: number;
  status: string;
  title: string;
  title_unicode: string;
  track_id: number;
  user_id: number;
  bpm: number;
  is_scoreable: boolean;
  ranked: number;
  ranked_date: string;
  submitted_date: string;
  last_updated: string;
  tags: string;
  spotlight: boolean;
  offset: number;
  source: string;
}
