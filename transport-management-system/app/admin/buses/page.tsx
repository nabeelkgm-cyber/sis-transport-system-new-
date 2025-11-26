// app/admin/buses/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Bus {
  busNo: string;
  capacity: number;
  driver: string;
  conductor: string;
  status: string;
  currentStudents: number;
}

export default function BusesManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    busNo: '',
    capacity: 40,
    driver: '',
    conductor: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/buses/list');
      const data = await response.json();
      
      if (data.success && data.buses) {
        setBuses(data.buses);
      } else {
        console.error('Failed to fetch buses:', data.error);
        alert('Failed to load buses. Using demo data.');
        // Fallback to demo data
        const demoData: Bus[] = [
          { busNo: 'BUS01', capacity: 45, driver: 'Ahmed Ali', conductor: 'Hassan', status: 'Active', currentStudents: 42 },
          { busNo: 'BUS02', capacity: 40, driver: 'Mohammed', conductor: 'Salim', status: 'Active', currentStudents: 35 },
        ];
        setBuses(demoData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to Google Sheets. Check environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBus) {
      // Update bus
      setBuses(buses.map(b => b.busNo === editingBus.busNo ? { ...b, ...formData, currentStudents: b.currentStudents } : b));
      alert('✅ Bus updated successfully!');
    } else {
      // Add new bus
      const newBus: Bus = { ...formData, currentStudents: 0 };
      setBuses([...buses, newBus]);
      alert('✅ Bus added successfully!');
    }
    
    resetForm();
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    setFormData({
      busNo: bus.busNo,
      capacity: bus.capacity,
      driver: bus.driver,
      conductor: bus.conductor,
      status: bus.status
    });
    setShowAddModal(true);
  };

  const handleDelete = (busNo: string) => {
    if (window.confirm(`Are you sure you want to delete ${busNo}?`)) {
      setBuses(buses.filter(b => b.busNo !== busNo));
      alert('✅ Bus deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({ busNo: '', capacity: 40, driver: '', conductor: '', status: 'Active' });
    setEditingBus(null);
    setShowAddModal(false);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            🚌 Buses Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Manage fleet and track utilization
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
          ➕ Add New Bus
        </button>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Buses</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{buses.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Active Buses</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {buses.filter(b => b.status === 'Active').length}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Capacity</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {buses.reduce((sum, b) => sum + b.capacity, 0)}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Current Students</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>
            {buses.reduce((sum, b) => sum + b.currentStudents, 0)}
          </p>
        </div>
      </div>

      {/* Buses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {buses.map(bus => {
          const utilization = (bus.currentStudents / bus.capacity) * 100;
          return (
            <div
              key={bus.busNo}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: bus.status !== 'Active' ? '2px solid #fbbf24' : 'none'
              }}
            >
              {/* Bus Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                    {bus.busNo}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: bus.status === 'Active' ? '#d1fae5' : '#fef3c7',
                    color: bus.status === 'Active' ? '#065f46' : '#92400e'
                  }}>
                    {bus.status}
                  </span>
                </div>
                <div style={{ fontSize: '32px' }}>🚌</div>
              </div>

              {/* Capacity Info */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>Capacity</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {bus.currentStudents}/{bus.capacity}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(utilization, 100)}%`,
                    height: '100%',
                    backgroundColor: getUtilizationColor(utilization),
                    transition: 'width 0.3s'
                  }} />
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', textAlign: 'right' }}>
                  {utilization.toFixed(0)}% utilized
                </p>
              </div>

              {/* Staff Info */}
              <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>👨‍✈️</span>
                  <span style={{ color: '#6b7280' }}>Driver:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{bus.driver}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🧍</span>
                  <span style={{ color: '#6b7280' }}>Conductor:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>{bus.conductor}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(bus)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(bus.busNo)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
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
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 24px 0' }}>
              {editingBus ? '✏️ Edit Bus' : '➕ Add New Bus'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Bus Number *
                </label>
                <input
                  type="text"
                  value={formData.busNo}
                  onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                  placeholder="e.g., BUS01"
                  required
                  disabled={!!editingBus}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                  min="20"
                  max="60"
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Driver Name *
                </label>
                <input
                  type="text"
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  placeholder="Driver name"
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Conductor Name *
                </label>
                <input
                  type="text"
                  value={formData.conductor}
                  onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                  placeholder="Conductor name"
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

              <div style={{ marginBottom: '24px' }}>
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
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
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
                  {editingBus ? 'Update Bus' : 'Add Bus'}
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
