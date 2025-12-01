// src/hooks/useGetProfile.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { QUERY_KEYS } from '@/utils/utils';
import { UserProfile } from '@/types/user';
import { useAuthStore } from '@/store/authStore';
import { IS_LOGGED_IN_KEY } from '@/App';

export const useGetProfile = () => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async (): Promise<UserProfile> => {
      const res = await userApi.getMe();
      if (!res.ok) throw new Error('Failed to fetch profile');
      const user = await res.json();
      return user;
    },
    staleTime: 50,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: isLoggedIn || !!localStorage.getItem(IS_LOGGED_IN_KEY),
  });
};
