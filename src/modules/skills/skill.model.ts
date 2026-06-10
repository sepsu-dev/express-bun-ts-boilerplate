import type { SkillCategory } from '../skill-categories/skill-category.model';

export interface Skill {
    uid: string;
    name: string;
    icon?: string;
    category_uid: string;
    category?: SkillCategory;
    is_deleted: boolean;
    created_at?: Date;
    updated_at?: Date;
}