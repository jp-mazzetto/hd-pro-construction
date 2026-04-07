import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  RegisterResponse,
} from "../types/auth";
import type {
  CheckoutSessionResult,
  CreatePropertyInput,
  Property,
  SubscriptionPlan,
  SubscriptionStatus,
  UserSubscription,
} from "../types/lib";

export type { SubscriptionStatus, UserSubscription };

type ErrorResponse = {
  message?: string;
  code?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

/**
 * Erro tipado para respostas HTTP malsucedidas da API.
 *
 * Encapsula o status code junto com a mensagem retornada pelo servidor,
 * permitindo tratamento granular de erros nos componentes consumidores
 * (ex.: exibir mensagem específica para 401 vs 500).
 *
 * @example
 * ```ts
 * try {
 *   await loginWithEmail({ email, password });
 * } catch (err) {
 *   if (err instanceof ApiError && err.status === 401) {
 *     // credenciais inválidas
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const buildHeaders = (body?: BodyInit | null) =>
  body instanceof FormData ? undefined : { "Content-Type": "application/json" };

/**
 * Wrapper genérico para chamadas `fetch` autenticadas via cookie.
 *
 * Centraliza a lógica de serialização de resposta, tratamento de erros
 * e envio de `credentials: "include"` em todas as requisições à API.
 * Retorna `null` para respostas 204 (No Content) e lança `ApiError`
 * para qualquer status fora do range 2xx.
 *
 * @typeParam T - Tipo esperado do body da resposta.
 * @param path - Caminho relativo da API (ex.: `/api/auth/me`).
 * @param init - Opções adicionais do `fetch` (method, body, headers, etc.).
 * @returns O body da resposta parseado como `T`.
 * @throws {ApiError} Quando `response.ok` é `false`.
 */
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
  let data: unknown = null;
  if (responseText.length > 0) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const parsedMessage: string =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as ErrorResponse).message === "string"
        ? ((data as ErrorResponse).message ?? "Unexpected API error")
        : "Unexpected API error";
    const parsedCode: string | undefined =
      typeof data === "object" &&
      data !== null &&
      "code" in data &&
      typeof (data as ErrorResponse).code === "string"
        ? (data as ErrorResponse).code
        : undefined;

    throw new ApiError(parsedMessage, response.status, parsedCode);
  }

  return data as T;
};

/**
 * Busca a sessão autenticada do usuário atual.
 *
 * Faz `GET /api/auth/me` usando o cookie de sessão.
 * Retorna `null` quando não há sessão ativa (ex.: cookie expirado).
 * Usada no carregamento inicial do app para hidratar o estado de auth.
 */
export const fetchCurrentSession = () =>
  request<AuthSession | null>("/api/auth/me", {
    method: "GET",
  });

/**
 * Autentica o usuário com e-mail e senha.
 *
 * Faz `POST /api/auth/login` e retorna a sessão criada.
 * O cookie de sessão é definido automaticamente pelo servidor.
 *
 * @param input - Credenciais do usuário (email + password).
 */
export const loginWithEmail = (input: LoginInput) =>
  request<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

/**
 * Registra um novo usuário com e-mail e senha.
 *
 * Faz `POST /api/auth/register`. Após o registro bem-sucedido,
 * o usuário ainda precisa fazer login separadamente.
 *
 * @param input - Dados de cadastro (name, email, password).
 */
export const registerWithEmail = (input: RegisterInput) =>
  request<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

/**
 * Retorna a URL de início do fluxo OAuth com Google.
 *
 * Não faz requisição HTTP — apenas monta a URL completa
 * para redirecionar o navegador ao endpoint de autenticação Google.
 */
export const getGoogleAuthStartUrl = () => `${API_BASE_URL}/api/auth/google/start`;

/**
 * Encerra a sessão do usuário atual.
 *
 * Faz `POST /api/auth/logout`, invalidando o cookie de sessão no servidor.
 */
export const logoutCurrentSession = () =>
  request<void>("/api/auth/logout", {
    method: "POST",
  });

/**
 * Verifica se o usuário autenticado já aceitou os termos na versão atual.
 */
export const fetchTermsStatus = () =>
  request<{ accepted: boolean; version: string }>("/api/terms/status", {
    method: "GET",
  });

/**
 * Registra o aceite dos termos pelo usuário autenticado.
 * O IP é capturado no servidor a partir do request.
 */
export const acceptTerms = () =>
  request<{ accepted: boolean; version: string }>("/api/terms/accept", {
    method: "POST",
  });

/**
 * Busca todos os planos de assinatura disponíveis.
 *
 * Faz `GET /api/subscription/plans` e retorna apenas o array de planos,
 * desempacotando o wrapper `{ plans }` da resposta.
 */
export const fetchPlans = async () => {
  const data = await request<{ plans: SubscriptionPlan[] }>(
    "/api/subscription/plans",
    { method: "GET" },
  );
  return data.plans;
};

/**
 * Cadastra uma nova propriedade vinculada ao usuário autenticado.
 *
 * Faz `POST /api/subscription/properties` com os dados do imóvel.
 * A propriedade criada pode então ser associada a uma assinatura via checkout.
 *
 * @param input - Dados do imóvel (endereço, metragem, notas).
 */
export const createProperty = (input: CreatePropertyInput) =>
  request<Property>("/api/subscription/properties", {
    method: "POST",
    body: JSON.stringify(input),
  });

/**
 * Cria uma sessão de checkout para uma assinatura.
 *
 * Faz `POST /api/subscription/subscriptions/checkout` com o plano
 * selecionado e retorna a URL de checkout (Stripe) para onde o
 * usuário deve ser redirecionado para efetuar o pagamento.
 *
 * @param input - ID do plano selecionado.
 */
export const createCheckoutSession = (input: {
  planId: string;
  propertyId?: string;
}) =>
  request<CheckoutSessionResult>(
    "/api/subscription/subscriptions/checkout",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

/**
 * Busca todas as assinaturas do usuário autenticado.
 *
 * Faz `GET /api/subscription/subscriptions` e retorna apenas o array,
 * desempacotando o wrapper `{ subscriptions }` da resposta.
 */
export const fetchUserSubscriptions = async () => {
  const data = await request<{ subscriptions: UserSubscription[] }>(
    "/api/subscription/subscriptions",
    { method: "GET" },
  );

  return data.subscriptions;
};
