import { createContext, useEffect, useState } from "react";
import { IAuthToken } from "./interfaces/IAuthToken";
import { fetchUserMe } from "./service/UserService";
import Navbar from "./components/Navbar";

export interface IUserContext {
  authToken?: IAuthToken | undefined;
  userId?: number | undefined;
  username?: string | undefined;
  playmode?: string | undefined;
  setContextValue?: Function | undefined;
}

export const UserContext = createContext<IUserContext>(null);

const UserContextWrapper = ({ children }) => {
  const setContextValue = (newValue: IUserContext) => {
    _setContextValue({
      ...contextValue,
      ...newValue,
    });
  };
  const [contextValue, _setContextValue] = useState<IUserContext>({
    authToken: undefined,
    userId: undefined,
    username: undefined,
    playmode: undefined,
    setContextValue: setContextValue,
  });

  useEffect(() => {
    const _authToken =
      contextValue.authToken ?? JSON.parse(localStorage.getItem("authToken")!);
    if (
      !_authToken ||
      _authToken === undefined ||
      _authToken === "undefined" ||
      !_authToken?.access_token ||
      _authToken?.access_token === undefined ||
      _authToken?.access_token === "undefined"
    ) {
      return;
    }
    fetchUserMe(_authToken).then((userMe) => {
      if (userMe) {
        localStorage.setItem("authToken", JSON.stringify(_authToken));
        _setContextValue({
          authToken: _authToken,
          userId: userMe.userId,
          username: userMe.username,
          playmode: userMe.playmode,
          setContextValue: setContextValue,
        });
      }
    });
  }, [contextValue.authToken]);

  return (
    <UserContext.Provider value={contextValue}>
      <div>
        <Navbar />
        <div>{children}</div>
      </div>
    </UserContext.Provider>
  );
};

export default UserContextWrapper;
