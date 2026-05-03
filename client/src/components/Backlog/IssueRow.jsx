import React from 'react';
import StatusDropdown from './StatusDropdown';

const IssueRow = ({ issue, onStatusChange, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="
        group relative flex items-center gap-4 px-4 py-3
        bg-white border border-gray-100 rounded-lg
        hover:border-gray-200 hover:shadow-md
        transition-all duration-200 ease-out cursor-pointer
      "
        >
            {/* Issue Type Label */}
            <div className="flex-shrink-0">
                <span
                    className="px-2 py-0.5 text-xs font-semibold rounded text-white truncate max-w-[120px] inline-block"
                    style={{ backgroundColor: issue.issue_type.color || '#6B7280' }}
                    title={issue.issue_type.name}
                >
                    {issue.issue_type.name}
                </span>
            </div>

            {/* Issue ID */}
            <div className="flex-shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {issue.issue_number}
                </span>
            </div>

            {/* Issue Title */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {issue.title}
                </h4>
            </div>

            {/* Priority Indicator */}
            <div className="flex-shrink-0">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: issue.priority.color || '#6B7280' }}
                    title={issue.priority.name}
                />
            </div>

            {/* Assignee Avatar */}
            <div className="flex-shrink-0">
                {issue.assignee ? (
                    <div
                        className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 ring-2 ring-white shadow-sm cursor-pointer"
                        title={issue.assignee.name}
                    >
                        {issue.assignee.name.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <div
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 ring-2 ring-white shadow-sm"
                        title="Unassigned"
                    >
                        ?
                    </div>
                )}
            </div>

            {/* Status Dropdown */}
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <StatusDropdown
                    issueId={issue.id}
                    currentStatus={issue.status}
                    onChange={onStatusChange}
                />
            </div>
        </div>
    );
};

export default IssueRow;
