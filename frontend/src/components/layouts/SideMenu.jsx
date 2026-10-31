import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiCreditCard, FiHome, FiLogOut, FiTrendingUp, FiUser } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import Avatar from "../common/Avatar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const MENU = [
  { label: "Dashboard", path: "/dashboard", icon: FiHome },
  { label: "Income", path: "/income", icon: FiTrendingUp },
  { label: "Expense", path: "/expense", icon: FiCreditCard },
  { label: "Profile", path: "/profile", icon: FiUser },
];

const SideMenu = ({ collapsed = false, onNavigate }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT); // end this device's session server-side
    } catch {
      // token may already be invalid; still log out locally
    }
    localStorage.removeItem("token");
    clearUser();
    onNavigate?.();
    navigate("/login", { replace: true });
  };

  const itemBase =
    "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200";

  return (
    <div className="flex h-full flex-col p-4">
      <div className={`mb-8 mt-2 flex flex-col items-center gap-2 ${collapsed ? "" : "text-center"}`}>
        <Avatar src={user?.profileImageUrl} name={user?.fullName} size={collapsed ? 44 : 76} />
        {!collapsed && (
          <div className="min-w-0 max-w-full">
            <p className="truncate text-sm font-semibold text-ink">{user?.fullName}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {MENU.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${itemBase} ${collapsed ? "justify-center" : ""} ${
                isActive
                  ? "bg-gradient-to-r from-primary to-balance text-white shadow-glow"
                  : "text-muted hover:bg-glass-strong hover:text-ink"
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        title="Logout"
        className={`${itemBase} ${collapsed ? "justify-center" : ""} text-muted hover:bg-expense-soft hover:text-expense`}
      >
        <FiLogOut size={20} className="shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default SideMenu;
