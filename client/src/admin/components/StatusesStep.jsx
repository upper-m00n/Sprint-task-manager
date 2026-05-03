import React, { useRef } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

const ColorCirclePicker = ({ color, onChange, title }) => {
    const inputRef = useRef(null);
    return (
        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                title={title || 'Pick color'}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 shrink-0 transition-transform hover:scale-110"
                style={{ backgroundColor: color || '#64748b' }}
            />
            <input
                ref={inputRef}
                type="color"
                value={color || '#64748b'}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only w-0 h-0 opacity-0 absolute"
                aria-label={title || 'Pick color'}
            />
        </div>
    );
};

const StatusesStep = ({ data, updateData }) => {
    const statuses = data.issue_statuses || [];

    const addStatus = () => {
        const newStatuses = [...statuses, { name: '', category: 'todo', color: '#64748b' }];
        updateData({ issue_statuses: newStatuses });
    };

    const removeStatus = (index) => {
        const newStatuses = statuses.filter((_, i) => i !== index);
        updateData({ issue_statuses: newStatuses });
    };

    const updateStatus = (index, field, value) => {
        const newStatuses = [...statuses];
        newStatuses[index] = { ...newStatuses[index], [field]: value };
        updateData({ issue_statuses: newStatuses });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary text-center">Workflow Statuses</h2>
                <p className="text-sm text-slate-500 text-center">Define the progress states for this project's workflow.</p>
            </div>

            <div className="flex flex-col gap-4">
                {statuses.map((status, index) => (
                    <div key={index} className="flex items-center gap-4 bg-border/50 p-4 rounded-2xl border border-border group transition-all hover:bg-panel hover:border-primary/20 hover:shadow-sm">
                        <GripVertical className="h-4 w-4 text-slate-200 shrink-0" />
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Status Name (e.g. Backlog)"
                                value={status.name}
                                onChange={(e) => updateStatus(index, 'name', e.target.value)}
                                className="bg-transparent border-none p-0 text-sm font-bold text-primary focus:ring-0 placeholder:text-slate-300 w-full"
                            />
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <ColorCirclePicker
                                color={status.color}
                                onChange={(value) => updateStatus(index, 'color', value)}
                                title="Workflow status color"
                            />
                        </div>

                        <button
                            onClick={() => removeStatus(index)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addStatus}
                    className="flex items-center justify-center gap-2 py-4 bg-panel border-2 border-dashed border-border rounded-2xl text-slate-400 font-bold text-sm hover:border-primary/20 hover:text-primary transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Add Workflow Status
                </button>
            </div>
        </div>
    );
};

export default StatusesStep;
