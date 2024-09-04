'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'animate.css';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-center px-6 animate__animated animate__fadeIn">
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
        <CardHeader className="flex flex-col items-center">
          <Image src="/images/user.jpg" alt="user" width={100} height={100} />
          <CardTitle>{userData?.username}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-center">
            <p className="text-gray-600">Email:</p>
            <p className="font-semibold">{userData?.email}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
