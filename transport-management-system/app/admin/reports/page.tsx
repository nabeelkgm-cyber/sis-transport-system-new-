// app/admin/reports/page.tsx
'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');

  const reports = [
    { id: 'students', name: 'Students Report', icon: '👥', desc: 'All students with transport details', color: '#3b82f6' },
    { id: 'buses', name: 'Buses Report', icon: '🚌', desc: 'Bus capacity and assignments', color: '#10b981' },
    { id: 'attendance', name: 'Attendance Report', icon: '✅', desc: 'Daily/monthly attendance summary', color: '#8b5cf6' },
    { id: 'km-logs', name: 'KM Logs Report', icon: '🛣️', desc: 'Driver KM tracking', color: '#06b6d4' },
    { id: 'overtime', name: 'Overtime Report', icon: '⏰', desc: 'Staff overtime calculations', color: '#f59e0b' },
    { id: 'financial', name: 'Financial Report', icon: '💰', desc: 'Fee collection and revenue', color: '#ef4444' },
  ];

  const handleGenerate = async (reportId: string) => {
    setSelectedReport(reportId);
    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(`✅ ${reports.find(r => r.id === reportId)?.name} generated successfully!\n\nDownload will start automatically.`);
    }, 2000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          📊 Reports Generation
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Generate and download comprehensive transport reports
        </p>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {reports.map(report => (
          <div
            key={report.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid transparent',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = report.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              backgroundColor: `${report.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              marginBottom: '16px'
            }}>
              {report.icon}
            </div>

            {/* Report Info */}
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              {report.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0' }}>
              {report.desc}
            </p>

            {/* Generate Button */}
            <button
              onClick={() => handleGenerate(report.id)}
              disabled={generating && selectedReport === report.id}
              style={{
                width: '100%',
                backgroundColor: report.color,
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: generating && selectedReport === report.id ? 'not-allowed' : 'pointer',
                opacity: generating && selectedReport === report.id ? 0.6 : 1
              }}
            >
              {generating && selectedReport === report.id ? '⏳ Generating...' : '📥 Generate Report'}
            </button>
          </div>
        ))}
      </div>

      {/* Quick Filters Section */}
      <div style={{
        marginTop: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0' }}>
          🔍 Quick Filters
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Date Range
            </label>
            <select style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
              <option>Custom Range</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Format
            </label>
            <select style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}>
              <option>PDF</option>
              <option>Excel (.xlsx)</option>
              <option>CSV</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Include
            </label>
            <select style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}>
              <option>All Data</option>
              <option>Active Only</option>
              <option>Summary Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div style={{
        marginTop: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0' }}>
          📁 Recent Reports
        </h2>
        
        <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          No recent reports. Generate your first report above!
        </div>
      </div>
    </div>
  );
}
