import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    Download,
    Filter
} from 'lucide-react';
import { attendanceService } from '../services/api';
import toast from 'react-hot-toast';

const Attendance = () => {
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const data = await attendanceService.getAll();
            setAttendanceLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to retrieve attendance audit logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const filteredLogs = (Array.isArray(attendanceLogs) ? attendanceLogs : []).filter(log =>
        log &&
        log.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDate === '' || new Date(log.date).toDateString() === new Date(selectedDate).toDateString())
    );

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Attendance & Time Tracking</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Monitor global resource availability and system check-ins.</p>
                </div>
                <button className="btn-corporate btn-corporate-outline">
                    <Download size={18} />
                    <span>Audit Report</span>
                </button>
            </div>

            <div className="card-professional mb-4">
                <div className="row g-3">
                    <div className="col-md-9">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Filter records by resource name..."
                                className="form-input-corporate ps-5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="position-relative">
                            <Calendar className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <input
                                type="date"
                                className="form-input-corporate ps-5"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-professional p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-corporate mb-0">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Billing Date</th>
                                <th>System Check-In</th>
                                <th>System Check-Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No attendance activity found for current period.</td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={16} color="var(--primary-color)" />
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{log.user_id?.name || 'Unknown User'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 text-secondary">
                                                <Calendar size={14} className="text-muted" />
                                                {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2" style={{ color: '#16a34a', fontWeight: '500' }}>
                                                <Clock size={14} />
                                                {log.checkin_time ? new Date(log.checkin_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2" style={{ color: '#dc2626', fontWeight: '500' }}>
                                                <Clock size={14} />
                                                {log.checkout_time ? new Date(log.checkout_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-badge status-success">ACTIVE</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 border-top d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-main)' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Showing {filteredLogs.length} activity records</span>
                    <div className="d-flex gap-2">
                        <button className="btn-corporate btn-corporate-outline p-1" style={{ width: '32px', height: '32px' }}>&lt;</button>
                        <button className="btn-corporate btn-corporate-outline p-1" style={{ width: '32px', height: '32px' }}>&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
