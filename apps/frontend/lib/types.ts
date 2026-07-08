export type task = {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: string
    dueDate: string | null
    aiGenerated: boolean
    groupId?: string | null
    group?: taskGroup | null
    createdAt: string;
    updatedAt: string

}

export type taskGroup = {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}
