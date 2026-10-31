import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import Spinner from "../../components/common/Spinner";
import { UserContext } from "../../context/UserContext";
import { useCountdown } from "../../hooks/useCountdown";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage } from "../../utils/helper";

const VerifyEmail = () => {
  const email = useLocation().state?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [left, restart] = useCountdown(60);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;
  if (!email) return <Navigate to="/signup" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code");

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, { email, otp });
      localStorage.setItem("token", data.token);
      updateUser(data.user);
      toast.success("Email verified. Welcome!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email, purpose: "verify" });
      toast.success("A new code has been sent");
      restart(60);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not resend the code"));
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-2xl font-semibold text-ink">Verify your email</h3>
      <p className="mb-7 mt-1 text-sm text-muted">
        We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. It expires in 10 minutes.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          error={error}
          className="[&_input]:text-center [&_input]:text-xl [&_input]:tracking-[0.5em]"
        />

        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-gradient w-full">
          {loading ? <Spinner /> : "VERIFY"}
        </motion.button>

        <p className="text-center text-sm text-muted">
          Didn&apos;t get it?{" "}
          {left > 0 ? (
            <span>Resend in {left}s</span>
          ) : (
            <button type="button" onClick={resend} className="font-medium text-primary hover:underline">
              Resend code
            </button>
          )}
        </p>
        <p className="text-center text-sm text-muted">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
