import React from 'react'
import { ChevronRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TeamCard = ({ id, name, description, members = [], project_count = 0 }) => {
    const navigate = useNavigate()

    return (
        <div className="bg-panel p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-accent-saffron/10 text-accent-saffron">
                    {project_count} {project_count === 1 ? 'Project' : 'Projects'}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-text">{name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {description || 'No description provided.'}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                {/* Avatars */}
                <div className="flex -space-x-2">
                    {members.slice(0, 4).map((member, index) => (
                        <div
                            key={index}
                            className="h-8 w-8 rounded-full border-2 border-panel bg-gray-100 overflow-hidden shadow-sm"
                            title={member.name}
                        >
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name || member.user_id}`}
                                alt={member.name}
                            />
                        </div>
                    ))}
                    {members.length > 4 && (
                        <div className="h-8 w-8 rounded-full border-2 border-panel bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                            +{members.length - 4}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/teams/${id}`)}
                    className="text-primary text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                    View team <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default TeamCard
