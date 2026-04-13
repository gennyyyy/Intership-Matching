import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token and load user state
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { access_token } = await authService.login(email, password);
            localStorage.setItem('token', access_token);

            // We need to decode the token or fetch user profile
            // For now, let's decode the simple payload by splitting the JWT
            const payload = JSON.parse(atob(access_token.split('.')[1]));

            const userData = {
                id: payload.id,
                email: payload.sub,
                role: payload.role || 'student'
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect based on role
            if (userData.role === 'employer') {
                navigate('/employer');
            } else if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await authService.register(userData);
            // Auto login after registration
            return await login(userData.email, userData.password);
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
