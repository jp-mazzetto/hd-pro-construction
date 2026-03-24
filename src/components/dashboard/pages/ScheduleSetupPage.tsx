import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check } from "lucide-react";

import type {
  DashboardSection,
  DayOfWeek,
  TimeWindow,
  ScheduleWithVisits,
} from "../../../types/dashboard";
import type { UserSubscription } from "../../../types/lib";
import {
  createSchedulePreference,
  fetchSubscription,
  fetchSchedule,
} from "../../../lib/dashboard-client";

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "MONDAY", label: "Monday", short: "Mon" },
  { value: "TUESDAY", label: "Tuesday", short: "Tue" },
  { value: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { value: "THURSDAY", label: "Thursday", short: "Thu" },
  { value: "FRIDAY", label: "Friday", short: "Fri" },
  { value: "SATURDAY", label: "Saturday", short: "Sat" },
];

const TIME_WINDOWS: { value: TimeWindow; label: string; description: string }[] = [
  { value: "MORNING", label: "Morning", description: "7:00 AM – 11:00 AM" },
  { value: "MIDDAY", label: "Midday", description: "11:00 AM – 2:00 PM" },
  { value: "AFTERNOON", label: "Afternoon", description: "2:00 PM – 6:00 PM" },
];

interface ScheduleSetupPageProps {
  subscriptionId: string;
  onNavigate: (section: DashboardSection, params?: Record<string, string>) => void;
}

export default function ScheduleSetupPage({
  subscriptionId,
  onNavigate,
}: ScheduleSetupPageProps) {
  const [sub, setSub] = useState<UserSubscription | null>(null);
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<TimeWindow | null>(null);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<ScheduleWithVisits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchSubscription(subscriptionId);
        if (cancelled) return;
        setSub(data);

        // Try to load existing schedule to pre-fill
        try {
          const schedule = await fetchSchedule(subscriptionId);
          if (cancelled) return;
          if (schedule?.preference) {
            setSelectedDay(schedule.preference.preferredDay as DayOfWeek);
            setSelectedWindow(schedule.preference.preferredWindow as TimeWindow);
            setNotes(schedule.preference.notes ?? "");
          }
        } catch {
          // No existing schedule — that's fine
        }
      } catch {
        if (!cancelled) setError("Failed to load subscription.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [subscriptionId]);

  const handleSubmit = useCallback(async () => {
    if (!selectedDay || !selectedWindow) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await createSchedulePreference(subscriptionId, {
        preferredDay: selectedDay,
        preferredWindow: selectedWindow,
        notes: notes.trim() || undefined,
      });
      setResult(data);
      setStep(4);
    } catch {
      setError("Failed to create schedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [subscriptionId, selectedDay, selectedWindow, notes]);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-900" />;
  }

  if (error && !result) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => onNavigate("subscriptions")}
          className="text-sm font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
        >
          Back to plans
        </button>
      </div>
    );
  }

  // Confirmation step
  if (step === 4 && result) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <Check size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white">Schedule Set!</h2>
        <p className="text-sm text-slate-400">
          Your {sub?.plan.name} visits are scheduled every{" "}
          {DAYS.find((d) => d.value === result.preference.preferredDay)?.label},{" "}
          {TIME_WINDOWS.find((w) => w.value === result.preference.preferredWindow)?.description}.
        </p>

        {result.visits.length > 0 && (
          <div className="mx-auto max-w-sm space-y-2 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Visits
            </h3>
            {result.visits.slice(0, 4).map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5"
              >
                <span className="text-sm font-semibold text-white">
                  {new Date(visit.scheduledDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-slate-400">
                  {TIME_WINDOWS.find((w) => w.value === visit.timeWindow)?.description}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate("schedule")}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
        >
          View Full Schedule <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 w-12 rounded-full transition-colors ${
              s <= step ? "bg-orange-500" : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="text-center">
        <div className="mb-2 flex justify-center">
          <CalendarDays size={24} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-black text-white">
          {step === 1 && "Choose Your Preferred Day"}
          {step === 2 && "Pick a Time Window"}
          {step === 3 && "Any Special Instructions?"}
        </h2>
        {sub && (
          <p className="mt-1 text-sm text-slate-400">
            {sub.plan.name} &middot; {sub.plan.visitsPerMonth} visits/month
          </p>
        )}
      </div>

      {/* Step 1: Day selection */}
      {step === 1 && (
        <div className="grid grid-cols-3 gap-3">
          {DAYS.map(({ value, label, short }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelectedDay(value);
                setStep(2);
              }}
              className={`rounded-xl border p-4 text-center transition-all cursor-pointer ${
                selectedDay === value
                  ? "border-orange-500 bg-orange-500/10 text-orange-400"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="text-lg font-black">{short}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Time window */}
      {step === 2 && (
        <div className="space-y-3">
          {TIME_WINDOWS.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelectedWindow(value);
                setStep(3);
              }}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                selectedWindow === value
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="text-base font-bold text-white">{label}</div>
                <div className="text-sm text-slate-400">{description}</div>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={14} /> Change day
          </button>
        </div>
      )}

      {/* Step 3: Notes + confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-3 text-sm text-slate-400">
              <span className="font-semibold text-white">
                {DAYS.find((d) => d.value === selectedDay)?.label}
              </span>{" "}
              &middot;{" "}
              <span className="font-semibold text-white">
                {TIME_WINDOWS.find((w) => w.value === selectedWindow)?.description}
              </span>
            </div>
            <textarea
              placeholder="Gate code, pet info, special access instructions... (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Setting up..." : "Confirm Schedule"}
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
