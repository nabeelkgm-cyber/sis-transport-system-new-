// components/portals/OTSubmissionForm.tsx
'use client';

import { useState } from 'react';

interface OTFormProps {
  empId: string;
  name: string;
  role: 'Driver' | 'Conductor';
}

export default function OTSubmissionForm({ empId, name, role }: OTFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'FN',
    startTime: '',
    endTime: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01T${formData.startTime}`);
    let end = new Date(`2000-01-01T${formData.endTime}`);
    
    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }
    
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(diff * 100) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/overtime/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          role,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          shift: 'FN',
          startTime: '',
          endTime: '',
          remarks: ''
        });
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      setError('Failed to submit overtime. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Overtime Submission</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">{name}</p>
              <p className="text-sm text-gray-500">{role} - {empId}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {role}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
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
                  Shift <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="FN">FN (Forenoon)</option>
                  <option value="AN">AN (Afternoon)</option>
                  <option value="Both">Both Shifts</option>
                  <option value="Special Task">Special Task</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {formData.startTime && formData.endTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">Total Hours:</span>
                  <span className="text-lg font-bold text-blue-900">{calculateHours()} hours</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={3}
                placeholder="Add any additional notes (e.g., Holiday, Special event, etc.)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Calculating & Submitting...' : 'Submit Overtime'}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Overtime Submitted Successfully</h3>
                <p className="text-sm text-gray-600 mb-4">Submission ID: {result.submissionId}</p>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Date</p>
                      <p className="font-medium text-gray-800">{result.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Shift</p>
                      <p className="font-medium text-gray-800">{result.shift}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Hours</p>
                      <p className="font-medium text-gray-800">{result.hours} hours</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Category</p>
                      <p className="font-medium text-gray-800">{result.category}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Rate:</span>
                      <span className="font-semibold text-blue-900">
                        {result.rateMultiplier}x {result.basedOn} Salary
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Amount:</span>
                      <span className="text-xl font-bold text-blue-900">
                        QAR {result.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> {result.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OT Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Overtime Guidelines</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {role === 'Driver' ? (
              <>
                <p>• <strong>Early Morning (7:30am-10:30am):</strong> 1.5x Gross Salary</p>
                <p>• <strong>Friday/Holiday:</strong> 1.5x Basic Salary</p>
                <p>• <strong>Off Shift (7:30pm-4:30am):</strong> 1.5x Basic Salary</p>
                <p>• <strong>Additional Duty:</strong> 1.25x Basic Salary</p>
              </>
            ) : (
              <>
                <p>• <strong>FN Shift (up to 4h):</strong> 1.5x Gross Salary</p>
                <p>• <strong>Friday/Holiday:</strong> 1.5x Basic Salary</p>
                <p>• <strong>Off Shift (7:30pm-4:30am):</strong> 1.5x Basic Salary</p>
                <p>• <strong>Additional Duty:</strong> 1.25x Basic Salary</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
