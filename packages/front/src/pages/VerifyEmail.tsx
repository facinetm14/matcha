import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import Login from './Login';

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

  if (isPending) return 'Loading...';

  if (error) navigate('/not-found');

  return <Login/>;
};
