import type { AdminCalendarResponse, AdminCalendarVisit } from "../types/admin";
import { ApiError } from "./auth-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

const request = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body instanceof FormData
        ? undefined
        : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  let data: unknown = null;
  if (text.length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Unexpected API error";
    throw new ApiError(message, response.status);
  }

  return data as T;
};

// ─── Visit Calendar ──────────────────────────────────────────────────────────

export const fetchVisitCalendar = async (params?: {
  from?: string;
  to?: string;
  status?: string;
}) => {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();

  return request<AdminCalendarResponse>(
    `/api/admin/visits/calendar${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
};

export const completeVisit = (id: string) =>
  request<{ visit: AdminCalendarVisit }>(`/api/admin/visits/${id}/complete`, {
    method: "PATCH",
  });

export const skipVisit = (id: string) =>
  request<{ visit: AdminCalendarVisit }>(`/api/admin/visits/${id}/skip`, {
    method: "PATCH",
  });

export const updateVisitNotes = (id: string, notes: string) =>
  request<{ visit: AdminCalendarVisit }>(`/api/admin/visits/${id}/notes`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });
