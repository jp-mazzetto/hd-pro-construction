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
export type SubscriptionLifecycleState =
  | "PENDING"
  | "ACTIVE"
  | "END_SCHEDULED"
  | "EXPIRED";
export type SubscriptionBillingState =
  | "PENDING"
  | "CURRENT"
  | "PAST_DUE"
  | "UNPAID";

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
  lifecycleState: SubscriptionLifecycleState;
  billingState: SubscriptionBillingState;
  billingGraceUntil: string | null;
  lastPaymentFailedAt: string | null;
  lastPaymentRecoveredAt: string | null;
  startDate: string;
  endDate: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  effectiveCancelDate: string | null;
  remainingCommitmentMonths: number | null;
  terminationFeeInCents: number | null;
  terminationFeeCheckoutSessionId: string | null;
  createdAt: string;
  plan: SubscriptionPlan;
  property: SubscriptionPropertySummary | null;
}

export interface CancelSubscriptionResponse extends UserSubscription {
  remainingMonths: number;
  terminationFeeInCents: number;
  effectiveCancelDate: string;
  feeCheckoutUrl: string | null;
  feeCheckoutSessionId: string | null;
}
