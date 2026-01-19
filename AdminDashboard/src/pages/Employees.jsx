import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    User,
    Mail,
    Phone,
    Briefcase,
    X,
    Save,
    IdCard,
    Filter,
    Download
} from 'lucide-react';
import { employeeService } from '../services/api';
import toast from 'react-hot-toast';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        employee_no: '',
        name: '',
        email: '',
        phone_no: '',
        emp_position: '',
        password: '',
        department: '',
        dateOfJoining: new Date().toISOString().split('T')[0]
    });

    const [selectedDepartment, setSelectedDepartment] = useState('All');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAll();
            setEmployees(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch corporate directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const departments = ['All', ...new Set(employees.map(emp => emp.department).filter(Boolean))];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                await employeeService.update(editingEmployee._id, formData);
                toast.success('Resource record updated');
            } else {
                await employeeService.add(formData);
                toast.success('New resource onboarded');
            }
            setShowModal(false);
            setEditingEmployee(null);
            resetForm();
            fetchEmployees();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const resetForm = () => {
        setFormData({
            employee_no: '',
            name: '',
            email: '',
            phone_no: '',
            emp_position: '',
            password: '',
            department: '',
            dateOfJoining: new Date().toISOString().split('T')[0]
        });
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            employee_no: employee.employee_no || '',
            name: employee.name,
            email: employee.email,
            phone_no: employee.phone_no || '',
            emp_position: employee.emp_position || '',
            department: employee.department || '',
            dateOfJoining: employee.dateOfJoining ? employee.dateOfJoining.split('T')[0] : new Date().toISOString().split('T')[0],
            password: ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to offboard this resource?')) {
            try {
                await employeeService.delete(id);
                toast.success('Resource removed from directory');
                fetchEmployees();
            } catch (error) {
                toast.error('Offboarding failed');
            }
        }
    };

    const filteredEmployees = (Array.isArray(employees) ? employees : []).filter(emp =>
        emp && (
            (selectedDepartment === 'All' || emp.department === selectedDepartment) &&
            ((emp.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (emp.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (emp.emp_position?.toLowerCase().includes(searchTerm.toLowerCase())))
        )
    );

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.025em', marginBottom: '4px' }}>Resource Management</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9375rem' }}>Global directory and employee information system.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-corporate btn-corporate-outline">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingEmployee(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-corporate btn-corporate-primary"
                    >
                        <Plus size={20} />
                        Onboard Resource
                    </button>
                </div>
            </div>

            <div className="card-professional mb-4">
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or designation..."
                                className="form-input-corporate ps-5"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="position-relative">
                            <Filter className="position-absolute top-50 translate-middle-y ms-3" size={18} color="var(--text-muted)" />
                            <select
                                className="form-input-corporate ps-5"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredEmployees.map((emp) => (
                        <motion.div
                            layout
                            key={emp._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-md-6 col-lg-4 col-xl-3"
                        >
                            <div className="card-professional h-100 position-relative group">
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-1" style={{ opacity: 0.6 }}>
                                    <button onClick={() => handleEdit(emp)} className="btn btn-sm btn-link p-1 text-primary"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(emp._id)} className="btn btn-sm btn-link p-1 text-danger"><Trash2 size={16} /></button>
                                </div>

                                <div className="d-flex flex-column align-items-center text-center mb-4">
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        backgroundColor: 'var(--primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1rem',
                                        color: 'var(--primary-color)'
                                    }}>
                                        <User size={32} />
                                    </div>
                                    <h5 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '700' }}>{emp.name}</h5>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-color)', backgroundColor: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                                        {emp.employee_no || 'Emp-ID'}
                                    </span>
                                </div>

                                <div className="employee-info pt-3 border-top" style={{ fontSize: '0.875rem' }}>
                                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
                                        <Briefcase size={14} className="text-muted" />
                                        <span className="text-truncate">{emp.emp_position || 'No Designation'}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-2 text-secondary">
                                        <Mail size={14} className="text-muted" />
                                        <span className="text-truncate">{emp.email}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <Phone size={14} className="text-muted" />
                                        <span>{emp.phone_no || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredEmployees.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h5 className="text-muted">No resources found in directory</h5>
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
                            style={{ width: '100%', maxWidth: '640px', padding: '2.5rem' }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingEmployee ? 'Edit Corporate Resource' : 'Onboard New Resource'}</h3>
                                <button onClick={() => setShowModal(false)} className="btn btn-link text-muted p-0"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Employee ID</label>
                                        <input type="text" name="employee_no" className="form-input-corporate" value={formData.employee_no} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Legal Full Name</label>
                                        <input type="text" name="name" className="form-input-corporate" value={formData.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Corporate Email</label>
                                        <input type="email" name="email" className="form-input-corporate" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Contact Number</label>
                                        <input type="text" name="phone_no" className="form-input-corporate" value={formData.phone_no} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Professional Designation</label>
                                        <input type="text" name="emp_position" className="form-input-corporate" value={formData.emp_position} onChange={handleInputChange} required />
                                    </div>
                                    {!editingEmployee && (
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label-corporate">Default Access Key</label>
                                            <input type="password" name="password" className="form-input-corporate" value={formData.password} onChange={handleInputChange} required />
                                        </div>
                                    )}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Department</label>
                                        <input type="text" name="department" className="form-input-corporate" value={formData.department} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label-corporate">Date of Onboarding</label>
                                        <input type="date" name="dateOfJoining" className="form-input-corporate" value={formData.dateOfJoining} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-top d-flex gap-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-corporate btn-corporate-outline flex-grow-1">Cancel</button>
                                    <button type="submit" className="btn-corporate btn-corporate-primary flex-grow-1">
                                        <Save size={18} />
                                        <span>{editingEmployee ? 'Commit Changes' : 'Confirm Onboarding'}</span>
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

export default Employees;
