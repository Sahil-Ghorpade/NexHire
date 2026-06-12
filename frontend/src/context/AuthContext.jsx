import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

/**
 * Authentication Provider
 */
export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("nexhire_token") ||
      null
  );

  const [loading, setLoading] =
    useState(true);

  /**
   * Restore user session
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await axiosInstance.get(
            "/api/user/me"
          );

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem(
          "nexhire_token"
        );

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  /**
   * Login user
   */
  const login = (
    authToken,
    authenticatedUser
  ) => {
    localStorage.setItem(
      "nexhire_token",
      authToken
    );

    setToken(authToken);
    setUser(authenticatedUser);
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem(
      "nexhire_token"
    );

    setToken(null);
    setUser(null);
  };

  /**
   * Authentication status
   */
  const isAuthenticated =
    Boolean(token) && Boolean(user);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom auth hook
 */
export const useAuth = () => {
  return useContext(AuthContext);
};