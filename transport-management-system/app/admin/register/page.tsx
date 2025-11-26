// app/admin/register/page.tsx
'use client';

import { useState } from 'react';

interface Student {
  enrollmentNo: string;
  name: string;
  grade: string;
  section: string;
  parentContact: string;
  address: string;
}

interface WhatsAppMessage {
  show: boolean;
  message: string;
  studentName: string;
}

export default function TransportRegistration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    busNo: '',
    routeNo: '',
    pickupPoint: '',
    shift: 'FN',
    startDate: new Date().toISOString().split('T')[0],
    monthlyFee: '200',
    specialNotes: ''
  });
  const [whatsappPopup, setWhatsappPopup] = useState<WhatsAppMessage>({
    show: false,
    message: '',
    studentName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Demo buses and routes - will fetch from Google Sheets in production
  const buses = ['BUS01', 'BUS02', 'BUS03', 'BUS04', 'BUS05', 'BUS06', 'BUS07', 'BUS08', 'BUS09', 'BUS10'];
  const routes = ['Route 01 - Al Sadd', 'Route 02 - Najma', 'Route 03 - Madinat Khalifa', 'Route 04 - Al Waab', 'Route 05 - Bin Mahmoud'];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter enrollment number');
      return;
    }

    setLoading(true);
    
    // TODO: Fetch from Google Sheets API
    // For now, using demo data
    setTimeout(() => {
      // Simulate API call
      setStudent({
        enrollmentNo: searchQuery,
        name: 'Ahmed Ali Hassan',
        grade: '5',
        section: 'A',
        parentContact: '+974 5555 1234',
        address: 'Al Sadd, Doha'
      });
      setLoading(false);
    }, 1000);
  };

  const generateWhatsAppMessage = () => {
    return `Dear Parent,

Your ward *${student?.name}* (Grade ${student?.grade}-${student?.section}, Enrollment: ${student?.enrollmentNo}) has been successfully registered for School Transport.

📍 *Pickup Point:* ${formData.pickupPoint}
🚌 *Bus Number:* ${formData.busNo}
🗺️ *Route:* ${formData.routeNo}
🕐 *Shift:* ${formData.shift === 'FN' ? 'Forenoon (6:30 AM - 7:30 AM)' : 'Afternoon (12:30 PM - 1:30 PM)'}
💰 *Monthly Fee:* QR ${formData.monthlyFee}
📅 *Start Date:* ${formData.startDate}

Please ensure your child is ready 5 minutes before pickup time.

*Important:*
- Driver contact will be shared separately
- First day: Please accompany your child to the pickup point
- Payment due by 5th of each month

For any queries, contact Transport Office.

- Shantiniketan Indian School Qatar
Transport Department`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) {
      alert('Please search and select a student first');
      return;
    }

    // Validate form
    if (!formData.busNo || !formData.routeNo || !formData.pickupPoint) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    // TODO: Submit to Google Sheets API
    // For now, simulating
    setTimeout(() => {
      setSubmitting(false);
      
      // Show WhatsApp message popup
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
      busNo: '',
      routeNo: '',
      pickupPoint: '',
      shift: 'FN',
      startDate: new Date().toISOString().split('T')[0],
      monthlyFee: '200',
      specialNotes: ''
    });
    setWhatsappPopup({ show: false, message: '', studentName: '' });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          🎫 Transport Registration
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Register students for school transport service
        </p>
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
            placeholder="Enter Enrollment Number (e.g., 2024001)"
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
            backgroundColor: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', margin: '0 0 12px 0' }}>
              ✅ Student Found
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Enrollment No:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.enrollmentNo}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Name:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.name}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Grade/Section:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.grade}-{student.section}</p>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Parent Contact:</span>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: '600' }}>{student.parentContact}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Form */}
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
              📝 Step 2: Registration Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Bus Number */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  🚌 Bus Number *
                </label>
                <select
                  value={formData.busNo}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
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
                  <option value="">Select Bus</option>
                  {buses.map(bus => (
                    <option key={bus} value={bus}>{bus}</option>
                  ))}
                </select>
              </div>

              {/* Route */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  🗺️ Route *
                </label>
                <select
                  value={formData.routeNo}
                  onChange={(e) => setFormData({ ...formData, routeNo: e.target.value })}
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
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route} value={route}>{route}</option>
                  ))}
                </select>
              </div>

              {/* Pickup Point */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📍 Pickup Point *
                </label>
                <input
                  type="text"
                  value={formData.pickupPoint}
                  onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                  placeholder="e.g., Al Sadd Park Gate"
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

              {/* Shift */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  🕐 Shift *
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
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
                  <option value="FN">FN (Forenoon)</option>
                  <option value="AN">AN (Afternoon)</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  📅 Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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

              {/* Monthly Fee */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  💰 Monthly Fee (QR) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
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
            </div>

            {/* Special Notes */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                📝 Special Notes (Optional)
              </label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                placeholder="Any special instructions or notes..."
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

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  backgroundColor: submitting ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Registering...' : '✅ Register Student'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ❌ Cancel
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
              🎉 Registration Successful!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {whatsappPopup.studentName} has been registered for transport.
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
              ✖️ Close & Register Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
