import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user.api';
import { useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { authApi } from '@/api/auth.api';

export const useGetProfile = () => {
  const updateUserProfile = useProfileStore((state) => state.updateUserProfile);
  const query = useQuery({
    queryKey: ['fetchUserProfile'],
    queryFn: async () => {
      const res = await userApi.getMe();
      if (!res.ok) {
        await authApi.logout();
        throw new Error('Failed to fetch user');
      }

      const user = await res.json();

      return {
        ...user,
        sexualOrientation: user.sexualOrientation?.split(' ') ?? [],
      };
    },
  });

  useEffect(() => {
    if (query.data) {
      updateUserProfile(query.data);
    }
  }, [query.data, updateUserProfile]);

  return query;
};
