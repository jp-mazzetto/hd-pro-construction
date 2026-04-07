import { useCallback, useEffect, useState } from "react";

import type { SubscriptionPlan } from "../types/lib";
import { ApiError } from "../lib/auth-client";
import {
	createCheckoutForSubscription,
	createPropertyForCheckout,
	findPlanByTier,
	getCheckoutErrorMessage,
	getSubscriptionPlans,
	normalizePlanTier,
} from "../lib/checkout-service";

export interface PropertyFormData {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	sqFt: string;
	notes: string;
}

export const INITIAL_FORM_DATA: PropertyFormData = {
	street: "",
	city: "",
	state: "",
	zipCode: "",
	sqFt: "",
	notes: "",
};

export interface FieldErrors {
	street?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	sqFt?: string;
	notes?: string;
}

export interface UseCheckoutReturn {
	form: PropertyFormData;
	fieldErrors: FieldErrors;
	updateField: (field: keyof PropertyFormData, value: string) => void;
	dbPlan: SubscriptionPlan | null;
	isLoadingPlan: boolean;
	planNotFound: boolean;
	isSubmitting: boolean;
	error: string | null;
	handleSubmitWithAddress: () => Promise<void>;
	handleSubmitWithoutAddress: () => Promise<void>;
}

export const useCheckout = (planTier: string): UseCheckoutReturn => {
	const normalizedTier = normalizePlanTier(planTier);

	const [form, setForm] = useState<PropertyFormData>(INITIAL_FORM_DATA);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [dbPlan, setDbPlan] = useState<SubscriptionPlan | null>(null);
	const [isLoadingPlan, setIsLoadingPlan] = useState(true);
	const [planNotFound, setPlanNotFound] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setIsLoadingPlan(true);
		setPlanNotFound(false);
		setDbPlan(null);
		setError(null);

		if (!normalizedTier) {
			setPlanNotFound(true);
			setIsLoadingPlan(false);
			return () => {
				cancelled = true;
			};
		}

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
				if (!cancelled) {
					setIsLoadingPlan(false);
				}
			}
		};

		void loadPlans();
		return () => {
			cancelled = true;
		};
	}, [normalizedTier]);

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

	const createCheckout = useCallback(
		async (propertyId?: string) => {
			if (!dbPlan) {
				setError("Plan not loaded yet. Please wait.");
				return;
			}

			const checkout = await createCheckoutForSubscription(dbPlan.id, propertyId);
			sessionStorage.setItem("latestCheckoutSubscriptionId", checkout.subscriptionId);
			sessionStorage.setItem(
				"latestCheckoutSubscriptionHasProperty",
				propertyId ? "1" : "0",
			);
			window.location.href = checkout.checkoutUrl;
		},
		[dbPlan],
	);

	const handleSubmitWithAddress = useCallback(async () => {
		setError(null);
		setFieldErrors({});

		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
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

			await createCheckout(property.id);
		} catch (err) {
			if (err instanceof ApiError && err.code === "TERMS_NOT_ACCEPTED") {
				const tier = normalizedTier?.toLowerCase();
				window.location.href = tier ? `/contract?plan=${tier}` : "/plans";
				return;
			}

			if (
				err instanceof ApiError &&
				err.status === 404 &&
				err.message === "Plan not found."
			) {
				try {
						const plans = await getSubscriptionPlans();
						const refreshedPlan = normalizedTier
							? findPlanByTier(plans, normalizedTier)
							: undefined;
					if (!refreshedPlan) {
						setPlanNotFound(true);
						setError("Selected plan is unavailable right now.");
						setIsSubmitting(false);
						return;
					}
					setDbPlan(refreshedPlan);
				} catch {
					setError("Failed to refresh plan data. Please try again.");
					setIsSubmitting(false);
					return;
				}
			}

			setError(getCheckoutErrorMessage(err));
			setIsSubmitting(false);
		}
	}, [createCheckout, form, normalizedTier, validate]);

	const handleSubmitWithoutAddress = useCallback(async () => {
		setError(null);
		setFieldErrors({});
		setIsSubmitting(true);

	try {
			await createCheckout();
		} catch (err) {
			if (err instanceof ApiError && err.code === "TERMS_NOT_ACCEPTED") {
				const tier = normalizedTier?.toLowerCase();
				window.location.href = tier ? `/contract?plan=${tier}` : "/plans";
				return;
			}
			setError(getCheckoutErrorMessage(err));
			setIsSubmitting(false);
		}
	}, [createCheckout, normalizedTier]);

	return {
		form,
		fieldErrors,
		updateField,
		dbPlan,
		isLoadingPlan,
		planNotFound,
		isSubmitting,
		error,
		handleSubmitWithAddress,
		handleSubmitWithoutAddress,
	};
};
