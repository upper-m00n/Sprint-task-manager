import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BoardColumn from './BoardColumn';
import IssueCard from './IssueCard';
import FilterBar from './FilterBar';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import IssueViewModal from '../WorkItems/IssueViewModal';

const Board = () => {
    const { id: projectId } = useParams();
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [issueTypes, setIssueTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        status_id: null,
        priority_id: null,
        issue_type_id: null,
        assignee_id: null,
        search: ''
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Fetch project configuration and issues
    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId, filters]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);

            // Fetch statuses
            const statusesRes = await api.get(`/project-config/${projectId}/statuses`);
            setStatuses(statusesRes.data);

            // Fetch priorities
            const prioritiesRes = await api.get(`/project-config/${projectId}/priorities`);
            setPriorities(prioritiesRes.data);

            // Fetch issue types
            const typesRes = await api.get(`/project-config/${projectId}/issue-types`);
            setIssueTypes(typesRes.data);

            // Fetch issues with filters
            const params = new URLSearchParams();
            if (filters.status_id) params.append('status_id', filters.status_id);
            if (filters.priority_id) params.append('priority_id', filters.priority_id);
            if (filters.issue_type_id) params.append('issue_type_id', filters.issue_type_id);
            if (filters.assignee_id) params.append('assignee_id', filters.assignee_id);
            if (filters.search) params.append('search', filters.search);

            const issuesRes = await api.get(`/projects/${projectId}/issues?${params.toString()}`);
            setIssues(issuesRes.data);
        } catch (error) {
            console.error('Error fetching project data:', error);
            toast.error('Failed to load board data');
        } finally {
            setLoading(false);
        }
    };

    // Group issues by status
    const groupedIssues = statuses.reduce((acc, status) => {
        acc[status.id] = issues.filter(issue => issue.status.id === status.id);
        return acc;
    }, {});

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeIssue = issues.find(issue => issue.id === active.id);

        // Determine the target status ID
        // If dropped on an issue, get that issue's status
        // If dropped on a column, use the column ID
        let newStatusId = over.id;
        const droppedOnIssue = issues.find(issue => issue.id === over.id);
        if (droppedOnIssue) {
            newStatusId = droppedOnIssue.status.id;
        }

        const newStatus = statuses.find(s => s.id === newStatusId);

        if (activeIssue && activeIssue.status.id !== newStatusId) {
            // Store original status for rollback
            const originalStatus = activeIssue.status;

            try {
                // Optimistically update UI
                setIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.id === activeIssue.id
                            ? { ...issue, status: newStatus }
                            : issue
                    )
                );

                // Update issue status via API
                await api.patch(`/issues/${activeIssue.id}`, { status_id: newStatusId });

                // Show success message with details
                toast.success(`Moved "${activeIssue.title}" to ${newStatus.name}`);
            } catch (error) {
                console.error('Error updating issue:', error);

                // Rollback on error
                setIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.id === activeIssue.id
                            ? { ...issue, status: originalStatus }
                            : issue
                    )
                );

                // Show detailed error message from backend
                const errorMessage = error.response?.data?.detail || 'Please try again.';
                toast.error(errorMessage);
            }
        }

        setActiveId(null);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-4 border-primary-deep border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                statuses={statuses}
                priorities={priorities}
                issueTypes={issueTypes}
                projectId={projectId}
                currentUser={user}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {statuses.map(status => (
                        <BoardColumn
                            key={status.id}
                            status={status}
                            issues={groupedIssues[status.id] || []}
                            onIssueClick={setSelectedIssue}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <IssueCard
                            issue={issues.find(issue => issue.id === activeId)}
                            isDragging
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <IssueViewModal
                isOpen={!!selectedIssue}
                onClose={() => setSelectedIssue(null)}
                task={selectedIssue}
            />
        </div>
    );
};

export default Board;
