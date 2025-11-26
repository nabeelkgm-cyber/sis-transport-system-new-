// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalStudents: number;
  studentsFN: number;
  studentsAN: number;
  totalBuses: number;
  totalCapacityFN: number;
  totalCapacityAN: number;
  totalCapacity: number;
  currentStudentsFN: number;
  currentStudentsAN: number;
  currentStudentsTotal: number;
  utilizationFN: number;
  utilizationAN: number;
  utilizationTotal: number;
}

interface BusUtil {
  busNo: string;
  current: number;
  capacity: number;
  percentage: number;
}

interface RecentReg {
  date: string;
  student: string;
  bus: string;
  shift: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    studentsFN: 0,
    studentsAN: 0,
    totalBuses: 0,
    totalCapacityFN: 0,
    totalCapacityAN: 0,
    totalCapacity: 0,
    currentStudentsFN: 0,
    currentStudentsAN: 0,
    currentStudentsTotal: 0,
    utilizationFN: 0,
    utilizationAN: 0,
    utilizationTotal: 0
  });
  const [busUtilization, setBusUtilization] = useState<BusUtil[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentReg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students
      const studentsRes = await fetch('/api/students/list');
      const studentsData = await studentsRes.json();
      
      // Fetch buses
      const busesRes = await fetch('/api/buses/list');
      const busesData = await busesRes.json();

      if (studentsData.success && busesData.success) {
        const students = studentsData.students || [];
        const buses = busesData.buses || [];

        // Filter students using transport
        const transportStudents = students.filter((s: any) => 
          s.transportStatus === 'Using' || s.transportStatus === 'Active'
        );

        // Count by shift
        const fnStudents = transportStudents.filter((s: any) => s.shift === 'FN' || s.shift === 'Forenoon').length;
        const anStudents = transportStudents.filter((s: any) => s.shift === 'AN' || s.shift === 'Afternoon').length;

        // Calculate total capacity
        const totalCap = buses.reduce((sum: number, b: any) => sum + (parseInt(b.capacity) || 0), 0);
        
        // For FN/AN capacity, assume equal distribution (or you can add shift-specific capacity in Bus Master)
        const capacityFN = Math.floor(totalCap / 2);
        const capacityAN = Math.floor(totalCap / 2);

        // Calculate utilization
        const utilizeFN = capacityFN > 0 ? Math.round((fnStudents / capacityFN) * 100) : 0;
        const utilizeAN = capacityAN > 0 ? Math.round((anStudents / capacityAN) * 100) : 0;
        const utilizeTotal = totalCap > 0 ? Math.round((transportStudents.length / totalCap) * 100) : 0;

        setStats({
          totalStudents: students.length,
          studentsFN: fnStudents,
          studentsAN: anStudents,
          totalBuses: buses.length,
          totalCapacityFN: capacityFN,
          totalCapacityAN: capacityAN,
          totalCapacity: totalCap,
          currentStudentsFN: fnStudents,
          currentStudentsAN: anStudents,
          currentStudentsTotal: transportStudents.length,
          utilizationFN: utilizeFN,
          utilizationAN: utilizeAN,
          utilizationTotal: utilizeTotal
        });

        // Recent registrations (last 5 students using transport)
        const recentReg = transportStudents
          .slice(-5)
          .reverse()
          .map((s: any) => ({
            date: s.registrationDate || 'Nov 25',
            student: s.name,
            bus: s.busNo || '-',
            shift: s.shift || '-'
          }));
        setRecentRegistrations(recentReg);

        // Bus utilization - calculate from students
        const busUtil = buses.map((bus: any) => {
          const capacity = parseInt(bus.capacity) || 40;
          // Count students assigned to this bus
          const busStudents = transportStudents.filter((s: any) => s.busNo === bus.busNo);
          const current = busStudents.length;
          const percentage = capacity > 0 ? Math.round((current / capacity) * 100) : 0;
          
          return {
            busNo: bus.busNo,
            current,
            capacity,
            percentage
          };
        }).filter((b: any) => b.busNo).slice(0, 6); // Top 6 buses
        
        setBusUtilization(busUtil);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, subValue, color, link }: any) => (
    <Link
      href={link}
      style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
        transition: 'all 0.2s',
        border: '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', margin: '0 0 12px 0' }}>
            {label}
          </p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            {value}
          </p>
          {subValue && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {subValue}
            </p>
          )}
        </div>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px'
        }}>
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          📊 Transport Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
          Welcome back! Here's your transport system overview
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* Total Students */}
            <StatCard
              icon="👥"
              label="Total Students"
              value={stats.totalStudents}
              subValue={`FN: ${stats.studentsFN} | AN: ${stats.studentsAN}`}
              color="#3b82f6"
              link="/admin/students"
            />

            {/* Total Buses */}
            <StatCard
              icon="🚌"
              label="Total Buses"
              value={stats.totalBuses}
              subValue={`Capacity: ${stats.totalCapacity} seats`}
              color="#10b981"
              link="/admin/buses"
            />

            {/* Total Capacity */}
            <StatCard
              icon="💺"
              label="Total Capacity"
              value={stats.totalCapacity}
              subValue={`FN: ${stats.totalCapacityFN} | AN: ${stats.totalCapacityAN}`}
              color="#f59e0b"
              link="/admin/buses"
            />

            {/* Current Students */}
            <StatCard
              icon="👨‍🎓"
              label="Students Using Transport"
              value={stats.currentStudentsTotal}
              subValue={`FN: ${stats.currentStudentsFN} | AN: ${stats.currentStudentsAN}`}
              color="#8b5cf6"
              link="/admin/students"
            />

            {/* Capacity Utilization FN */}
            <StatCard
              icon="📊"
              label="FN Utilization"
              value={`${stats.utilizationFN}%`}
              subValue={`${stats.currentStudentsFN} / ${stats.totalCapacityFN} seats`}
              color="#06b6d4"
              link="/admin/students"
            />

            {/* Capacity Utilization AN */}
            <StatCard
              icon="📈"
              label="AN Utilization"
              value={`${stats.utilizationAN}%`}
              subValue={`${stats.currentStudentsAN} / ${stats.totalCapacityAN} seats`}
              color="#ec4899"
              link="/admin/students"
            />

            {/* Total Utilization */}
            <StatCard
              icon="🎯"
              label="Total Utilization"
              value={`${stats.utilizationTotal}%`}
              subValue={`${stats.currentStudentsTotal} / ${stats.totalCapacity} seats`}
              color="#ef4444"
              link="/admin/buses"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Link href="/admin/register" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>
                  ➕ Register Student
                </div>
              </Link>

              <Link href="/admin/cancel" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}>
                  ❌ Cancel Transport
                </div>
              </Link>

              <Link href="/admin/students" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}>
                  📋 View Students
                </div>
              </Link>

              <Link href="/admin/reports" style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}>
                  📊 Generate Reports
                </div>
              </Link>
            </div>
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Recent Registrations */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📝</span>
                  Recent Registrations
                </h2>
                <Link href="/admin/students" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                  View All →
                </Link>
              </div>

              {recentRegistrations.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No recent registrations</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentRegistrations.map((reg, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {reg.student}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                          {reg.date} • Shift: {reg.shift}
                        </p>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {reg.bus}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bus Utilization */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚌</span>
                  Bus Utilization
                </h2>
                <Link href="/admin/buses" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                  View All Buses →
                </Link>
              </div>

              {busUtilization.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No buses available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {busUtilization.map((bus, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{bus.busNo}</span>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          {bus.current}/{bus.capacity} ({bus.percentage}%)
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
                          width: `${bus.percentage}%`,
                          height: '100%',
                          backgroundColor: bus.percentage > 90 ? '#ef4444' : bus.percentage > 75 ? '#f59e0b' : '#10b981',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
