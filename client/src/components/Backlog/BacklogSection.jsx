import React from 'react';
import IssueRow from './IssueRow';
import { Plus, Play, Search, User } from 'lucide-react';
import { useWorkItem } from '../../context/WorkItemContext';

const BacklogSection = ({
    issues,
    onStatusChange,
    onIssueClick,
    onStartSprint,
    searchQuery = '',
    onSearchChange,
    showMyIssues = false,
    onToggleMyIssues,
    currentUserId
}) => {
    const { openModal } = useWorkItem();
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
            {/* Backlog Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-gray-900">Backlog</h2>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onStartSprint}
                            className="
                inline-flex items-center gap-2 px-4 py-2 
                bg-gradient-to-r from-blue-600 to-indigo-600 
                text-white text-sm font-semibold rounded-lg
                hover:from-blue-700 hover:to-indigo-700
                hover:shadow-lg hover:scale-105
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
                        >
                            <Play className="w-4 h-4" />
                            Start Sprint
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search issues by title or description..."
                            className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onToggleMyIssues}
                        className={`
                            inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg
                            transition-all duration-200
                            ${showMyIssues
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                            }
                        `}
                        title="Show only issues assigned to me"
                    >
                        <User size={16} />
                        For me
                    </button>
                </div>
            </div>

            {/* Backlog Issues */}
            <div className="p-4 space-y-2">
                {issues.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm mb-4">No items in backlog</p>
                        <button
                            onClick={openModal}
                            className="
                inline-flex items-center gap-2 px-4 py-2 
                bg-white border-2 border-dashed border-gray-300
                text-gray-700 text-sm font-semibold rounded-lg
                hover:border-blue-400 hover:text-blue-600
                transition-all duration-200
              "
                        >
                            <Plus className="w-4 h-4" />
                            Create your first issue
                        </button>
                    </div>
                ) : (
                    <>
                        {issues.map((issue) => (
                            <IssueRow
                                key={issue.id}
                                issue={issue}
                                onStatusChange={onStatusChange}
                                onClick={() => onIssueClick && onIssueClick(issue)}
                            />
                        ))}

                        {/* Create Issue CTA */}
                        <button
                            onClick={openModal}
                            className="
                w-full mt-4 px-4 py-3 
                bg-gray-50 border-2 border-dashed border-gray-200
                text-gray-600 text-sm font-semibold rounded-lg
                hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600
                transition-all duration-200
                flex items-center justify-center gap-2
              "
                        >
                            <Plus className="w-4 h-4" />
                            Create issue
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BacklogSection;
