import { useContext, useState } from "react";
import { fetchBeatmapsets } from "../../../service/BeatmapsService";
import { IUserContext, UserContext } from "../../../UserContextWrapper";

const FetchBeatmaps = () => {
  const userContext = useContext<IUserContext>(UserContext);
  const [beatmapDbOverlapCount, setBeatmapDbOverlapCount] = useState<number>(0);
  const [beatmapsToFetchCount, setBeatmapsToFetchCount] = useState<number>(0);
  const [fetchedBeatmapsetsCount, setFetchedBeatmapsetsCount] =
    useState<number>(0);
  const [
    autoStopFetchingBeatmapsOnConsecutiveOverlap,
    setAutoStopFetchingBeatmapsOnConsecutiveOverlap,
  ] = useState<boolean>(true);
  const [autoStopTextVisible, setAutoStopTextVisible] =
    useState<boolean>(false);

  const fetchBeatmapsFromOsuApi = async (cursor: string | null) => {
    if (userContext.authToken === undefined) {
      alert("authorize first!");
      return;
    }
    const resp = await fetchBeatmapsets(userContext.authToken, cursor);
    return resp;
  };

  const fetchBeatmapsDateAsc = async () => {
    const beatmapsetsPerRequest = 50;
    let cursor = null;
    let totalMaps = 0;
    let fetchedMaps = 0;
    let consecutiveOverlaps = 0;

    setAutoStopTextVisible(false);
    while (true) {
      const response: any = await fetchBeatmapsFromOsuApi(cursor);
      if (!response) {
        alert("failed fetching maps!");
      }
      cursor = response.cursor_string;
      if (cursor === null) {
        setBeatmapsToFetchCount(response.total);
        totalMaps = response.total;
      }
      fetchedMaps += response.fetched;
      setFetchedBeatmapsetsCount(fetchedMaps);
      setBeatmapDbOverlapCount(response.overlapCount);
      if (response.overlapCount === beatmapsetsPerRequest) {
        consecutiveOverlaps += 1;
      } else {
        consecutiveOverlaps = 0;
      }
      if (response.ratelimitRemaining < 100) {
        await new Promise((r) => setTimeout(r, 60000));
      }
      if (
        autoStopFetchingBeatmapsOnConsecutiveOverlap &&
        consecutiveOverlaps > 9
      ) {
        setAutoStopTextVisible(true);
        return;
      }
    }
  };

  return (
    <div>
      <div className="main-page_menu-element">
        <button
          disabled={userContext.authToken === undefined}
          onClick={fetchBeatmapsDateAsc}
        >
          Fetch new beatmapsets from osu site
        </button>
      </div>
      <p>
        Fetched {fetchedBeatmapsetsCount}/
        {beatmapsToFetchCount === 0 ? "?" : beatmapsToFetchCount} beatmapsets...
        (Overlap with database entries: {beatmapDbOverlapCount})
        <br />
        <label htmlFor="autoStopBeatmapFetch">
          Automatically stop fetching beatmaps on 10 consecutive overlaps
        </label>
        <input
          name="autoStopBeatmapFetch"
          type="checkbox"
          checked={autoStopFetchingBeatmapsOnConsecutiveOverlap}
          onClick={() => {
            setAutoStopFetchingBeatmapsOnConsecutiveOverlap(
              !autoStopFetchingBeatmapsOnConsecutiveOverlap
            );
          }}
        />
        <br />
        {autoStopTextVisible && (
          <span>
            Auto stopped fetching due to 10 consecutive overlap count!
          </span>
        )}
      </p>
    </div>
  );
};

export default FetchBeatmaps;
