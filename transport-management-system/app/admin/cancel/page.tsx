// app/admin/cancel/page.tsx
'use client';

import { useState } from 'react';

interface Student {
  enrollmentNo: string;
  name: string;
  grade: string;
  section: string;
  parentContact: string;
  busNo: string;
  routeNo: string;
  pickupPoint: string;
  shift: string;
  monthlyFee: string;
}

interface WhatsAppMessage {
  show: boolean;
  message: string;
  studentName: string;
}

export default function TransportCancellation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    lastDate: new Date().toISOString().split('T')[0],
    refundAmount: '',
    additionalNotes: ''
  });
  const [whatsappPopup, setWhatsappPopup] = useState<WhatsAppMessage>({
    show: false,
    message: '',
    studentName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const cancellationReasons = [
    'Family relocating',
    'Parent transport arranged',
    'Shifting to nearby accommodation',
    'Financial reasons',
    'Student withdrawn from school',
    'Service not satisfactory',
    'Other'
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter enrollment number');
      return;
    }

    setLoading(true);
    
    // TODO: Fetch from Google Sheets API
    setTimeout(() => {
      setStudent({
        enrollmentNo: searchQuery,
        name: 'Ahmed Ali Hassan',
        grade: '5',
        section: 'A',
        parentContact: '+974 5555 1234',
        busNo: 'BUS01',
        routeNo: 'Route 01 - Al Sadd',
        pickupPoint: 'Al Sadd Park Gate',
        shift: 'FN',
        monthlyFee: '200'
      });
      setLoading(false);
    }, 1000);
  };

  const generateWhatsAppMessage = () => {
    return `Dear Parent,

Transport service for your ward *${student?.name}* (Grade ${student?.grade}-${student?.section}, Enrollment: ${student?.enrollmentNo}) has been *cancelled* as requested.

*PREVIOUS DETAILS:*
🚌 Bus Number: ${student?.busNo}
🗺️ Route: ${student?.routeNo}
📍 Pickup Point: ${student?.pickupPoint}
🕐 Shift: ${student?.shift === 'FN' ? 'Forenoon' : 'Afternoon'}

*CANCELLATION DETAILS:*
📅 Last Day of Service: ${formData.lastDate}
📝 Reason: ${formData.reason}
${formData.refundAmount ? `💰 Refund Amount: QR ${formData.refundAmount}` : ''}

${formData.refundAmount ? 'Refund will be processed within 7-10 working days.' : ''}

If you wish to re-register for transport in the future, please contact the Transport Office.

Thank you for using our transport service.

- Shantiniketan Indian School Qatar
Transport Department`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) {
      alert('Please search and select a student first');
      return;
    }

    if (!formData.reason) {
      alert('Please select cancellation reason');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel transport for ${student.name}?\n\nThis action will mark the transport registration as cancelled.`
    );

    if (!confirmed) return;

    setSubmitting(true);

    // TODO: Update Google Sheets API
    setTimeout(() => {
      setSubmitting(false);
      
      setWhatsappPopup({
        show: true,
        message: generateWhatsAppMessage(),
        studentName: student.name
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappPopup.message);
    alert('✅ Message copied! Now paste it in WhatsApp');
  };

  const openWhatsApp = () => {
    const phone = student?.parentContact.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(whatsappPopup.message);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const resetForm = () => {
    setStudent(null);
    setSearchQuery('');
    setFormData({
      reason: '',
      lastDate: new Date().toISOString().split('T')[0],
      refundAmount: '',
      additionalNotes: ''
    });
    setWhatsappPopup({ show: false, message: '', studentName: '' });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          ❌ Transport Cancellation
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Cancel student transport registration
        </p>
      </div>

      {/* Warning Banner */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '2px solid #fbbf24',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'start'
      }}>
        <span style={{ fontSize: '24px' }}>⚠️</span>
        <div>
          <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#92400e' }}>
            Important Notice
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
            Cancelling transport will remove the student from the bus route. Please ensure you have confirmed this with the parent before proceeding.
          </p>
        </div>
      </div>

      {/* Student Search */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 16px 0' }}>
          🔍 Step 1: Search Student
        </h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter Enrollment Number"
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {student && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '2px solid #fca5a5',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#991b1b', margin: '0 0 16px 0' }}>
              🚌 Current Transport Registration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Student:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.name}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Enrollment:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.enrollmentNo}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Grade/Section:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.grade}-{student.section}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Bus Number:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.busNo}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Route:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.routeNo}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Pickup Point:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.pickupPoint}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Shift:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.shift}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Monthly Fee:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>QR {student.monthlyFee}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Form */}
      {student && (
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px 0' }}>
              📝 Step 2: Cancellation Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📋 Reason for Cancellation *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Reason</option>
                  {cancellationReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Last Date */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📅 Last Day of Service *
                </label>
                <input
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Refund Amount */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  💰 Refund Amount (QR) - Optional
                </label>
                <input
                  type="number"
                  value={formData.refundAmount}
                  onChange={(e) => setFormData({ ...formData, refundAmount: e.target.value })}
                  placeholder="Enter refund amount if applicable"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                📝 Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any additional information..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  backgroundColor: submitting ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Cancelling...' : '❌ Cancel Transport'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ↩️ Back
              </button>
            </div>
          </div>
        </form>
      )}

      {/* WhatsApp Message Popup */}
      {whatsappPopup.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              ✅ Cancellation Completed
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Transport has been cancelled for {whatsappPopup.studentName}.
            </p>

            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {whatsappPopup.message}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📋 Copy Message
              </button>
              <button
                onClick={openWhatsApp}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📱 Open WhatsApp
              </button>
            </div>

            <button
              onClick={() => {
                setWhatsappPopup({ show: false, message: '', studentName: '' });
                resetForm();
              }}
              style={{
                width: '100%',
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              ✖️ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
