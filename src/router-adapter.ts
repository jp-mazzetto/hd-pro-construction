import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
} from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type URLSearchParamsInit =
  | URLSearchParams
  | string
  | string[][]
  | Record<string, string>
  | undefined;

type SetSearchParams = (
  nextInit:
    | URLSearchParamsInit
    | ((prev: URLSearchParams) => URLSearchParamsInit),
  navigateOptions?: { replace?: boolean },
) => void;

const normalizeSearchParams = (init: URLSearchParamsInit) =>
  init instanceof URLSearchParams ? init : new URLSearchParams(init);

const toSearchObject = (params: URLSearchParams): Record<string, string> =>
  Object.fromEntries(params.entries());

export { Link, Navigate, Outlet, useLocation };

export const useNavigate = () => {
  const navigate = useTanStackNavigate();

  return useCallback(
    (to: string, options?: NavigateOptions) =>
      navigate({
        to,
        replace: options?.replace,
        state: options?.state as never,
      }),
    [navigate],
  );
};

export const useParams = () =>
  useTanStackParams({ strict: false }) as Record<string, string | undefined>;

export const useSearchParams = (): [URLSearchParams, SetSearchParams] => {
  const location = useLocation();
  const navigate = useTanStackNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(location.searchStr),
    [location.searchStr],
  );

  const setSearchParams = useCallback<SetSearchParams>(
    (nextInit, navigateOptions) => {
      const next =
        typeof nextInit === "function"
          ? normalizeSearchParams(nextInit(new URLSearchParams(location.searchStr)))
          : normalizeSearchParams(nextInit);

      void navigate({
        to: location.pathname,
        search: toSearchObject(next),
        replace: navigateOptions?.replace,
      });
    },
    [location.pathname, location.searchStr, navigate],
  );

  return [searchParams, setSearchParams];
};
