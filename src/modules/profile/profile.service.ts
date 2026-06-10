import { profileRepository } from './profile.repository';
import type { Profile } from './profile.model';

export const ProfileService = {
    getProfile: async () => {
        return await profileRepository.get();
    },

    getProfileWithPassword: async () => {
        return await profileRepository.getWithPassword();
    },

    findByEmail: async (email: string) => {
        return await profileRepository.findByEmail(email);
    },

    update: async (data: Partial<Profile>) => {
        return await profileRepository.update(data);
    },

    delete: async (id: string) => {
        return await profileRepository.delete(id);
    },
};