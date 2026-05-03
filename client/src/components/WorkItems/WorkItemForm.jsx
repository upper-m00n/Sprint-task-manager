import React, { useState, useEffect } from 'react';
import api from '../../api';
import UserSelector from './UserSelector';
import RichTextEditor from './RichTextEditor';
import { Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkItemForm = ({ onSubmit, onCancel }) => {
    const [projects, setProjects] = useState([]);
    const [issueTypes, setIssueTypes] = useState([]);
    const [issueStatuses, setIssueStatuses] = useState([]);
    const [issuePriorities, setIssuePriorities] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        project_id: '',
        issue_type_id: '',
        title: '',
        description: '',
        priority_id: '',
        status_id: '',
        assignee_id: null,
        start_date: '',
        due_date: '',
        createAnother: false
    });

    const [errors, setErrors] = useState({});

    // Initial fetch for projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/accessible');
                setProjects(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, project_id: response.data[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                toast.error("Failed to load projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Fetch project-specific details when project changes
    useEffect(() => {
        if (!formData.project_id) return;

        const fetchProjectDetails = async () => {
            try {
                const [typesRes, statusesRes, prioritiesRes, usersRes] = await Promise.all([
                    api.get(`/project-config/${formData.project_id}/issue-types`),
                    api.get(`/project-config/${formData.project_id}/statuses`),
                    api.get(`/project-config/${formData.project_id}/priorities`),
                    api.get(`/project-config/${formData.project_id}/assignable-users`)
                ]);

                setIssueTypes(typesRes.data);
                setIssueStatuses(statusesRes.data);
                setIssuePriorities(prioritiesRes.data);
                setAssignableUsers(usersRes.data);

                // Set defaults
                setFormData(prev => ({
                    ...prev,
                    issue_type_id: typesRes.data[0]?.id || '',
                    status_id: statusesRes.data[0]?.id || '',
                    priority_id: prioritiesRes.data.find(p => p.name === 'Medium')?.id || prioritiesRes.data[0]?.id || '',
                }));
            } catch (error) {
                console.error("Failed to fetch project details", error);
                toast.error("Failed to load project configurations");
            }
        };

        fetchProjectDetails();
    }, [formData.project_id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.project_id) newErrors.project_id = 'Project is required';
        if (!formData.issue_type_id) newErrors.issue_type_id = 'Issue type is required';
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.status_id) newErrors.status_id = 'Status is required';
        if (!formData.priority_id) newErrors.priority_id = 'Priority is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                project_id: formData.project_id,
                title: formData.title,
                description: formData.description,
                issue_type_id: formData.issue_type_id,
                priority_id: formData.priority_id,
                status_id: formData.status_id,
                assignee_id: formData.assignee_id,
                start_date: formData.start_date || null,
                due_date: formData.due_date || null
            };

            const response = await api.post('/issues', payload);
            toast.success(`Issue created successfully!`);

            if (onSubmit) onSubmit(response.data);

            if (formData.createAnother) {
                setFormData(prev => ({
                    ...prev,
                    title: '',
                    description: '',
                    start_date: '',
                    due_date: ''
                }));
            }
        } catch (error) {
            console.error("Failed to create issue", error);
            const errorMsg = error.response?.data?.detail || "Failed to create issue";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading configurations...</div>;
    }

    const inputClasses = (field) => `
        w-full p-2.5 bg-border border rounded-lg text-sm text-slate-700 outline-none transition-all
        ${errors[field] ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-border focus:bg-panel focus:border-primary focus:shadow-sm'}
    `;

    const labelClasses = "block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider mb-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Project */}
                <div>
                    <label className={labelClasses}>Priority <span className="text-accent-saffron">*</span></label>
                    <select
                        value={formData.project_id}
                        onChange={(e) => handleChange('project_id', e.target.value)}
                        className={inputClasses('project_id')}
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Issue Type */}
                <div>
                    <label className={labelClasses}>Issue Type <span className="text-red-500">*</span></label>
                    <select
                        value={formData.issue_type_id}
                        onChange={(e) => handleChange('issue_type_id', e.target.value)}
                        className={inputClasses('issue_type_id')}
                    >
                        {issueTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Title */}
            <div>
                <label className={labelClasses}>Title <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Briefly describe the task"
                    className={inputClasses('title')}
                />
                {errors.title && <p className="text-[0.65rem] text-red-500 mt-1 font-semibold">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label className={labelClasses}>Description</label>
                <RichTextEditor
                    value={formData.description}
                    onChange={(val) => handleChange('description', val)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Status */}
                <div>
                    <label className={labelClasses}>Status <span className="text-red-500">*</span></label>
                    <select
                        value={formData.status_id}
                        onChange={(e) => handleChange('status_id', e.target.value)}
                        className={inputClasses('status_id')}
                    >
                        {issueStatuses.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label className={labelClasses}>Priority <span className="text-red-500">*</span></label>
                    <select
                        value={formData.priority_id}
                        onChange={(e) => handleChange('priority_id', e.target.value)}
                        className={inputClasses('priority_id')}
                    >
                        {issuePriorities.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Assignee */}
                <UserSelector
                    users={assignableUsers}
                    selectedUserId={formData.assignee_id}
                    onSelect={(user) => handleChange('assignee_id', user?.id || null)}
                />

                {/* Start Date */}
                <div>
                    <label className={labelClasses}>Start Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => handleChange('start_date', e.target.value)}
                            className={inputClasses('start_date')}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Due Date */}
                <div>
                    <label className={labelClasses}>Due Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => handleChange('due_date', e.target.value)}
                            className={inputClasses('due_date')}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={formData.createAnother}
                        onChange={(e) => handleChange('createAnother', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-500">Create another</span>
                </label>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-white px-7 py-2.5 rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgba(0,0,128,0.2)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        {submitting ? 'CREATING...' : 'CREATE'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default WorkItemForm;
