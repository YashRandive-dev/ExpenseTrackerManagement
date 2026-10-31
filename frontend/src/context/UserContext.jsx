import { setCurrency } from "../utils/helper";
import { createContext, useCallback, useMemo, useState } from "react";

export const UserContext = createContext({
  user: null,
  updateUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = useCallback((userData) => {
    setCurrency(userData?.currency);
    setUser(userData);
  }, []);
  const clearUser = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, updateUser, clearUser }), [user, updateUser, clearUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
