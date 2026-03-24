import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Pencil,
  RefreshCw,
  Save,
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
          fetchVisits().catch(() => []),
          fetchSubscriptions().catch(() => []),
        ]);
        if (cancelled) return;

        setVisits(visitsData);
        const active = subsData.filter((s) => s.status === "ACTIVE");
        setActiveSubs(active);

        // Load schedule preference for first active subscription
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

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-900" />;
  }

  if (error && visits.length === 0 && !preference) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (visits.length === 0 && !preference) {
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

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400">
          <Check size={16} />
          Schedule preferences updated successfully.
        </div>
      )}

      {/* Schedule Preferences Panel */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Schedule Preferences</h3>
          {!isEditing ? (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-orange-400 hover:bg-orange-500/10 cursor-pointer"
            >
              <Pencil size={14} />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !editDay || !editWindow}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          /* Display mode */
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Preferred Day
              </div>
              <div className="text-sm font-semibold text-white">
                {DAYS.find((d) => d.value === preference?.preferredDay)?.label ?? "—"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Time Window
              </div>
              <div className="text-sm font-semibold text-white">
                {TIME_WINDOW_LABELS[preference?.preferredWindow ?? ""] ?? "—"}
              </div>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Notes
              </div>
              <div className="text-sm text-slate-300">
                {preference?.notes || "No special instructions"}
              </div>
            </div>
          </div>
        ) : (
          /* Edit mode */
          <div className="space-y-5">
            {/* Day selection */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Preferred Day
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {DAYS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditDay(value)}
                    className={`rounded-lg border px-3 py-2.5 text-center text-sm font-semibold transition-all cursor-pointer ${
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
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Time Window
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {TIME_WINDOWS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditWindow(value)}
                    className={`rounded-lg border px-4 py-3 text-left transition-all cursor-pointer ${
                      editWindow === value
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{label}</div>
                    <div className="text-xs text-slate-400">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Special Instructions
              </label>
              <textarea
                placeholder="Gate code, pet info, special access instructions... (optional)"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Upcoming visits list */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
          Upcoming Visits ({upcomingVisits.length})
        </h2>
        <div className="space-y-2">
          {upcomingVisits.map((visit) => {
            const visitDate = new Date(visit.scheduledDate);
            const canEdit = isThisWeek(visitDate);

            return (
              <div key={visit.id} className="rounded-xl border border-slate-800 bg-slate-900">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {visitDate.toLocaleDateString("en-US", {
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
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          rescheduleId === visit.id
                            ? cancelReschedule()
                            : startReschedule(visit)
                        }
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer"
                        title="Reschedule visit"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
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

                {/* Inline reschedule form */}
                {rescheduleId === visit.id && (
                  <div className="border-t border-slate-800 px-4 py-3">
                    <div className="flex flex-wrap items-end gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                          New Date
                        </label>
                        <input
                          type="date"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
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
            <p className="py-8 text-center text-sm text-slate-500">
              No upcoming visits scheduled.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
