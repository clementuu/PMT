export interface UserRole {
    id: number,
    userId: number,
    role: string
}

export interface UserProject {
    id: number,
    projectId: number,
    userId: number,
    role: string
}

export interface UsersProject {
    projectId: number,
    users: UserRole[]
}
