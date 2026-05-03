import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ column, tasks, onAddTask }) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });

    const taskIds = tasks.map(t => t.id);

    return (
        <div className="flex flex-col h-full w-[350px] shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{column.title}</h2>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-bold">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 bg-gray-50/80 rounded-2xl border border-gray-200/60 p-3 flex flex-col gap-3 overflow-y-auto min-h-[500px]"
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                        Drop tasks here
                    </div>
                )}

                <button
                    onClick={() => onAddTask(column.id)}
                    className="flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 p-2.5 rounded-xl transition-all mt-auto w-full text-sm font-medium group border border-transparent hover:border-indigo-100"
                >
                    <Plus size={16} className="text-gray-400 group-hover:text-indigo-600" />
                    <span>Add Task</span>
                </button>
            </div>
        </div>
    );
};

export default KanbanColumn;
