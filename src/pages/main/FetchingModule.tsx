import { useContext, useEffect, useRef, useState } from "react";
import FetchBeatmaps from "./components/FetchBeatmaps";
import FetchingProgressBar from "../../components/_partials/FetchingProgressBar";
import { IUserContext, UserContext } from "../../UserContextWrapper";
import {
  fetchBeatmapsetById,
  getAllBeatmapsetsIdsNode,
  getBeatmapsIdsNode,
} from "../../service/BeatmapsService";
import {
  fetchUserScoresOnBeatmapsNode,
  getUserScoresBeatmapIdsNode,
} from "../../service/UserService";
import {
  beatmapsetIdsArrayCatch,
  beatmapsetIdsArrayMania,
  beatmapsetIdsArrayStandard,
  beatmapsetIdsArrayTaiko,
  sussyIds,
  sussyIds2,
} from "../../misc/beatmapsetsList";
import YesNoButton from "../../components/_partials/YesNoButton";
import RangeSelect from "../../components/_partials/RangeSelect";

const FetchingModule = (props: { selectedGamemode: string }) => {
  const userContext = useContext<IUserContext>(UserContext);
  const [isFetchingScores, setIsFetchingScores] = useState<boolean>();
  const [beatmapCountToCheck, setBeatmapCountToCheck] = useState<number>(0);
  const [checkedBeatmapCount, setCheckedBeatmapCount] = useState<number>(0);
  const [beatmapsToFetchCount, setBeatmapsToFetchCount] = useState<number>(0);
  const [fetchedBeatmapsetsCount, setFetchedBeatmapsetsCount] =
    useState<number>(0);
  const beatmapsYearRef = useRef<any>();
  const [unplayedOnly, setUnplayedOnly] = useState<boolean>(true);
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const [fetchingPanelVisible, setFetchingPanelVisible] =
    useState<boolean>(false);
  const listenerRef = useRef(null);

  useEffect(() => {
    listenerRef.current = window.addEventListener("keydown", (e) => {
      if (e.key === "p") {
        setFetchingPanelVisible(true);
      }
    });
    return () => {
      window.removeEventListener("keydown", listenerRef.current);
    };
  }, []);

  const fetchUserScores = async () => {
    alert(
      `Fetching scores for userId ${userContext.userId} for gamemode ${
        props.selectedGamemode
      } ${
        beatmapsYearRef?.current?.value
          ? ` for year ${beatmapsYearRef?.current?.value}`
          : ""
      } `
    );
    setIsFetchingScores(true);
    const sliceSize = 20;
    let beatmapsIds = await getBeatmapsIdsNode(
      props.selectedGamemode,
      convertsOnly,
      beatmapsYearRef.current?.value ?? undefined
    );

    if (unplayedOnly) {
      const userId = userContext.userId;
      const userScoresBeatmapsIds = await getUserScoresBeatmapIdsNode(
        userId!,
        props.selectedGamemode,
        convertsOnly,
        beatmapsYearRef.current?.value ?? undefined
      );

      beatmapsIds = beatmapsIds?.filter(
        (x) => !userScoresBeatmapsIds!.some((y) => y === x)
      );
    }

    setBeatmapCountToCheck(beatmapsIds.length);

    const beatmapsIdsSliced = [];
    while (beatmapsIds.length) {
      beatmapsIdsSliced.push(beatmapsIds.splice(0, sliceSize));
    }
    let count = 0;
    for (let i = 0; i < beatmapsIdsSliced.length; i++) {
      const beatmapsIdsSlice = beatmapsIdsSliced[i];
      const result = await fetchUserScoresOnBeatmapsNode(
        userContext.userId,
        userContext.authToken?.access_token,
        props.selectedGamemode ?? "osu",
        beatmapsIdsSlice
      );

      if (result.rateLimitRemaining === -1) {
        //repeat this iteration
        i--;
        continue;
      }
      if (result.ratelimitRemaining < 30) {
        await new Promise((r) => setTimeout(r, 20000));
      } else if (result.ratelimitRemaining < 100) {
        await new Promise((r) => setTimeout(r, 11000));
      } else if (result.ratelimitRemaining < 200) {
        await new Promise((r) => setTimeout(r, 3000));
      }
      count += sliceSize;
      setCheckedBeatmapCount(count);
    }
  };

  //DO NOT DELETE
  const fetchMissingBeatmapsets = async () => {
    const AllBeatmapsetsIds = await getAllBeatmapsetsIdsNode();
    const beatmapsetsIdsArray = [
      ...beatmapsetIdsArrayStandard,
      ...beatmapsetIdsArrayTaiko,
      ...beatmapsetIdsArrayMania,
      ...beatmapsetIdsArrayCatch,
      ...sussyIds,
      ...sussyIds2,
    ];

    const filteredBeatmapsetsIds = beatmapsetsIdsArray.filter(
      (x) => !AllBeatmapsetsIds?.some((y) => y === x)
    );
    setBeatmapsToFetchCount(filteredBeatmapsetsIds.length);
    for await (const beatmapsetId of filteredBeatmapsetsIds) {
      const beatmapsetWithRateLimit: any = await fetchBeatmapsetById(
        userContext.authToken!,
        beatmapsetId
      );
      setFetchedBeatmapsetsCount((x) => x + 1);
      if (beatmapsetWithRateLimit?.ratelimitRemaining < 100) {
        await new Promise((r) => setTimeout(r, 60000));
      }
    }
  };

  return (
    <div data-html2canvas-ignore="true">
      {fetchingPanelVisible && (
        <>
          <button onClick={fetchMissingBeatmapsets}>Fetch DMCA beatmaps</button>
          <p>
            Fetched {fetchedBeatmapsetsCount}/
            {beatmapsToFetchCount === 0 ? "?" : beatmapsToFetchCount}{" "}
            beatmapsets...
          </p>
        </>
      )}
      <h4 className="mx-3" style={{ color: "white" }}>
        Fetch scores:{" "}
        <span
          data-toggle="tooltip"
          data-placement="right"
          title="osu!api doesnt have an endpoint for such a large amount of scores, so in order to use the app you need to manually fetch the scores from osu, which are then saved in completionist!db for usage on site"
        >
          (?)
        </span>
      </h4>
      <div
        className="d-flex justify-content-center my-2"
        data-html2canvas-ignore="true"
      >
        <YesNoButton value={unplayedOnly} setValue={setUnplayedOnly}>
          Unplayed only
        </YesNoButton>
        <YesNoButton value={convertsOnly} setValue={setConvertsOnly}>
          Converts only
        </YesNoButton>
      </div>
      <div
        className="d-flex justify-content-center"
        data-html2canvas-ignore="true"
      >
        <button
          className="btn btn-primary my-2"
          disabled={userContext.authToken === undefined}
          onClick={fetchUserScores}
        >
          Fetch user scores
        </button>
        <RangeSelect
          start={2007}
          end={new Date().getFullYear()}
          selectRef={beatmapsYearRef}
          default={"All"}
        />
      </div>
      {fetchingPanelVisible && <FetchBeatmaps />}
      {isFetchingScores && (
        <FetchingProgressBar
          current={checkedBeatmapCount}
          total={beatmapCountToCheck}
        />
      )}
    </div>
  );
};

export default FetchingModule;
