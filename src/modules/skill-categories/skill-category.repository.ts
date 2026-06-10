import { db } from '@/config/db';
import type { SkillCategory } from './skill-category.model';

export class SkillCategoryRepository {
    public async findAll(): Promise<SkillCategory[]> {
        const { rows } = await db.query(
            'SELECT uid, name, icon, created_at, updated_at FROM skill_categories WHERE is_deleted = false ORDER BY name'
        );
        return rows;
    }

    public async findById(uid: string): Promise<SkillCategory | null> {
        const { rows } = await db.query(
            'SELECT uid, name, icon, created_at, updated_at FROM skill_categories WHERE uid = $1 AND is_deleted = false',
            [uid]
        );
        return rows[0] || null;
    }

    public async findByName(name: string): Promise<SkillCategory | null> {
        const { rows } = await db.query(
            'SELECT uid, name, icon, created_at, updated_at FROM skill_categories WHERE LOWER(name) = LOWER($1) AND is_deleted = false',
            [name]
        );
        return rows[0] || null;
    }

    public async create(data: { name: string; icon?: string }): Promise<SkillCategory> {
        const { rows } = await db.query(
            'INSERT INTO skill_categories (name, icon) VALUES ($1, $2) RETURNING uid, name, icon, created_at, updated_at',
            [data.name, data.icon ?? null]
        );
        return rows[0];
    }

    public async update(uid: string, data: { name?: string; icon?: string }): Promise<SkillCategory | null> {
        const { rows } = await db.query(
            `UPDATE skill_categories
             SET name       = COALESCE($1, name),
                 icon       = COALESCE($2, icon),
                 updated_at = CURRENT_TIMESTAMP
             WHERE uid = $3 AND is_deleted = false
             RETURNING uid, name, icon, created_at, updated_at`,
            [data.name, data.icon, uid]
        );
        return rows[0] || null;
    }

    public async delete(uid: string): Promise<boolean> {
        // Soft delete — consistent with other modules
        const result = await db.query(
            'UPDATE skill_categories SET is_deleted = true WHERE uid = $1 AND is_deleted = false',
            [uid]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export const skillCategoryRepository = new SkillCategoryRepository();