import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const [passwd, setPassword] = useState('');
  const [confirmPasswd, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    passwd?: string;
    confirmPasswd?: string;
  }>({});

  const { token } = useParams();

  const { isPending, error } = useQuery({
    queryKey: ['confirmResetPassword', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No token provided');
      }

      const verifyEmailResult = await authApi.confirmResetPassword(token);
      if (verifyEmailResult.status === 200) {
        return true;
      }

      throw new Error('Verification failed');
    },
  });

  const createNewPasswordMutation = useMutation({
    mutationFn: async ({
      passwd,
      confirmPasswd,
    }: {
      passwd: string;
      confirmPasswd: string;
    }) => {
      const updatePassword = await authApi.createNewPassword(
        passwd,
        confirmPasswd,
      );
      if (updatePassword.status === 200) {
        return true;
      }
      throw new Error('update password failed. Please try again.');
    },
    onSuccess: () => {
      toast.success('Your passwd has been updated!');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isPending) return 'Loading...';

  if (error) {
    return <NotFound />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { passwd?: string; confirmPasswd?: string } = {};

    if (!passwd) {
      newErrors.passwd = 'Please enter your new passwd.';
    }

    if (!confirmPasswd) {
      newErrors.confirmPasswd = 'Please confirm your new passwd.';
    }

    if (passwd !== confirmPasswd) {
      newErrors.confirmPasswd = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      createNewPasswordMutation.mutate({ passwd, confirmPasswd });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-primary fill-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Matcha
            </span>
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            New Password
            <Sparkles className="w-5 h-5 text-primary" />
          </CardTitle>
          <CardDescription>Create a new passwd</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="passwd">Password</Label>
              <Input
                id="passwd"
                type="password"
                placeholder="New password"
                value={passwd}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.passwd ? 'border-destructive' : ''}
              />
              {errors.passwd && (
                <p className="text-sm text-destructive">{errors.passwd}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwd">Confirm Password</Label>
              <Input
                id="confirm-passwd"
                type="password"
                placeholder="Confirm password"
                value={confirmPasswd}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPasswd ? 'border-destructive' : ''}
              />
              {errors.confirmPasswd && (
                <p className="text-sm text-destructive">
                  {errors.confirmPasswd}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
            >
              SUBMIT
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
