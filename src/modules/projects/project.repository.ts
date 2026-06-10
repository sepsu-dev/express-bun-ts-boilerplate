import { db } from '@/config/db';
import type { Project } from './project.model';

export class ProjectRepository {
    public async findAll(page: number = 1, limit: number = 3): Promise<{ data: Project[], total: number }> {
        const offset = (page - 1) * limit;

        const countRes = await db.query('SELECT COUNT(*) FROM projects WHERE is_deleted = false');
        const total = parseInt(countRes.rows[0].count, 10);

        const query = `
            SELECT uid, title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, created_at, updated_at,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'uid', s.uid,
                           'name', s.name, 
                           'icon', s.icon
                       ))
                        FROM project_skills ps 
                        JOIN skills s ON ps.skill_uid = s.uid 
                        WHERE ps.project_uid = p.uid AND s.is_deleted = false), 
                   '[]') as skills
            FROM projects p
            WHERE p.is_deleted = false
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const { rows } = await db.query(query, [limit, offset]);
        return { data: rows, total };
    }

    public async findByTitle(title: string): Promise<Project | null> {
        const { rows } = await db.query(
            'SELECT uid, title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, created_at, updated_at FROM projects WHERE LOWER(title) = LOWER($1) AND is_deleted = false',
            [title]
        );
        return rows[0] || null;
    }

    public async findById(id: string): Promise<Project | null> {
        const query = `
            SELECT uid, title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, created_at, updated_at,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'uid', s.uid,
                           'name', s.name, 
                           'icon', s.icon
                       ))
                        FROM project_skills ps 
                        JOIN skills s ON ps.skill_uid = s.uid 
                        WHERE ps.project_uid = p.uid AND s.is_deleted = false), 
                   '[]') as skills
            FROM projects p
            WHERE p.uid = $1 AND p.is_deleted = false
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0] || null;
    }

    public async create(data: Partial<Project>): Promise<Project> {
        const query = `
            INSERT INTO projects (title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING uid, title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, created_at, updated_at
        `;
        const { rows } = await db.query(query, [
            data.title, data.subtitle, data.overview,
            data.architecture, data.demo_url, data.source_url, data.image_url, data.is_public ?? true
        ]);
        return rows[0];
    }

    public async update(id: string, data: Partial<Project>): Promise<Project | null> {
        const query = `
            UPDATE projects SET 
                title = COALESCE($1, title), 
                subtitle = COALESCE($2, subtitle),
                overview = COALESCE($3, overview),
                architecture = COALESCE($4, architecture),
                demo_url = COALESCE($5, demo_url),
                source_url = COALESCE($6, source_url),
                image_url = COALESCE($7, image_url),
                is_public = COALESCE($8, is_public),
                updated_at = CURRENT_TIMESTAMP
            WHERE uid = $9 AND is_deleted = false 
            RETURNING uid, title, subtitle, overview, architecture, demo_url, source_url, image_url, is_public, created_at, updated_at
        `;
        const { rows } = await db.query(query, [
            data.title, data.subtitle, data.overview, data.architecture,
            data.demo_url, data.source_url, data.image_url, data.is_public, id
        ]);
        return rows[0] || null;
    }

    public async delete(id: string): Promise<boolean> {
        // Cascade: remove project_skills entries for this project
        await db.query('DELETE FROM project_skills WHERE project_uid = $1', [id]);

        const result = await db.query(
            'UPDATE projects SET is_deleted = true WHERE uid = $1 AND is_deleted = false',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    public async addSkill(projectUuid: string, skillUuid: string) {
        return await db.query(
            'INSERT INTO project_skills (project_uid, skill_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [projectUuid, skillUuid]
        );
    }

    public async removeSkill(projectUuid: string, skillUuid: string) {
        return await db.query(
            'DELETE FROM project_skills WHERE project_uid = $1 AND skill_uid = $2',
            [projectUuid, skillUuid]
        );
    }
}

export const projectRepository = new ProjectRepository();
