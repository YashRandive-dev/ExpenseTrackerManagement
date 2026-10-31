import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiMenu } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";
import Avatar from "../common/Avatar";

const Navbar = ({ collapsed, onToggleSidebar, onOpenMobile }) => {
  const { user } = useContext(UserContext);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-glass-border bg-[rgba(12,14,32,0.6)] px-4 py-3 backdrop-blur-xl md:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="rounded-xl p-2 text-ink transition hover:bg-glass-strong lg:hidden"
      >
        <FiMenu size={22} />
      </button>

      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden rounded-xl p-2 text-ink transition hover:bg-glass-strong lg:block"
      >
        <FiChevronLeft size={22} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
      </button>

      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <span>💸</span> Expense Tracker
      </h2>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-muted sm:block">Hi, {user?.fullName?.split(" ")[0]}</span>
        <Link to="/profile" aria-label="Profile">
          <Avatar src={user?.profileImageUrl} name={user?.fullName} size={36} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
