import React from "react";
import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

/**
 * AuthContext
 */
const AuthContext = React.createContext({
  getAuthData: (): AuthData => ({ authToken: "", authData: "" }),
  setAuthToken: (val: string) => {},
  setAuthData: (val: string) => {},
  signOut: () => {},
  updateData: (val: AuthData) => {},
});

/**
 * AuthProps
 */
type AuthProps = {
  children: JSX.Element;
};

/**
 * AuthData type
 */
export type AuthData = {
  authToken: string;
  authData: string;
};

/**
 * AuthProvider
 *
 * @param AuthProps
 * @returns React.FunctionComponent
 */
const AuthProvider = ({ children }: AuthProps) => {
  const [authToken, setAuthToken] = useState("");
  const [authData, setAuthData] = useState("");

  /**
   * Get authentication and user data.
   *
   * @returns AuthData
   */
  const getAuthData = () => {
    // {"header":{"alg":"HS256","typ":"JWT"},"payload":{"email":"akyle2001@gmail.com","firstName":"Andrew","lastName":"Hong","role":"user","id":"61549a053a2836dfe1da37f3","metadata":[],"iat":1632935449,"exp":1632939049},"signature":"QHgFbGiGE3hswtfBJGe1rXaubwOiI20sa0qIEc7ihAI"}

    if (authData) {
      const data = JSON.parse(authData);
      if (
        data.payload &&
        data.payload.exp &&
        data.payload.exp < Date.now() / 1000
      ) {
        setAuthData("");
        setAuthToken("");
      }
    }

    return { authToken, authData };
  };

  /**
   * Sign out (clear authentication token and data)
   *
   * @returns void
   */
  const signOut = () => {
    setAuthToken("");
    setAuthData("");
    localStorage.setItem("authToken", "");
    localStorage.setItem("authData", "");
  };

  /**
   * Update authentication data. Use this to update the authentication token and data, particularly within a user login, etc.
   *
   * @param AuthData data
   * @return void
   */
  const updateData = ({ authToken, authData }: AuthData) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authData", authData);
    setAuthToken(authToken);
    setAuthData(authData);
  };

  useEffect(() => {
    const authTokenFromStorage = localStorage.getItem("authToken");
    const authDataFromStorage = localStorage.getItem("authData");
    if (
      !authData &&
      authTokenFromStorage != null &&
      authDataFromStorage != null
    ) {
      setAuthToken(authTokenFromStorage);
      setAuthData(authDataFromStorage);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getAuthData,
        setAuthToken,
        setAuthData,
        signOut,
        updateData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
