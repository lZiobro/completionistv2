import { useContext } from "react";
import { IUserContext, UserContext } from "../UserContextWrapper";
import LoginButton from "./_partials/LoginButton";

const ProfilePanel = () => {
  const userContext = useContext<IUserContext>(UserContext);

  return (
    <div
      className="container border border-3 rounded-3 border-primary bg-secondary p-2 d-flex flex-column justify-content-center my-2"
      style={{ width: 200 }}
    >
      <img
        className="img-thumbnail"
        src={
          userContext.userId
            ? `https://a.ppy.sh/${userContext.userId}`
            : "https://osu.ppy.sh/images/layout/avatar-guest@2x.png"
        }
        alt="profile pic"
      />
      {userContext.username && (
        <h4>
          <center>{userContext.username}</center>
        </h4>
      )}
      <LoginButton />
    </div>
  );
};

export default ProfilePanel;
