import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import BasicInfoStep from './BasicInfoStep';
import IssueTypesStep from './IssueTypesStep';
import StatusesStep from './StatusesStep';
import PrioritiesStep from './PrioritiesStep';
import ManagersStep from './ManagersStep';
import { useAdmin } from '../context/AdminContext';

const DEFAULT_DATA = {
    name: '',
    key: '',
    description: '',
    issue_types: [
        { name: 'Bug', icon: 'Bug', color: '#f43f5e', description: 'Technical errors or unexpected behavior' },
        { name: 'Task', icon: 'Task', color: '#3b82f6', description: 'General work items' },
        { name: 'Story', icon: 'Story', color: '#22c55e', description: 'User-centric features or requirements' }
    ],
    issue_statuses: [
        { name: 'Backlog', category: 'todo', color: '#64748b', description: 'Initial staging for new work' },
        { name: 'To Do', category: 'todo', color: '#94a3b8', description: 'Work ready to be started' },
        { name: 'In Progress', category: 'in_progress', color: '#3b82f6', description: 'Active work currently being performed' },
        { name: 'Done', category: 'done', color: '#22c55e', description: 'Completed work' }
    ],
    issue_priorities: [
        { name: 'Low', level: 1, color: '#94a3b8' },
        { name: 'Medium', level: 3, color: '#eab308' },
        { name: 'High', level: 5, color: '#f43f5e' }
    ],
    members: []
};

const CreateProjectWizard = ({ isOpen, onClose }) => {
    const { createProject, error: adminError } = useAdmin();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(DEFAULT_DATA);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [localError, setLocalError] = useState(null);

    const updateData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setLocalError(null);
    };

    const nextStep = () => {
        if (step === 1 && (!formData.name || !formData.key)) {
            setLocalError("Project name and key are required.");
            return;
        }
        if (step === 5 && formData.members.length === 0) {
            setLocalError("Assign at least one Project Manager or Product Manager.");
            return;
        }
        setStep(prev => prev + 1);
        setLocalError(null);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        setLocalError(null);
    };

    const handleSubmit = async () => {
        if (formData.members.length === 0) {
            setLocalError("Assign at least one Project Manager or Product Manager.");
            return;
        }
        setLoading(true);
        try {
            // Normalize payload so backend always gets required fields (category, level, icon)
            const payload = {
                ...formData,
                issue_types: (formData.issue_types || []).map((t) => ({
                    name: t.name || 'Unnamed',
                    icon: t.icon ?? 'Task',
                    color: t.color ?? '#3b82f6',
                    description: t.description ?? null
                })),
                issue_statuses: (formData.issue_statuses || []).map((s) => ({
                    name: s.name || 'Unnamed',
                    category: s.category ?? 'todo',
                    color: s.color ?? '#64748b',
                    description: s.description ?? null
                })),
                issue_priorities: (formData.issue_priorities || []).map((p) => ({
                    name: p.name || 'Unnamed',
                    level: typeof p.level === 'number' ? p.level : 1,
                    color: p.color ?? '#94a3b8',
                    description: p.description ?? null
                }))
            };
            await createProject(payload);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            const msg = err.response?.data?.detail;
            const text = Array.isArray(msg) ? msg.map((o) => o.msg || JSON.stringify(o)).join(' ') : (msg || err.message || 'Failed to create project');
            setLocalError(text);
            console.error("Submission failed", err.response?.data ?? err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-panel rounded-3xl w-full max-w-lg p-12 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 shadow-premium">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary">Project Created Successfully!</h2>
                        <p className="text-slate-500 mt-2">Setting up your new workspace and redirecting...</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <BasicInfoStep data={formData} updateData={updateData} />;
            case 2: return <IssueTypesStep data={formData} updateData={updateData} />;
            case 3: return <StatusesStep data={formData} updateData={updateData} />;
            case 4: return <PrioritiesStep data={formData} updateData={updateData} />;
            case 5: return <ManagersStep data={formData} updateData={updateData} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-panel rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Wizard Header */}
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-border/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map(s => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 bg-primary' : s < step ? 'w-4 bg-primary/30' : 'w-4 bg-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 5</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="px-12 py-10 overflow-y-auto flex-1">
                    {renderStep()}

                    {(localError || adminError) && (
                        <div className="mt-6 p-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-red-100 animate-in shake duration-300">
                            {localError || adminError}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-6 bg-border/50 border-t border-border flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={step === 1 || loading}
                        className={`flex items-center gap-2 text-sm font-bold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'text-slate-500 hover:text-primary'}`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    {step < 5 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-accent-orange transition-all active:scale-95"
                        >
                            Next Step
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-500 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating Project...
                                </>
                            ) : (
                                <>
                                    Launch Project
                                    <CheckCircle2 className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProjectWizard;
