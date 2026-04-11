export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  plans: {
    all: ["plans"] as const,
  },
  terms: {
    status: ["terms", "status"] as const,
  },
  subscriptions: {
    all: ["subscriptions"] as const,
    detail: (id: string) => ["subscriptions", "detail", id] as const,
  },
  properties: {
    all: ["properties"] as const,
  },
  billing: {
    all: ["billing"] as const,
  },
  visits: {
    all: ["visits"] as const,
    list: (params?: { status?: string; from?: string; to?: string }) =>
      ["visits", params ?? {}] as const,
  },
  referral: {
    status: ["referral", "status"] as const,
  },
} as const;

