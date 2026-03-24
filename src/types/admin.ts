import type { TimeWindow, VisitStatus } from "./dashboard";

export type AdminSection = "visit-calendar";

export interface AdminCalendarVisit {
  id: string;
  scheduledDate: string;
  timeWindow: TimeWindow;
  status: VisitStatus;
  completedAt: string | null;
  adminNotes: string | null;
  property: {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    sqFt: number;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  subscription: {
    id: string;
    planName: string;
    planTier: string;
  };
}

export interface AdminCalendarDay {
  date: string;
  dayOfWeek: string;
  visits: AdminCalendarVisit[];
}

export interface AdminCalendarResponse {
  days: AdminCalendarDay[];
  summary: {
    totalVisits: number;
    byTimeWindow: Record<string, number>;
    byStatus: Record<string, number>;
  };
}
