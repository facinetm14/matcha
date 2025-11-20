import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';
import { useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { authApi } from '@/api/auth.api';
import { UserProfile } from '@/types/user';
import { useAuthStore } from '@/store/authStore';
import { IS_LOGGED_IN_KEY } from '@/App';
import { disconnectSocket } from '@/api/socket.api';

export const useGetProfile = () => {
  const updateUserProfile = useProfileStore((state) => state.updateUserProfile);
  const { isLoggedIn } = useAuthStore();

  const query = useQuery({
    queryKey: ['fetchUserProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const res = await userApi.getMe();
      if (!res.ok) {
        await authApi.logout();
        disconnectSocket();
        localStorage.removeItem(IS_LOGGED_IN_KEY);
        throw new Error('Failed to fetch user');
      }

      const user = await res.json();

      return {
        ...user,
        sexualOrientation: user.sexualOrientation?.split(' ') ?? [],
      };
    },
    enabled: isLoggedIn || !!localStorage.getItem(IS_LOGGED_IN_KEY),
  });

  useEffect(() => {
    if (query.data) {
      updateUserProfile(query.data);
    }
  }, [query.data, updateUserProfile]);

  return query;
};
