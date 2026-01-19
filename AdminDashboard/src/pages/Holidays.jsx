import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Calendar as CalendarIcon, X, Save, Download, Filter } from 'lucide-react';
import { holidayService } from '../services/api';
import toast from 'react-hot-toast';

const Holidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        type: 'Public'
    });

    const [selectedYear, setSelectedYear] = useState('All');

    const fetchHolidays = async () => {
        try {
            setLoading(true);
            const data = await holidayService.getAll();
            setHolidays(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to retrieve corporate holiday calendar');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const years = ['All', ...new Set(holidays.map(h => new Date(h.date).getFullYear()))].sort();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHoliday) {
                await holidayService.update(editingHoliday._id, formData);
                toast.success('Corporate holiday record updated');
            } else {
                await holidayService.add(formData);
                toast.success('New holiday added to calendar');
            }
            setShowModal(false);
            setEditingHoliday(null);
            setFormData({ name: '', date: '', type: 'Public' });
            fetchHolidays();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setFormData({
            name: holiday.name,
            date: holiday.date ? new Date(holiday.date).toISOString().split('T')[0] : '',
            type: holiday.type || 'Public'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this holiday from corporate calendar?')) {
            try {
                await holidayService.delete(id);
                toast.success('Holiday removed');
                fetchHolidays();
            } catch (error) {
                toast.error('Operation failed');
            }
        }
    };

    const filteredHolidays = (Array.isArray(holidays) ? holidays : []).filter(h =>
        h && h.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedYear === 'All' || new Date(h.date).getFullYear().toString() === selectedYear.toString())
    );

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Corporate Calendar</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Global holiday scheduling and public leave registry.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingHoliday(null);
                        setFormData({ name: '', date: '', type: 'Public' });
                        setShowModal(true);
                    }}
                    className="btn-corporate btn-corporate-primary"
                >
                    <Plus size={20} />
                    Register Holiday
                </button>
            </div>

            <div className="card-professional mb-4">
                <div className="row g-3">
                    <div className="col-md-9">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search by holiday title..."
                                className="form-input-corporate ps-5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="position-relative">
                            <Filter className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <select
                                className="form-input-corporate ps-5"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-professional p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-corporate mb-0">
                        <thead>
                            <tr>
                                <th>Holiday Occasion</th>
                                <th>Scheduled Date</th>
                                <th>Classification</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : filteredHolidays.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No holidays registered in system.</td>
                                </tr>
                            ) : (
                                filteredHolidays.map((holiday) => (
                                    <tr key={holiday._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <CalendarIcon size={16} color="var(--primary-color)" />
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{holiday.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-secondary">{holiday.date ? new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${holiday.type === 'Public' ? 'status-info' : 'status-warning'}`}>
                                                {holiday.type?.toUpperCase() || 'PUBLIC'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button onClick={() => handleEdit(holiday)} className="btn btn-sm btn-link p-1 text-primary"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(holiday._id)} className="btn btn-sm btn-link p-1 text-danger"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="custom-modal-backdrop">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card-professional shadow-xl"
                            style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}
                        >
                            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingHoliday ? 'Edit Holiday Registry' : 'New Holiday Registration'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Holiday Title</label>
                                    <input type="text" name="name" className="form-input-corporate" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Designated Date</label>
                                    <input type="date" name="date" className="form-input-corporate" value={formData.date} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label-corporate">Classification</label>
                                    <select name="type" className="form-input-corporate" value={formData.type} onChange={handleInputChange}>
                                        <option value="Public">Public Holiday</option>
                                        <option value="Restricted">Restricted Holiday</option>
                                        <option value="Company">MNC Mandatory Shutdown</option>
                                    </select>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-corporate btn-corporate-outline flex-grow-1">Cancel</button>
                                    <button type="submit" className="btn-corporate btn-corporate-primary flex-grow-1">
                                        <Save size={18} />
                                        <span>Commit Registry</span>
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

export default Holidays;
