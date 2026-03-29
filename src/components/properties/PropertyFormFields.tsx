import type { PropertyFormData } from "../../hooks/usePropertyForm";

interface PropertyFormFieldsProps {
  form: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: string) => void;
  onZipCodeBlur: () => void;
  zipLookupMessage: string | null;
  sqFtPlaceholder?: string;
}

const INPUT_CLASS_NAME =
  "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none";

export default function PropertyFormFields({
  form,
  onFieldChange,
  onZipCodeBlur,
  zipLookupMessage,
  sqFtPlaceholder = "Property size (sq ft)",
}: PropertyFormFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        type="text"
        placeholder="Street address"
        value={form.street}
        onChange={(e) => onFieldChange("street", e.target.value)}
        required
        minLength={3}
        className={INPUT_CLASS_NAME}
      />
      <input
        type="text"
        placeholder="City"
        value={form.city}
        onChange={(e) => onFieldChange("city", e.target.value)}
        required
        minLength={2}
        className={INPUT_CLASS_NAME}
      />
      <input
        type="text"
        placeholder="State (e.g. MA)"
        value={form.state}
        onChange={(e) => onFieldChange("state", e.target.value)}
        required
        maxLength={2}
        className={INPUT_CLASS_NAME}
      />
      <div>
        <input
          type="text"
          placeholder="Zip Code"
          value={form.zipCode}
          onChange={(e) => onFieldChange("zipCode", e.target.value)}
          onBlur={onZipCodeBlur}
          required
          pattern="^\\d{5}(-\\d{4})?$"
          className={`w-full ${INPUT_CLASS_NAME}`}
        />
        {zipLookupMessage && (
          <p className="mt-1.5 text-xs text-amber-300">{zipLookupMessage}</p>
        )}
      </div>
      <input
        type="number"
        placeholder={sqFtPlaceholder}
        value={form.sqFt}
        onChange={(e) => onFieldChange("sqFt", e.target.value)}
        required
        min={100}
        max={50000}
        className={INPUT_CLASS_NAME}
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => onFieldChange("notes", e.target.value)}
        maxLength={500}
        className={INPUT_CLASS_NAME}
      />
    </div>
  );
}
