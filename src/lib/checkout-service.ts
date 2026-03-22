import type {
    CheckoutSessionResult,
    CreatePropertyInput,
    Property,
    SubscriptionPlan,
} from "../types/lib";
import { ApiError, fetchPlans } from "./auth-client";

/**
 * Fetches available subscription plans from the API.
 *
 * @returns Array of available subscription plans
 * @throws {ApiError} When the API request fails
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    return fetchPlans();
};

/**
 * Finds a specific plan by its tier.
 *
 * @param plans - Array of available plans
 * @param tier - The tier to search for (e.g., "BASIC", "STANDARD", "PREMIUM")
 * @returns The matching plan or undefined if not found
 */
export const findPlanByTier = (
    plans: SubscriptionPlan[],
    tier: string,
): SubscriptionPlan | undefined => {
    return plans.find((plan) => plan.tier === tier);
};

/**
 * Creates a new property for the authenticated user.
 *
 * @param propertyData - The property details
 * @returns The created property with its ID
 * @throws {ApiError} When the property creation fails
 */
export const createPropertyForCheckout = async (
    propertyData: CreatePropertyInput,
): Promise<Property> => {
    const { createProperty } = await import("./auth-client");
    return createProperty(propertyData);
};

/**
 * Creates a Stripe checkout session for the subscription.
 *
 * @param planId - The ID of the selected subscription plan
 * @param propertyId - The ID of the property to associate with the subscription
 * @returns The checkout session result containing the Stripe redirect URL
 * @throws {ApiError} When the checkout session creation fails
 */
export const createCheckoutForSubscription = async (
    planId: string,
    propertyId: string,
): Promise<CheckoutSessionResult> => {
    const { createCheckoutSession } = await import("./auth-client");
    return createCheckoutSession({ planId, propertyId });
};

/**
 * Normalizes the plan tier from URL parameter to internal format.
 *
 * @param planTier - The tier string from URL (e.g., "basic", "standard", "premium")
 * @returns The normalized tier string (e.g., "BASIC", "STANDARD", "PREMIUM")
 */
export const normalizePlanTier = (planTier: string): string => {
    const TIER_MAP: Record<string, string> = {
        basic: "BASIC",
        standard: "STANDARD",
        premium: "PREMIUM",
    };
    return TIER_MAP[planTier.toLowerCase()] ?? "STANDARD";
};

/**
 * Type for checkout service errors with additional context.
 */
export interface CheckoutServiceError {
    message: string;
    code?: string;
}

/**
 * Handles checkout errors and returns user-friendly messages.
 *
 * @param error - The caught error
 * @returns A user-friendly error message
 */
export const getCheckoutErrorMessage = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }
    return "Something went wrong. Please try again.";
};
