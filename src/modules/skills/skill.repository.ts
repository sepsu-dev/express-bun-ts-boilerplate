import { db } from '@/config/db';
import type { Skill } from './skill.model';

const SELECT_FIELDS = `
    s.uid, s.name, s.icon, s.category_uid,
    sc.name AS category_name, sc.icon AS category_icon,
    s.is_deleted, s.created_at, s.updated_at
`;

const mapRow = (row: any): Skill => ({
    uid: row.uid,
    name: row.name,
    icon: row.icon,
    category_uid: row.category_uid,
    category: {
        uid: row.category_uid,
        name: row.category_name,
        icon: row.category_icon,
        is_deleted: false,
    },
    is_deleted: row.is_deleted,
    created_at: row.created_at,
    updated_at: row.updated_at,
});

export class SkillRepository {
    public async findAllGrouped(): Promise<Record<string, Skill[]>> {
        // Only fetch data that has not been soft-deleted
        const { rows } = await db.query(`
            SELECT ${SELECT_FIELDS}
            FROM skills s
            JOIN skill_categories sc ON s.category_uid = sc.uid
            WHERE s.is_deleted = false
            ORDER BY sc.name, s.name
        `);

        return rows.reduce((acc: Record<string, Skill[]>, row: any) => {
            const categoryName: string = row.category_name;
            if (!acc[categoryName]) acc[categoryName] = [];
            acc[categoryName].push(mapRow(row));
            return acc;
        }, {});
    }

    public async findByName(name: string): Promise<Skill | null> {
        const { rows } = await db.query(`
            SELECT ${SELECT_FIELDS}
            FROM skills s
            JOIN skill_categories sc ON s.category_uid = sc.uid
            WHERE LOWER(s.name) = LOWER($1) AND s.is_deleted = false
        `, [name]);
        return rows[0] ? mapRow(rows[0]) : null;
    }

    public async findById(uid: string): Promise<Skill | null> {
        const { rows } = await db.query(`
            SELECT ${SELECT_FIELDS}
            FROM skills s
            JOIN skill_categories sc ON s.category_uid = sc.uid
            WHERE s.uid = $1 AND s.is_deleted = false
        `, [uid]);
        return rows[0] ? mapRow(rows[0]) : null;
    }

    public async create(data: { name: string; category_uid: string; icon?: string }): Promise<Skill> {
        const { rows } = await db.query(`
            INSERT INTO skills (name, category_uid, icon)
            VALUES ($1, $2, $3)
            RETURNING uid
        `, [data.name, data.category_uid, data.icon ?? null]);

        // Fetch the full row with JOIN to return category details
        return (await this.findById(rows[0].uid))!;
    }

    public async update(uid: string, data: Partial<{ name: string; category_uid: string; icon: string }>): Promise<Skill | null> {
        const { rows } = await db.query(`
            UPDATE skills SET
                name          = COALESCE($1, name),
                category_uid  = COALESCE($2, category_uid),
                icon          = COALESCE($3, icon),
                updated_at    = CURRENT_TIMESTAMP
            WHERE uid = $4 AND is_deleted = false
            RETURNING uid
        `, [data.name, data.category_uid, data.icon, uid]);

        if (!rows[0]) return null;
        return this.findById(rows[0].uid);
    }

    public async delete(uid: string): Promise<boolean> {
        // SOFT DELETE mechanism
        const result = await db.query(
            'UPDATE skills SET is_deleted = true WHERE uid = $1 AND is_deleted = false',
            [uid]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export const skillRepository = new SkillRepository();