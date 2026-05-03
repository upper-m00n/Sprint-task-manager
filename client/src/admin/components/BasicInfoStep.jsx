import React from 'react';

const BasicInfoStep = ({ data, updateData }) => {
    const handleKeyChange = (e) => {
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
        updateData({ key: val });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary text-center">Project Essentials</h2>
                <p className="text-sm text-slate-400 text-center mt-1">Start with the basic identity of your new workspace.</p>
            </div>

            <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Mobile Application Revamp"
                        value={data.name || ''}
                        onChange={(e) => updateData({ name: e.target.value })}
                        className="w-full bg-border border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Key</label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="e.g. MOBILE"
                            value={data.key || ''}
                            onChange={(e) => updateData({ key: e.target.value.toUpperCase() })}
                            className="w-full bg-border border border-border rounded-xl py-3 px-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-mono font-bold tracking-widest"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-panel px-2 py-1 rounded border border-border shadow-sm pointer-events-none group-focus-within:text-primary group-focus-within:border-primary/20">
                            REQUIRED
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">This key prefix will be used for all issues (e.g., {data.key || 'KEY'}-123).</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description (Optional)</label>
                    <textarea
                        rows={3}
                        placeholder="Provide context about this project's goals and scope..."
                        value={data.description || ''}
                        onChange={(e) => updateData({ description: e.target.value })}
                        className="w-full bg-border border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoStep;
