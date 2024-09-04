'use client';
import Image from 'next/image';
import 'animate.css';
import Navbar from '@/components/ui/navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col min-h-[90vh]">
        <div className="flex flex-1 flex-col justify-center items-center text-center animate__animated animate__fadeIn">
          <Image
            src="/images/simplechat-logo.png"
            alt="SimpleChat Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            SimpleChat
          </h1>
          <p className="text-base md:text-lg text-gray-600 md:mt-4 mt-2 md:px-0 px-8">
            A simple and elegant chat application built with Next.js and
            Nest.js.
            <br />
            <span className="hidden md:inline text-sm font-semibold">
              By Satria Pinandita Abyatarsyah
            </span>
          </p>
        </div>

        <footer className="md:hidden text-sm font-semibold text-center text-gray-600 mt-4 mb-4">
          By Satria Pinandita Abyatarsyah
        </footer>
      </main>
    </>
  );
}
