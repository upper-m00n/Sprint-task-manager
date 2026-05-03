import React, { useState } from 'react'
import { Calendar } from 'lucide-react'

const TaskItem = ({ id, title, code, date, status, statusColor, statusBg, tagColor, tagBg, isOverdue, isCompleted, onComplete }) => {
    const [loading, setLoading] = useState(false)

    const handleCheck = () => {
        if (isCompleted || !onComplete || !id || loading) return
        setLoading(true)
        onComplete(id).finally(() => setLoading(false))
    }

    return (
        <div className="flex items-center justify-between p-4 hover:bg-border/50 transition-colors border-b border-border last:border-0 group">

            <div className="flex items-center gap-4 flex-1">
                <input
                    type="checkbox"
                    checked={!!isCompleted}
                    disabled={loading || !!isCompleted}
                    onChange={handleCheck}
                    className="w-5 h-5 rounded-md border-gray-300 text-primary-deep focus:ring-primary-deep cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                />
                <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                        {title}
                    </h4>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${tagBg} ${tagColor}`}>
                            {code}
                        </span>
                        <div className={`flex items-center gap-1.5 text-[11px] ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            <Calendar className="h-3 w-3" />
                            {date}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${statusBg} ${statusColor}`}>
                    {status}
                </span>
                <div className="h-8 w-8 rounded-full bg-border border-2 border-panel overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${title}`} alt="User" />
                </div>
            </div>
        </div>
    )
}

export default TaskItem
