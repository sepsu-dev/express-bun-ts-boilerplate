import { db } from '@/config/db';
import type { Profile } from './profile.model';
import bcrypt from 'bcrypt';

export class ProfileRepository {
    /**
     * Get public profile (without password).
     */
    public async get(): Promise<Profile | null> {
        const { rows } = await db.query(
            'SELECT uid, name, title, email, location, bio, image_url, github_url, focus, created_at, updated_at FROM profile WHERE is_deleted = false ORDER BY created_at DESC LIMIT 1'
        );
        return rows[0] || null;
    }

    /**
     * Get profile with password (for authentication/password change).
     */
    public async getWithPassword(): Promise<Profile | null> {
        const { rows } = await db.query(
            'SELECT uid, name, title, email, location, bio, image_url, github_url, focus, password, created_at, updated_at FROM profile WHERE is_deleted = false ORDER BY created_at DESC LIMIT 1'
        );
        return rows[0] || null;
    }

    public async findByEmail(email: string): Promise<Profile | null> {
        const { rows } = await db.query(
            'SELECT uid, name, title, email, location, bio, image_url, github_url, focus, password, created_at, updated_at FROM profile WHERE email = $1 AND is_deleted = false',
            [email]
        );
        return rows[0] || null;
    }

    public async update(data: Partial<Profile>): Promise<Profile | null> {
        if (data.password && !data.password.startsWith('$2')) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        // Serialize `focus` array for PostgreSQL (TEXT[] column)
        const focusValue = data.focus ? `{${data.focus.map(f => `"${f.replace(/"/g, '""')}"`).join(',')}}` : undefined;

        const query = `
            UPDATE profile SET 
                name = COALESCE($1, name), 
                title = COALESCE($2, title), 
                location = COALESCE($3, location),
                bio = COALESCE($4, bio),
                image_url = COALESCE($5, image_url),
                github_url = COALESCE($6, github_url),
                focus = COALESCE($7::text[], focus),
                password = COALESCE($8, password),
                email = COALESCE($9, email),
                updated_at = CURRENT_TIMESTAMP
            WHERE is_deleted = false
            RETURNING uid, name, title, email, location, bio, image_url, github_url, focus, created_at, updated_at
        `;
        const { rows } = await db.query(query, [
            data.name, data.title, data.location, data.bio,
            data.image_url, data.github_url, focusValue || null,
            data.password, data.email
        ]);
        return rows[0] || null;
    }

    public async delete(id: string): Promise<boolean> {
        const result = await db.query(
            'UPDATE profile SET is_deleted = true WHERE uid = $1 AND is_deleted = false',
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}

export const profileRepository = new ProfileRepository();