import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Shield,
    Mail,
    Phone,
    X,
    Save,
    UserCircle,
    Download
} from 'lucide-react';
import { adminService } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Admins = () => {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    });

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAll();
            setAdmins(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to retrieve security administrators');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAdmin) {
                await adminService.update(editingAdmin._id, formData);
                toast.success('Administrator security profile updated');
            } else {
                await adminService.add(formData);
                toast.success('New system administrator authorized');
            }
            setShowModal(false);
            setEditingAdmin(null);
            resetForm();
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'admin' });
    };

    const handleEdit = (admin) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: '',
            role: admin.role
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (id === currentUser.id) return toast.error('Self-deletion of security profiles is prohibited');
        if (window.confirm('Revoke all system administration rights for this resource?')) {
            try {
                await adminService.delete(id);
                toast.success('Security profile revoked');
                fetchAdmins();
            } catch (error) {
                toast.error('Operation failed');
            }
        }
    };

    const filteredAdmins = (Array.isArray(admins) ? admins : []).filter(admin =>
        admin && (
            (admin.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (admin.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>System Administration</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Control root system access and security administrator profiles.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAdmin(null);
                        resetForm();
                        setShowModal(true);
                    }}
                    className="btn-corporate btn-corporate-primary"
                >
                    <Plus size={20} />
                    Grant Admin Access
                </button>
            </div>

            <div className="card-professional mb-4">
                <div className="position-relative">
                    <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search security profiles..."
                        className="form-input-corporate ps-5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredAdmins.map((admin) => (
                        <motion.div
                            layout
                            key={admin._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-md-6 col-xl-4"
                        >
                            <div className="card-professional h-100 position-relative">
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                                    <button onClick={() => handleEdit(admin)} className="btn btn-sm btn-link p-1 text-primary"><Edit2 size={16} /></button>
                                    {admin._id !== currentUser.id && (
                                        <button onClick={() => handleDelete(admin._id)} className="btn btn-sm btn-link p-1 text-danger"><Trash2 size={16} /></button>
                                    )}
                                </div>

                                <div className="d-flex align-items-center gap-4 mb-4">
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        backgroundColor: admin.role === 'superadmin' ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: admin.role === 'superadmin' ? 'var(--primary-color)' : 'var(--text-secondary)'
                                    }}>
                                        <Shield size={28} />
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{admin.name}</h5>
                                        <span className={`status-badge ${admin.role === 'superadmin' ? 'status-info' : 'status-secondary'}`} style={{ fontSize: '0.65rem' }}>
                                            {admin.role?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-top" style={{ fontSize: '0.875rem' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
                                        <Mail size={14} className="text-muted" />
                                        <span>{admin.email}</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between mt-3">
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <span className="text-success fw-bold">Active</span></span>
                                        {admin._id === currentUser.id && (
                                            <span className="status-badge status-primary" style={{ fontSize: '0.65rem' }}>YOU</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="custom-modal-backdrop">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="card-professional shadow-xl"
                            style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingAdmin ? 'Modify Security Profile' : 'New Admin Authorization'}</h3>
                                <button onClick={() => setShowModal(false)} className="btn btn-link text-muted p-0"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label-corporate">System Full Name</label>
                                    <input type="text" name="name" className="form-input-corporate" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Corporate Email</label>
                                    <input type="email" name="email" className="form-input-corporate" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Security Access Key (Leave blank to keep current)</label>
                                    <input type="password" name="password" className="form-input-corporate" value={formData.password} onChange={handleInputChange} {...(!editingAdmin && { required: true })} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label-corporate">Authority Level</label>
                                    <select name="role" className="form-input-corporate" value={formData.role} onChange={handleInputChange}>
                                        <option value="admin">Administrator</option>
                                        <option value="superadmin">Super Administrator</option>
                                    </select>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-corporate btn-corporate-outline flex-grow-1">Cancel</button>
                                    <button type="submit" className="btn-corporate btn-corporate-primary flex-grow-1">
                                        <Save size={18} />
                                        <span>{editingAdmin ? 'Update Audit Info' : 'Confirm Authorization'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admins;
