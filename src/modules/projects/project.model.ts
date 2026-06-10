export interface Project {
    id: number;
    uid: string; // UUID
    title: string;
    subtitle: string;
    overview: string;
    architecture: string;
    demo_url?: string;
    source_url?: string;
    image_url?: string;
    is_public: boolean;
    is_deleted: boolean;
    created_at?: Date;
    updated_at?: Date;
    skills?: any[];
}
