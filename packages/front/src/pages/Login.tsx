import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/api/auth.api';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';
import { UserProfile } from '@/types/user';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const updateLoginStatus = useAuthStore((state) => state.updateLoginStatus);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const loginResult = await authApi.signIn(username, password);
      if (loginResult.status !== 200) {
        throw new Error(
          'Login failed. Please check your credentials and try again.',
        );
      }
      const currentUserResp = await userApi.getMe();
      if (!currentUserResp.ok) {
        throw new Error('Failled to retrieve user infos');
      }

      const user = (await currentUserResp.json()) as UserProfile;
      return user;
    },

    onSuccess: async (user: UserProfile) => {
      toast.success("You're logged in!");
      localStorage.setItem('isLoggedIn', 'true');
      updateLoginStatus(true);

      await Promise.resolve();

      if (user.isFirstLogin) {
        const params = new URLSearchParams({
          openEdition: 'true',
        });
        navigate(`/profile?${params.toString()}`);
        return;
      }
      navigate('/browse');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string } = {};

    if (!username) {
      newErrors.username = 'username is required.';
    }

    if (!password) {
      newErrors.password = 'password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      loginMutation.mutate({ username, password });
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
            Welcome back
            <Sparkles className="w-5 h-5 text-primary" />
          </CardTitle>
          <CardDescription>Sign in to find your perfect match</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
            >
              SIGN IN
            </Button>

            <div className="text-center space-y-4">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                PASSWORD FORGOTTEN ?
              </Link>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
