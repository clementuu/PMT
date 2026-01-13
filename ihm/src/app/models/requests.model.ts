import { User } from "./user.model";

/**
 * Interface représentant la structure d'une requête de connexion.
 */
export interface LoginRequest {
  /**
   * L'adresse e-mail de l'utilisateur.
   */
  email: string;
  /**
   * Le mot de passe de l'utilisateur.
   */
  mdp: string;
}

/**
 * Interface représentant la structure d'une requête d'inscription.
 */
export interface SigninRequest {
  /**
   * Le nom de l'utilisateur.
   */
  nom: string;
  /**
   * L'adresse e-mail de l'utilisateur.
   */
  email: string;
  /**
   * Le mot de passe de l'utilisateur.
   */
  mdp: string;
}

/**
 * Interface représentant la structure de la réponse de connexion.
 */
export interface LoginResponse {
  /**
   * Indique si la connexion a réussi.
   */
  success: boolean;
  /**
   * L'objet utilisateur si la connexion a réussi, sinon null.
   */
  user: User | null;
}