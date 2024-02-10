export interface IBeatmapInfo {
  accuracy: number; //float
  ar: number; //float
  beatmapset_id: number; //int
  bpm: number | undefined; //float?
  convert: boolean;
  count_circles: number; //int
  count_sliders: number; //int
  count_spinners: number; //int
  cs: number; //float
  deleted_at: Date | undefined;
  drain: number; //float
  hit_length: number; //int
  is_scoreable: boolean;
  last_updated: Date;
  mode_int: number; //int
  passcount: number; //int
  playcount: number; //int
  ranked: number; //int //See Rank status for list of possible values.
  url: string;
}
