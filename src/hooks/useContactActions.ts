import { useCallback } from "react";

import type { ServiceName } from "../consts/site";
import {
  createSmsHref,
  createTelHref,
  getSmsMessage,
  navigateToHref,
} from "../utils/contact";

interface UseContactActionsReturn {
  requestSmsContact: (service?: ServiceName) => void;
  requestCallContact: () => void;
}

const useContactActions = (phoneNumber: string): UseContactActionsReturn => {
  const requestSmsContact = useCallback(
    (service?: ServiceName) => {
      const message = getSmsMessage(service);
      navigateToHref(createSmsHref(phoneNumber, message));
    },
    [phoneNumber],
  );

  const requestCallContact = useCallback(() => {
    navigateToHref(createTelHref(phoneNumber));
  }, [phoneNumber]);

  return {
    requestSmsContact,
    requestCallContact,
  };
};

export default useContactActions;
