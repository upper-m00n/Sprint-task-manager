// HMR Trigger
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../../api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/projects');
            setProjects(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async (projectData) => {
        setLoading(true);
        try {
            const response = await api.post('/admin/projects', projectData);
            setProjects(prev => [response.data, ...prev]);
            setError(null);
            return response.data;
        } catch (err) {
            const detail = err.response?.data?.detail;
            setError(Array.isArray(detail) ? detail[0].msg : detail || "Failed to create project");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminContext.Provider value={{ projects, loading, error, fetchAllProjects, createProject }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
};
