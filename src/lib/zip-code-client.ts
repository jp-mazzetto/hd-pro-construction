export interface ZipCodeLookupResult {
  zipCode: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

export type ZipCodeLookupErrorKind =
  | "invalid_zip"
  | "not_found"
  | "not_massachusetts"
  | "request_failed";

export class ZipCodeLookupError extends Error {
  kind: ZipCodeLookupErrorKind;
  status?: number;

  constructor(message: string, kind: ZipCodeLookupErrorKind, status?: number) {
    super(message);
    this.name = "ZipCodeLookupError";
    this.kind = kind;
    this.status = status;
  }
}

interface ZipLookupErrorResponse {
  kind?: string;
  message?: string;
}

const zipCodeCache = new Map<string, ZipCodeLookupResult>();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const ZIP_CLIENT_LOG_PREFIX = "[zip-code-client]";

/**
 * Returns the base 5-digit ZIP used by Zippopotam.us.
 */
export const getZipCodeBase = (value: string): string | null => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 5 ? digits.slice(0, 5) : null;
};

export const fetchZipCodeDetails = async (
  zipCodeInput: string,
): Promise<ZipCodeLookupResult> => {
  const zipCodeBase = getZipCodeBase(zipCodeInput);
  if (!zipCodeBase) {
    throw new ZipCodeLookupError(
      "ZIP code must contain at least 5 digits.",
      "invalid_zip",
    );
  }

  const cached = zipCodeCache.get(zipCodeBase);
  if (cached) {
    return cached;
  }

  let response: Response;
  const requestUrl = `${API_BASE_URL}/api/subscription/zip/${encodeURIComponent(zipCodeBase)}`;

  try {
    response = await fetch(requestUrl, { method: "GET" });
  } catch {
    throw new ZipCodeLookupError("Failed to lookup ZIP code.", "request_failed");
  }

  const responseText = await response.text();
  let data: unknown = null;

  if (responseText.length > 0) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorPayload = data as ZipLookupErrorResponse | null;
    const kind = errorPayload?.kind;
    console.warn(`${ZIP_CLIENT_LOG_PREFIX} Non-OK response payload.`, {
      zipCodeBase,
      requestUrl,
      status: response.status,
      payload: errorPayload,
    });

    if (kind === "invalid_zip" || response.status === 400) {
      throw new ZipCodeLookupError(
        errorPayload?.message ?? "ZIP code must contain at least 5 digits.",
        "invalid_zip",
        response.status,
      );
    }

    if (kind === "not_found" || response.status === 404) {
      throw new ZipCodeLookupError(
        errorPayload?.message ?? "ZIP code not found.",
        "not_found",
        response.status,
      );
    }

    if (kind === "not_massachusetts" || response.status === 422) {
      throw new ZipCodeLookupError(
        errorPayload?.message ?? "We currently only service Massachusetts.",
        "not_massachusetts",
        response.status,
      );
    }

    throw new ZipCodeLookupError(
      errorPayload?.message ?? "Failed to lookup ZIP code.",
      "request_failed",
      response.status,
    );
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("city" in data) ||
    !("state" in data) ||
    !("zipCode" in data)
  ) {
    throw new ZipCodeLookupError(
      "ZIP lookup response is missing expected fields.",
      "request_failed",
    );
  }

  const payload = data as Partial<ZipCodeLookupResult>;
  if (
    typeof payload.city !== "string" ||
    typeof payload.state !== "string" ||
    typeof payload.zipCode !== "string"
  ) {
    throw new ZipCodeLookupError(
      "ZIP lookup response is missing expected fields.",
      "request_failed",
    );
  }

  const resolved: ZipCodeLookupResult = {
    zipCode: payload.zipCode,
    city: payload.city,
    state: payload.state,
    latitude:
      typeof payload.latitude === "number" ? payload.latitude : null,
    longitude:
      typeof payload.longitude === "number" ? payload.longitude : null,
  };

  zipCodeCache.set(zipCodeBase, resolved);
  return resolved;
};
