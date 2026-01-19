import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Calendar as CalendarIcon, X, Save, Clock, MapPin, Tag, Download } from 'lucide-react';
import { eventService } from '../services/api';
import toast from 'react-hot-toast';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Meeting'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAll();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to retrieve corporate agenda');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = (Array.isArray(events) ? events : []).filter(event =>
        event && (
            (selectedType === 'All' || event.type === selectedType) &&
            (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await eventService.update(editingEvent._id, formData);
                toast.success('Corporate event updated');
            } else {
                await eventService.add(formData);
                toast.success('New event scheduled');
            }
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'Meeting' });
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            time: event.time || '',
            location: event.location || '',
            type: event.type || 'Meeting'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Cancel this scheduled corporate event?')) {
            try {
                await eventService.delete(id);
                toast.success('Event cancelled and removed from agenda');
                fetchEvents();
            } catch (error) {
                toast.error('Operation failed');
            }
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Corporate Agenda</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Global meetings, conferences, and organization milestones.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setFormData({ title: '', description: '', date: '', time: '', location: '', type: 'Meeting' });
                        setShowModal(true);
                    }}
                    className="btn-corporate btn-corporate-primary"
                >
                    <Plus size={20} />
                    Schedule Event
                </button>
            </div>

            <div className="card-professional mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search agenda by title or description..."
                                className="form-input-corporate ps-5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-input-corporate"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="All">All Classifications</option>
                            <option value="Meeting">Strategic Meeting</option>
                            <option value="Training">Resource Training</option>
                            <option value="Holiday">Corporate Holiday</option>
                            <option value="Other">General Milestone</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredEvents.map((event) => (
                        <motion.div
                            layout
                            key={event._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-md-6 col-lg-4"
                        >
                            <div className="card-professional h-100 position-relative">
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                                    <button onClick={() => handleEdit(event)} className="btn btn-sm btn-link p-1 text-primary"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(event._id)} className="btn btn-sm btn-link p-1 text-danger"><Trash2 size={16} /></button>
                                </div>

                                <div className="mb-3">
                                    <span className={`status-badge ${event.type === 'Meeting' ? 'status-info' :
                                        event.type === 'Training' ? 'status-success' : 'status-warning'
                                        }`} style={{ fontSize: '0.65rem' }}>
                                        {event.type?.toUpperCase()}
                                    </span>
                                </div>

                                <h5 className="mb-3" style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)' }}>{event.title}</h5>
                                <p className="text-secondary small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {event.description || 'No corporate description provided for this agenda item.'}
                                </p>

                                <div className="pt-3 border-top mt-auto" style={{ fontSize: '0.8125rem' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
                                        <CalendarIcon size={14} className="text-muted" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
                                        <Clock size={14} className="text-muted" />
                                        <span>{event.time || 'TBD'}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <MapPin size={14} className="text-muted" />
                                        <span>{event.location || 'Virtual / Corporate Office'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <CalendarIcon size={48} className="text-muted mb-3 opacity-20" />
                            <h5 className="text-muted">Global agenda is currently clear</h5>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="custom-modal-backdrop">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card-professional shadow-xl"
                            style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}
                        >
                            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingEvent ? 'Modify Event Protocol' : 'Initial Event Scheduling'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Event Title</label>
                                    <input type="text" name="title" className="form-input-corporate" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Scheduled Date</label>
                                        <input type="date" name="date" className="form-input-corporate" value={formData.date} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Time Slot</label>
                                        <input type="text" name="time" className="form-input-corporate" placeholder="e.g. 14:00 GMT" value={formData.time} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Deployment Location</label>
                                    <input type="text" name="location" className="form-input-corporate" value={formData.location} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label-corporate">Event Classification</label>
                                    <select name="type" className="form-input-corporate" value={formData.type} onChange={handleInputChange}>
                                        <option value="Meeting">Strategic Meeting</option>
                                        <option value="Training">Resource Training</option>
                                        <option value="Holiday">Corporate Holiday</option>
                                        <option value="Other">General Milestone</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label-corporate">Strategic Summary</label>
                                    <textarea name="description" className="form-input-corporate" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-corporate btn-corporate-outline flex-grow-1">Abort</button>
                                    <button type="submit" className="btn-corporate btn-corporate-primary flex-grow-1">
                                        <Save size={18} />
                                        <span>Confirm Schedule</span>
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

export default Events;
