import React from 'react';
import { X, Calendar, Clock, AlertCircle, Code, FlaskConical, Link as LinkIcon } from 'lucide-react';
import CommentSection from './CommentSection';

const IssueViewModal = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null;

    const getIconColorClass = (issueType) => {
        if (!issueType) return 'text-gray-500';
        const name = (issueType.name || '').toLowerCase();
        if (name.includes('bug')) return 'text-red-500';
        if (name.includes('dev') || name.includes('task')) return 'text-blue-500';
        if (name.includes('research')) return 'text-purple-500';
        return 'text-gray-500';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'None';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header Container */}
                <div className="shrink-0 border-b border-gray-100 bg-white">
                    {/* Header Top Bar */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                {task.id}
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5`} style={{ backgroundColor: task.issue_type?.color || '#F3F4F6' }}>
                                <span className={getIconColorClass(task.issue_type)}>•</span>
                                {task.issue_type?.name || 'Issue'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Copy link">
                                <LinkIcon size={18} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/30">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Left Column: Main Content */}
                        <div className="flex-1 p-6 md:p-8 min-w-0 md:border-r border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
                                {task.title}
                            </h1>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Description</h3>
                                {task.description ? (
                                    <div
                                        className="prose prose-sm prose-indigo max-w-none prose-p:leading-relaxed prose-p:text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: task.description }}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No description provided.</p>
                                )}
                            </div>

                            {/* Using the actual Issue ID (not the 'T-101' visual ID if possible, but the DB uuid). 
                                Often task.db_id is used, or task.id if that is the UUID */}
                            <CommentSection issueId={task.db_id || task.id} />
                        </div>

                        {/* Right Column: Meta Info */}
                        <div className="w-full md:w-80 shrink-0 bg-white md:bg-transparent p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                {/* Status Section */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h4>
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                                        {task.status?.name || 'Unknown'}
                                    </div>
                                </div>

                                {/* Assignee Section */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Assignee</h4>
                                    <div className="flex items-center gap-3 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        {task.assignee ? (
                                            <>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold ring-2 ring-white shadow-sm">
                                                    {task.assignee.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{task.assignee.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                    ?
                                                </div>
                                                <span className="text-sm text-gray-500 italic">Unassigned</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Priority Section */}
                                <div>
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Priority</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: task.priority?.color || '#9ca3af' }} />
                                        <span className="text-sm font-medium text-gray-700">{task.priority?.name || 'Medium'}</span>
                                    </div>
                                </div>

                                {/* Dates Section */}
                                <div className="pt-6 border-t border-gray-100">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Created</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={14} className="text-gray-400" />
                                                {formatDate(task.created_at)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(task.due_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueViewModal;
