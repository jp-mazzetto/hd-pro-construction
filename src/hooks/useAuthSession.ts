import { useEffect, useState } from "react";

import {
  ApiError,
  fetchCurrentSession,
  loginWithEmail,
  registerWithEmail,
  logoutCurrentSession,
} from "../lib/auth-client";
import type { AuthSession, LoginInput, RegisterInput } from "../types/auth";

const SESSION_LOAD_ERROR =
  "We couldn't verify the current session right now. Please try again.";
const LOGIN_ERROR = "Unable to sign in right now. Please try again.";
const INVALID_CREDENTIALS_ERROR = "Invalid email or password.";
const REGISTER_ERROR = "Unable to create your account right now. Please try again.";
const LOGOUT_ERROR = "Unable to sign out right now. Please try again.";

const getAuthErrorMessage = (caughtError: unknown, fallbackMessage: string) => {
  if (caughtError instanceof ApiError) {
    if (caughtError.status === 401) {
      return INVALID_CREDENTIALS_ERROR;
    }

    if (caughtError.message.trim().length > 0) {
      return caughtError.message;
    }
  }

  if (
    caughtError instanceof Error &&
    caughtError.message.trim().length > 0 &&
    caughtError.message !== "Failed to fetch"
  ) {
    return caughtError.message;
  }

  return fallbackMessage;
};

export default function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const nextSession = await fetchCurrentSession();

        if (!isMounted) {
          return;
        }

        setSession(nextSession);
        setError(null);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (caughtError instanceof ApiError && caughtError.status === 401) {
          setSession(null);
          setError(null);
          return;
        }

        setError(SESSION_LOAD_ERROR);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (input: LoginInput) => {
    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const nextSession = await loginWithEmail(input);
      setSession(nextSession);
      return true;
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, LOGIN_ERROR));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await registerWithEmail(input);
      setSession(null);
      setNotice(response.message);
      return true;
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, REGISTER_ERROR));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    setIsSubmitting(true);

    try {
      await logoutCurrentSession();
      setSession(null);
      setError(null);
      setNotice(null);
    } catch {
      setError(LOGOUT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    session,
    isLoading,
    isSubmitting,
    error,
    notice,
    setNotice,
    login,
    register,
    logout,
  };
}
