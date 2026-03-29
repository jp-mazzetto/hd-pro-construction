import { useCallback, useState } from "react";

import useZipCodeAutofill from "./useZipCodeAutofill";

export interface PropertyFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: string;
  notes: string;
}

export const INITIAL_PROPERTY_FORM: PropertyFormData = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  sqFt: "",
  notes: "",
};

export default function usePropertyForm() {
  const [form, setForm] = useState<PropertyFormData>(INITIAL_PROPERTY_FORM);

  const updateField = useCallback((field: keyof PropertyFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const {
    zipLookupMessage,
    onZipCodeBlur,
    markCityAsManual,
    markStateAsManual,
  } = useZipCodeAutofill({
    zipCode: form.zipCode,
    city: form.city,
    state: form.state,
    onCityResolved: (city) => updateField("city", city),
    onStateResolved: (state) => updateField("state", state),
  });

  const handleFieldChange = useCallback(
    (field: keyof PropertyFormData, value: string) => {
      if (field === "city") {
        markCityAsManual();
        updateField("city", value);
        return;
      }

      if (field === "state") {
        markStateAsManual();
        updateField("state", value.toUpperCase().slice(0, 2));
        return;
      }

      updateField(field, value);
    },
    [markCityAsManual, markStateAsManual, updateField],
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_PROPERTY_FORM);
  }, []);

  return {
    form,
    setForm,
    resetForm,
    handleFieldChange,
    zipLookupMessage,
    onZipCodeBlur,
  };
}
