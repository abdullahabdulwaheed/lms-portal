import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    X,
    ClipboardList,
    AlertCircle
} from 'lucide-react';
import { leaveService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Leaves = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        reason: '',
        from_date: '',
        to_date: ''
    });

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const data = await leaveService.getAll();
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to fetch leaves');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            await leaveService.apply(formData);
            toast.success('Leave application submitted');
            setShowModal(false);
            setFormData({ reason: '', from_date: '', to_date: '' });
            fetchLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit leave');
        }
    };

    const handleStatusUpdate = async (id, status, isSuper) => {
        try {
            if (isSuper) {
                await leaveService.approve(id, status);
            } else {
                await leaveService.process(id, status);
            }
            toast.success(`Leave ${status.toLowerCase()} successfully`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update leave status');
        }
    };

    const filteredLeaves = leaves.filter(leave =>
        leave.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-success-subtle text-success';
            case 'Rejected': return 'bg-danger-subtle text-danger';
            case 'Pending': return 'bg-warning-subtle text-warning';
            default: return 'bg-secondary-subtle text-secondary';
        }
    };

    return (
        <div className="leaves-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>Leave Requests</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Review and manage employee time-off requests</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary d-flex align-items-center gap-2 py-2 px-4"
                    style={{ borderRadius: '12px' }}
                >
                    <Plus size={20} />
                    Apply For Leave
                </button>
            </div>

            <div className="glass-card mb-4" style={{ padding: '20px' }}>
                <div className="position-relative">
                    <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search by employee or leave type..."
                        className="form-control ps-5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th className="ps-4 py-3 text-muted small fw-bold">EMPLOYEE</th>
                                <th className="py-3 text-muted small fw-bold">REASON</th>
                                <th className="py-3 text-muted small fw-bold">DURATION</th>
                                <th className="py-3 text-muted small fw-bold">STATUS</th>
                                <th className="py-3 text-muted small fw-bold text-end pe-4">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No leave requests found</td></tr>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={14} color="var(--primary-color)" />
                                                </div>
                                                <span className="fw-medium">{leave.user_id?.name || 'Self'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3">{leave.reason}</td>
                                        <td className="py-3">
                                            <div className="small">
                                                <div>{leave.from_date ? new Date(leave.from_date).toLocaleDateString() : 'N/A'} to</div>
                                                <div>{leave.to_date ? new Date(leave.to_date).toLocaleDateString() : 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`badge ${getStatusStyle(leave.status)} rounded-pill`}>{leave.status}</span>
                                        </td>
                                        <td className="py-3 text-end pe-4">
                                            {leave.status === 'Pending' && (
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave._id, 'Approved', user?.role === 'superadmin')}
                                                        className="btn btn-sm btn-success-subtle text-success p-1 rounded"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave._id, 'Rejected', user?.role === 'superadmin')}
                                                        className="btn btn-sm btn-danger-subtle text-danger p-1 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="custom-modal-backdrop" style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3>Apply For Leave</h3>
                                <button onClick={() => setShowModal(false)} className="btn btn-link text-muted p-0"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleApplyLeave}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted">START DATE</label>
                                        <input type="date" name="from_date" className="form-control" value={formData.from_date} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted">END DATE</label>
                                        <input type="date" name="to_date" className="form-control" value={formData.to_date} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">REASON</label>
                                    <textarea name="reason" className="form-control" rows="3" value={formData.reason} onChange={handleInputChange} required placeholder="Why are you taking leave?"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-3">Submit Application</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Leaves;
