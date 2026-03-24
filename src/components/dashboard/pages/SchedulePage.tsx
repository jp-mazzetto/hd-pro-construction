import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";

import type { ServiceVisit, DashboardSection } from "../../../types/dashboard";
import type { UserSubscription } from "../../../types/lib";
import { fetchVisits, cancelVisit, fetchSubscriptions } from "../../../lib/dashboard-client";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";

const TIME_WINDOW_LABELS: Record<string, string> = {
  MORNING: "7:00 AM – 11:00 AM",
  MIDDAY: "11:00 AM – 2:00 PM",
  AFTERNOON: "2:00 PM – 6:00 PM",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface SchedulePageProps {
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
}

export default function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [activeSubs, setActiveSubs] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [visitsData, subsData] = await Promise.all([
          fetchVisits().catch(() => []),
          fetchSubscriptions().catch(() => []),
        ]);
        if (!cancelled) {
          setVisits(visitsData);
          setActiveSubs(subsData.filter((s) => s.status === "ACTIVE"));
        }
      } catch {
        if (!cancelled) setError("Failed to load schedule.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const handleCancel = useCallback(async (visitId: string) => {
    setCancellingId(visitId);
    try {
      const updated = await cancelVisit(visitId);
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? updated : v)),
      );
    } catch {
      setError("Failed to cancel visit. Make sure it's at least 48 hours away.");
    } finally {
      setCancellingId(null);
    }
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-900" />;
  }

  if (error && visits.length === 0) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (visits.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays size={28} />}
        title="No Scheduled Visits"
        description={
          activeSubs.length > 0
            ? "You have an active plan. Set up your preferred schedule to get started."
            : "Subscribe to a plan and set up your schedule to see upcoming visits."
        }
        action={
          activeSubs.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                onNavigate("schedule-setup", { id: activeSubs[0].id })
              }
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
            >
              Set Up Schedule
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("overview")}
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
            >
              View My Plans
            </button>
          )
        }
      />
    );
  }

  // Build calendar data
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const visitDates = new Set(
    visits
      .filter((v) => v.status === "SCHEDULED" || v.status === "COMPLETED")
      .map((v) => {
        const d = new Date(v.scheduledDate);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }),
  );

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const upcomingVisits = visits
    .filter((v) => v.status === "SCHEDULED" && new Date(v.scheduledDate) >= now)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Calendar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-base font-bold text-white">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              className="py-1 text-xs font-bold uppercase text-slate-600"
            >
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} />;
            }
            const dateKey = `${viewYear}-${viewMonth}-${day}`;
            const hasVisit = visitDates.has(dateKey);
            const isToday =
              day === now.getDate() &&
              viewMonth === now.getMonth() &&
              viewYear === now.getFullYear();

            return (
              <div
                key={`day-${day}`}
                className={`relative flex h-9 items-center justify-center rounded-lg text-sm ${
                  hasVisit
                    ? "bg-orange-500/15 font-bold text-orange-400"
                    : isToday
                      ? "bg-slate-800 font-semibold text-white"
                      : "text-slate-400"
                }`}
              >
                {day}
                {hasVisit && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming visits list */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          Upcoming Visits ({upcomingVisits.length})
        </h2>
        <div className="space-y-2">
          {upcomingVisits.map((visit) => (
            <div
              key={visit.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {new Date(visit.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-slate-400">
                    {TIME_WINDOW_LABELS[visit.timeWindow]}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={visit.status} />
                <button
                  type="button"
                  onClick={() => handleCancel(visit.id)}
                  disabled={cancellingId === visit.id}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                  title="Cancel visit"
                >
                  {cancellingId === visit.id ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <XCircle size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
          {upcomingVisits.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No upcoming visits scheduled.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
