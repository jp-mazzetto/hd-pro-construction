import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ApiError,
  fetchCurrentSession,
  getGoogleAuthStartUrl,
  loginWithEmail,
  registerWithEmail,
  logoutCurrentSession,
} from "../lib/auth-client";
import { invalidateAuthAndPrivateQueries } from "../lib/query-invalidations";
import { queryKeys } from "../lib/query-keys";
import type { AuthSession, LoginInput, RegisterInput } from "../types/auth";

const SESSION_LOAD_ERROR =
  "We couldn't verify the current session right now. Please try again.";
const LOGIN_ERROR = "Unable to sign in right now. Please try again.";
const INVALID_CREDENTIALS_ERROR = "Invalid email or password.";
const REGISTER_ERROR = "Unable to create your account right now. Please try again.";
const LOGOUT_ERROR = "Unable to sign out right now. Please try again.";

let restoreSessionRequest: Promise<AuthSession | null> | null = null;

const restoreSessionOnce = async () => {
  if (!restoreSessionRequest) {
    restoreSessionRequest = fetchCurrentSession().finally(() => {
      restoreSessionRequest = null;
    });
  }

  return restoreSessionRequest;
};

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
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async () => {
      try {
        return await restoreSessionOnce();
      } catch (caughtError) {
        if (caughtError instanceof ApiError && caughtError.status === 401) {
          return null;
        }

        throw caughtError;
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, caughtError) => {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        return false;
      }

      return failureCount < 1;
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginWithEmail,
    onSuccess: async (nextSession) => {
      queryClient.setQueryData<AuthSession | null>(queryKeys.auth.session, nextSession);
      await invalidateAuthAndPrivateQueries(queryClient);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerWithEmail,
    onSuccess: async (response) => {
      queryClient.setQueryData<AuthSession | null>(queryKeys.auth.session, null);
      setNotice(response.message);
      await invalidateAuthAndPrivateQueries(queryClient);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutCurrentSession,
    onSuccess: async () => {
      queryClient.setQueryData<AuthSession | null>(queryKeys.auth.session, null);
      setError(null);
      setNotice(null);
      await invalidateAuthAndPrivateQueries(queryClient);
    },
  });

  const login = async (input: LoginInput) => {
    setError(null);
    setNotice(null);

    try {
      await loginMutation.mutateAsync(input);
      return true;
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, LOGIN_ERROR));
      return false;
    }
  };

  const register = async (input: RegisterInput) => {
    setError(null);

    try {
      await registerMutation.mutateAsync(input);
      return true;
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, REGISTER_ERROR));
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      setError(LOGOUT_ERROR);
    }
  };

  const continueWithGoogle = () => {
    window.location.assign(getGoogleAuthStartUrl());
  };

  const updateSessionActorName = (name: string) => {
    queryClient.setQueryData<AuthSession | null>(queryKeys.auth.session, (prevSession) =>
      prevSession
        ? {
            ...prevSession,
            actor: {
              ...prevSession.actor,
              name,
            },
          }
        : prevSession,
    );
  };

  const isSubmitting =
    loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;
  const effectiveError =
    error ?? (sessionQuery.isError ? SESSION_LOAD_ERROR : null);

  return {
    session: sessionQuery.data ?? null,
    isLoading: sessionQuery.isPending,
    isSubmitting,
    error: effectiveError,
    notice,
    setNotice,
    login,
    register,
    continueWithGoogle,
    logout,
    updateSessionActorName,
  };
}
