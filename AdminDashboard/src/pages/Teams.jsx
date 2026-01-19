import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Briefcase, X, Save, Users, Download, ArrowRight } from 'lucide-react';
import { teamService, employeeService } from '../services/api';
import toast from 'react-hot-toast';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({
        team_name: '',
        user_id: []
    });

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [teamData, empData] = await Promise.all([
                teamService.getAll(),
                employeeService.getAll()
            ]);
            setTeams(Array.isArray(teamData) ? teamData : []);
            setEmployees(Array.isArray(empData) ? empData : []);
        } catch (error) {
            toast.error('Failed to retrieve organizational structure');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTeams = (Array.isArray(teams) ? teams : []).filter(team =>
        team && team.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTeamMemberChange = (id) => {
        const currentMembers = [...formData.user_id];
        const index = currentMembers.indexOf(id);
        if (index > -1) {
            currentMembers.splice(index, 1);
        } else {
            currentMembers.push(id);
        }
        setFormData({ ...formData, user_id: currentMembers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeam) {
                await teamService.update(editingTeam._id, formData);
                toast.success('Departmental structure updated');
            } else {
                await teamService.add(formData);
                toast.success('New tactical team deployed');
            }
            setShowModal(false);
            setEditingTeam(null);
            setFormData({ team_name: '', user_id: [] });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setFormData({
            team_name: team.team_name,
            user_id: Array.isArray(team.user_id) ? team.user_id.map(u => u._id || u) : []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Dissolve this tactical team registry?')) {
            try {
                await teamService.delete(id);
                toast.success('Team structure dissolved');
                fetchData();
            } catch (error) {
                toast.error('Operation failed');
            }
        }
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Organizational Teams</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Tactical unit management and department resource allocation.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTeam(null);
                        setFormData({ team_name: '', user_id: [] });
                        setShowModal(true);
                    }}
                    className="btn-corporate btn-corporate-primary"
                >
                    <Plus size={20} />
                    Deploy New Team
                </button>
            </div>

            <div className="card-professional mb-4">
                <div className="position-relative">
                    <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search teams by designation..."
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
                    {filteredTeams.map((team) => (
                        <motion.div
                            layout
                            key={team._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-md-6 col-xl-4"
                        >
                            <div className="card-professional h-100 position-relative">
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                                    <button onClick={() => handleEdit(team)} className="btn btn-sm btn-link p-1 text-primary"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(team._id)} className="btn btn-sm btn-link p-1 text-danger"><Trash2 size={16} /></button>
                                </div>

                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        backgroundColor: 'var(--primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-color)'
                                    }}>
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700' }}>{team.team_name}</h5>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {team._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resources Assigned</span>
                                        <span className="status-badge status-info" style={{ fontSize: '0.65rem' }}>{Array.isArray(team.user_id) ? team.user_id.length : 0} Members</span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {(Array.isArray(team.user_id) ? team.user_id : []).slice(0, 5).map((user, i) => (
                                            <div key={i} style={{
                                                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-main)',
                                                border: '2px solid var(--bg-card)', fontSize: '0.65rem', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--primary-color)'
                                            }}>
                                                {(user.name || 'U').charAt(0)}
                                            </div>
                                        ))}
                                        {(Array.isArray(team.user_id) && team.user_id.length > 5) && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '2px 4px' }}>+{team.user_id.length - 5} more</div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-top mt-auto">
                                    <button className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2" style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--primary-color)' }}>
                                        View Capability Matrix <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredTeams.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h5 className="text-muted">No tactical team structures defined</h5>
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
                            style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}
                        >
                            <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingTeam ? 'Reconfigure Tactical Team' : 'Deploy New Tactical Unit'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label-corporate">Team Designation Name</label>
                                    <input
                                        type="text"
                                        className="form-input-corporate"
                                        placeholder="e.g. Strategic Infrastructure Unit"
                                        value={formData.team_name}
                                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label-corporate mb-2 d-block">Select Resources for Deployment</label>
                                    <div className="search-box mb-3 position-relative">
                                        <Search className="position-absolute top-50 translate-middle-y ms-2 text-muted" size={14} />
                                        <input type="text" className="form-input-corporate ps-5 py-2" placeholder="Scan resources..." style={{ fontSize: '0.75rem' }} />
                                    </div>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-main)' }}>
                                        {employees.map(emp => (
                                            <div
                                                key={emp._id}
                                                className="d-flex align-items-center gap-3 p-2 border-bottom hover-bg"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleTeamMemberChange(emp._id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.user_id.includes(emp._id)}
                                                    onChange={() => { }} // Controlled by div click
                                                    className="form-check-input ms-2"
                                                />
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{emp.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{emp.emp_position}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-corporate btn-corporate-outline flex-grow-1">Abort</button>
                                    <button type="submit" className="btn-corporate btn-corporate-primary flex-grow-1">
                                        <Save size={18} />
                                        <span>Confirm Deployment</span>
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

export default Teams;
