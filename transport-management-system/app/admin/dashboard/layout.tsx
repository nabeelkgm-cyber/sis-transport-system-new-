// app/admin/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState('');

  useEffect(() => {
    // Check authentication
    const auth = sessionStorage.getItem('adminAuth');
    const user = sessionStorage.getItem('adminUser');
    
    if (!auth || auth !== 'true') {
      router.push('/admin/login');
    } else {
      setAdminUser(user || 'Admin');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin/dashboard', active: pathname === '/admin/dashboard' },
    { icon: '🎫', label: 'Register Student', href: '/admin/register', active: pathname === '/admin/register' },
    { icon: '❌', label: 'Cancel Transport', href: '/admin/cancel', active: pathname === '/admin/cancel' },
    { icon: '👥', label: 'Students', href: '/admin/students', active: pathname === '/admin/students' },
    { icon: '🚌', label: 'Buses', href: '/admin/buses', active: pathname === '/admin/buses' },
    { icon: '🗺️', label: 'Routes', href: '/admin/routes', active: pathname === '/admin/routes' },
    { icon: '👨‍✈️', label: 'Drivers', href: '/admin/drivers', active: pathname === '/admin/drivers' },
    { icon: '🧍', label: 'Conductors', href: '/admin/conductors', active: pathname === '/admin/conductors' },
    { icon: '📋', label: 'Attendance', href: '/admin/attendance', active: pathname === '/admin/attendance' },
    { icon: '🛣️', label: 'KM Logs', href: '/admin/km-logs', active: pathname === '/admin/km-logs' },
    { icon: '⏰', label: 'Overtime', href: '/admin/overtime', active: pathname === '/admin/overtime' },
    { icon: '📊', label: 'Reports', href: '/admin/reports', active: pathname === '/admin/reports' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '80px',
        backgroundColor: '#1f2937',
        color: 'white',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 1000
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center'
        }}>
          {sidebarOpen && (
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                🚌 SIS Transport
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                Admin Portal
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '16px 0' }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: sidebarOpen ? '12px 20px' : '12px',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                backgroundColor: item.active ? '#374151' : 'transparent',
                borderLeft: item.active ? '4px solid #3b82f6' : '4px solid transparent',
                color: 'white',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!item.active) e.currentTarget.style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                if (!item.active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ marginLeft: '12px', fontSize: '14px' }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '260px' : '80px',
        flex: 1,
        transition: 'margin-left 0.3s',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '16px 32px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <input
              type="search"
              placeholder="🔍 Search students, buses, routes..."
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* User Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {adminUser.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {adminUser}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto'
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'white',
          padding: '16px 32px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '12px'
        }}>
          © 2024 Shantiniketan Indian School Qatar - Transport Management System v1.0
        </footer>
      </div>
    </div>
  );
}
