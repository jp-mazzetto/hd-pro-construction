import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Pencil,
  RefreshCw,
  Save,
  Shield,
  X,
  XCircle,
} from "lucide-react";

import type {
  ServiceVisit,
  DashboardSection,
  DayOfWeek,
  TimeWindow,
  SchedulePreference,
} from "../../../types/dashboard";
import type { UserSubscription } from "../../../types/lib";
import {
  fetchVisits,
  cancelVisit,
  rescheduleVisit,
  fetchSubscriptions,
  fetchSchedule,
  updateSchedulePreference,
} from "../../../lib/dashboard-client";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";

const TIME_WINDOW_LABELS: Record<string, string> = {
  MORNING: "7:00 AM – 11:00 AM",
  MIDDAY: "11:00 AM – 2:00 PM",
  AFTERNOON: "2:00 PM – 6:00 PM",
};

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];

const TIME_WINDOWS: { value: TimeWindow; label: string; description: string }[] = [
  { value: "MORNING", label: "Morning", description: "7:00 AM – 11:00 AM" },
  { value: "MIDDAY", label: "Midday", description: "11:00 AM – 2:00 PM" },
  { value: "AFTERNOON", label: "Afternoon", description: "2:00 PM – 6:00 PM" },
];

const TIER_LABELS: Record<string, string> = {
  BASIC: "Basic",
  STANDARD: "Standard",
  PREMIUM: "Premium",
};

interface SchedulePageProps {
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
}

export default function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [visits, setVisits] = useState<ServiceVisit[]>([]);
  const [activeSubs, setActiveSubs] = useState<UserSubscription[]>([]);
  const [preference, setPreference] = useState<SchedulePreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Reschedule visit state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleWindow, setRescheduleWindow] = useState<TimeWindow | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editDay, setEditDay] = useState<DayOfWeek | null>(null);
  const [editWindow, setEditWindow] = useState<TimeWindow | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const now = new Date();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [visitsData, subsData] = await Promise.all([
          fetchVisits(),
          fetchSubscriptions(),
        ]);
        if (cancelled) return;

        setVisits(visitsData);
        const active = subsData.filter(
          (s) => s.status === "ACTIVE" && s.lifecycleState === "ACTIVE",
        );
        setActiveSubs(active);

        if (active.length > 0) {
          try {
            const schedule = await fetchSchedule(active[0].id);
            if (!cancelled && schedule?.preference) {
              setPreference(schedule.preference);
            }
          } catch {
            // No schedule yet
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load schedule data. Please try again.");
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

  const startEditing = () => {
    setEditDay(preference?.preferredDay ?? null);
    setEditWindow(preference?.preferredWindow ?? null);
    setEditNotes(preference?.notes ?? "");
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditDay(null);
    setEditWindow(null);
    setEditNotes("");
  };

  const handleSave = useCallback(async () => {
    if (!editDay || !editWindow || activeSubs.length === 0) return;

    setIsSaving(true);
    setError(null);

    try {
      const result = await updateSchedulePreference(activeSubs[0].id, {
        preferredDay: editDay,
        preferredWindow: editWindow,
        notes: editNotes.trim() || undefined,
      });
      setPreference(result.preference);
      setVisits(result.visits);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError("Failed to update schedule preferences.");
    } finally {
      setIsSaving(false);
    }
  }, [editDay, editWindow, editNotes, activeSubs]);

  const isThisWeek = (date: Date) => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return date >= startOfWeek && date < endOfWeek;
  };

  const startReschedule = (visit: ServiceVisit) => {
    setRescheduleId(visit.id);
    setRescheduleDate(visit.scheduledDate.split("T")[0]);
    setRescheduleWindow(visit.timeWindow);
  };

  const cancelReschedule = () => {
    setRescheduleId(null);
    setRescheduleDate("");
    setRescheduleWindow(null);
  };

  const handleReschedule = useCallback(async () => {
    if (!rescheduleId || !rescheduleDate || !rescheduleWindow) return;

    setIsRescheduling(true);
    setError(null);

    try {
      const updated = await rescheduleVisit(rescheduleId, {
        newDate: rescheduleDate,
        timeWindow: rescheduleWindow,
      });
      setVisits((prev) =>
        prev.map((v) => (v.id === rescheduleId ? updated : v)),
      );
      cancelReschedule();
    } catch {
      setError("Failed to reschedule visit.");
    } finally {
      setIsRescheduling(false);
    }
  }, [rescheduleId, rescheduleDate, rescheduleWindow]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const upcomingVisits = visits
    .filter((v) => v.status === "SCHEDULED" && new Date(v.scheduledDate) >= now)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const nextVisit = upcomingVisits[0];
  const nextVisitDate = nextVisit ? new Date(nextVisit.scheduledDate) : null;
  const daysRemaining = nextVisitDate
    ? Math.ceil((nextVisitDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const activeSub = activeSubs[0] ?? null;
  const visitsPerMonth = activeSub?.plan.visitsPerMonth ?? 0;
  const visibleVisits = showAll ? upcomingVisits : upcomingVisits.slice(0, 3);
  const hiddenCount = Math.max(0, upcomingVisits.length - 3);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 rounded-xl bg-slate-900" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-900" />
          ))}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 h-80 rounded-xl bg-slate-900" />
          <div className="col-span-4 h-80 rounded-xl bg-slate-900" />
        </div>
      </div>
    );
  }

  // ── Error / empty ─────────────────────────────────────────────────────────
  if (error && visits.length === 0 && !preference) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (visits.length === 0 && !preference) {
    const hasLinkedProperty = Boolean(activeSubs[0]?.property);

    return (
      <EmptyState
        icon={<CalendarDays size={28} />}
        title="No Scheduled Visits"
        description={
          activeSubs.length > 0
            ? hasLinkedProperty
              ? "You have an active plan. Set up your preferred schedule to get started."
              : "You have an active plan, but no linked address yet. Link an address first."
            : "Subscribe to a plan and set up your schedule to see upcoming visits."
        }
        action={
          activeSubs.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                hasLinkedProperty
                  ? onNavigate("schedule-setup", { id: activeSubs[0].id })
                  : onNavigate("subscription-detail", { id: activeSubs[0].id })
              }
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
            >
              {hasLinkedProperty ? "Set Up Schedule" : "Link Address"}
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

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Alerts */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
          <Check size={16} />
          Schedule preferences updated successfully.
        </div>
      )}

      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-white leading-none mb-2">
            Service Pipeline
          </h2>
          <p className="max-w-sm text-sm text-slate-500">
            Orchestrate field operations and site visits with structural precision.
          </p>
        </div>
        {activeSub && (
          <div className="rounded-xl border-l-4 border-orange-500 bg-slate-900 px-4 py-2.5">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Active Plan
            </span>
            <span className="text-xl font-bold text-white">{activeSub.plan.name}</span>
          </div>
        )}
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Next Visit */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors duration-300 hover:bg-slate-800/60">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Next Visit
          </p>
          {nextVisitDate ? (
            <>
              <h3 className="text-2xl font-extrabold tracking-tight text-white">
                {nextVisitDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-orange-400">
                <Clock size={12} />
                {daysRemaining === 0
                  ? "Today"
                  : daysRemaining === 1
                    ? "Tomorrow"
                    : `${daysRemaining} days remaining`}
              </p>
            </>
          ) : (
            <h3 className="text-lg font-bold text-slate-500">None scheduled</h3>
          )}
          <CalendarDays
            size={72}
            className="absolute -bottom-3 -right-3 rotate-12 text-white/5 transition-transform group-hover:rotate-0"
          />
        </div>

        {/* Visits Scheduled */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors duration-300 hover:bg-slate-800/60">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Visits Scheduled
          </p>
          <h3 className="text-2xl font-extrabold tracking-tight text-white">
            {String(upcomingVisits.length).padStart(2, "0")}
            {visitsPerMonth > 0 && (
              <span className="ml-1 text-base font-normal text-slate-500">
                / {visitsPerMonth}/mo
              </span>
            )}
          </h3>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-orange-500 transition-all"
              style={{
                width:
                  visitsPerMonth > 0
                    ? `${Math.min(100, (upcomingVisits.length / (visitsPerMonth * 3)) * 100)}%`
                    : "0%",
              }}
            />
          </div>
          <Clock
            size={72}
            className="absolute -bottom-3 -right-3 rotate-12 text-white/5 transition-transform group-hover:rotate-0"
          />
        </div>

        {/* Plan Status */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors duration-300 hover:bg-slate-800/60">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Plan Status
          </p>
          {activeSub ? (
            <>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold tracking-tight text-white">
                  {TIER_LABELS[activeSub.plan.tier] ?? activeSub.plan.tier}
                </h3>
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Active
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {activeSub.plan.visitsPerMonth} visits / month
              </p>
            </>
          ) : (
            <h3 className="text-lg font-bold text-slate-500">No active plan</h3>
          )}
          <Shield
            size={72}
            className="absolute -bottom-3 -right-3 rotate-12 text-white/5 transition-transform group-hover:rotate-0"
          />
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── Left: Upcoming Services ──────────────────────────────────── */}
        <section className="col-span-8">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            {/* Section header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-5 w-1 rounded-full bg-orange-500" />
                <h3 className="text-base font-bold text-white">Upcoming Services</h3>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {upcomingVisits.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-800/60">
              {visibleVisits.map((visit) => {
                const visitDate = new Date(visit.scheduledDate);
                const canEdit = isThisWeek(visitDate);
                const monthAbbr = visitDate
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase();
                const day = visitDate.getDate();
                const weekday = visitDate.toLocaleDateString("en-US", { weekday: "long" });
                const windowLabel =
                  visit.timeWindow.charAt(0) +
                  visit.timeWindow.slice(1).toLowerCase();

                return (
                  <div key={visit.id} className="group">
                    <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-800/40">
                      <div className="flex items-center gap-5">
                        {/* Date block */}
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                          <span className="text-[9px] font-extrabold uppercase leading-none tracking-widest text-orange-400">
                            {monthAbbr}
                          </span>
                          <span className="mt-0.5 text-2xl font-black leading-none text-white">
                            {day}
                          </span>
                        </div>

                        <div>
                          <div className="mb-1 flex items-center gap-2.5">
                            <h4 className="text-sm font-bold text-white">
                              {windowLabel} Service Visit
                            </h4>
                            <StatusBadge status={visit.status} />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={10} />
                            <span>{weekday} · {TIME_WINDOW_LABELS[visit.timeWindow]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions (revealed on hover) */}
                      <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              rescheduleId === visit.id
                                ? cancelReschedule()
                                : startReschedule(visit)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer"
                            title="Reschedule"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCancel(visit.id)}
                          disabled={cancellingId === visit.id}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
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

                    {/* Inline reschedule form */}
                    {rescheduleId === visit.id && (
                      <div className="border-t border-slate-800 bg-slate-950/50 px-6 py-4">
                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              New Date
                            </label>
                            <input
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none scheme-dark"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              Time Window
                            </label>
                            <div className="flex gap-1.5">
                              {TIME_WINDOWS.map(({ value, label }) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setRescheduleWindow(value)}
                                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                                    rescheduleWindow === value
                                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleReschedule}
                              disabled={isRescheduling || !rescheduleDate || !rescheduleWindow}
                              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
                            >
                              {isRescheduling ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <Save size={12} />
                              )}
                              {isRescheduling ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelReschedule}
                              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {upcomingVisits.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                  No upcoming visits scheduled.
                </div>
              )}

              {/* Show more / less toggle */}
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="flex w-full items-center justify-center gap-2 border-t border-dashed border-slate-800 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 transition-all hover:border-orange-500/30 hover:text-orange-400 cursor-pointer"
                >
                  {showAll ? (
                    <>
                      <ChevronUp size={14} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      View {hiddenCount} More
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Right: Pipeline Logic + Property ─────────────────────────── */}
        <div className="col-span-4 flex flex-col gap-4">

          {/* Pipeline Logic panel */}
          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            {/* Orange accent strip */}
            <div className="h-0.75 bg-orange-500" />

            {/* Panel header */}
            <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h3 className="text-base font-bold text-white">Pipeline Logic</h3>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-500">
                  Schedule Settings
                </p>
              </div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-all hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer"
                  title="Edit preferences"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-lg bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !editDay || !editWindow}
                    className="rounded-lg bg-orange-600 p-2 text-white transition-all hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 p-5">
              {!isEditing ? (
                // ── View mode ──────────────────────────────────────────────
                <>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center gap-2 text-orange-400">
                      <CalendarDays size={13} />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest">
                        Preferred Window
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-white">
                          {DAYS.find((d) => d.value === preference?.preferredDay)?.label ?? "—"}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {TIME_WINDOW_LABELS[preference?.preferredWindow ?? ""] ?? "—"}
                        </p>
                      </div>
                      <span className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-400">
                        PRIMARY
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="mb-3 flex items-center gap-2 text-slate-400">
                      <MapPin size={13} />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest">
                        Site Notes
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">
                      {preference?.notes || "No special instructions added."}
                    </p>
                  </div>
                </>
              ) : (
                // ── Edit mode ──────────────────────────────────────────────
                <div className="space-y-5">
                  {/* Day selection */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Preferred Day
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DAYS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setEditDay(value)}
                          className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                            editDay === value
                              ? "border-orange-500 bg-orange-500/10 text-orange-400"
                              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time window selection */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Time Window
                    </label>
                    <div className="space-y-1.5">
                      {TIME_WINDOWS.map(({ value, label, description }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setEditWindow(value)}
                          className={`w-full rounded-lg border px-4 py-2.5 text-left transition-all cursor-pointer ${
                            editWindow === value
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-slate-700 bg-slate-800 hover:border-slate-600"
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{label}</div>
                          <div className="text-[10px] text-slate-500">{description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Site Instructions
                    </label>
                    <textarea
                      placeholder="Gate code, access instructions, special notes... (optional)"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !editDay || !editWindow}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                    {isSaving ? "Saving Changes..." : "Save Preferences"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Service Property card */}
          {activeSub && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Service Property
                </span>
              </div>
              <h4 className="text-sm font-bold leading-snug text-white">
                {activeSub.property?.street ?? "Address pending"}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500">
                {activeSub.property
                  ? `${activeSub.property.city}, ${activeSub.property.state} ${activeSub.property.zipCode}`
                  : "Link an address to continue scheduling"}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Area
                </span>
                <span className="text-xs font-bold text-white">
                  {activeSub.property
                    ? `${activeSub.property.sqFt.toLocaleString()} sq ft`
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
