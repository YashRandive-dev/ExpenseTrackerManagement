import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Spinner from "../../components/common/Spinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage, validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem("token")) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined, form: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!validateEmail(form.email.trim())) next.email = "Please enter a valid email address";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      let profileImageUrl = null;
      if (photo) {
        try {
          const fd = new FormData();
          fd.append("image", photo);
          const up = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, fd);
          profileImageUrl = up.data.imageUrl;
        } catch (upErr) {
          // a bad photo shouldn't block account creation
          toast.error(getErrorMessage(upErr, "Photo upload failed; continuing without it."));
        }
      }

      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        profileImageUrl,
      });
      toast.success("Account created! Check your email for the verification code.");
      navigate("/verify-email", { replace: true, state: { email: data.email } });
    } catch (err) {
      setErrors({ form: getErrorMessage(err, "Sign up failed. Please try again.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="text-2xl font-semibold text-ink">Create an account</h3>
      <p className="mb-5 mt-1 text-sm text-muted">Join us today by entering your details below.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <ProfilePhotoSelector image={photo} setImage={setPhoto} />

        <Input
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          value={form.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />

        {errors.form && (
          <p className="rounded-xl bg-expense-soft px-3 py-2 text-xs text-expense">{errors.form}</p>
        )}

        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-gradient w-full">
          {loading ? <Spinner /> : "SIGN UP"}
        </motion.button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
