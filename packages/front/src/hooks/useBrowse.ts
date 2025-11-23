// src/hooks/useBrowseUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { UserProfile } from '@/types/user';

export const useBrowseUsers = (enabled = true) =>
  useQuery({
    queryKey: ['browseUsers'],
    queryFn: async (): Promise<UserProfile[]> => {
      const res = await userApi.browseUsers();
      if (!res.ok) throw new Error('Failed to browse users');
      const users = await res.json();

      return users.map((user) => ({
        ...user,
        sexualOrientation: user.sexualOrientation?.split(' ') ?? [],
      }));
    },
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
