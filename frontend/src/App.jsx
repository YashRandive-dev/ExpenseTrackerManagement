import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Blobs from "./components/common/Blobs";
const DashboardLayout = lazy(() => import("./components/layouts/DashboardLayout"));
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));

const Root = () => {
  const authed = !!localStorage.getItem("token");
  return <Navigate to={authed ? "/dashboard" : "/login"} replace />;
};

const App = () => (
  <>
    <Blobs />
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Root />} />
    </Routes>
    </Suspense>

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(22, 24, 52, 0.95)",
          color: "rgba(255, 255, 255, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(10px)",
          fontSize: "14px",
        },
      }}
    />
  </>
);

export default App;
