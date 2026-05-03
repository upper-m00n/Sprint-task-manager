import React from 'react'

// eslint-disable-next-line no-unused-vars
const ActivityItem = ({ icon: IconComponent, color, user, action, target, time, comment, isLast, tag }) => (
    <div className="relative pl-10 pb-10 last:pb-0">
        {!isLast && <div className="absolute left-[15px] top-8 bottom-0 w-[1px] bg-gray-100"></div>}
        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${color} flex items-center justify-center ring-4 ring-white shadow-sm`}>
            <IconComponent className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-gray-600 font-medium">
                <span className="font-bold text-gray-900">{user}</span> {action} <span className="font-bold text-blue-600 cursor-pointer hover:underline">{target}</span>
                {tag && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded uppercase tracking-wider">{tag}</span>}
            </p>
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-tight">{time}</span>
            {comment && (
                <div className="mt-3 bg-blue-50/40 p-4 rounded-2xl border border-blue-100/30">
                    <p className="text-[13px] text-blue-800 italic leading-relaxed">"{comment}"</p>
                </div>
            )}
        </div>
    </div>
)

export default ActivityItem
