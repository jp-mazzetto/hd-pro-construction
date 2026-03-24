export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type TimeWindow = "MORNING" | "MIDDAY" | "AFTERNOON";

export type VisitStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "SKIPPED";

export interface SchedulePreference {
  id: string;
  subscriptionId: string;
  preferredDay: DayOfWeek;
  preferredWindow: TimeWindow;
  notes: string | null;
  createdAt: string;
}

export interface ServiceVisit {
  id: string;
  subscriptionId: string;
  scheduledDate: string;
  timeWindow: TimeWindow;
  status: VisitStatus;
  completedAt: string | null;
  cancelledAt: string | null;
  rescheduledFrom: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export interface ScheduleWithVisits {
  preference: SchedulePreference;
  visits: ServiceVisit[];
}

export interface CreateSchedulePreferenceInput {
  preferredDay: DayOfWeek;
  preferredWindow: TimeWindow;
  notes?: string;
}

export interface RescheduleVisitInput {
  newDate: string;
  timeWindow: TimeWindow;
}

export interface BillingCycleView {
  id: string;
  subscriptionId: string;
  periodStart: string;
  periodEnd: string;
  amountInCents: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "WAIVED";
  paidAt: string | null;
  createdAt: string;
  planName?: string;
  planTier?: string;
}

export interface ReferralStatus {
  referralCode: string | null;
  total: number;
  converted: number;
  freeMonthsEarned: number;
  untilNextReward: number;
}

export interface UpdateProfileInput {
  name: string;
}

export interface AuthIdentityView {
  id: string;
  provider: "GOOGLE";
  email: string;
  createdAt: string;
}

export type DashboardSection =
  | "overview"
  | "subscriptions"
  | "subscription-detail"
  | "properties"
  | "billing"
  | "referrals"
  | "schedule"
  | "schedule-setup"
  | "settings";
