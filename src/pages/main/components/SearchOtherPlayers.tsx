import { useContext, useEffect, useRef, useState } from "react";
import Modal from "../../modals/Modal";
import { fetchSearchUserNode } from "../../../service/OsuwebService";
import { IUserContext, UserContext } from "../../../UserContextWrapper";
import { getUsersScoresCountNode } from "../../../service/UserService";

const SearchOtherPlayers = (props: {
  closeModal: Function;
  setUserId: Function;
  setUsername?: Function;
}) => {
  const userContext = useContext<IUserContext>(UserContext);
  const [username, setUsername] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const listenerRef = useRef(null);

  const searchUsers = async (username) => {
    let result = await fetchSearchUserNode(
      userContext.authToken.access_token,
      username
    );
    if (result && result[0]) {
      const usersScoreCount = await getUsersScoresCountNode(
        (result as any).map((x) => x.id)
      );
      result = (result as any).map((x) => {
        const scoreCount = usersScoreCount?.find(
          (y) => y.user_id === x.id
        )?.count;
        return { ...x, scoreCount: scoreCount ?? 0 };
      });
      setSearchResult(result);
    }
  };

  const selectUser = (userId, username) => {
    props.setUserId(userId);
    if (props.setUsername) {
      props.setUsername(username);
    }
    props.closeModal();
  };

  useEffect(() => {
    listenerRef.current = window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        props.closeModal();
      }
    });

    return () => {
      window.removeEventListener("keydown", listenerRef.current);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchUsers(username);
    }
  };

  return (
    <Modal>
      <div style={{ width: "min-content", marginLeft: "auto" }}>
        <button
          className="btn btn-secondary"
          onClick={() => props.closeModal()}
        >
          Close
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <input
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: "auto" }}
        />
        <button
          className="btn btn-primary mx-2"
          onClick={() => searchUsers(username)}
        >
          Search
        </button>
      </div>
      <div className="flex">
        {searchResult?.map((x) => (
          <div
            className="card"
            style={{
              width: 500,
              margin: "auto",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={x.avatar_url}
                  className="img-fluid rounded-start"
                  alt="..."
                />
              </div>
              <div className="col-md-8">
                <div className="card-body" style={{ height: "100%" }}>
                  <h5 className="card-title">{x.username}</h5>
                  <p className="card-text">
                    Scores in completionist database: {x.scoreCount}
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      marginTop: "auto",
                    }}
                    onClick={() => selectUser(x.id, x.username)}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default SearchOtherPlayers;
