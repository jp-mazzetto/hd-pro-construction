import { useCallback, useEffect, useState } from "react";
import { MapPin, Plus, Trash2, X } from "lucide-react";

import type { Property } from "../../../types/lib";
import {
  fetchProperties,
  createProperty,
  deleteProperty,
} from "../../../lib/dashboard-client";
import EmptyState from "../shared/EmptyState";

interface PropertyFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: string;
  notes: string;
}

const INITIAL_FORM: PropertyFormData = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  sqFt: "",
  notes: "",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PropertyFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch {
      setError("Failed to load properties.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        await createProperty({
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim().toUpperCase(),
          zipCode: form.zipCode.trim(),
          sqFt: Number(form.sqFt),
          notes: form.notes.trim() || undefined,
        });
        setForm(INITIAL_FORM);
        setShowForm(false);
        await loadProperties();
      } catch {
        setError("Failed to create property.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, loadProperties],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch {
        setError("Failed to delete property. It may have an active subscription.");
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  const updateField = (field: keyof PropertyFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`sk-${i}`} className="h-24 animate-pulse rounded-xl bg-slate-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Add button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Property"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            New Property
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Street address"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              required
              minLength={3}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              required
              minLength={2}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="State (e.g. MA)"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              required
              maxLength={2}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={form.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              required
              pattern="^\d{5}(-\d{4})?$"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Property size (sq ft)"
              value={form.sqFt}
              onChange={(e) => updateField("sqFt", e.target.value)}
              required
              min={100}
              max={50000}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              maxLength={500}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Property"}
          </button>
        </form>
      )}

      {/* Property list */}
      {properties.length === 0 && !showForm ? (
        <EmptyState
          icon={<MapPin size={28} />}
          title="No Properties"
          description="Add a property to associate with your lawn maintenance plan."
          action={
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer"
            >
              <Plus size={16} /> Add Property
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <div>
                <div className="text-sm font-bold text-white">
                  {prop.street}
                </div>
                <div className="text-xs text-slate-400">
                  {prop.city}, {prop.state} {prop.zipCode} &middot;{" "}
                  {prop.sqFt.toLocaleString()} sq ft
                </div>
                {prop.notes && (
                  <div className="mt-1 text-xs text-slate-500">{prop.notes}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(prop.id)}
                disabled={deletingId === prop.id}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                title="Delete property"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
