// app/driver/[accessToken]/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface DriverData {
  empId: string;
  name: string;
  busAssigned: string;
}

export default function DriverPortal({ params }: { params: { accessToken: string } }) {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'FN',
    startKM: '',
    endKM: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // In a real implementation, this would verify the token and fetch driver data
    setTimeout(() => {
      setLoading(false);
      // Simulated data - in production, this would come from API
      setDriverData({
        empId: 'DRV001',
        name: 'Ahmed Ali',
        busAssigned: 'BUS01'
      });
    }, 1000);
  }, [params.accessToken]);

  const calculateKM = (): number => {
    if (!formData.startKM || !formData.endKM) return 0;
    const start = parseFloat(formData.startKM);
    const end = parseFloat(formData.endKM);
    if (isNaN(start) || isNaN(end)) return 0;
    if (end > start) {
      return parseFloat((end - start).toFixed(1));
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage('');

    // Simulate API call
    setTimeout(() => {
      setMessage('✓ KM logged successfully!');
      setSubmitLoading(false);
      setFormData({ ...formData, startKM: '', endKM: '' });
    }, 1500);
  };

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
          <p style={{ color: '#6b7280' }}>Loading driver portal...</p>
        </div>
      </div>
    );
  }

  if (!driverData) {
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
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {driverData.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {driverData.name}
              </h1>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                Driver - {driverData.empId} | Bus: {driverData.busAssigned}
              </p>
            </div>
          </div>
        </div>

        {/* KM Logging Form */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            📝 Log Daily KM
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Shift
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="FN">FN (Forenoon)</option>
                  <option value="AN">AN (Afternoon)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Start KM
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.startKM}
                  onChange={(e) => setFormData({ ...formData, startKM: e.target.value })}
                  placeholder="e.g., 12345.5"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  End KM
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.endKM}
                  onChange={(e) => setFormData({ ...formData, endKM: e.target.value })}
                  placeholder="e.g., 12390.2"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            {calculateKM() > 0 && (
              <div style={{
                backgroundColor: '#dbeafe',
                border: '2px solid #3b82f6',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: '#1e40af', margin: 0, fontSize: '14px' }}>
                  <strong>Total Distance:</strong> {calculateKM()} km
                </p>
              </div>
            )}

            {message && (
              <div style={{
                backgroundColor: message.startsWith('✓') ? '#d1fae5' : '#fee2e2',
                border: `2px solid ${message.startsWith('✓') ? '#10b981' : '#ef4444'}`,
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ color: message.startsWith('✓') ? '#065f46' : '#991b1b', margin: 0, fontSize: '14px' }}>
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              style={{
                width: '100%',
                backgroundColor: submitLoading ? '#9ca3af' : '#10b981',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: submitLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {submitLoading ? 'Submitting...' : 'Submit KM Log'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#92400e', margin: 0, fontSize: '14px' }}>
            <strong>ℹ️ Note:</strong> This is a demo interface. To fully activate KM logging with Google Sheets sync, 
            the API endpoint needs to be connected. Contact your administrator for setup.
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
