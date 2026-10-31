import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import Spinner from "../../components/common/Spinner";
import { useCountdown } from "../../hooks/useCountdown";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage, validateEmail } from "../../utils/helper";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email -> reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [left, restart] = useCountdown(0);
  const navigate = useNavigate();

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!validateEmail(email.trim())) return setErrors({ email: "Please enter a valid email address" });
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email: email.trim() });
      toast.success("If that account exists, a code is on its way");
      setStep("reset");
      setErrors({});
      restart(60);
    } catch (err) {
      setErrors({ form: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\d{6}$/.test(otp)) next.otp = "Enter the 6-digit code";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email: email.trim(),
        otp,
        newPassword: password,
      });
      toast.success("Password updated. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      setErrors({ form: getErrorMessage(err, "Could not reset password") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-2xl font-semibold text-ink">Forgot password</h3>
      <p className="mb-7 mt-1 text-sm text-muted">
        {step === "email"
          ? "Enter your email and we'll send you a one-time code."
          : `Enter the code sent to ${email.trim()} and choose a new password.`}
      </p>

      {step === "email" ? (
        <form onSubmit={sendCode} noValidate className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            error={errors.email}
          />
          {errors.form && <p className="rounded-xl bg-expense-soft px-3 py-2 text-xs text-expense">{errors.form}</p>}
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-gradient w-full">
            {loading ? <Spinner /> : "SEND CODE"}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={resetPassword} noValidate className="space-y-4">
          <Input
            label="Code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setErrors((er) => ({ ...er, otp: undefined, form: undefined }));
            }}
            error={errors.otp}
            className="[&_input]:text-center [&_input]:text-xl [&_input]:tracking-[0.5em]"
          />
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((er) => ({ ...er, password: undefined, form: undefined }));
            }}
            error={errors.password}
          />
          {errors.form && <p className="rounded-xl bg-expense-soft px-3 py-2 text-xs text-expense">{errors.form}</p>}
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-gradient w-full">
            {loading ? <Spinner /> : "RESET PASSWORD"}
          </motion.button>
          <p className="text-center text-sm text-muted">
            {left > 0 ? (
              <span>Resend code in {left}s</span>
            ) : (
              <button type="button" onClick={sendCode} className="font-medium text-primary hover:underline">
                Resend code
              </button>
            )}
          </p>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-muted">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
