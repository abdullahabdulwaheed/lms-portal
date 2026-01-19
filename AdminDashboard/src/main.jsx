import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster position="top-right" reverseOrder={false} />
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
