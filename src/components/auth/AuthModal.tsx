import {
  ShieldCheck,
  ShieldEllipsis,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import type { AuthSession, LoginInput, RegisterInput } from "../../types/auth";
import Button from "../Button";

interface AuthModalProps {
  isOpen: boolean;
  session: AuthSession | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  notice: string | null;
  onClose: () => void;
  onLogin: (input: LoginInput) => Promise<boolean>;
  onRegister: (input: RegisterInput) => Promise<boolean>;
  onLogout: () => Promise<void>;
}

type AuthMode = "login" | "register";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const formatExpiry = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const AuthModal = ({
  isOpen,
  session,
  isLoading,
  isSubmitting,
  error,
  notice,
  onClose,
  onLogin,
  onRegister,
  onLogout,
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isAuthenticated = session !== null;
  const activeError = localError ?? error;
  const title = isAuthenticated
    ? "Session active"
    : mode === "login"
      ? "Login"
      : "Create account";

  const resetPasswords = () => {
    setFormState((currentState) => ({
      ...currentState,
      password: "",
      confirmPassword: "",
    }));
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setLocalError(null);
    resetPasswords();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (mode === "register") {
      if (formState.password !== formState.confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }

      const didRegister = await onRegister({
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });

      if (didRegister) {
        setMode("login");
        resetPasswords();
      }

      return;
    }

    const didLogin = await onLogin({
      email: formState.email,
      password: formState.password,
    });

    if (didLogin) {
      resetPasswords();
    }
  };

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close login modal"
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[#111111] text-white shadow-[0_40px_160px_-40px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_45%)]" />

        <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-orange-200">
                  <ShieldCheck size={14} />
                  Secure access
                </p>
                <h2 className="mt-6 text-4xl font-black uppercase italic leading-[0.9] tracking-tighter sm:text-6xl">
                  Built for
                  <span className="block text-orange-500">the client area</span>
                </h2>
              </div>

              <button
                type="button"
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3 text-gray-300 transition hover:border-orange-500/40 hover:text-white"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300">
              Sign in to continue, or create your customer account and confirm
              your email before the first login.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-orange-300">
                  Access mode
                </p>
                <h3 className="mt-3 text-3xl font-black uppercase italic tracking-tight">
                  {title}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-orange-300">
                {isAuthenticated ? <ShieldCheck size={26} /> : <ShieldEllipsis size={26} />}
              </div>
            </div>

            {activeError ? (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {activeError}
              </div>
            ) : null}

            {notice ? (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {notice}
              </div>
            ) : null}

            {isAuthenticated && session ? (
              <div className="mt-8 space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <p className="text-xl font-black uppercase italic tracking-tight">
                        {session.actor.name}
                      </p>
                      <p className="text-sm text-gray-300">{session.actor.email}</p>
                    </div>
                  </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                          Role
                        </p>
                        <p className="mt-2 text-lg font-bold">
                          {session.actor.role}
                        </p>
                      </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                        Session expires
                      </p>
                      <p className="mt-2 text-lg font-bold">
                        {formatExpiry(session.expiresAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    void onLogout();
                  }}
                  variant="outline"
                  className="w-full border-white/20 bg-transparent py-4 text-white hover:border-orange-500 hover:bg-orange-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-8 inline-flex rounded-full border border-white/10 bg-black/20 p-1">
                  <button
                    type="button"
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.22em] transition ${
                      mode === "login"
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => {
                      handleModeChange("login");
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.22em] transition ${
                      mode === "register"
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                    onClick={() => {
                      handleModeChange("register");
                    }}
                  >
                    Create account
                  </button>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {mode === "register" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.32em] text-gray-400">
                        Full name
                      </span>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-orange-400"
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                      />
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.32em] text-gray-400">
                      Email
                    </span>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) =>
                        setFormState((currentState) => ({
                          ...currentState,
                          email: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-orange-400"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.32em] text-gray-400">
                      Password
                    </span>
                    <input
                      type="password"
                      value={formState.password}
                      onChange={(event) =>
                        setFormState((currentState) => ({
                          ...currentState,
                          password: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-orange-400"
                      placeholder={
                        mode === "register" ? "At least 8 characters" : "Enter your password"
                      }
                      autoComplete={
                        mode === "register" ? "new-password" : "current-password"
                      }
                      required
                    />
                  </label>

                  {mode === "register" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.32em] text-gray-400">
                        Confirm password
                      </span>
                      <input
                        type="password"
                        value={formState.confirmPassword}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            confirmPassword: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-orange-400"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                      />
                    </label>
                  ) : null}

                  <Button
                    type="submit"
                    className="w-full py-5 text-lg"
                    disabled={isLoading || isSubmitting}
                  >
                    {mode === "register" ? (
                      <>
                        <UserPlus size={20} />
                        {isSubmitting ? "Creating account..." : "Create account"}
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        {isSubmitting ? "Signing in..." : "Login"}
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
