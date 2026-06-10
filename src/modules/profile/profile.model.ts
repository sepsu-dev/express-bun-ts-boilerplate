export interface Profile {
    id: number;
    uid: string; // UUID
    name: string;
    title: string;
    email: string;
    location: string;
    bio: string;
    image_url?: string;
    github_url?: string;
    focus: string[];
    created_at?: Date;
    updated_at?: Date;
    is_deleted: boolean;
    password?: string;
}
