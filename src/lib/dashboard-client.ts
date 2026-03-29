import type {
  AuthIdentityView,
  BillingCycleView,
  CreateSchedulePreferenceInput,
  ReferralStatus,
  RescheduleVisitInput,
  ScheduleWithVisits,
  ServiceVisit,
  UpdateProfileInput,
} from "../types/dashboard";
import type { Property, CreatePropertyInput, UserSubscription } from "../types/lib";
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

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const fetchSubscriptions = async () => {
  const data = await request<{ subscriptions: UserSubscription[] }>(
    "/api/subscription/subscriptions",
    { method: "GET" },
  );
  return data.subscriptions;
};

export const fetchSubscription = (id: string) =>
  request<UserSubscription>(`/api/subscription/subscriptions/${id}`, {
    method: "GET",
  });

export const cancelSubscription = (id: string, reason?: string) =>
  request<UserSubscription>(
    `/api/subscription/subscriptions/${id}/cancel`,
    {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    },
  );

export const verifyCheckoutSession = (sessionId: string) =>
  request<{ status: string; subscriptionId: string }>(
    "/api/subscription/subscriptions/checkout/verify",
    {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    },
  );

export const resumeCheckout = (subscriptionId: string) =>
  request<{
    status: "activated" | "checkout_url";
    subscriptionId?: string;
    checkoutUrl?: string;
    reason?: "open_session" | "session_expired_recreated";
  }>(
    `/api/subscription/subscriptions/${subscriptionId}/resume-checkout`,
    { method: "POST" },
  );

export const linkSubscriptionProperty = (
  subscriptionId: string,
  propertyId: string,
) =>
  request<UserSubscription>(
    `/api/subscription/subscriptions/${subscriptionId}/property`,
    {
      method: "PATCH",
      body: JSON.stringify({ propertyId }),
    },
  );

// ─── Properties ───────────────────────────────────────────────────────────────

export const fetchProperties = async () => {
  const data = await request<{ properties: Property[] }>(
    "/api/subscription/properties",
    { method: "GET" },
  );
  return data.properties;
};

export const createProperty = (input: CreatePropertyInput) =>
  request<Property>("/api/subscription/properties", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateProperty = (id: string, input: Partial<CreatePropertyInput>) =>
  request<Property>(`/api/subscription/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const deleteProperty = (id: string) =>
  request<void>(`/api/subscription/properties/${id}`, {
    method: "DELETE",
  });

// ─── Billing ──────────────────────────────────────────────────────────────────

export const fetchBillingCycles = async () => {
  const data = await request<{ billingCycles: BillingCycleView[] }>(
    "/api/subscription/billing",
    { method: "GET" },
  );
  return data.billingCycles;
};

// ─── Schedule ─────────────────────────────────────────────────────────────────

export const createSchedulePreference = (
  subscriptionId: string,
  input: CreateSchedulePreferenceInput,
) =>
  request<ScheduleWithVisits>(
    `/api/subscription/subscriptions/${subscriptionId}/schedule`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

export const fetchSchedule = (subscriptionId: string) =>
  request<ScheduleWithVisits>(
    `/api/subscription/subscriptions/${subscriptionId}/schedule`,
    { method: "GET" },
  );

export const updateSchedulePreference = (
  subscriptionId: string,
  input: CreateSchedulePreferenceInput,
) =>
  request<ScheduleWithVisits>(
    `/api/subscription/subscriptions/${subscriptionId}/schedule`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

export const fetchVisits = async (params?: {
  status?: string;
  from?: string;
  to?: string;
}) => {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const qs = search.toString();
  const data = await request<{ visits: ServiceVisit[] }>(
    `/api/subscription/visits${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
  return data.visits;
};

export const rescheduleVisit = (id: string, input: RescheduleVisitInput) =>
  request<ServiceVisit>(`/api/subscription/visits/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const cancelVisit = (id: string) =>
  request<ServiceVisit>(`/api/subscription/visits/${id}/cancel`, {
    method: "PATCH",
  });

// ─── Referrals ────────────────────────────────────────────────────────────────

export const fetchReferralStatus = () =>
  request<ReferralStatus>("/api/subscription/referral/status", {
    method: "GET",
  });

export const generateReferralCode = () =>
  request<{ referralCode: string }>("/api/subscription/referral/code", {
    method: "POST",
  });

// ─── Profile ──────────────────────────────────────────────────────────────────

export const updateProfile = (input: UpdateProfileInput) =>
  request<{ name: string }>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export type ChangePasswordInput = {
  currentPassword?: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  kind: "password_set" | "password_changed";
  message: string;
};

export const changePassword = (input: ChangePasswordInput) =>
  request<ChangePasswordResponse>("/api/auth/me/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const fetchAuthIdentities = () =>
  request<{ identities: AuthIdentityView[] }>("/api/auth/me/identities", {
    method: "GET",
  });
