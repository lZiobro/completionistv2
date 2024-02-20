export interface IBeatmapView {
  id: number; //int
  //from which set is the map - use for grouping maps(diffs) int sets
  beatmapset_id: number; //int
  version: string;
  accuracy: number; //decimal
  convert: boolean;
  url: string;
  ranked: boolean;
  mode: string;
  completed: boolean | undefined;
  //then a list of beatmaps in a set
}
