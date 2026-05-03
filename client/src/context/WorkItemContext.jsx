import React, { createContext, useContext, useState } from 'react';

const WorkItemContext = createContext();

export const WorkItemProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <WorkItemContext.Provider value={{ isModalOpen, openModal, closeModal }}>
            {children}
        </WorkItemContext.Provider>
    );
};

export const useWorkItem = () => {
    const context = useContext(WorkItemContext);
    if (!context) {
        throw new Error('useWorkItem must be used within a WorkItemProvider');
    }
    return context;
};
