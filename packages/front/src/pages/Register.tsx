import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { isPasswordStrong, MIN_SIZE_PASSWORD } from '@/utils/password';
import { isValidEmail } from '../../../shared/is-valid-email';
import { authApi } from '@/api/auth.api';
import { UserIdentifier } from '../../../shared/user-identifier';
import { isUserIdentifierAvailable } from '@/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { CreateUserDto } from '@/types/dto/create-user.dto';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '' as string,
    username: '' as string,
    firstName: '' as string,
    lastName: '' as string,
    password: '' as string,
    confirmPassword: '' as string,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const RegisterMutation = useMutation({
    mutationFn: async (createUserDto: CreateUserDto) => {
      const loginResult = await authApi.register(createUserDto);
      if (loginResult.status === 201) {
        return true;
      }
      throw new Error('Registration failed. Please try again.');
    },
    onSuccess: () => {
      toast.success('Account created! Please check your email to verify.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email))
      newErrors.email = 'Email is invalid';
    else {
      const isUsernameAvailable = await isUserIdentifierAvailable(
        UserIdentifier.EMAIL,
        formData.email,
      );
      if (!isUsernameAvailable) {
        newErrors.email = 'email is already used';
      }
    }

    if (!formData.username) newErrors.username = 'Username is required';
    else {
      const isUsernameAvailable = await isUserIdentifierAvailable(
        UserIdentifier.USERNAME,
        formData.username,
      );
      if (!isUsernameAvailable) {
        newErrors.username = 'Username is already used';
      }
    }
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isPasswordStrong(formData.password, MIN_SIZE_PASSWORD))
      newErrors.password = 'Password is not strong enough.';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = await validateForm();

    if (Object.keys(newErrors).length === 0) {
      RegisterMutation.mutate({
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        passwd: formData.password,
        confirmPasswd: formData.confirmPassword,
      });
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
            Create Account
            <Sparkles className="w-5 h-5 text-primary" />
          </CardTitle>
          <CardDescription>
            Join us to find meaningful connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={errors.username ? 'border-destructive' : ''}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
            >
              CREATE ACCOUNT
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
