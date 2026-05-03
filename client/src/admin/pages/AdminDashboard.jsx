import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, FolderKanban, Users, ArrowRight, Loader2, Rocket } from 'lucide-react';
import api from '../../api';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/admin/projects');
                setProjects(res.data);
            } catch {
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const recentProjects = projects.slice(0, 5);
    const totalProjects = projects.length;

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h1 className="text-3xl font-bold text-primary-deep tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 mt-2 font-medium">Overview of your organization and projects.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-deep/10 flex items-center justify-center">
                            <FolderKanban className="h-6 w-6 text-primary-deep" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Projects</p>
                            <p className="text-2xl font-bold text-primary-deep">{loading ? '—' : totalProjects}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <LayoutGrid className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Spaces</p>
                            <p className="text-2xl font-bold text-primary-deep">
                                {loading ? '—' : projects.filter(p => p.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Issues</p>
                            <p className="text-2xl font-bold text-primary-deep">
                                {loading ? '—' : projects.reduce((sum, p) => sum + (p.total_issues || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent projects + CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-primary-deep">Recent Projects</h2>
                    <Link
                        to="/admin/projects"
                        className="text-sm font-bold text-primary-deep hover:text-accent-orange flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-primary-deep animate-spin" />
                        </div>
                    ) : recentProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Rocket className="h-12 w-12 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No projects yet</p>
                            <Link
                                to="/admin/projects"
                                className="mt-3 text-primary-deep font-bold hover:text-accent-orange"
                            >
                                Create your first project
                            </Link>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {recentProjects.map((p) => (
                                <li key={p.id}>
                                    <Link
                                        to={`/spaces/${p.id}`}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-primary-deep/80 bg-primary-deep/5 w-10 h-10 rounded-lg flex items-center justify-center">
                                                {p.key?.slice(0, 2) || '?'}
                                            </span>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-primary-deep">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.key} · {p.member_count} members · {p.total_issues} issues</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-deep" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
