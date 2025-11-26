// app/admin/layout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { name: 'Students', icon: '👥', path: '/admin/students' },
    { name: 'Buses', icon: '🚌', path: '/admin/buses' },
    { name: 'Routes', icon: '🗺️', path: '/admin/routes' },
    { name: 'Drivers', icon: '🧑', path: '/admin/drivers' },
    { name: 'Conductors', icon: '🧍', path: '/admin/conductors' },
    { name: 'Register', icon: '➕', path: '/admin/register' },
    { name: 'Cancel', icon: '❌', path: '/admin/cancel' },
    { name: 'Reports', icon: '📄', path: '/admin/reports' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Only rendered once here */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-800 flex items-center gap-2">
          <span className="text-2xl">🚌</span>
          <div>
            <h1 className="font-bold text-lg">SIS Transport</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors ${
                pathname === item.path ? 'bg-blue-600' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => router.push('/admin/login')}
          className="p-4 bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}