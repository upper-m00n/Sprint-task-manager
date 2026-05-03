import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Settings, Users, Calendar, ListTodo, MoreVertical } from 'lucide-react'

const AdminProjectCard = ({ id, name, projectKey, description, status, created_at, members = [], stats }) => {
    return (
        <div className="bg-panel p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 shadow-sm ring-1 ring-white/50">
                    <span className="text-lg font-black tracking-tighter text-primary uppercase select-none drop-shadow-sm">
                        {(projectKey ?? '—').slice(0, 4)}
                    </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-primary group-hover:text-accent-orange transition-colors">{name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[40px]">
                    {description || "No description provided."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mt-auto">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Members</span>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-primary">{members.length}</span>
                    </div>
                </div>
                {stats && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Issues</span>
                        <div className="flex items-center gap-2">
                            <ListTodo className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-primary">{stats.total_issues}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {members.slice(0, 4).map((member, index) => (
                        <div key={index} className="h-8 w-8 rounded-full border-2 border-panel bg-gray-100 overflow-hidden shadow-sm hover:z-10 transition-all cursor-help" title={member.name}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                        </div>
                    ))}
                    {members.length > 4 && (
                        <div className="h-8 w-8 rounded-full border-2 border-panel bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                            +{members.length - 4}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button type="button" className="p-2 hover:bg-border rounded-lg text-slate-400 hover:text-primary transition-all" aria-label="Settings">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                    <Link to={`/spaces/${id}`} className="bg-primary text-white p-2 rounded-lg shadow-sm hover:shadow-md hover:bg-accent-orange transition-all group/btn inline-flex">
                        <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminProjectCard
