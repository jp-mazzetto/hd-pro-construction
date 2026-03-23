import { Loader2, Lock, MapPin } from "lucide-react";
import type { FormEvent } from "react";

import type { PropertyFormData, FieldErrors } from "../../hooks/useCheckout";

interface CheckoutFormProps {
    form: PropertyFormData;
    fieldErrors: FieldErrors;
    isSubmitting: boolean;
    isLoadingPlan: boolean;
    isPlanLoaded: boolean;
    onUpdateField: (field: keyof PropertyFormData, value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const INPUT_BASE_CLASSES =
    "w-full rounded-2xl border bg-white/3 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:bg-black/30 focus:ring-2 focus:ring-orange-500/20";

const getInputClass = (hasError: boolean, centered = false) =>
    `${INPUT_BASE_CLASSES} ${centered ? "text-center uppercase" : ""} ${hasError
        ? "border-red-400/65 focus:border-red-400 focus:ring-red-500/20"
        : "border-white/15"
    }`;

export const CheckoutForm = ({
    form,
    fieldErrors,
    isSubmitting,
    isLoadingPlan,
    isPlanLoaded,
    onUpdateField,
    onSubmit,
}: CheckoutFormProps) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(event);
    };

    const handleFieldChange = (field: keyof PropertyFormData, value: string) => {
        // Special handling for state - auto uppercase and limit to 2 chars
        if (field === "state") {
            onUpdateField(field, value.toUpperCase().slice(0, 2));
        } else {
            onUpdateField(field, value);
        }
    };

    return (
        <section className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/25 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_32%),linear-gradient(160deg,rgba(255,255,255,0.05),transparent_50%)]" />

                <div className="relative mb-8 flex items-center gap-3">
                    <div className="rounded-2xl border border-orange-400/25 bg-orange-500/15 p-3 text-orange-300">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-200">
                            Property details
                        </p>
                        <h2 className="font-['Bebas_Neue'] text-3xl tracking-[0.06em] text-white">
                            Service address
                        </h2>
                    </div>
                </div>

                <form className="relative space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                            Street address
                        </span>
                        <input
                            type="text"
                            value={form.street}
                            onChange={(e) => handleFieldChange("street", e.target.value)}
                            className={getInputClass(Boolean(fieldErrors.street))}
                            placeholder="123 Main Street"
                            required
                        />
                        {fieldErrors.street && (
                            <p className="mt-1.5 text-xs text-red-300">{fieldErrors.street}</p>
                        )}
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
                        <label className="block">
                            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                                City
                            </span>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => handleFieldChange("city", e.target.value)}
                                className={getInputClass(Boolean(fieldErrors.city))}
                                placeholder="Boston"
                                required
                            />
                            {fieldErrors.city && (
                                <p className="mt-1.5 text-xs text-red-300">{fieldErrors.city}</p>
                            )}
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                                State
                            </span>
                            <input
                                type="text"
                                value={form.state}
                                onChange={(e) => handleFieldChange("state", e.target.value)}
                                className={getInputClass(Boolean(fieldErrors.state), true)}
                                placeholder="MA"
                                maxLength={2}
                                required
                            />
                            {fieldErrors.state && (
                                <p className="mt-1.5 text-xs text-red-300">{fieldErrors.state}</p>
                            )}
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                                Zip code
                            </span>
                            <input
                                type="text"
                                value={form.zipCode}
                                onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                                className={getInputClass(Boolean(fieldErrors.zipCode))}
                                placeholder="02101"
                                required
                            />
                            {fieldErrors.zipCode && (
                                <p className="mt-1.5 text-xs text-red-300">{fieldErrors.zipCode}</p>
                            )}
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                                Property size (sq ft)
                            </span>
                            <input
                                type="number"
                                value={form.sqFt}
                                onChange={(e) => handleFieldChange("sqFt", e.target.value)}
                                className={getInputClass(Boolean(fieldErrors.sqFt))}
                                placeholder="3000"
                                min={100}
                                max={50000}
                                required
                            />
                            {fieldErrors.sqFt && (
                                <p className="mt-1.5 text-xs text-red-300">{fieldErrors.sqFt}</p>
                            )}
                        </label>
                    </div>

                    <label className="block">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-gray-400">
                                Additional notes
                                <span className="ml-1 font-medium normal-case tracking-normal text-gray-500">
                                    (optional)
                                </span>
                            </span>
                            <span className="text-xs text-gray-500">{form.notes.length}/500</span>
                        </div>
                        <textarea
                            value={form.notes}
                            onChange={(e) => handleFieldChange("notes", e.target.value)}
                            className={`${getInputClass(Boolean(fieldErrors.notes))} min-h-28 resize-none`}
                            placeholder="Gate code, preferred service window, access details..."
                            rows={3}
                            maxLength={500}
                        />
                        {fieldErrors.notes && (
                            <p className="mt-1.5 text-xs text-red-300">{fieldErrors.notes}</p>
                        )}
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingPlan || !isPlanLoaded}
                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-orange-400 px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white shadow-xl shadow-orange-900/35 transition-all hover:from-orange-400 hover:to-orange-300 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : isLoadingPlan ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Loading plan...
                            </>
                        ) : (
                            "Proceed to payment"
                        )}
                    </button>

                    <p className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <Lock size={12} />
                        Secure checkout powered by Stripe
                    </p>
                </form>
            </div>
        </section>
    );
};
