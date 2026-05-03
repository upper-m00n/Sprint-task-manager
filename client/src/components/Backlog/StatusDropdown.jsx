import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import api from '../../api';
import { toast } from 'react-toastify';

const StatusDropdown = ({ currentStatus, issueId, onChange, disabled = false }) => {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch statuses from the current project
        const fetchStatuses = async () => {
            try {
                // Get project ID from URL
                const projectId = window.location.pathname.split('/')[2];

                const response = await api.get(`/project-config/${projectId}/statuses`);
                setStatuses(response.data);
            } catch (error) {
                console.error('Error fetching statuses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatuses();
    }, []);

    const handleStatusChange = (newStatus) => {
        console.log('StatusDropdown: handleStatusChange called', { issueId, newStatus, onChange });
        // Only notify parent component - let it handle the API call
        if (onChange) {
            console.log('StatusDropdown: Calling onChange callback');
            onChange(issueId, newStatus);
        } else {
            console.warn('StatusDropdown: onChange callback is not defined!');
        }
    };

    if (loading) {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span>{currentStatus.name}</span>
            </div>
        );
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button
                        disabled={disabled}
                        className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              transition-all duration-200 ease-out
              ${!disabled && 'hover:shadow-md hover:scale-105 cursor-pointer'}
              ${disabled && 'opacity-50 cursor-not-allowed'}
              ${open && 'ring-2 ring-offset-1 ring-blue-400'}
            `}
                        style={{
                            backgroundColor: currentStatus.color ? `${currentStatus.color}20` : '#f3f4f6',
                            color: currentStatus.color || '#374151'
                        }}
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentStatus.color || '#9ca3af' }}
                        ></span>
                        <span>{currentStatus.name}</span>
                        {!disabled && (
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            />
                        )}
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-[9999] mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                            <div className="py-1">
                                {statuses.map((status) => (
                                    <Menu.Item key={status.id}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => handleStatusChange(status)}
                                                className={`
                          w-full text-left px-4 py-2.5 text-sm font-medium
                          flex items-center gap-2.5 transition-colors duration-150
                          ${active ? 'bg-gray-50' : ''}
                          ${currentStatus.id === status.id ? 'bg-blue-50' : ''}
                        `}
                                            >
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: status.color || '#9ca3af' }}
                                                ></span>
                                                <span style={{ color: status.color || '#374151' }}>
                                                    {status.name}
                                                </span>
                                                {currentStatus.id === status.id && (
                                                    <span className="ml-auto text-blue-600">✓</span>
                                                )}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default StatusDropdown;
