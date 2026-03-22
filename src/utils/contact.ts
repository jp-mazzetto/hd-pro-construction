import {
  DEFAULT_SMS_TEMPLATE,
  PLAN_SMS_TEMPLATES,
  SMS_TEMPLATES,
  type ServiceName,
  type SubscriptionPlanName,
} from "../consts/site";

/**
 * Retorna o texto de SMS padrao ou especifico por tipo de servico.
 *
 * @param service Nome do servico para personalizar a mensagem.
 * @returns Mensagem pronta para envio via SMS.
 *
 * @example
 * ```ts
 * const generic = getSmsMessage();
 * const forPavers = getSmsMessage("Pavers");
 * ```
 */
export const getSmsMessage = (service?: ServiceName): string => {
  if (!service) {
    return DEFAULT_SMS_TEMPLATE;
  }

  return SMS_TEMPLATES[service];
};

/**
 * Retorna mensagem de SMS com intencao de contratar um plano de assinatura.
 */
export const getPlanSmsMessage = (planName?: SubscriptionPlanName): string => {
  if (!planName) {
    return DEFAULT_SMS_TEMPLATE;
  }

  return PLAN_SMS_TEMPLATES[planName];
};

/**
 * Monta um link `sms:` com numero e corpo da mensagem.
 *
 * @param phoneNumber Numero de destino no formato internacional.
 * @param message Mensagem que sera codificada na URL.
 * @returns Href no formato `sms:+numero?body=...`.
 *
 * @example
 * ```ts
 * const href = createSmsHref("+18572492409", "Oi, quero um orcamento");
 * // sms:+18572492409?body=Oi%2C%20quero%20um%20orcamento
 * ```
 */
export const createSmsHref = (phoneNumber: string, message: string): string =>
  `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

/**
 * Monta um link `tel:` para iniciar uma ligacao.
 *
 * @param phoneNumber Numero de telefone no formato internacional.
 * @returns Href no formato `tel:+numero`.
 *
 * @example
 * ```ts
 * const href = createTelHref("+18572492409");
 * // tel:+18572492409
 * ```
 */
export const createTelHref = (phoneNumber: string): string =>
  `tel:${phoneNumber}`;

/**
 * Redireciona o navegador para um `href` informado.
 *
 * @param href URL ou protocolo customizado (`sms:`, `tel:`, etc).
 *
 * @example
 * ```ts
 * const smsHref = createSmsHref("+18572492409", getSmsMessage("Deck"));
 * navigateToHref(smsHref);
 * ```
 */
export const navigateToHref = (href: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = href;
};
