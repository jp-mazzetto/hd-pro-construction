import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

const invalidate = (queryClient: QueryClient, queryKey: readonly unknown[]) =>
  queryClient.invalidateQueries({ queryKey });

export const invalidateAuthAndPrivateQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    invalidate(queryClient, queryKeys.auth.session),
    invalidate(queryClient, queryKeys.subscriptions.all),
    invalidate(queryClient, queryKeys.properties.all),
    invalidate(queryClient, queryKeys.billing.all),
    invalidate(queryClient, queryKeys.visits.all),
    invalidate(queryClient, queryKeys.referral.status),
  ]);
};

export const invalidatePropertyAndSubscriptionQueries = async (
  queryClient: QueryClient,
) => {
  await Promise.all([
    invalidate(queryClient, queryKeys.properties.all),
    invalidate(queryClient, queryKeys.subscriptions.all),
  ]);
};

export const invalidateCheckoutQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    invalidate(queryClient, queryKeys.subscriptions.all),
    invalidate(queryClient, queryKeys.billing.all),
    invalidate(queryClient, queryKeys.visits.all),
  ]);
};

export const invalidateReferralQueries = async (queryClient: QueryClient) => {
  await invalidate(queryClient, queryKeys.referral.status);
};

