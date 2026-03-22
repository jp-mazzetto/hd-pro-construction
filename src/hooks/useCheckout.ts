import { useCallback, useEffect, useState } from "react";

import type { SubscriptionPlan } from "../types/lib";
import {
  createCheckoutForSubscription,
  createPropertyForCheckout,
  findPlanByTier,
  getCheckoutErrorMessage,
  getSubscriptionPlans,
  normalizePlanTier,
} from "../lib/checkout-service";

/**
 * Property form data structure
 */
export interface PropertyFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  sqFt: string;
  notes: string;
}

/**
 * Initial empty form state
 */
export const INITIAL_FORM_DATA: PropertyFormData = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  sqFt: "",
  notes: "",
};

/**
 * Field validation errors
 */
export interface FieldErrors {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  sqFt?: string;
  notes?: string;
}

/**
 * Checkout hook return type
 */
export interface UseCheckoutReturn {
  // Form state
  form: PropertyFormData;
  fieldErrors: FieldErrors;
  updateField: (field: keyof PropertyFormData, value: string) => void;

  // Plan state
  dbPlan: SubscriptionPlan | null;
  isLoadingPlan: boolean;
  planNotFound: boolean;

  // Submission state
  isSubmitting: boolean;
  error: string | null;

  // Actions
  validate: () => FieldErrors;
  handleSubmit: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for checkout form logic.
 * Handles form state, validation, plan loading, and submission.
 *
 * @param planTier - The tier string from URL parameter
 * @returns Checkout state and actions
 */
export const useCheckout = (planTier: string): UseCheckoutReturn => {
  const normalizedTier = normalizePlanTier(planTier);

  // Form state
  const [form, setForm] = useState<PropertyFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Plan state
  const [dbPlan, setDbPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planNotFound, setPlanNotFound] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load plan on mount
  useEffect(() => {
    let cancelled = false;

    const loadPlans = async () => {
      try {
        const plans = await getSubscriptionPlans();
        if (cancelled) return;

        const match = findPlanByTier(plans, normalizedTier);
        if (match) {
          setDbPlan(match);
        } else {
          setPlanNotFound(true);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load plan details. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoadingPlan(false);
      }
    };

    void loadPlans();
    return () => {
      cancelled = true;
    };
  }, [normalizedTier]);

  /**
   * Validates the form data and returns field errors.
   */
  const validate = useCallback((): FieldErrors => {
    const errors: FieldErrors = {};

    if (form.street.trim().length < 3) {
      errors.street = "Street must be at least 3 characters.";
    }
    if (form.city.trim().length < 2) {
      errors.city = "City must be at least 2 characters.";
    }
    if (form.state.trim().length !== 2) {
      errors.state = "State must be exactly 2 characters (e.g., MA).";
    }
    if (!/^\d{5}(-\d{4})?$/.test(form.zipCode.trim())) {
      errors.zipCode = "Enter a valid zip code (e.g., 02101 or 02101-1234).";
    }

    const sqFt = Number(form.sqFt);
    if (!form.sqFt || Number.isNaN(sqFt) || sqFt < 100 || sqFt > 50_000) {
      errors.sqFt = "Property size must be between 100 and 50,000 sq ft.";
    }

    if (form.notes.trim().length > 500) {
      errors.notes = "Notes must be 500 characters or less.";
    }

    return errors;
  }, [form]);

  /**
   * Updates a single form field and clears its error.
   */
  const updateField = useCallback(
    (field: keyof PropertyFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [fieldErrors],
  );

  /**
   * Clears the general error message.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handles form submission - validates, creates property, and initiates checkout.
   */
  const handleSubmit = useCallback(async () => {
    setError(null);
    setFieldErrors({});

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!dbPlan) {
      setError("Plan not loaded yet. Please wait.");
      return;
    }

    setIsSubmitting(true);

    try {
      const property = await createPropertyForCheckout({
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim().toUpperCase(),
        zipCode: form.zipCode.trim(),
        sqFt: Number(form.sqFt),
        notes: form.notes.trim() || undefined,
      });

      const checkout = await createCheckoutForSubscription(
        dbPlan.id,
        property.id,
      );

      window.location.href = checkout.checkoutUrl;
    } catch (err) {
      setError(getCheckoutErrorMessage(err));
      setIsSubmitting(false);
    }
  }, [dbPlan, form, validate]);

  return {
    form,
    fieldErrors,
    updateField,
    dbPlan,
    isLoadingPlan,
    planNotFound,
    isSubmitting,
    error,
    validate,
    handleSubmit,
    clearError,
  };
};
