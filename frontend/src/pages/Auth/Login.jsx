import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import Spinner from "../../components/common/Spinner";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage, validateEmail } from "../../utils/helper";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined, form: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!validateEmail(form.email.trim())) next.email = "Please enter a valid email address";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      updateUser(data.user);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        toast("Please verify your email first");
        navigate("/verify-email", { state: { email: err.response.data.email } });
        return;
      }
      setErrors({ form: getErrorMessage(err, "Login failed. Please try again.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-2xl font-semibold text-ink">Welcome back</h3>
      <p className="mb-7 mt-1 text-sm text-muted">Please enter your details to log in.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          autoComplete="current-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {errors.form && (
          <p className="rounded-xl bg-expense-soft px-3 py-2 text-xs text-expense">{errors.form}</p>
        )}

        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-gradient w-full">
          {loading ? <Spinner /> : "LOGIN"}
        </motion.button>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
