import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import IssueCard from './IssueCard';

const BoardColumn = ({ status, issues, onIssueClick }) => {
    const { setNodeRef } = useDroppable({
        id: status.id,
    });

    return (
        <div className="flex-shrink-0 w-80">
            <div className="bg-gray-50 rounded-lg p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color || '#6B7280' }}
                        />
                        <h3 className="font-semibold text-gray-900">{status.name}</h3>
                        <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
                            {issues.length}
                        </span>
                    </div>
                </div>

                {/* Issues List */}
                <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
                    <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        {issues.map(issue => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                onClick={() => onIssueClick(issue)}
                            />
                        ))}
                    </SortableContext>

                    {issues.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-8">
                            No issues
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardColumn;
