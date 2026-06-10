import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ProfileService } from '@/modules/profile/profile.service';
import { APP_CONFIG } from '@/config';
import { AppError } from '@/utils/app-error.util';

export const AuthService = {
    login: async (email: string, password: string) => {
        const profile = await ProfileService.findByEmail(email);

        if (!profile || !profile.password) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordMatch = await bcrypt.compare(password, profile.password);

        if (!isPasswordMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = jwt.sign(
            { id: profile.uid, email: profile.email },
            APP_CONFIG.jwtSecret,
            { expiresIn: '1d' }
        );

        return {
            token
        };
    }
};
