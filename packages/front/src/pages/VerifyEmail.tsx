import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import Login from './Login';
import { Loadder } from '@/components/ui/Loadder';
import { useEffect } from 'react';

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { isPending, error } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No token provided');
      }

      const verifyEmailResult = await authApi.verify(token);
      if (verifyEmailResult.status === 200) {
        return true;
      }

      throw new Error('Verification failed');
    },
  });

  useEffect(() => {
    if (error) navigate('/not-found');
  }, [error, navigate]);

  if (isPending) return <Loadder />;

  return <Login />;
};
