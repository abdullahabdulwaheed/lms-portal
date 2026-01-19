import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admins from './pages/Admins';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Holidays from './pages/Holidays';
import Teams from './pages/Teams';
import Events from './pages/Events';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/admins" element={<Admins />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/leaves" element={<Leaves />} />
                        <Route path="/holidays" element={<Holidays />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/login" element={<Navigate to="/" />} />
                        {/* Other routes can be added here */}
                        <Route path="*" element={<div className="glass-card"><h4>Page under construction</h4></div>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
