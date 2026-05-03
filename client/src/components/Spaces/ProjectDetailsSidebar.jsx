import React from 'react'
import { CheckCircle2, Circle, Settings } from 'lucide-react'

const ProjectDetailsSidebar = ({ description, lead, milestones, canManage }) => {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
            <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Project Details</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Lead Developer</h3>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <img src={lead?.avatar} alt={lead?.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">{lead?.name}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{lead?.role}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Key Milestones</h3>
                <div className="flex flex-col">
                    {milestones?.map((milestone, index) => (
                        <div key={index} className="relative pl-8 pb-8 last:pb-0">
                            {index !== milestones?.length - 1 && (
                                <div className="absolute left-3 top-6 bottom-0 w-[1px] bg-gray-100"></div>
                            )}
                            <div className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center">
                                {milestone.status === 'completed' ? (
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-50" />
                                ) : milestone.status === 'in-progress' ? (
                                    <Circle className="h-5 w-5 text-blue-500 fill-white" strokeWidth={3} />
                                ) : (
                                    <Circle className="h-5 w-5 text-gray-200" />
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className={`text-xs font-bold ${milestone.status === 'completed' ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {milestone.label}
                                </h4>
                                <span className={`text-[10px] font-bold uppercase ${milestone.status === 'completed' ? 'text-green-500' :
                                    milestone.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'
                                    }`}>
                                    {milestone.statusText}
                                </span>
                                {milestone.date && <span className="text-[10px] text-gray-400 font-medium mt-1">{milestone.date}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {canManage && (
                <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                    <Settings className="h-4 w-4 text-gray-400 group-hover:rotate-45 transition-transform" />
                    Project Settings
                </button>
            )}
        </div>
    )
}

export default ProjectDetailsSidebar
