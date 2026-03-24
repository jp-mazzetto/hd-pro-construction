import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  SkipForward,
  StickyNote,
  MapPin,
  User,
  Clock,
  Printer,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";

import type {
  AdminCalendarDay,
  AdminCalendarResponse,
  AdminCalendarVisit,
} from "../../../types/admin";
import {
  fetchVisitCalendar,
  completeVisit,
  skipVisit,
  updateVisitNotes,
} from "../../../lib/admin-client";
import StatusBadge from "../../dashboard/shared/StatusBadge";

const TIME_WINDOW_LABELS: Record<string, { label: string; icon: typeof Sun }> = {
  MORNING: { label: "Morning (7–11 AM)", icon: Sunrise },
  MIDDAY: { label: "Midday (11 AM–2 PM)", icon: Sun },
  AFTERNOON: { label: "Afternoon (2–6 PM)", icon: Sunset },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

export default function VisitCalendarPage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [calendar, setCalendar] = useState<AdminCalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notesModal, setNotesModal] = useState<{ visitId: string; current: string } | null>(null);
  const [notesText, setNotesText] = useState("");

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5);

  const loadCalendar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVisitCalendar({
        from: toDateStr(weekStart),
        to: toDateStr(weekEnd),
      });
      setCalendar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load calendar");
    } finally {
      setIsLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    void loadCalendar();
  }, [loadCalendar]);

  const navigateWeek = (delta: number) => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  };

  const goToday = () => setWeekStart(getMonday(new Date()));

  const handleComplete = async (id: string) => {
    try {
      await completeVisit(id);
      void loadCalendar();
    } catch {}
  };

  const handleSkip = async (id: string) => {
    try {
      await skipVisit(id);
      void loadCalendar();
    } catch {}
  };

  const handleSaveNotes = async () => {
    if (!notesModal) return;
    try {
      await updateVisitNotes(notesModal.visitId, notesText);
      setNotesModal(null);
      void loadCalendar();
    } catch {}
  };

  const openNotesModal = (visit: AdminCalendarVisit) => {
    setNotesModal({ visitId: visit.id, current: visit.adminNotes ?? "" });
    setNotesText(visit.adminNotes ?? "");
  };

  const weekLabel = `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(weekStart)} – ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(weekEnd)}`;

  const isCurrentWeek =
    toDateStr(getMonday(new Date())) === toDateStr(weekStart);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 text-orange-300">
            <CalendarDays size={22} />
          </div>
          <div>
            <h2 className="font-['Bebas_Neue'] text-3xl uppercase tracking-[0.1em] text-white">
              Visit Calendar
            </h2>
            <p className="text-xs text-slate-400">
              Schedule overview with addresses
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="hidden items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 cursor-pointer print:hidden sm:flex"
        >
          <Printer size={14} />
          Print
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 print:border-none print:bg-transparent print:px-0">
        <button
          type="button"
          onClick={() => navigateWeek(-1)}
          className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-slate-500 hover:bg-slate-800 cursor-pointer print:hidden"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            {weekLabel}
          </span>
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300 hover:bg-orange-500/20 cursor-pointer print:hidden"
            >
              Today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigateWeek(1)}
          className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-slate-500 hover:bg-slate-800 cursor-pointer print:hidden"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary */}
      {calendar && !isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4">
          <SummaryCard
            label="Total Visits"
            value={calendar.summary.totalVisits}
          />
          <SummaryCard
            label="Morning"
            value={calendar.summary.byTimeWindow.MORNING ?? 0}
          />
          <SummaryCard
            label="Midday"
            value={calendar.summary.byTimeWindow.MIDDAY ?? 0}
          />
          <SummaryCard
            label="Afternoon"
            value={calendar.summary.byTimeWindow.AFTERNOON ?? 0}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-400" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Calendar days */}
      {calendar && !isLoading && (
        <div className="space-y-4">
          {calendar.days.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 py-16 text-center">
              <CalendarDays size={40} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">
                No visits scheduled this week
              </p>
            </div>
          ) : (
            calendar.days.map((day) => (
              <DayCard
                key={day.date}
                day={day}
                onComplete={handleComplete}
                onSkip={handleSkip}
                onOpenNotes={openNotesModal}
              />
            ))
          )}
        </div>
      )}

      {/* Notes modal */}
      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 print:hidden">
          <div className="mx-4 w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Admin Notes
            </h3>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500/50 focus:outline-none"
              rows={4}
              placeholder="Add notes about this visit..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNotesModal(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSaveNotes()}
                className="rounded-lg border border-orange-500/40 bg-orange-500/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-300 hover:bg-orange-500/25 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="dashboard-stat-card rounded-xl border border-slate-800 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function DayCard({
  day,
  onComplete,
  onSkip,
  onOpenNotes,
}: {
  day: AdminCalendarDay;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onOpenNotes: (visit: AdminCalendarVisit) => void;
}) {
  const timeWindows = ["MORNING", "MIDDAY", "AFTERNOON"] as const;
  const grouped = Object.fromEntries(
    timeWindows.map((tw) => [tw, day.visits.filter((v) => v.timeWindow === tw)]),
  );

  const isToday = toDateStr(new Date()) === day.date;

  return (
    <div
      className={`rounded-xl border bg-slate-900/50 ${
        isToday
          ? "border-orange-500/40 shadow-[0_0_24px_rgba(249,115,22,0.12)]"
          : "border-slate-800"
      }`}
    >
      {/* Day header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
            {formatDate(day.date)}
          </h3>
          {isToday && (
            <span className="rounded-full border border-orange-500/40 bg-orange-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-orange-300">
              Today
            </span>
          )}
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300">
          {day.visits.length} visit{day.visits.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Time window groups */}
      <div className="divide-y divide-slate-800/60 px-5 py-3">
        {timeWindows.map((tw) => {
          const visits = grouped[tw];
          if (visits.length === 0) return null;

          const meta = TIME_WINDOW_LABELS[tw];
          const Icon = meta.icon;

          return (
            <div key={tw} className="py-3 first:pt-0 last:pb-0">
              <div className="mb-2.5 flex items-center gap-2">
                <Icon size={14} className="text-orange-400/70" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {meta.label}
                </span>
              </div>

              <div className="space-y-2.5">
                {visits.map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    onComplete={() => onComplete(visit.id)}
                    onSkip={() => onSkip(visit.id)}
                    onOpenNotes={() => onOpenNotes(visit)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VisitCard({
  visit,
  onComplete,
  onSkip,
  onOpenNotes,
}: {
  visit: AdminCalendarVisit;
  onComplete: () => void;
  onSkip: () => void;
  onOpenNotes: () => void;
}) {
  const isActionable = visit.status === "SCHEDULED";

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Address — prominent */}
          <div className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-orange-400" />
            <div>
              <p className="text-sm font-bold text-white">
                {visit.property.street}
              </p>
              <p className="text-xs text-slate-400">
                {visit.property.city}, {visit.property.state}{" "}
                {visit.property.zipCode}
              </p>
            </div>
          </div>

          {/* Customer + plan */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {visit.customer.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {visit.subscription.planName}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              {visit.property.sqFt.toLocaleString()} sq ft
            </span>
          </div>

          {/* Admin notes */}
          {visit.adminNotes && (
            <p className="rounded-md border border-slate-700/50 bg-slate-800/50 px-2.5 py-1.5 text-xs text-slate-300 italic">
              {visit.adminNotes}
            </p>
          )}
        </div>

        {/* Status + actions */}
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={visit.status} />

          {isActionable && (
            <div className="flex gap-1 print:hidden">
              <button
                type="button"
                onClick={onComplete}
                title="Complete"
                className="rounded-lg border border-emerald-500/30 p-1.5 text-emerald-400 hover:bg-emerald-500/15 cursor-pointer"
              >
                <CheckCircle2 size={15} />
              </button>
              <button
                type="button"
                onClick={onSkip}
                title="Skip"
                className="rounded-lg border border-slate-600 p-1.5 text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                <SkipForward size={15} />
              </button>
              <button
                type="button"
                onClick={onOpenNotes}
                title="Notes"
                className="rounded-lg border border-slate-600 p-1.5 text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                <StickyNote size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
