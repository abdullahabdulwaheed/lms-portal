import React, { useState, useEffect } from 'react';
import {
    Bell,
    User,
    LogOut,
    ChevronDown,
    Moon,
    Sun,
    Calendar,
    Cake,
    Tag,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    eventService,
    holidayService,
    employeeService,
    adminService
} from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const [
                events = [],
                holidays = [],
                employees = [],
                admins = []
            ] = await Promise.all([
                eventService.getAll().catch(() => []),
                holidayService.getAll().catch(() => []),
                employeeService.getAll().catch(() => []),
                adminService.getAll().catch(() => [])
            ]);

            const today = new Date();
            const newList = [];

            // Events
            (Array.isArray(events) ? events : []).slice(0, 5).forEach(e => {
                newList.push({
                    type: 'event',
                    title: `Upcoming Event: ${e.title}`,
                    date: e.date,
                    icon: <Tag size={16} />
                });
            });

            // Holidays
            (Array.isArray(holidays) ? holidays : []).filter(h => h && new Date(h.date) >= today).slice(0, 3).forEach(h => {
                newList.push({
                    type: 'holiday',
                    title: `Holiday: ${h.name}`,
                    date: h.date,
                    icon: <Calendar size={16} />
                });
            });

            // Birthdays
            [...(Array.isArray(employees) ? employees : []), ...(Array.isArray(admins) ? admins : [])].forEach(person => {
                if (person?.dob) {
                    const dob = new Date(person.dob);
                    if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
                        newList.push({
                            type: 'birthday',
                            title: `Happy Birthday, ${person.name}!`,
                            icon: <Cake size={16} />
                        });
                    }
                }
            });

            setNotifications(newList);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <nav
            className="navbar glass-effect"
            style={{
                height: '70px',
                padding: '0 2rem',
                backgroundColor: 'var(--bg-navbar)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 999,
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    Corporate Dashboard / <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Overview</span>
                </span>
            </div>

            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={toggleTheme}
                    className="btn-corporate btn-corporate-outline p-0"
                    style={{ width: '36px', height: '36px', border: 'none' }}
                >
                    {!isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="position-relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="btn-corporate btn-corporate-outline p-0 position-relative"
                        style={{ width: '36px', height: '36px', border: 'none' }}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: '10px', border: '2px solid var(--bg-card)' }}
                            >
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div
                            className="card-professional position-absolute end-0 mt-3 p-0 overflow-hidden shadow-lg"
                            style={{ width: '320px', zIndex: 1100, border: '1px solid var(--border-color)' }}
                        >
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-main)' }}>
                                <h6 className="m-0" style={{ fontWeight: '700' }}>Notifications</h6>
                                <span className="status-badge status-info">{notifications.length} New</span>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {notifications.length > 0 ? notifications.map((n, i) => (
                                    <div key={i} className="p-3 border-bottom" style={{ cursor: 'pointer', transition: 'background 0.2s' }}>
                                        <div className="d-flex gap-3 align-items-start">
                                            <div style={{
                                                backgroundColor: 'var(--primary-light)',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                color: 'var(--primary-color)'
                                            }}>
                                                {n.icon}
                                            </div>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.3', marginBottom: '2px' }}>{n.title}</div>
                                                {n.date && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(n.date).toLocaleDateString()}</div>}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-5 text-center text-muted">
                                        <Bell size={32} className="mb-2 opacity-20" />
                                        <p className="small m-0">No new notifications</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-top text-center" style={{ backgroundColor: 'var(--bg-main)' }}>
                                <button className="btn btn-link btn-sm text-decoration-none" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-dropdown position-relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            padding: '4px'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600'
                        }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="d-none d-md-block text-start">
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.2' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MNC Administrator</div>
                        </div>
                        <ChevronDown size={14} color="var(--text-muted)" />
                    </button>

                    {showProfileMenu && (
                        <div
                            className="card-professional position-absolute end-0 mt-3 p-2 shadow-lg"
                            style={{ width: '220px', zIndex: 1100, border: '1px solid var(--border-color)' }}
                        >
                            <div className="p-2 mb-2 border-bottom">
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Settings</span>
                            </div>
                            <button
                                className="sidebar-item w-100 border-0 bg-transparent text-start mb-1"
                                style={{ padding: '8px 12px' }}
                            >
                                <User size={18} />
                                <span>My Profile</span>
                            </button>
                            <button
                                className="sidebar-item w-100 border-0 bg-transparent text-start mb-1"
                                style={{ padding: '8px 12px' }}
                            >
                                <Settings size={18} />
                                <span>Preferences</span>
                            </button>
                            <div className="border-top my-2"></div>
                            <button
                                onClick={logout}
                                className="sidebar-item w-100 border-0 bg-transparent text-start"
                                style={{ padding: '8px 12px', color: '#ef4444' }}
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
