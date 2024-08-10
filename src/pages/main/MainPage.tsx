import { useContext, useEffect, useRef, useState } from "react";
import { IUserScoreView } from "../../interfaces/IUserScoreView";
import { IBeatmapsetView } from "../../interfaces/IBeatmapsetView";
import {
  fetchBeatmapsetsForYear,
  fetchBeatmapsetsForYearFull,
  fetchBeatmapsetsForYearWithCompletion,
} from "../../misc/utils";
import BeatmapsetsTable from "./components/BeatmapsetsTable";
import YesNoButton from "../../components/_partials/YesNoButton";
import RangeSelect from "../../components/_partials/RangeSelect";
import { IUserContext, UserContext } from "../../UserContextWrapper";
import BeatmapsetsFilters from "./components/BeatmapsetsFilters/BeatmapsetsFilters";
import { Filter } from "../../interfaces/Types";
import {
  applyCompletionFilter,
  applyUserMissCountFilter,
  applyUserRankFilter,
} from "../../modules/Filters";
import { FiltersNames } from "../../interfaces/Enums";
import { getUserScoresForYearNode } from "../../service/UserService";
import SearchOtherPlayers from "./components/SearchOtherPlayers";
import CheckOtherPlayer from "../../components/CheckOtherPlayer";
import { exportScores } from "../../components/ExportScores";

const MainPage = (props: { selectedGamemode: string }) => {
  const userContext = useContext<IUserContext>(UserContext);
  const [beatmapsets, setBeatmapsets] = useState<IBeatmapsetView[] | undefined>(
    undefined
  );
  const [beatmapsetsView, setBeatmapsetsView] = useState<
    IBeatmapsetView[] | undefined
  >([]);
  const [userScores, setUserScores] = useState<IUserScoreView[] | undefined>(
    undefined
  );
  const beatmapsYearRef = useRef<any>();
  const beatmapsMonthRef = useRef<any>();
  const [convertsOnly, setConvertsOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fetchedFull, setFetchedFull] = useState<boolean>(false);
  useEffect(() => {
    //setUserScores(undefined);
  }, [beatmapsets]);

  const exportBeatmapsetsWithScores = async () => {
    const _beatmapsets = await fetchBeatmapsetsForYearFull(
      userId ?? userContext.userId!,
      props.selectedGamemode,
      beatmapsYearRef.current?.value,
      beatmapsMonthRef.current?.value,
      convertsOnly
    );
    const _userScores = await getUserScoresForYearNode(
      userId ?? userContext.userId!,
      beatmapsYearRef.current?.value,
      props.selectedGamemode
    );
    const _exportBeatmapsets = await applyFilters(
      filters,
      _beatmapsets,
      _userScores
    );
    exportScores(_exportBeatmapsets, userScores);
  };

  const applyFilters = async (
    filters: Filter[],
    beatmapsets: IBeatmapsetView[],
    userScores: IUserScoreView[]
  ) => {
    if (!beatmapsets) {
      return;
    }
    let _beatmapsets = [...beatmapsets];
    let _userScores = userScores;
    const missCountFilter = filters.find(
      (x) => x.name === FiltersNames.Misscount
    );
    const rankFilter = filters.find((x) => x.name === FiltersNames.Rank);
    const completionFilter = filters.find(
      (x) => x.name === FiltersNames.Completion
    );

    //if filters required beatmaps and/or user scores - fetch them upfront
    if ((rankFilter || missCountFilter) && !userScores) {
      const beatmapsetsFull = await fetchBeatmapsetsForYearFull(
        userId ?? userContext.userId!,
        props.selectedGamemode,
        beatmapsYearRef.current?.value,
        beatmapsMonthRef.current?.value,
        convertsOnly
      );
      setBeatmapsets(beatmapsetsFull);
      const userScoresForYear = await getUserScoresForYearNode(
        userId ?? userContext.userId!,
        beatmapsYearRef.current?.value,
        props.selectedGamemode
      );
      setUserScores(userScoresForYear);
      setFetchedFull(true);
      return;
    }

    const userFilterBeatmapsets = (bs, us) =>
      bs.filter((x) => us.some((y) => y.beatmapset_id === x.id));

    //would be faster to check against user scores return them here and apply all the filters at the end...
    if (rankFilter) {
      _userScores = applyUserRankFilter(rankFilter, _userScores);
      _beatmapsets = userFilterBeatmapsets(_beatmapsets, _userScores);
    }

    if (missCountFilter) {
      _userScores = applyUserMissCountFilter(missCountFilter, _userScores);
      _beatmapsets = userFilterBeatmapsets(_beatmapsets, _userScores);
    }

    if (completionFilter) {
      _beatmapsets = applyCompletionFilter(_beatmapsets, completionFilter);
    }

    return _beatmapsets;
  };

  useEffect(() => {
    applyFilters(filters, beatmapsets, userScores).then((res) => {
      if (res) {
        setBeatmapsetsView(res);
      }
    });
  }, [beatmapsets, filters]);

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark mainpage-padding"
      style={{ margin: "auto", width: "fit-content" }}
    >
      <h2
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 20,
          marginBottom: 60,
        }}
      >
        Completionist
      </h2>
      <div className="main-page_menu-wrapper">
        <div className="d-flex justify-content-center my-2">
          <RangeSelect
            start={2007}
            end={new Date().getFullYear()}
            selectRef={beatmapsYearRef}
            default={"Year"}
          />
          <RangeSelect
            start={1}
            end={12}
            selectRef={beatmapsMonthRef}
            default={"Month (optional)"}
          />
          <button
            className="btn btn-primary my-2"
            onClick={async () => {
              if (userContext.userId) {
                const beatmapsets = await fetchBeatmapsetsForYearWithCompletion(
                  userId ?? userContext.userId!,
                  props.selectedGamemode,
                  beatmapsYearRef.current?.value,
                  beatmapsMonthRef.current?.value,
                  convertsOnly
                );
                setBeatmapsets(beatmapsets!);
              } else {
                const beatmapsets = await fetchBeatmapsetsForYear(
                  props.selectedGamemode,
                  beatmapsYearRef.current?.value,
                  beatmapsMonthRef.current?.value,
                  convertsOnly
                );
                setBeatmapsets(beatmapsets!);
              }
              setFetchedFull(false);
              setUserScores(undefined);
            }}
          >
            Confirm
          </button>
        </div>

        <div className="d-flex justify-content-center my-2">
          <CheckOtherPlayer
            username={username}
            setUserId={setUserId}
            setUsername={setUsername}
          />
          <YesNoButton value={convertsOnly} setValue={setConvertsOnly}>
            Converts only
          </YesNoButton>
          <button
            className="btn btn-primary"
            style={{}}
            onClick={() => setShowFilters((x) => !x)}
          >
            Filters
          </button>
          {beatmapsetsView && beatmapsetsView[0] && (
            <button
              className="btn btn-info"
              style={{ marginLeft: "auto" }}
              onClick={() => exportBeatmapsetsWithScores()}
            >
              Export
            </button>
          )}
        </div>
      </div>

      <div className={"" + (showFilters ? "" : " collapse")}>
        <BeatmapsetsFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="d-flex justify-content-center my-2">
        {beatmapsetsView && beatmapsetsView[0] && (
          <BeatmapsetsTable
            gamemode={props.selectedGamemode}
            beatmapsets={beatmapsetsView}
            userScores={userScores}
            convertsOnly={convertsOnly}
            userId={userId}
            fetchedFull={fetchedFull}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
