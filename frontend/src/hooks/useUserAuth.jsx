import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

/** Loads the current user into context; redirects to /login when not authenticated. */
export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
        if (active) updateUser(res.data);
      } catch {
        if (active) {
          localStorage.removeItem("token");
          clearUser();
          navigate("/login", { replace: true });
        }
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
};
