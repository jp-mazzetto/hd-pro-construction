import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "../router-adapter";

import { acceptTerms, fetchPlans, fetchTermsStatus } from "../lib/auth-client";
import { queryKeys } from "../lib/query-keys";
import type { AuthSession } from "../types/auth";
import type { SubscriptionPlan } from "../types/lib";
import useAuth from "./useAuth";
import { addMonths } from "../utils/contract";

export interface ContractPageState {
  plan: SubscriptionPlan | null;
  isLoadingPlan: boolean;
  planNotFound: boolean;
  hasScrolledToBottom: boolean;
  isChecked: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  planTier: string | null;
  startDate: Date;
  endDate: Date;
  billingDay: number;
  session: AuthSession | null;
  isAuthLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setIsChecked: (v: boolean) => void;
  handleScroll: () => void;
  handleAccept: () => Promise<void>;
  navigateBack: () => void;
}

export default function useContractPage(): ContractPageState {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, isAuthLoading } = useAuth();

  const planTier = searchParams.get("plan");

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(() => addMonths(startDate, 12), [startDate]);
  const billingDay = startDate.getDate();

  const plansQuery = useQuery({
    queryKey: queryKeys.plans.all,
    queryFn: fetchPlans,
    staleTime: 60 * 60 * 1000,
    enabled: Boolean(session && planTier),
  });

  const termsStatusQuery = useQuery({
    queryKey: queryKeys.terms.status,
    queryFn: fetchTermsStatus,
    staleTime: 60 * 60 * 1000,
    enabled: Boolean(session && planTier),
  });

  useEffect(() => {
    if (termsStatusQuery.data?.accepted && planTier) {
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    }
  }, [termsStatusQuery.data?.accepted, planTier, navigate]);

  const acceptTermsMutation = useMutation({
    mutationFn: acceptTerms,
    onSuccess: async (termsStatus) => {
      queryClient.setQueryData(queryKeys.terms.status, termsStatus);
      await queryClient.invalidateQueries({ queryKey: queryKeys.terms.status });
    },
  });

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || hasScrolledToBottom) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom) setHasScrolledToBottom(true);
  };

  const handleAccept = async () => {
    if (!isChecked || acceptTermsMutation.isPending) return;
    setSubmitError(null);

    try {
      await acceptTermsMutation.mutateAsync();
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    } catch {
      setSubmitError("Failed to record your acceptance. Please try again.");
    }
  };

  const plan: SubscriptionPlan | null = useMemo(() => {
    if (!planTier || !plansQuery.data) {
      return null;
    }

    return plansQuery.data.find((p) => p.tier === planTier.toUpperCase()) ?? null;
  }, [planTier, plansQuery.data]);

  const isLoadingPlan =
    Boolean(session && planTier) && (plansQuery.isPending || termsStatusQuery.isPending);

  const planNotFound =
    Boolean(session && planTier) &&
    !isLoadingPlan &&
    Boolean(plansQuery.isError || termsStatusQuery.isError || !plan);

  return {
    plan,
    isLoadingPlan,
    planNotFound,
    hasScrolledToBottom,
    isChecked,
    isSubmitting: acceptTermsMutation.isPending,
    submitError,
    planTier,
    startDate,
    endDate,
    billingDay,
    session,
    isAuthLoading,
    scrollRef,
    setIsChecked,
    handleScroll,
    handleAccept,
    navigateBack: () => navigate("/plans"),
  };
}
