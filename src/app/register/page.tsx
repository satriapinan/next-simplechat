'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/navbar';

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await axiosInstance.post('/auth/register', data);
      router.push('/login');
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center px-6 min-h-[90vh]">
        <div className="flex items-end justify-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-800 hidden md:block">
            SimpleChat
          </h1>
          <Image
            src="/images/simplechat-logo.png"
            alt="SimpleChat Logo"
            width={80}
            height={80}
          />
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Register</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Register
              </Button>
              <Button variant="link" className="p-0" asChild>
                <Link href="/login">Already have an account?</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
}
