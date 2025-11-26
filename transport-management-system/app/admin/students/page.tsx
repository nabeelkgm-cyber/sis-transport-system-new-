// app/admin/students/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Student {
  enrollmentNo: string;
  name: string;
  grade: string;
  section: string;
  parentContact: string;
  transportStatus: string;
  busNo?: string;
  routeNo?: string;
  shift?: string;
}

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTransport, setFilterTransport] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, filterTransport, filterGrade, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students/list');
      const data = await response.json();
      
      if (data.success && data.students) {
        setStudents(data.students);
        setFilteredStudents(data.students);
      } else {
        console.error('Failed to fetch students:', data.error);
        alert('Failed to load students. Using demo data.');
        // Fallback to demo data
        const demoData: Student[] = [
          { enrollmentNo: '2024001', name: 'Ahmed Ali Hassan', grade: '5', section: 'A', parentContact: '+974 5555 1234', transportStatus: 'Active', busNo: 'BUS01', routeNo: 'Route 01', shift: 'FN' },
        ];
        setStudents(demoData);
        setFilteredStudents(demoData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error connecting to Google Sheets. Check environment variables.');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.enrollmentNo.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.busNo?.toLowerCase().includes(query) ||
        s.parentContact.includes(query)
      );
    }

    // Transport status filter
    if (filterTransport !== 'all') {
      filtered = filtered.filter(s => {
        if (filterTransport === 'active') return s.transportStatus === 'Active';
        if (filterTransport === 'notusing') return s.transportStatus === 'Not Using';
        return true;
      });
    }

    // Grade filter
    if (filterGrade !== 'all') {
      filtered = filtered.filter(s => s.grade === filterGrade);
    }

    setFilteredStudents(filtered);
  };

  const exportToExcel = () => {
    alert('Export to Excel functionality - Coming soon!');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            👥 Students Management
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            View and manage all students
          </p>
        </div>
        <button
          onClick={exportToExcel}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📥 Export to Excel
        </button>
      </div>

      {/* Filters & Search */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Search */}
          <input
            type="search"
            placeholder="🔍 Search by name, enrollment, bus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              gridColumn: 'span 2'
            }}
          />

          {/* Transport Filter */}
          <select
            value={filterTransport}
            onChange={(e) => setFilterTransport(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="all">All Students</option>
            <option value="active">Using Transport</option>
            <option value="notusing">Not Using Transport</option>
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value="all">All Grades</option>
            {['KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Students</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{students.length}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Using Transport</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            {students.filter(s => s.transportStatus === 'Active').length}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Not Using</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6b7280', margin: 0 }}>
            {students.filter(s => s.transportStatus === 'Not Using').length}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No students found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Enrollment</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Grade</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Transport</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Bus</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.enrollmentNo} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', color: '#1f2937', fontWeight: '500' }}>{student.enrollmentNo}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{student.name}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{student.grade}-{student.section}</td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>{student.parentContact}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: student.transportStatus === 'Active' ? '#d1fae5' : '#f3f4f6',
                        color: student.transportStatus === 'Active' ? '#065f46' : '#6b7280'
                      }}>
                        {student.transportStatus}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#1f2937' }}>
                      {student.busNo || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {student.transportStatus === 'Active' ? (
                          <Link
                            href={`/admin/cancel?enrollment=${student.enrollmentNo}`}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              textDecoration: 'none'
                            }}
                          >
                            Cancel
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/register?enrollment=${student.enrollmentNo}`}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              textDecoration: 'none'
                            }}
                          >
                            Register
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginTop: '16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
}
