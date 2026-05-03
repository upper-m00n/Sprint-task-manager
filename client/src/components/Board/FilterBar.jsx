import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, User } from 'lucide-react';
import api from '../../api';

const FilterBar = ({ filters, onFilterChange, statuses, priorities, issueTypes, projectId, currentUser }) => {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showMyIssues, setShowMyIssues] = useState(false);

    useEffect(() => {
        // Fetch assignable users for the project
        const fetchUsers = async () => {
            try {
                const response = await api.get(`/project-config/${projectId}/assignable-users`);
                setAssignableUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        if (projectId) {
            fetchUsers();
        }
    }, [projectId]);

    // Update showMyIssues state when filters change
    useEffect(() => {
        setShowMyIssues(filters.assignee_id === currentUser?.id);
    }, [filters.assignee_id, currentUser]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        // Debounce search
        const timeoutId = setTimeout(() => {
            onFilterChange({ ...filters, search: value });
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const handleFilterChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleToggleMyIssues = () => {
        if (showMyIssues) {
            // Clear the assignee filter
            onFilterChange({ ...filters, assignee_id: null });
        } else {
            // Set assignee to current user
            if (currentUser) {
                onFilterChange({ ...filters, assignee_id: currentUser.id });
            }
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setShowMyIssues(false);
        onFilterChange({
            status_id: null,
            priority_id: null,
            issue_type_id: null,
            assignee_id: null,
            search: ''
        });
    };

    const hasActiveFilters = filters.status_id || filters.priority_id || filters.issue_type_id || filters.assignee_id;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search issues by title or description..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={handleToggleMyIssues}
                        className={`
                            inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-lg
                            transition-all duration-200
                            ${showMyIssues
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200'
                            }
                        `}
                        title="Show only issues assigned to me"
                    >
                        <User size={18} />
                        For me
                    </button>
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`p-2.5 rounded-lg border transition-all ${showAdvancedFilters || hasActiveFilters
                            ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                            }`}
                        title="Advanced filters"
                    >
                        <SlidersHorizontal size={18} />
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
                            title="Clear filters"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status_id || ''}
                                onChange={(e) => handleFilterChange('status_id', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Priority</label>
                            <select
                                value={filters.priority_id || ''}
                                onChange={(e) => handleFilterChange('priority_id', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="">All Priorities</option>
                                {priorities.map(priority => (
                                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Type</label>
                            <select
                                value={filters.issue_type_id || ''}
                                onChange={(e) => handleFilterChange('issue_type_id', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="">All Types</option>
                                {issueTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Assignee Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Assignee</label>
                            <select
                                value={filters.assignee_id || ''}
                                onChange={(e) => handleFilterChange('assignee_id', e.target.value || null)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="">All Assignees</option>
                                {assignableUsers.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
