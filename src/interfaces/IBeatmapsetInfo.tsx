import { IBeatmapInfo } from "./IBeatmapInfo";

export interface IBeatmapsetInfo {
  // accuracy: number; //float
  // ar: number; //float
  // beatmapset_id: number; //int
  // bpm: number | undefined; //float?
  // convert: boolean;
  // count_circles: number; //int
  // count_sliders: number; //int
  // count_spinners: number; //int
  // cs: number; //float
  // deleted_at: Date | undefined;
  // drain: number; //float
  // hit_length: number; //int
  // is_scoreable: boolean;
  // last_updated: Date;
  // mode_int: number; //int
  // passcount: number; //int
  // playcount: number; //int
  // ranked: number; //int //See Rank status for list of possible values.
  // url: string;

  id: number; //int
  artist: string;
  artist_unicode: string;
  cover: string;
  creator: string;
  play_count: number; //int
  favourite_count: number; //int
  status: string;
  title: string;
  title_unicode: string;
  track_id: number; //int
  user_id: number; //int
  bpm: number; //decimal
  is_scoreable: boolean;
  ranked: boolean;
  ranked_date: string;
  submitted_date: string;
  last_updated: string;
  tags: string;
  spotlight: boolean;
  offset: number; //int
  source: string;
  beatmaps: IBeatmapInfo[];
  completed: number | undefined; //0 - uncompleted, 1 - partial, 2 - completed
  //then a list of beatmaps in a set
}
