/**
 * Interface représentant le rôle d'un utilisateur dans le contexte d'un projet.
 */
export interface UserRole {
    /**
     * L'identifiant unique du rôle de l'utilisateur dans le projet.
     */
    id: number,
    /**
     * L'identifiant de l'utilisateur.
     */
    userId: number,
    /**
     * Le rôle de l'utilisateur dans le projet (par exemple, 'ADMIN', 'MEMBER', 'OBSERVER').
     */
    role: string
}

/**
 * Interface représentant l'association entre un utilisateur et un projet.
 */
export interface UserProject {
    /**
     * L'identifiant unique de l'association.
     */
    id: number,
    /**
     * L'identifiant du projet.
     */
    projectId: number,
    /**
     * L'identifiant de l'utilisateur.
     */
    userId: number,
    /**
     * Le rôle de l'utilisateur dans le projet.
     */
    role: string
}

/**
 * Interface représentant une collection d'utilisateurs et leurs rôles pour un projet donné.
 */
export interface UsersProject {
    /**
     * L'identifiant du projet.
     */
    projectId: number,
    /**
     * Une liste des rôles des utilisateurs associés à ce projet.
     */
    users: UserRole[]
}