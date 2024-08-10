import { IBeatmapsetView } from "../interfaces/IBeatmapsetView";
import { IUserScoreView } from "../interfaces/IUserScoreView";
import {
  getBeatmapsetsForYearFullNode,
  getBeatmapsetsForYearNode,
  getBeatmapsetsForYearWithCompletionNode,
} from "../service/BeatmapsService";

export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export const getBeatmapsIdsFromBeatmapsetsView = (
  beatmapsets: IBeatmapsetView[]
) => {
  const beatmaps = beatmapsets
    ?.map((beatmapset) => {
      return beatmapset.beatmaps;
    })
    .flat(1);
  return beatmaps.map((x) => x.id);
};

export const fetchBeatmapsetsForYear = async (
  gamemode: string,
  year: number,
  month?: number,
  convertsOnly?: boolean
) => {
  let beatmapsets: any[] = [];
  const beatmapsYear = !Number.isInteger(Number(year)) ? 2007 : year;
  const beatmapsMonth = !Number.isInteger(Number(month)) ? null : month;
  beatmapsets = (await getBeatmapsetsForYearNode(
    beatmapsYear,
    gamemode,
    convertsOnly,
    beatmapsMonth
  ))!;

  if (!beatmapsets) {
    return undefined;
  }

  return beatmapsets;
};

export const fetchBeatmapsetsForYearWithCompletion = async (
  userId: number,
  gamemode: string,
  year: number,
  month?: number,
  convertsOnly?: boolean
) => {
  let beatmapsets: any[] = [];
  const beatmapsYear = !Number.isInteger(Number(year)) ? 2007 : year;
  const beatmapsMonth = !Number.isInteger(Number(month)) ? null : month;
  beatmapsets = (await getBeatmapsetsForYearWithCompletionNode(
    beatmapsYear,
    beatmapsMonth,
    gamemode,
    userId,
    convertsOnly
  ))!;

  if (!beatmapsets) {
    return undefined;
  }

  return beatmapsets;
};

export const fetchBeatmapsetsForYearFull = async (
  userId: number,
  gamemode: string,
  year: number,
  month?: number,
  convertsOnly?: boolean
) => {
  let beatmapsets: any[] = [];
  const beatmapsYear = !Number.isInteger(Number(year)) ? 2007 : year;
  const beatmapsMonth = !Number.isInteger(Number(month)) ? null : month;
  beatmapsets = (await getBeatmapsetsForYearFullNode(
    beatmapsYear,
    beatmapsMonth,
    gamemode,
    userId,
    convertsOnly
  ))!;

  if (!beatmapsets) {
    return undefined;
  }

  return beatmapsets;
};

// export const fetchUserScores = async (
//   userId: number | undefined,
//   gamemode: string,
//   beatmapsIds: number[]
// ) => {
//   if (!userId) {
//     alert("Set UserId first!");
//   }

//   const userScores: IUserScoreDbModel[] = (await getUserScoresOnBeatmapsNode(
//     userId!,
//     gamemode,
//     beatmapsIds
//   )) as IUserScoreDbModel[];

//   if (userScores) {
//     const userScoresMapped = userScores.map((x) => ({
//       ...x,
//       mods: x.mods?.map((y) => y.mod),
//     })) as IUserScoreView[];
//     return userScoresMapped;
//   }
//   return [];
// };

//update maps with scores from user
const setUserScoresOnBeatmaps = (
  userScores: IUserScoreView[],
  beatmapsets: IBeatmapsetView[]
) => {
  if (userScores === undefined) return;
  const beatmapsetsUpdated = beatmapsets.map((beatmapset) =>
    checkForUserScoreOnMapset(userScores, beatmapset)
  );
  return beatmapsetsUpdated;
};

const checkForUserScoreOnMapset = (
  userScores: IUserScoreView[],
  beatmapset: IBeatmapsetView
) => {
  const diffCount = beatmapset.beatmaps.length;
  let completedDiffs = 0;
  beatmapset.beatmaps.forEach((beatmap) => {
    if (
      userScores?.some((score) => {
        return score.beatmap_id === beatmap.id;
      })
    ) {
      completedDiffs += 1;
      beatmap.completed = true;
    }
  });
  if (completedDiffs === 0) {
    beatmapset.completed = 0;
  } else if (completedDiffs < diffCount) {
    beatmapset.completed = 1;
  } else {
    beatmapset.completed = 2;
  }
  return beatmapset;
};
