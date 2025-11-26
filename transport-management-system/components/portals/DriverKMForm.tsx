// components/portals/DriverKMForm.tsx
'use client';

import { useState, useEffect } from 'react';

interface DriverData {
  empId: string;
  name: string;
  busAssigned: string;
}

export default function DriverKMForm({ accessToken }: { accessToken: string }) {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'FN',
    startKM: '',
    endKM: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchDriverData();
    fetchRecentLogs();
  }, [accessToken]);

  const fetchDriverData = async () => {
    try {
      const response = await fetch(`/api/auth/verify?token=${accessToken}&role=driver`);
      const data = await response.json();
      
      if (data.success) {
        setDriverData(data.data);
      } else {
        setMessage('Invalid access token');
      }
    } catch (error) {
      setMessage('Error loading driver data');
    }
  };

  const fetchRecentLogs = async () => {
    if (!driverData) return;
    
    try {
      const response = await fetch(`/api/km-log/submit?driverId=${driverData.empId}&limit=10`);
      const data = await response.json();
      
      if (data.logs) {
        setRecentLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/km-log/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: driverData?.empId,
          busNo: driverData?.busAssigned,
          date: formData.date,
          startKM: parseFloat(formData.startKM),
          endKM: parseFloat(formData.endKM),
          shift: formData.shift
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✓ KM logged successfully. Total: ${data.data.totalKM} km`);
        setFormData({ ...formData, startKM: '', endKM: '' });
        fetchRecentLogs();
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('✗ Failed to submit KM log');
    } finally {
      setLoading(false);
    }
  };

  if (!driverData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {driverData.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{driverData.name}</h1>
              <p className="text-gray-600">Driver - {driverData.empId}</p>
              <p className="text-sm text-gray-500">Bus: {driverData.busAssigned}</p>
            </div>
          </div>
        </div>

        {/* KM Logging Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Log Daily KM</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="FN">FN (Forenoon)</option>
                  <option value="AN">AN (Afternoon)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start KM
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.startKM}
                  onChange={(e) => setFormData({ ...formData, startKM: e.target.value })}
                  placeholder="e.g., 12345.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End KM
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.endKM}
                  onChange={(e) => setFormData({ ...formData, endKM: e.target.value })}
                  placeholder="e.g., 12390.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {formData.startKM && formData.endKM && parseFloat(formData.endKM) > parseFloat(formData.startKM) && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Total Distance:</span>{' '}
                  {(parseFloat(formData.endKM) - parseFloat(formData.startKM)).toFixed(1)} km
                </p>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-md ${
                message.startsWith('✓') 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit KM Log'}
            </button>
          </form>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent KM Logs</h2>
          
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No logs yet</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(log['Date']).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log['Shift']} Shift - Bus {log['Bus No']}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">
                        {log['Total KM']} km
                      </p>
                      <p className="text-xs text-gray-500">
                        {log['Start KM']} → {log['End KM']}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
