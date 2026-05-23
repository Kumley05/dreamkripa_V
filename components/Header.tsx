'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Programs', href: '/programs' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo.png"
                alt="Dreamkripa"
                width={48}
                height={48}
                className="h-12 w-12"
                priority
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold leading-tight">
                  <span className="text-[#1F2937]">Dream</span><span className="text-[#A84296]">kripa</span>
                </span>
                <span className="text-[9px] text-[#8B9F3B] font-bold tracking-[0.18em] uppercase leading-none mt-0.5">
                  Your Gateway to Elite Colleges
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#A84296] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="bg-[#A84296] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8E3780] transition-colors shadow-md hover:shadow-lg"
            >
Book Slot
</Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-[#A84296] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="space-y-1 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-[#A84296]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="block rounded-lg px-3 py-2 text-base font-medium bg-[#A84296] text-white hover:bg-[#8E3780] text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Slot
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}