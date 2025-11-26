// app/conductor/[accessToken]/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ConductorData {
  empId: string;
  name: string;
  busAssigned: string;
}

export default function ConductorPortal({ params }: { params: { accessToken: string } }) {
  const [conductorData, setConductorData] = useState<ConductorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real implementation, this would verify the token and fetch conductor data
    // For now, we'll show a placeholder
    setTimeout(() => {
      setLoading(false);
      // Simulated data - in production, this would come from API
      setConductorData({
        empId: 'CND001',
        name: 'Hassan',
        busAssigned: 'BUS01'
      });
    }, 1000);
  }, [params.accessToken]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280' }}>Loading conductor portal...</p>
        </div>
      </div>
    );
  }

  if (error || !conductorData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px'
          }}>
            ⚠️
          </div>
          <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Invalid Access Token</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            This access token is not valid or has expired.
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Please contact your administrator for a valid access link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {conductorData.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {conductorData.name}
              </h1>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                Conductor - {conductorData.empId} | Bus: {conductorData.busAssigned}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            📋 Attendance Marking
          </h2>
          
          <div style={{
            backgroundColor: '#dbeafe',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#1e40af', margin: 0, fontSize: '14px' }}>
              ℹ️ <strong>Note:</strong> The full attendance marking interface is under development. 
              This portal will allow you to mark student attendance for your assigned bus.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
              Available Features:
            </h3>
            <ul style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.8' }}>
              <li>View students assigned to your bus</li>
              <li>Mark AM/PM attendance status</li>
              <li>Filter by shift (FN/AN)</li>
              <li>View attendance history</li>
              <li>Generate printable attendance sheets</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            🚀 Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <button style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'not-allowed',
              color: '#6b7280'
            }}>
              <strong>Mark Today's Attendance</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                (Coming soon)
              </p>
            </button>

            <button style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'not-allowed',
              color: '#6b7280'
            }}>
              <strong>View Student List</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                (Coming soon)
              </p>
            </button>

            <button style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'not-allowed',
              color: '#6b7280'
            }}>
              <strong>Generate Attendance Sheet</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                (Coming soon)
              </p>
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
            <strong>⚠️ Development Notice:</strong> This portal is functional but UI features are still being built. 
            The attendance API endpoint is ready and can be accessed via the admin panel or direct API calls.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
