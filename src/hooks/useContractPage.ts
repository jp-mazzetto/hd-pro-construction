import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { acceptTerms, fetchPlans, fetchTermsStatus } from "../lib/auth-client";
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
  const { session, isAuthLoading } = useAuth();

  const planTier = searchParams.get("plan");

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planNotFound, setPlanNotFound] = useState(false);
  const [alreadyAccepted, setAlreadyAccepted] = useState(false);

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(() => addMonths(startDate, 12), [startDate]);
  const billingDay = startDate.getDate();

  useEffect(() => {
    if (!session || !planTier) return;

    const load = async () => {
      try {
        const [plans, status] = await Promise.all([fetchPlans(), fetchTermsStatus()]);

        if (status.accepted) {
          setAlreadyAccepted(true);
          return;
        }

        const found = plans.find((p) => p.tier === planTier.toUpperCase());
        if (!found) {
          setPlanNotFound(true);
        } else {
          setPlan(found);
        }
      } catch {
        setPlanNotFound(true);
      } finally {
        setIsLoadingPlan(false);
      }
    };

    void load();
  }, [session, planTier]);

  useEffect(() => {
    if (alreadyAccepted && planTier) {
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    }
  }, [alreadyAccepted, planTier, navigate]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || hasScrolledToBottom) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom) setHasScrolledToBottom(true);
  };

  const handleAccept = async () => {
    if (!isChecked || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await acceptTerms();
      void navigate(`/checkout?plan=${planTier}`, { replace: true });
    } catch {
      setSubmitError("Failed to record your acceptance. Please try again.");
      setIsSubmitting(false);
    }
  };

  return {
    plan,
    isLoadingPlan,
    planNotFound,
    hasScrolledToBottom,
    isChecked,
    isSubmitting,
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
