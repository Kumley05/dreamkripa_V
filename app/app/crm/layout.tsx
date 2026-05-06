'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types';
import { AuthContext } from '@/lib/auth-context';
import {
  LayoutDashboard, Users, LogOut, Menu, X, UserCircle, Settings
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Skip auth check for login page
      if (pathname === '/crm/login') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/crm/login');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          router.push('/crm/login');
        }
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.push('/crm/login');
      }
    } catch {
      router.push('/crm/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      router.push('/crm/login');
    }
  };

  // Login page renders without layout
  if (pathname === '/crm/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: '/crm', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crm/users', label: 'Users', icon: Users },
    { href: '/crm/profile', label: 'Profile Settings', icon: Settings },
  ];

  // Only admin sees Users link; everyone sees Dashboard + Profile
  const filteredNav = user.role === 'admin'
    ? navItems
    : [navItems[0], navItems[2]];

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r shadow-sm transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/crm" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Dreamkripa"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <div>
                <div className="font-extrabold text-sm leading-tight">
                  <span className="text-[#1F2937]">Dream</span><span className="text-[#A84296]">kripa</span>
                </div>
                <div className="text-[8px] text-[#8B9F3B] font-bold tracking-[0.15em] uppercase leading-none mt-0.5">Lead Manager</div>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {filteredNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[#FDF2F8] text-[#A84296]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#A84296]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-red-600" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}