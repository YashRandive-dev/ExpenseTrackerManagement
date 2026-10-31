import { useState } from "react";
import { Navigate, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useUserAuth } from "../../hooks/useUserAuth";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { FullScreenLoader } from "../common/Spinner";

/** Protected layout route: sidebar + navbar + animated page outlet. */
const DashboardLayout = () => {
  const user = useUserAuth();
  const location = useLocation();
  const outlet = useOutlet();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (!user) return <FullScreenLoader />;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 88 : 272 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="glass-panel sticky top-0 hidden h-screen shrink-0 overflow-hidden lg:block"
      >
        <SideMenu collapsed={collapsed} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[rgba(5,6,18,0.6)] backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="glass-panel fixed inset-y-0 left-0 z-50 w-72 !bg-[rgba(18,20,44,0.96)] lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <SideMenu onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
