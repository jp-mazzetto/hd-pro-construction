import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Mail, Shield, User } from "lucide-react";

import type { AuthSession } from "../../../types/auth";
import type { AuthIdentityView } from "../../../types/dashboard";
import {
  updateProfile,
  fetchAuthIdentities,
  changePassword,
} from "../../../lib/dashboard-client";

interface SettingsPageProps {
  session: AuthSession;
  onSessionUpdate: (name: string) => void;
}

export default function SettingsPage({ session, onSessionUpdate }: SettingsPageProps) {
  // Profile
  const [name, setName] = useState(session.actor.name);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [identities, setIdentities] = useState<AuthIdentityView[]>([]);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchAuthIdentities()
      .then((data) => setIdentities(data.identities))
      .catch(() => {});
  }, []);

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        setProfileError("Name must be at least 2 characters.");
        return;
      }

      setIsSaving(true);
      setProfileError(null);
      setSaveSuccess(false);

      try {
        await updateProfile({ name: trimmed });
        onSessionUpdate(trimmed);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch {
        setProfileError("Failed to update profile.");
      } finally {
        setIsSaving(false);
      }
    },
    [name, onSessionUpdate],
  );

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError(null);
      setPasswordSuccess(false);

      if (newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      setIsChangingPassword(true);

      try {
        await changePassword({ currentPassword, newPassword });
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to change password.";
        setPasswordError(message);
      } finally {
        setIsChangingPassword(false);
      }
    },
    [currentPassword, newPassword, confirmPassword],
  );

  return (
    <div className="max-w-xl space-y-6">
      {/* Profile */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <User size={16} /> Profile
        </h3>

        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold text-slate-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Email</label>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-400">
            <Mail size={14} />
            {session.actor.email}
          </div>
        </div>

        {profileError && <p className="text-sm text-red-400">{profileError}</p>}
        {saveSuccess && <p className="text-sm text-emerald-400">Profile updated.</p>}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handleChangePassword}
        className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <KeyRound size={16} /> Change Password
        </h3>

        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-xs font-semibold text-slate-500">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-xs font-semibold text-slate-500">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-slate-500">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
        {passwordSuccess && <p className="text-sm text-emerald-400">Password changed successfully.</p>}

        <button
          type="submit"
          disabled={isChangingPassword}
          className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
        >
          {isChangingPassword ? "Changing..." : "Change Password"}
        </button>
      </form>

      {/* Auth Methods */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
          <Shield size={16} /> Sign-in Methods
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-slate-300">
                <Mail size={16} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Email &amp; Password</div>
                <div className="text-xs text-slate-400">{session.actor.email}</div>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
              Active
            </span>
          </div>

          {identities.map((id) => (
            <div
              key={id.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-slate-300">
                  <svg viewBox="0 0 24 24" width={16} height={16}>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Google</div>
                  <div className="text-xs text-slate-400">{id.email}</div>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                Linked
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
