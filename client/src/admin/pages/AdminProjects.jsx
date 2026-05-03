import React, { useEffect, useState } from 'react'
import { Plus, Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import AdminProjectCard from '../components/AdminProjectCard'
import { useAdmin } from '../context/AdminContext'
import CreateProjectWizard from '../components/CreateProjectWizard'

const AdminProjects = () => {
    const { projects, loading, error, fetchAllProjects } = useAdmin();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAllProjects();
    }, [fetchAllProjects]);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Project Administration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Create and manage your organization's workspaces and configurations.</p>
                </div>
                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm shadow-[0_4px_14px_0_rgba(0,0,128,0.2)] hover:shadow-[0_6px_20px_0_rgba(0,0,128,0.3)] hover:bg-accent-orange transition-all active:scale-95">
                    <Plus className="h-5 w-5" />
                    Create project
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by project name or key..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-panel border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 bg-panel px-6 py-3.5 rounded-2xl border border-border shadow-sm text-sm font-bold text-text hover:bg-border transition-all">
                    <Filter className="h-5 w-5 text-gray-400" />
                    Filter
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Content States */}
            {loading && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-gray-500 font-bold">Synchronizing project data...</p>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {filteredProjects.map((project) => (
                        <AdminProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            projectKey={project.key}
                            description={project.description}
                            status={project.status}
                            created_at={project.created_at}
                            updated_at={project.updated_at}
                            created_by={project.created_by}
                            member_count={project.member_count}
                            total_issues={project.total_issues}
                            members={project.members ?? []}
                            stats={project.stats}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-panel border-2 border-dashed border-border rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6">
                    <div className="w-20 h-20 bg-border rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">No projects found</h3>
                        <p className="text-gray-500 max-w-sm mt-1">
                            {searchQuery ? `We couldn't find any results matching "${searchQuery}".` : "Your organization doesn't have any projects yet."}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="text-primary font-bold hover:opacity-80 transition-opacity"
                    >
                        Create your first project
                    </button>
                </div>
            )}

            {/* Create Project Wizard Modal */}
            {isWizardOpen && (
                <CreateProjectWizard
                    isOpen={isWizardOpen}
                    onClose={() => setIsWizardOpen(false)}
                />
            )}
        </div>
    )
}

export default AdminProjects
