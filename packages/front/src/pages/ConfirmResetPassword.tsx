import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import Login from './Login';
import { Loadder } from '@/components/ui/Loadder';
import { QUERY_KEYS } from '@/utils/utils';
import { useEffect, useState } from 'react';

export const ConfirmResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: [QUERY_KEYS.VERIFY_RESET_PASSWORD_TOKEN, token],
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
    enabled: !isVerified,
  });

  useEffect(() => {
    if (data) {
      setIsVerified(true);
    }
    if (error) navigate('/not-found');
  }, [data, error, navigate]);

  if (isPending) return <Loadder />;

  return <Login />;
};
