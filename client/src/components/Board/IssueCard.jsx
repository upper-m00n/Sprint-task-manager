import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const IssueCard = ({ issue, isDragging = false, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: issue.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        >
            {/* Issue Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">
                        {issue.issue_number}
                    </span>
                    {/* Styled Issue Type Label */}
                    <span
                        className="px-2 py-0.5 text-xs font-semibold rounded text-white truncate max-w-[100px] inline-block"
                        style={{ backgroundColor: issue.issue_type.color || '#6B7280' }}
                        title={issue.issue_type.name}
                    >
                        {issue.issue_type.name}
                    </span>
                </div>
                {/* Priority Indicator */}
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: issue.priority.color || '#6B7280' }}
                    title={issue.priority.name}
                />
            </div>

            {/* Issue Title */}
            <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">
                {issue.title}
            </h4>

            {/* Issue Footer */}
            <div className="flex items-center justify-between">
                {issue.assignee ? (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 cursor-pointer"
                            title={issue.assignee.name}
                        >
                            {issue.assignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600">{issue.assignee.name}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400"
                            title="Unassigned"
                        >
                            ?
                        </div>
                        <span className="text-xs text-gray-400">Unassigned</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueCard;
