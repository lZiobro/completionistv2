import { IBeatmapView } from "./IBeatmapView";

export interface IBeatmapsetView {
  id: number; //int
  artist: string;
  status: string;
  title: string;
  ranked_date: string;
  beatmaps: IBeatmapView[];
  completed: number | undefined; //0 - uncompleted, 1 - partial, 2 - completed
  //then a list of beatmaps in a set
}
