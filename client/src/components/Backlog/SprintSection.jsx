import React from 'react';
import IssueRow from './IssueRow';
import { Calendar } from 'lucide-react';

const SprintSection = ({ sprint, onStatusChange, onIssueClick }) => {
    if (!sprint || !sprint.issues || sprint.issues.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No active sprint</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
            {/* Sprint Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{sprint.name}</h2>
                            <p className="text-xs text-gray-600 font-medium mt-0.5">
                                {sprint.startDate} – {sprint.endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {sprint.issues.length} {sprint.issues.length === 1 ? 'issue' : 'issues'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Sprint Issues */}
            <div className="p-4 space-y-2">
                {sprint.issues.map((issue) => (
                    <IssueRow
                        key={issue.id}
                        issue={issue}
                        onStatusChange={onStatusChange}
                        onClick={() => onIssueClick && onIssueClick(issue)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SprintSection;
