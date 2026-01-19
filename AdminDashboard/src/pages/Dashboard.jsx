import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    Clock,
    FileText,
    ArrowUpRight,
    Briefcase,
    Tag,
    TrendingUp
} from 'lucide-react';
import {
    employeeService,
    attendanceService,
    leaveService,
    holidayService,
    teamService,
    eventService
} from '../services/api';

const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="card-professional h-100 d-flex flex-column justify-content-between"
        style={{ borderLeft: `4px solid ${color}` }}
    >
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${color}15`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color
                }}>
                    {icon}
                </div>
                {trend && (
                    <div className={`status-badge ${trend?.startsWith('+') ? 'status-success' : 'status-danger'}`} style={{ fontSize: '0.7rem' }}>
                        {trend}
                    </div>
                )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em', margin: 0 }}>{title}</p>
        </div>
        <div className="mt-2 d-flex align-items-baseline gap-2">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{value}</h3>
            {trend && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs last month</span>}
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        attendanceToday: 0,
        leaveRequests: 0,
        upcomingHolidays: 0,
        totalTeams: 0,
        upcomingEvents: 0
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [
                employees = [],
                attendance = [],
                leaves = [],
                holidays = [],
                teams = [],
                eventData = []
            ] = await Promise.all([
                employeeService.getAll().catch(() => []),
                attendanceService.getAll().catch(() => []),
                leaveService.getAll().catch(() => []),
                holidayService.getAll().catch(() => []),
                teamService.getAll().catch(() => []),
                eventService.getAll().catch(() => [])
            ]);

            const today = new Date().toDateString();
            const attendanceTodayCount = (Array.isArray(attendance) ? attendance : []).filter(a => a && a.date && new Date(a.date).toDateString() === today).length;
            const pendingLeaves = (Array.isArray(leaves) ? leaves : []).filter(l => l && l.status === 'pending');
            const upcomingHolidaysCount = (Array.isArray(holidays) ? holidays : []).filter(h => h && h.date && new Date(h.date) >= new Date()).length;

            setStats({
                totalEmployees: Array.isArray(employees) ? employees.length : 0,
                attendanceToday: attendanceTodayCount,
                leaveRequests: pendingLeaves.length,
                upcomingHolidays: upcomingHolidaysCount,
                totalTeams: Array.isArray(teams) ? teams.length : 0,
                upcomingEvents: Array.isArray(eventData) ? eventData.length : 0
            });

            setRecentLeaves(Array.isArray(leaves) ? leaves.slice(0, 5) : []);
            setEvents(Array.isArray(eventData) ? eventData.slice(0, 4) : []);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statCards = [
        { title: 'Total Employees', value: stats.totalEmployees, icon: <Users size={20} />, color: '#2563eb', trend: '+12.5%' },
        { title: 'Active Today', value: stats.attendanceToday, icon: <Clock size={20} />, color: '#16a34a', trend: '+4.2%' },
        { title: 'Pending Leaves', value: stats.leaveRequests, icon: <FileText size={20} />, color: '#ca8a04', trend: '-2.1%' },
        { title: 'Public Holidays', value: stats.upcomingHolidays, icon: <Calendar size={20} />, color: '#db2777' },
        { title: 'Organization Teams', value: stats.totalTeams, icon: <Briefcase size={20} />, color: '#7c3aed' },
        { title: 'Upcoming Events', value: stats.upcomingEvents, icon: <Tag size={20} />, color: '#0891b2' },
    ];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Executive Summary</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Monitor organization health and department performance metrics.</p>
                </div>
                <button className="btn-corporate btn-corporate-primary">
                    <TrendingUp size={18} />
                    <span>Download Report</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="row g-4 mb-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-xl-2">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Recent Leave Requests */}
                <div className="col-12 col-xl-8">
                    <div className="card-professional h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>Payroll & Leave Requests</h4>
                            <button className="btn btn-link p-0 text-decoration-none" style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.875rem' }}>
                                Full Logs <ArrowUpRight size={16} />
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table-corporate">
                                <thead>
                                    <tr>
                                        <th>Resource Name</th>
                                        <th>Reason for Leave</th>
                                        <th>Period</th>
                                        <th>Current Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(recentLeaves) ? recentLeaves : []).map((leave, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Users size={16} color="var(--primary-color)" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{leave?.user_id?.name || 'MNC Resource'}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leave?.user_id?.email || 'Corporate ID'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '200px' }} className="text-truncate">{leave?.reason}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>
                                                {leave?.from_date ? new Date(leave.from_date).toLocaleDateString() : 'N/A'} - {leave?.to_date ? new Date(leave.to_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${leave?.status === 'approved' ? 'status-success' :
                                                        leave?.status === 'rejected' ? 'status-danger' : 'status-warning'
                                                    }`}>
                                                    {leave?.status?.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentLeaves.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">No recent leave requests found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="col-12 col-xl-4">
                    <div className="card-professional h-100">
                        <h4 className="mb-4" style={{ fontSize: '1.125rem', fontWeight: '600' }}>Corporate Calendar</h4>
                        <div className="timeline-corporate">
                            {(Array.isArray(events) ? events : []).map((event, idx) => (
                                <div key={idx} className="d-flex gap-4 mb-4 position-relative">
                                    {idx !== events.length - 1 && (
                                        <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: '-20px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
                                    )}
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: event?.type === 'Meeting' ? 'var(--primary-light)' : 'var(--bg-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: event?.type === 'Meeting' ? 'var(--primary-color)' : 'var(--text-muted)',
                                        zIndex: 1
                                    }}>
                                        <Tag size={16} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9375rem' }}>{event?.title}</div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>{event?.time || '9:00 AM'}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                            <Calendar size={14} />
                                            <span>{event?.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</span>
                                            <span style={{ opacity: 0.3 }}>|</span>
                                            <span>{event?.location || 'Conference Room A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!events || events.length === 0) && (
                                <div className="text-center py-5 text-muted">
                                    <Calendar size={40} className="mb-3 opacity-10" />
                                    <p>No upcoming corporate events.</p>
                                </div>
                            )}
                        </div>
                        <button className="btn-corporate btn-corporate-outline w-100 mt-2">View Full Calendar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
