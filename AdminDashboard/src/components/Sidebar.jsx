import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Calendar,
    Briefcase,
    Settings,
    LogOut,
    ChevronRight,
    ClipboardList,
    Shield,
    Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Employees', icon: <Users size={20} />, path: '/employees' },
        { name: 'Attendance', icon: <UserCheck size={20} />, path: '/attendance' },
        { name: 'Leaves', icon: <ClipboardList size={20} />, path: '/leaves' },
        { name: 'Holidays', icon: <Calendar size={20} />, path: '/holidays' },
        { name: 'Teams', icon: <Briefcase size={20} />, path: '/teams' },
        { name: 'Events', icon: <Tag size={20} />, path: '/events' },
        { name: 'Admins', icon: <Shield size={20} />, path: '/admins', superOnly: true },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        !item.superOnly || (user && user.role === 'superadmin')
    );

    return (
        <aside
            className="sidebar"
            style={{
                width: '260px',
                backgroundColor: 'var(--bg-sidebar)',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1000,
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                    }}>
                        L
                    </div>
                    <div>
                        <h4 style={{ margin: 0, letterSpacing: '-0.5px' }}>LMS <span style={{ color: 'var(--primary-color)' }}>Portal</span></h4>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Enterprise Edition</span>
                    </div>
                </div>
            </div>

            <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
                <div className="sidebar-nav">
                    {filteredMenuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span style={{ flex: 1 }}>{item.name}</span>
                            <ChevronRight size={14} className="chevron" style={{ opacity: 0.4 }} />
                        </NavLink>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
