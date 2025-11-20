export interface UserRole {
    userId: number,
    role: string
}

export interface UserProject {
    projectId: number,
    userId: number,
    role: string
}

export interface UsersProject {
    projectId: number,
    users: UserRole[]
}
