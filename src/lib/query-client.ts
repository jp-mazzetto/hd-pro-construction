import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./auth-client";

const DEFAULT_STALE_TIME_MS = 60 * 1000;

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) {
            return false;
          }

          return failureCount < 2;
        },
      },
    },
  });

export const queryClient = createAppQueryClient();

