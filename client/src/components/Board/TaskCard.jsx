import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle, Code, FlaskConical } from 'lucide-react';

const TaskCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Bug': return <AlertCircle size={14} className="text-red-500" />;
            case 'Dev': return <Code size={14} className="text-blue-500" />;
            case 'Research': return <FlaskConical size={14} className="text-purple-500" />;
            default: return null;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Bug': return 'bg-red-50 text-red-700 border-red-200';
            case 'Dev': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Research': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-50 p-4 rounded-xl shadow-inner border-2 border-indigo-500/50 opacity-50 h-[100px] w-full"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white group p-4 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-grab active:cursor-grabbing w-full relative overflow-hidden"
        >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />

            <div className="flex justify-between items-start mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${getTypeColor(task.type)}`}>
                    {getTypeIcon(task.type)}
                    {task.type}
                </span>
                <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <GripVertical size={14} />
                </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-800 mb-3 leading-snug">{task.title}</h4>

            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white shadow-sm" title={task.assignee}>
                        {task.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{task.assignee}</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono font-medium">
                    {task.id}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
