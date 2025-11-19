import { User } from "./user.model";

export interface LoginRequest {
  email: string;
  mdp: string;
}

export interface SigninRequest {
  nom: string;
  email: string;
  mdp: string;
}

export interface LoginResponse {
  success: boolean;
  user: User | null;
}