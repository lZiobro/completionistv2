import { useContext, useState } from "react";
import ProfilePanel from "../../components/ProfilePanel";
import GamemodeSelect from "../../components/GamemodeSelect";
import YesNoButton from "../../components/_partials/YesNoButton";
import { IUserContext, UserContext } from "../../UserContextWrapper";

const AdminPanelPage = (props: {
  selectedGamemode: string;
  setSelectedGamemode: Function;
}) => {
  return (
    <div className="admin-panel">
      <div className="d-flex flex-column flex-shrink-0 p-2 text-white bg-dark">
        <ProfilePanel />
        <div className="main-page_menu-wrapper d-flex flex-column justify-content-center">
          <GamemodeSelect
            gamemode={props.selectedGamemode}
            setGamemode={props.setSelectedGamemode}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
