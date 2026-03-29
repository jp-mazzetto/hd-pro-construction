import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchZipCodeDetails,
  getZipCodeBase,
  ZipCodeLookupError,
} from "../lib/zip-code-client";

interface UseZipCodeAutofillOptions {
  zipCode: string;
  city: string;
  state: string;
  onCityResolved: (city: string) => void;
  onStateResolved: (state: string) => void;
  debounceMs?: number;
}

interface UseZipCodeAutofillReturn {
  zipLookupMessage: string | null;
  onZipCodeBlur: () => void;
  markCityAsManual: () => void;
  markStateAsManual: () => void;
}

const ZIP_NOT_FOUND_MESSAGE =
  "ZIP code not found. Please enter city and state manually.";
const ZIP_LOOKUP_UNAVAILABLE_MESSAGE =
  "Couldn't auto-fill this ZIP right now. Please enter city and state manually.";
const DEFAULT_DEBOUNCE_MS = 350;

const useZipCodeAutofill = ({
  zipCode,
  city,
  state,
  onCityResolved,
  onStateResolved,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseZipCodeAutofillOptions): UseZipCodeAutofillReturn => {
  const [zipLookupMessage, setZipLookupMessage] = useState<string | null>(null);

  const cityEditedManuallyRef = useRef(false);
  const stateEditedManuallyRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const lastLookupZipRef = useRef<string | null>(null);

  useEffect(() => {
    if (city.trim().length === 0) {
      cityEditedManuallyRef.current = false;
    }
  }, [city]);

  useEffect(() => {
    if (state.trim().length === 0) {
      stateEditedManuallyRef.current = false;
    }
  }, [state]);

  const runLookup = useCallback(
    async (force: boolean) => {
      const zipCodeBase = getZipCodeBase(zipCode);
      if (!zipCodeBase) {
        return;
      }

      if (!force && lastLookupZipRef.current === zipCodeBase) {
        return;
      }

      lastLookupZipRef.current = zipCodeBase;
      const currentRequestId = ++requestIdRef.current;

      setZipLookupMessage(null);

      try {
        const location = await fetchZipCodeDetails(zipCodeBase);
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (!cityEditedManuallyRef.current) {
          onCityResolved(location.city);
        }
        if (!stateEditedManuallyRef.current) {
          onStateResolved(location.state);
        }
      } catch (error) {
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (error instanceof ZipCodeLookupError && error.kind === "not_found") {
          setZipLookupMessage(ZIP_NOT_FOUND_MESSAGE);
          return;
        }

        setZipLookupMessage(ZIP_LOOKUP_UNAVAILABLE_MESSAGE);
      }
    },
    [onCityResolved, onStateResolved, zipCode],
  );

  useEffect(() => {
    const zipCodeBase = getZipCodeBase(zipCode);
    if (!zipCodeBase) {
      lastLookupZipRef.current = null;
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      void runLookup(false);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [debounceMs, runLookup, zipCode]);

  const onZipCodeBlur = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    void runLookup(true);
  }, [runLookup]);

  const markCityAsManual = useCallback(() => {
    cityEditedManuallyRef.current = true;
  }, []);

  const markStateAsManual = useCallback(() => {
    stateEditedManuallyRef.current = true;
  }, []);

  const visibleZipLookupMessage = getZipCodeBase(zipCode) ? zipLookupMessage : null;

  return {
    zipLookupMessage: visibleZipLookupMessage,
    onZipCodeBlur,
    markCityAsManual,
    markStateAsManual,
  };
};

export default useZipCodeAutofill;
