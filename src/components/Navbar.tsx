import { Link } from "react-router-dom";
import LoginButton from "./_partials/LoginButton";
import { IUserContext, UserContext } from "../UserContextWrapper";
import { useContext } from "react";

const Navbar = () => {
  const userContext = useContext<IUserContext>(UserContext);
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: `rgba(64, 64, 64, 1)` }}
    >
      <Link to="/completionistv2" className="navbar-brand nav-link">
        Completionist
      </Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/statistics" className="nav-link">
              Statistics
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/howtouse" className="nav-link">
              How to use
            </Link>
          </li>
        </ul>
        <div className="navbar-nav" style={{ margin: "auto", marginRight: 20 }}>
          {userContext.username && (
            <span style={{ margin: "auto" }}>
              Logged in as {userContext.username}
            </span>
          )}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
