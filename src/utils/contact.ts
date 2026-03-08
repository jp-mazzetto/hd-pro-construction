import {
  DEFAULT_SMS_TEMPLATE,
  SMS_TEMPLATES,
  type ServiceName,
} from "../consts/site";

export const getSmsMessage = (service?: ServiceName): string => {
  if (!service) {
    return DEFAULT_SMS_TEMPLATE;
  }

  return SMS_TEMPLATES[service];
};

export const createSmsHref = (phoneNumber: string, message: string): string =>
  `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

export const createTelHref = (phoneNumber: string): string =>
  `tel:${phoneNumber}`;

export const navigateToHref = (href: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = href;
};
