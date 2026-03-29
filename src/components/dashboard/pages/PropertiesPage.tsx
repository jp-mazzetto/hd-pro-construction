import { useCallback, useEffect, useState } from "react";
import { MapPin, Navigation, Plus, Trash2, X } from "lucide-react";

import type { Property } from "../../../types/lib";
import {
  fetchProperties,
  createProperty,
  deleteProperty,
} from "../../../lib/dashboard-client";
import usePropertyForm from "../../../hooks/usePropertyForm";
import EmptyState from "../shared/EmptyState";
import PropertyFormFields from "../../properties/PropertyFormFields";

// ── Map panel ──────────────────────────────────────────────────────────────────
function PropertyMapPanel({ prop }: { prop: Property }) {
  const fullAddress = `${prop.street}, ${prop.city}, ${prop.state} ${prop.zipCode}`;
  const embeddedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress,
  )}&z=15&output=embed`;
  const openMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress,
  )}`;

  return (
    <div
      className="relative h-48 w-full grow overflow-hidden md:h-auto"
      style={{ backgroundColor: "#060e20", minHeight: "180px" }}
    >
      <iframe
        key={prop.id}
        title={`Map for ${fullAddress}`}
        src={embeddedMapUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Left fade — blend with details panel */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: "linear-gradient(to right, #171f33 0%, transparent 26%)",
        }}
      />
      {/* Top fade — mobile */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: "linear-gradient(to bottom, #171f33 0%, transparent 30%)",
        }}
      />
      {/* Centered orange glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.20) 0%, transparent 58%)",
        }}
      />

      {/* Location pin — centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div
          className="absolute h-20 w-20 animate-ping rounded-full"
          style={{ backgroundColor: "rgba(249,115,22,0.08)", animationDuration: "2s" }}
        />
        <div
          className="absolute h-12 w-12 rounded-full"
          style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
        />
        <MapPin
          size={36}
          className="relative z-10"
          style={{
            color: "#ffb690",
            filter: "drop-shadow(0 0 10px rgba(249,115,22,0.7))",
            fill: "rgba(249,115,22,0.35)",
          }}
        />
        <Navigation
          size={13}
          className="absolute -right-1.5 -top-1.5 z-20 rounded-full p-0.5 text-slate-900"
          style={{ backgroundColor: "#ffb690" }}
        />
      </div>

      {/* Coordinate badge */}
      <div
        className="absolute bottom-3 right-3 rounded px-2.5 py-1 text-[10px] font-mono tracking-tight text-slate-300"
        style={{ backgroundColor: "rgba(45,52,73,0.90)", backdropFilter: "blur(4px)" }}
      >
        {prop.zipCode} · {prop.state}
      </div>

      <a
        href={openMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-slate-900/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-100 transition-colors hover:bg-slate-800/90"
      >
        <Navigation size={11} />
        Open Map
      </a>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    form,
    resetForm,
    handleFieldChange,
    zipLookupMessage,
    onZipCodeBlur,
  } = usePropertyForm();

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
        resetForm();
        setShowForm(false);
        await loadProperties();
      } catch {
        setError("Failed to create property.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, loadProperties, resetForm],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch {
        setError("Failed to delete property. It may be linked to a plan.");
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`sk-${i}`}
            className="h-48 animate-pulse rounded-xl"
            style={{ backgroundColor: "#171f33" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-['Manrope'] text-3xl font-extrabold tracking-tight text-white">
            My Properties
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage the properties linked to your maintenance plans.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 cursor-pointer transition-colors self-start sm:self-auto"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Property"}
        </button>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Add property form ─────────────────────────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border p-6 space-y-4"
          style={{ backgroundColor: "#171f33", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <h3 className="font-['Manrope'] text-base font-bold text-white">
            New Property
          </h3>
          <PropertyFormFields
            form={form}
            onFieldChange={handleFieldChange}
            onZipCodeBlur={onZipCodeBlur}
            zipLookupMessage={zipLookupMessage}
            sqFtPlaceholder="Property size (sq ft)"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Property"}
          </button>
        </form>
      )}

      {/* ── Property list ─────────────────────────────────────────────────── */}
      {properties.length === 0 && !showForm ? (
        <EmptyState
          icon={<MapPin size={32} />}
          title="No Properties Yet"
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
        <div className="space-y-5">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="group overflow-hidden rounded-xl border-l-4 border-[#ffb690] shadow-lg transition-colors duration-300"
              style={{ backgroundColor: "#171f33" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#222a3d")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#171f33")
              }
            >
              <div className="flex flex-col md:flex-row">
                {/* ── Details ─────────────────────────────────────────── */}
                <div className="flex w-full shrink-0 flex-col justify-between p-6 md:w-80">
                  <div>
                    {/* Address heading */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-['Manrope'] text-xl font-bold text-white transition-colors group-hover:text-[#ffb690]">
                          {prop.street}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                          <MapPin size={12} className="shrink-0" />
                          {prop.city}, {prop.state} {prop.zipCode}
                        </div>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Square Footage
                        </span>
                        <p className="font-['Manrope'] mt-0.5 font-bold text-white">
                          {prop.sqFt.toLocaleString()} sq ft
                        </p>
                      </div>
                      {prop.notes && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Notes
                          </span>
                          <p className="mt-0.5 text-sm text-slate-400 line-clamp-2">
                            {prop.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(prop.id)}
                      disabled={deletingId === prop.id}
                      className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 cursor-pointer"
                      title="Delete property"
                    >
                      <Trash2 size={14} />
                      {deletingId === prop.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* ── Map panel ───────────────────────────────────────── */}
                <PropertyMapPanel prop={prop} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
