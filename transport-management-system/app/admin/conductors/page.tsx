// app/admin/conductors/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Conductor {
  empId: string;
  name: string;
  contact: string;
  busAssigned: string;
  status: string;
  joiningDate: string;
}

export default function ConductorsManagement() {
  const [conductors, setConductors] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null);
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    contact: '',
    busAssigned: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchConductors();
  }, []);

  const fetchConductors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/conductors/list');
      const data = await response.json();
      
      if (data.success) {
        setConductors(data.conductors || []);
      } else {
        // Fallback to demo data
        const demoData: Conductor[] = [
          { empId: 'CND001', name: 'Hassan Ali', contact: '+974 5555 5555', busAssigned: 'BUS01', status: 'Active', joiningDate: '2023-01-15' },
          { empId: 'CND002', name: 'Salim Ahmed', contact: '+974 5555 6666', busAssigned: 'BUS02', status: 'Active', joiningDate: '2023-02-20' },
          { empId: 'CND003', name: 'Yusuf Khan', contact: '+974 5555 7777', busAssigned: 'BUS03', status: 'Active', joiningDate: '2023-03-10' },
          { empId: 'CND004', name: 'Omar Ibrahim', contact: '+974 5555 8888', busAssigned: '-', status: 'On Leave', joiningDate: '2023-04-05' },
        ];
        setConductors(demoData);
      }
    } catch (error) {
      console.error('Error fetching conductors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingConductor) {
      setConductors(conductors.map(c => c.empId === editingConductor.empId ? { ...formData } : c));
      alert('✅ Conductor updated!');
    } else {
      setConductors([...conductors, formData]);
      alert('✅ Conductor added!');
    }
    
    resetForm();
  };

  const handleEdit = (conductor: Conductor) => {
    setEditingConductor(conductor);
    setFormData(conductor);
    setShowAddModal(true);
  };

  const handleDelete = (empId: string, name: string) => {
    if (window.confirm(`Delete ${name}?`)) {
      setConductors(conductors.filter(c => c.empId !== empId));
      alert('✅ Conductor deleted!');
    }
  };

  const resetForm = () => {
    setFormData({
      empId: '',
      name: '',
      contact: '',
      busAssigned: '',
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0]
    });
    setEditingConductor(null);
    setShowAddModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            🚶 Conductors Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Manage conductor information and assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ➕ Add Conductor
        </button>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Conductors</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{conductors.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Active</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {conductors.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Assigned</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {conductors.filter(c => c.busAssigned && c.busAssigned !== '-').length}
          </p>
        </div>
      </div>

      {/* Conductors Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading conductors...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Emp ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Bus Assigned</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {conductors.map(conductor => (
                  <tr key={conductor.empId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', color: '#1f2937', fontWeight: '500' }}>{conductor.empId}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{conductor.name}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{conductor.contact}</td>
                    <td style={{ padding: '16px', color: '#1f2937', fontWeight: '600' }}>
                      {conductor.busAssigned || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: conductor.status === 'Active' ? '#d1fae5' : '#fef3c7',
                        color: conductor.status === 'Active' ? '#065f46' : '#92400e'
                      }}>
                        {conductor.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(conductor)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(conductor.empId, conductor.name)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
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
            width: '100%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 24px 0' }}>
              {editingConductor ? '✏️ Edit Conductor' : '➕ Add Conductor'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Emp ID *
                  </label>
                  <input
                    type="text"
                    value={formData.empId}
                    onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                    placeholder="CND001"
                    required
                    disabled={!!editingConductor}
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Hassan Ali"
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Contact *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+974 5555 1234"
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Bus Assigned
                  </label>
                  <input
                    type="text"
                    value={formData.busAssigned}
                    onChange={(e) => setFormData({ ...formData, busAssigned: e.target.value })}
                    placeholder="BUS01"
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
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
                  {editingConductor ? 'Update' : 'Add Conductor'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
