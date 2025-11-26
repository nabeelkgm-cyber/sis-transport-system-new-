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
    { name: 'Drivers', icon: '👨‍✈️', path: '/admin/drivers' },
    { name: 'Conductors', icon: '🚶', path: '/admin/conductors' },
    { name: 'Register', icon: '➕', path: '/admin/register' },
    { name: 'Cancel', icon: '❌', path: '/admin/cancel' },
    { name: 'Reports', icon: '📄', path: '/admin/reports' },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/admin/login');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '260px' : '80px',
          backgroundColor: '#1f2937',
          color: 'white',
          transition: 'width 0.3s',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen ? (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                🚌 SIS Transport
              </h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                Admin Panel
              </p>
            </div>
          ) : (
            <div style={{ fontSize: '24px' }}>🚌</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '16px 0' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  width: '100%',
                  padding: sidebarOpen ? '12px 20px' : '12px',
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  border: 'none',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  transition: 'background-color 0.2s',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          width: sidebarOpen ? '260px' : '80px',
          padding: '0 16px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: sidebarOpen ? '12px 20px' : '12px',
              backgroundColor: '#ef4444',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '260px' : '80px',
          flex: 1,
          transition: 'margin-left 0.3s',
          padding: '24px',
          minHeight: '100vh'
        }}
      >
        {/* Top Bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {menuItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              👤 Admin User
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
