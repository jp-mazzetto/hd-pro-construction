export interface SubscriptionPlan {
  id: string;
  tier: "BASIC" | "STANDARD" | "PREMIUM";
  name: string;
  priceInCents: number;
  maxSqFt: number;
  visitsPerMonth: number;
  features: string[];
}

export interface CreatePropertyInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: number;
  notes?: string;
}

export interface Property {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: number;
  notes: string | null;
}

export interface CheckoutSessionResult {
  subscriptionId: string;
  checkoutSessionId: string;
  checkoutUrl: string;
}

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface SubscriptionPropertySummary {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: number;
  notes: string | null;
  createdAt: string;
}

export interface UserSubscription {
  id: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  plan: SubscriptionPlan;
  property: SubscriptionPropertySummary;
}
