import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { ListTodo, Presentation, BarChart3 } from 'lucide-react'

const SpaceHeader = ({ title, role, icon: Icon, iconBg = "bg-blue-50", iconColor = "text-blue-600" }) => {
    const { id } = useParams()

    const tabs = [
        { label: 'Summary', icon: BarChart3, path: `/spaces/${id}` },
        { label: 'Backlog', icon: ListTodo, path: `/spaces/${id}/backlog` },
        { label: 'Board', icon: Presentation, path: `/spaces/${id}/board` },
    ]

    return (
        <div className="flex flex-col gap-8 mb-10">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {role && (
                    <span className="px-3 py-1 bg-primary-deep/5 text-primary-deep text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-deep/10">
                        {role}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1 border-b border-gray-100">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.label}
                        to={tab.path}
                        end={tab.label === 'Summary'}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${isActive
                                ? 'text-blue-600'
                                : 'text-gray-400 hover:text-gray-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <tab.icon className="h-4.5 w-4.5" />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default SpaceHeader
