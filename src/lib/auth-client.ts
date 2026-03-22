import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  RegisterResponse,
} from "../types/auth";

type ErrorResponse = {
  message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const buildHeaders = (body?: BodyInit | null) =>
  body instanceof FormData ? undefined : { "Content-Type": "application/json" };

const request = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...buildHeaders(init.body),
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return null as T;
  }

  const responseText = await response.text();
  const data = responseText.length > 0 ? JSON.parse(responseText) : null;

  if (!response.ok) {
    const parsedMessage: string =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as ErrorResponse).message === "string"
        ? ((data as ErrorResponse).message ?? "Unexpected API error")
        : "Unexpected API error";

    throw new ApiError(parsedMessage, response.status);
  }

  return data as T;
};

export const fetchCurrentSession = () =>
  request<AuthSession | null>("/api/auth/me", {
    method: "GET",
  });

export const loginWithEmail = (input: LoginInput) =>
  request<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const registerWithEmail = (input: RegisterInput) =>
  request<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const getGoogleAuthStartUrl = () => `${API_BASE_URL}/api/auth/google/start`;

export const logoutCurrentSession = () =>
  request<void>("/api/auth/logout", {
    method: "POST",
  });
