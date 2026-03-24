import type { SubscriptionPlanName } from "./site";
import type { SubscriptionStatus, UserSubscription } from "../types/lib";

export const TIER_LABELS: Record<SubscriptionPlanName, string> = {
  "Basic Plan": "Starter Tier",
  "Standard Plan": "Property Essential",
  "Premium Plan": "Estate Grade",
};

export const API_TIER_TO_SITE_TIER: Record<
  UserSubscription["plan"]["tier"],
  SubscriptionPlanName
> = {
  BASIC: "Basic Plan",
  STANDARD: "Standard Plan",
  PREMIUM: "Premium Plan",
};

export const STATUS_META: Record<
  SubscriptionStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-orange-400/40 bg-orange-500/15 text-orange-300",
  },
  PENDING: {
    label: "Pending Payment",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-red-400/40 bg-red-500/15 text-red-300",
  },
  EXPIRED: {
    label: "Expired",
    className: "border-gray-500/40 bg-gray-500/15 text-gray-300",
  },
};

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export const formatMoney = (valueInCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(valueInCents / 100);
