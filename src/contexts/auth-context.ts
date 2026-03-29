import { createContext } from "react";

import type { SubscriptionPlanName } from "../consts/site";
import type { AuthSession, LoginInput, RegisterInput } from "../types/auth";

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAuthSubmitting: boolean;
  authError: string | null;
  authNotice: string | null;
  setAuthNotice: (notice: string | null) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  continueWithGoogle: () => void;
  logout: () => Promise<void>;
  updateSessionActorName: (name: string) => void;
  pendingPlan: SubscriptionPlanName | null;
  setPendingPlan: (plan: SubscriptionPlanName | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
