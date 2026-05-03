import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth init failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);
        return userResponse.data;
    };

    const adminLogin = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/admin/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);
        return userResponse.data;
    };

    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
        return login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = Boolean(user?.roles?.includes?.('admin'));

    return (
        <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
