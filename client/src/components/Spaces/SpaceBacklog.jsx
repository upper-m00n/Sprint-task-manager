import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import BacklogSection from '../Backlog/BacklogSection';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const SpaceBacklog = () => {
    const { id: projectId } = useParams();
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMyIssues, setShowMyIssues] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchIssues();
        }
    }, [projectId, searchQuery, showMyIssues]);

    const fetchIssues = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams();
            if (searchQuery) {
                params.append('search', searchQuery);
            }
            if (showMyIssues && user) {
                params.append('assignee_id', user.id);
            }

            const response = await api.get(`/projects/${projectId}/issues?${params.toString()}`);
            setIssues(response.data);
        } catch (error) {
            console.error('Error fetching issues:', error);
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (issueId, newStatus) => {
        console.log('SpaceBacklog: handleStatusChange called', { issueId, newStatus });
        // Find the issue to get original status for rollback
        const issue = issues.find(i => i.id === issueId);
        if (!issue) {
            console.error('SpaceBacklog: Issue not found', issueId);
            return;
        }

        const originalStatus = issue.status;
        console.log('SpaceBacklog: Making API call to update status');

        try {
            // Optimistically update UI
            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.id === issueId
                        ? { ...issue, status: newStatus }
                        : issue
                )
            );

            // Update issue status via API
            await api.patch(`/issues/${issueId}`, { status_id: newStatus.id });

            // Show success message
            toast.success(`Status updated to ${newStatus.name}`);
        } catch (error) {
            console.error('Error updating issue status:', error);

            // Rollback on error
            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.id === issueId
                        ? { ...issue, status: originalStatus }
                        : issue
                )
            );

            // Show error message
            const errorMessage = error.response?.data?.detail || 'Failed to update status';
            toast.error(errorMessage);
        }
    };

    const handleStartSprint = () => {
        toast.info('Sprint functionality coming soon!');
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleToggleMyIssues = () => {
        setShowMyIssues(!showMyIssues);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BacklogSection
                issues={issues}
                onStatusChange={handleStatusChange}
                onStartSprint={handleStartSprint}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                showMyIssues={showMyIssues}
                onToggleMyIssues={handleToggleMyIssues}
                currentUserId={user?.id}
            />
        </div>
    );
};

export default SpaceBacklog;
