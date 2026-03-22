export type UserRole = "USER" | "ADMIN";

export interface AuthActor {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSession {
  expiresAt: string;
  actor: AuthActor;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}
