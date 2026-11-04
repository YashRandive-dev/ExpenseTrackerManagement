import { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiLogOut, FiMonitor, FiSmartphone } from "react-icons/fi";
import toast from "react-hot-toast";
import Avatar from "../../components/common/Avatar";
import Input from "../../components/inputs/Input";
import CurrencySelect from "../../components/inputs/CurrencySelect";
import Spinner from "../../components/common/Spinner";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getErrorMessage } from "../../utils/helper";

const fmt = (d) => new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const ProfileCard = () => {
  const { user, updateUser } = useContext(UserContext);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const save = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full name is required");
    setSaving(true);
    try {
      const body = { fullName: fullName.trim(), currency };
      if (photo) {
        const fd = new FormData();
        fd.append("image", photo);
        const up = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, fd);
        body.profileImageUrl = up.data.imageUrl;
      }
      const { data } = await axiosInstance.put(API_PATHS.AUTH.PROFILE, body);
      updateUser(data);
      setPhoto(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="glass-card space-y-4 p-6">
      <h3 className="text-lg font-semibold text-ink">Profile</h3>
      <div className="flex flex-col items-center gap-2">
        <Avatar src={preview || user?.profileImageUrl} name={user?.fullName} size={80} />
        <label className="btn-ghost cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setPhoto(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <CurrencySelect
        label="Currency"
        value={currency}
        onChange={setCurrency}
        hint="Only changes how amounts are displayed; existing amounts are not converted."
      />
      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted">Email</span>
        <p className="field opacity-70">
          {user?.email}
          {user?.emailVerified && <span className="ml-2 text-xs text-income">verified</span>}
        </p>
      </div>
      <button type="submit" disabled={saving} className="btn-gradient w-full">
        {saving ? <Spinner /> : "SAVE CHANGES"}
      </button>
    </form>
  );
};

const PasswordCard = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (!form.currentPassword) return toast.error("Enter your current password");
    if (form.newPassword.length < 8) return toast.error("New password must be at least 8 characters");
    setSaving(true);
    try {
      const { data } = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, form);
      toast.success(data.message);
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change password"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="glass-card space-y-4 p-6">
      <h3 className="text-lg font-semibold text-ink">Change password</h3>
      <Input
        label="Current Password"
        type="password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
      />
      <Input
        label="New Password"
        type="password"
        autoComplete="new-password"
        placeholder="Min 8 characters"
        value={form.newPassword}
        onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
      />
      <p className="text-xs text-muted">Changing your password signs out all your other devices.</p>
      <button type="submit" disabled={saving} className="btn-gradient w-full">
        {saving ? <Spinner /> : "UPDATE PASSWORD"}
      </button>
    </form>
  );
};

const DevicesCard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.AUTH.SESSIONS);
      setSessions(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load devices"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const signOut = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.AUTH.SESSION(id));
      toast.success("Device signed out");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not sign out device"));
    }
  };

  const signOutOthers = async () => {
    try {
      const { data } = await axiosInstance.delete(API_PATHS.AUTH.SESSIONS);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not sign out devices"));
    }
  };

  return (
    <div className="glass-card p-6 lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Logged-in devices</h3>
          <p className="text-xs text-muted">Everywhere your account is currently signed in.</p>
        </div>
        {sessions.length > 1 && (
          <button type="button" onClick={signOutOthers} className="btn-danger">
            <FiLogOut /> Sign out all other devices
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => {
            const Icon = /iOS|Android|mobile/.test(`${s.os} ${s.deviceName}`) ? FiSmartphone : FiMonitor;
            return (
              <li key={s.id} className="flex items-center gap-4 rounded-xl bg-glass-strong p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {s.deviceName}
                    {s.current && (
                      <span className="ml-2 rounded-full bg-income-soft px-2 py-0.5 text-[10px] text-income">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {s.ip || "Unknown IP"} · Logged in {fmt(s.loggedInAt)} · Last active {fmt(s.lastActive)}
                  </p>
                </div>
                {!s.current && (
                  <button type="button" onClick={() => signOut(s.id)} className="btn-ghost shrink-0">
                    Sign out
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Profile = () => (
  <motion.div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2" initial={false}>
    <ProfileCard />
    <PasswordCard />
    <DevicesCard />
  </motion.div>
);

export default Profile;
