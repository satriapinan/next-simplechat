'use client';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, checkLoginStatus } = useAuth();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    checkLoginStatus();
  }, [pathname, checkLoginStatus]);

  return (
    <nav className="sticky top-0 z-50 bg-white flex justify-between items-center px-4 md:px-10 py-[0.5rem] text-black border-b-2">
      {isAuthPage ? (
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 group-hover:hidden transition-all duration-300 ease-in-out"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 hidden group-hover:block transition-all duration-300 ease-in-out"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">Back</span>
        </Link>
      ) : (
        <>
          <Link href="/">
            <Image
              src="/images/simplechat-logo.png"
              alt="SimpleChat Logo"
              width={40}
              height={40}
              className="md:hidden"
            />
            <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
              SimpleChat
            </h1>
          </Link>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <span className="icon-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5 stroke-gray-800"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 px-6 pt-10">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-800">Home</span>
                      <span className="icon-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 stroke-gray-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                          />
                        </svg>
                      </span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/about"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-800">About</span>
                      <span className="icon-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 stroke-gray-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          />
                        </svg>
                      </span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild className="pt-4">
                    <Link
                      href="/login"
                      className="flex items-center justify-between"
                    >
                      <Button variant="login" className="flex-1">
                        Login
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="profile">
                  {user?.username}
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/user.jpg" alt="User Avatar" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/profile" legacyBehavior passHref>
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <Button variant="destructive" className="w-full">
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex gap-2">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink>
                      <Button variant="link">Home</Button>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink>
                      <Button variant="link">About</Button>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/login" legacyBehavior passHref>
                    <NavigationMenuLink>
                      <Button variant="login">Login</Button>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </>
      )}
    </nav>
  );
}
