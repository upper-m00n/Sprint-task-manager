import React from 'react'
import { RefreshCcw, Flag, Calendar } from 'lucide-react'

export const StatusOverview = ({ stats }) => {
    const { total_issues = 0, issues_by_status = {} } = stats || {}
    const doneTasks = (issues_by_status['Done'] || 0) + (issues_by_status['Resolved'] || 0) + (issues_by_status['Closed'] || 0)
    const progress = total_issues > 0 ? Math.round((doneTasks / total_issues) * 100) : 0

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Status Overview</span>
                <RefreshCcw className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-900">{progress}%</span>
                <span className="text-xs text-gray-400 mb-2">{doneTasks} of {total_issues} tasks completed</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-2 gap-y-2 mt-2">
                {Object.entries(issues_by_status).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between pr-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{status}</span>
                        <span className="text-[11px] font-bold text-gray-900">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const PriorityCard = ({ priorities }) => {
    const priorityConfig = {
        'Critical': { color: 'bg-red-600', label: 'Crit' },
        'High': { color: 'bg-red-500', label: 'High' },
        'Medium': { color: 'bg-orange-400', label: 'Med' },
        'Low': { color: 'bg-blue-400', label: 'Low' }
    }

    const priorityItems = Object.entries(priorities || {}).map(([key, count]) => ({
        label: priorityConfig[key]?.label || key,
        fullLabel: key,
        count,
        color: priorityConfig[key]?.color || 'bg-gray-400'
    })).sort((a, b) => {
        const order = ['Critical', 'High', 'Medium', 'Low']
        return order.indexOf(a.fullLabel) - order.indexOf(b.fullLabel)
    })

    const total = priorityItems.reduce((acc, curr) => acc + curr.count, 0)

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Priority Distribution</span>
                <Flag className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex gap-1 h-3 items-end mb-1">
                {priorityItems.map((item) => (
                    <div
                        key={item.fullLabel}
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ flexGrow: item.count || 1, minWidth: item.count > 0 ? '4px' : '0px' }}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-1">
                {priorityItems.map((item) => (
                    <div key={item.fullLabel} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${item.color}`} />
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-900">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const UpcomingMilestones = ({ items }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Development Sprint</span>
            <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex flex-col gap-5">
            {items.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700 uppercase tracking-tight">{item.label}</span>
                        <span className="text-blue-600 font-black px-2 py-0.5 bg-blue-50 rounded-md text-[10px]">{item.date}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[15%] rounded-full opacity-60" />
                    </div>
                </div>
            ))}
        </div>
    </div>
)
