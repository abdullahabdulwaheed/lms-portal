import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Globe, CheckCircle, Sun, Moon } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginIllustration = ({ isDarkMode }) => {
    const primaryColor = isDarkMode ? '#3b82f6' : '#2563eb';
    const secondaryColor = isDarkMode ? '#1e293b' : '#e2e8f0';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <motion.svg
                viewBox="0 0 500 500"
                style={{ width: '70%', height: 'auto', zIndex: 10 }}
            >
                {/* Central Core */}
                <motion.circle
                    cx="250"
                    cy="250"
                    r="60"
                    stroke={primaryColor}
                    strokeWidth="4"
                    fill="transparent"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />

                {/* Rotating Rings */}
                {[1, 2, 3].map((i) => (
                    <motion.ellipse
                        key={i}
                        cx="250"
                        cy="250"
                        rx={80 + i * 30}
                        ry={80 + i * 30}
                        stroke={primaryColor}
                        strokeWidth="2"
                        strokeDasharray="20 20"
                        fill="none"
                        initial={{ rotate: 0, opacity: 0 }}
                        animate={{ rotate: 360, opacity: 0.6 - i * 0.1 }}
                        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                    />
                ))}

                {/* Floating Particles */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                        key={i}
                        r="6"
                        fill={primaryColor}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            cx: [250, 250 + (Math.random() - 0.5) * 400],
                            cy: [250, 250 + (Math.random() - 0.5) * 400],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </motion.svg>

            {/* Background Gradient Mesh */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${primaryColor}15, transparent)`,
                    zIndex: 0,
                    filter: 'blur(40px)'
                }}
            />
        </div>
    );
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    // Pre-filled credentials as requested
    const [email, setEmail] = useState('admin3@lms.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please enter your corporate credentials');

        setLoading(true);
        try {
            const data = await authService.login(email, password);
            login({ ...data.admin, token: data.token });
            toast.success('System Access Authorized');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-main)',
            position: 'relative',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-professional shadow-2xl"
                style={{
                    width: '100%',
                    maxWidth: '850px',
                    padding: 0,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr', // Force 2 columns for the smaller layout
                    overflow: 'hidden',
                    height: 'auto',
                    minHeight: '500px',
                    borderRadius: '20px'
                }}
            >
                {/* Left Side - Animated Illustration */}
                <div style={{
                    background: isDarkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    position: 'relative'
                }}>
                    <LoginIllustration isDarkMode={isDarkMode} />
                    <div style={{ position: 'absolute', bottom: '2rem', textAlign: 'center', zIndex: 10 }}>
                        <h3 style={{ fontWeight: '700', color: isDarkMode ? '#f8fafc' : '#1e3a8a', marginBottom: '0.25rem', fontSize: '1.25rem' }}>Admin Portal</h3>
                        <p style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '0.8rem', maxWidth: '250px' }}>
                            Authorized Personnel Only
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div style={{
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-card)',
                    position: 'relative'
                }}>
                    <button
                        onClick={toggleTheme}
                        className="btn p-2 rounded-circle shadow-sm"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'var(--bg-main)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                        }}
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'var(--primary-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px var(--shadow-color)'
                            }}>
                                <Globe size={16} color="white" />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-main)' }}>LMS Admin</span>
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Welcome</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to manage the platform.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label-corporate" style={{ fontSize: '0.8rem' }}>Email Address</label>
                            <div className="position-relative">
                                <Mail className="position-absolute translate-middle-y top-50 ms-3" size={16} color="var(--text-muted)" />
                                <input
                                    type="email"
                                    className="form-input-corporate"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: '40px', height: '45px', fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label-corporate mb-0" style={{ fontSize: '0.8rem' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Forgot?</a>
                            </div>
                            <div className="position-relative">
                                <Lock className="position-absolute translate-middle-y top-50 ms-3" size={16} color="var(--text-muted)" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input-corporate"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: '40px', paddingRight: '40px', height: '45px', fontSize: '0.9rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="position-absolute translate-middle-y top-50 end-0 me-2 btn p-0 text-muted"
                                    style={{ border: 'none', background: 'transparent' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" style={{ width: '14px', height: '14px' }} />
                            <label className="form-check-label small text-secondary" htmlFor="rememberMe" style={{ fontSize: '0.8rem' }}>Remember me</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-corporate btn-corporate-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                            style={{ fontSize: '0.95rem' }}
                        >
                            {loading ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                            ) : <CheckCircle size={18} />}
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
