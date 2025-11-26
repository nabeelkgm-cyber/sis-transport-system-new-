// app/admin/routes/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Route {
  routeNo: string;
  routeName: string;
  area: string;
  stops: string;
  distance: number;
  timingFN: string;
  timingAN: string;
  status: string;
}

export default function RoutesManagement() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    routeNo: '',
    routeName: '',
    area: '',
    stops: '',
    distance: 0,
    timingFN: '6:30 AM - 7:30 AM',
    timingAN: '12:30 PM - 1:30 PM',
    status: 'Active'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/routes/list');
      const data = await response.json();
      
      if (data.success) {
        setRoutes(data.routes || []);
      } else {
        // Fallback to demo data
        const demoData: Route[] = [
          { routeNo: 'Route 01', routeName: 'Al Sadd Route', area: 'Al Sadd', stops: 'Al Sadd Park, Sports City, Museum', distance: 12.5, timingFN: '6:30 AM', timingAN: '12:30 PM', status: 'Active' },
          { routeNo: 'Route 02', routeName: 'Najma Route', area: 'Najma', stops: 'Najma Market, C-Ring Road, Old Airport', distance: 15.2, timingFN: '6:45 AM', timingAN: '12:45 PM', status: 'Active' },
          { routeNo: 'Route 03', routeName: 'Madinat Khalifa', area: 'Madinat Khalifa', stops: 'Khalifa Park, Education City, Al Waab', distance: 18.0, timingFN: '6:20 AM', timingAN: '12:20 PM', status: 'Active' },
        ];
        setRoutes(demoData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoute) {
      setRoutes(routes.map(r => r.routeNo === editingRoute.routeNo ? { ...formData } : r));
      alert('✅ Route updated successfully!');
    } else {
      setRoutes([...routes, formData]);
      alert('✅ Route added successfully!');
    }
    
    resetForm();
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData(route);
    setShowAddModal(true);
  };

  const handleDelete = (routeNo: string) => {
    if (window.confirm(`Delete ${routeNo}?`)) {
      setRoutes(routes.filter(r => r.routeNo !== routeNo));
      alert('✅ Route deleted!');
    }
  };

  const resetForm = () => {
    setFormData({
      routeNo: '',
      routeName: '',
      area: '',
      stops: '',
      distance: 0,
      timingFN: '6:30 AM - 7:30 AM',
      timingAN: '12:30 PM - 1:30 PM',
      status: 'Active'
    });
    setEditingRoute(null);
    setShowAddModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            🗺️ Routes Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Manage transport routes and stops
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
          ➕ Add New Route
        </button>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Routes</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{routes.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Active Routes</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {routes.filter(r => r.status === 'Active').length}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Distance</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
            {routes.reduce((sum, r) => sum + r.distance, 0).toFixed(1)} km
          </p>
        </div>
      </div>

      {/* Routes Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading routes...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route No</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Area</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Stops</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Distance</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>FN Timing</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(route => (
                  <tr key={route.routeNo} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', color: '#1f2937', fontWeight: '500' }}>{route.routeNo}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{route.routeName}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{route.area}</td>
                    <td style={{ padding: '16px', color: '#6b7280', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {route.stops}
                    </td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{route.distance} km</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{route.timingFN}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: route.status === 'Active' ? '#d1fae5' : '#f3f4f6',
                        color: route.status === 'Active' ? '#065f46' : '#6b7280'
                      }}>
                        {route.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(route)}
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
                          onClick={() => handleDelete(route.routeNo)}
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
                          🗑️ Delete
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
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 24px 0' }}>
              {editingRoute ? '✏️ Edit Route' : '➕ Add New Route'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Route No *
                  </label>
                  <input
                    type="text"
                    value={formData.routeNo}
                    onChange={(e) => setFormData({ ...formData, routeNo: e.target.value })}
                    placeholder="Route 01"
                    required
                    disabled={!!editingRoute}
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
                    Route Name *
                  </label>
                  <input
                    type="text"
                    value={formData.routeName}
                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                    placeholder="Al Sadd Route"
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
                    Area *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Al Sadd"
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
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
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
                    FN Timing *
                  </label>
                  <input
                    type="text"
                    value={formData.timingFN}
                    onChange={(e) => setFormData({ ...formData, timingFN: e.target.value })}
                    placeholder="6:30 AM"
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
                    AN Timing *
                  </label>
                  <input
                    type="text"
                    value={formData.timingAN}
                    onChange={(e) => setFormData({ ...formData, timingAN: e.target.value })}
                    placeholder="12:30 PM"
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

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Stops (comma-separated) *
                </label>
                <textarea
                  value={formData.stops}
                  onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                  placeholder="Al Sadd Park, Sports City, Museum"
                  required
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

              <div style={{ marginTop: '16px' }}>
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
                  <option value="Inactive">Inactive</option>
                </select>
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
                  {editingRoute ? 'Update Route' : 'Add Route'}
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
