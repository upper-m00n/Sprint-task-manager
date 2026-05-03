import React from 'react'
import { CheckCircle2, MessageSquare, Play, UserPlus, Edit, Trash2 } from 'lucide-react'

const ActivityItem = ({ icon: Icon, color, user, action, target, time, comment, isLast }) => {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-[1px] bg-gray-100"></div>
            )}
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center ring-4 ring-white`}>
                <Icon className="h-3 w-3 text-white" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-600">
                    <span className="font-bold text-gray-900">{user}</span> {action} <span className="font-bold text-accent-saffron cursor-pointer hover:underline">{target}</span>
                </p>
                <span className="text-[10px] text-gray-400 uppercase font-medium">{time}</span>
                {comment && (
                    <div className="mt-2 bg-accent-saffron/5 p-3 rounded-xl border border-accent-saffron/10">
                        <p className="text-xs text-slate-700 italic leading-relaxed">"{comment}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const ActivityStream = ({ activities = [] }) => {
    // Helper function to get icon based on action
    const getIconForAction = (action) => {
        const lowerAction = action.toLowerCase()
        if (lowerAction.includes('comment')) return MessageSquare
        if (lowerAction.includes('complete') || lowerAction.includes('done')) return CheckCircle2
        if (lowerAction.includes('start')) return Play
        if (lowerAction.includes('join') || lowerAction.includes('add')) return UserPlus
        if (lowerAction.includes('edit') || lowerAction.includes('update')) return Edit
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return Trash2
        return Edit
    }

    // Helper function to get color based on action
    const getColorForAction = (action) => {
        const lowerAction = action.toLowerCase()
        if (lowerAction.includes('comment')) return 'bg-purple-500'
        if (lowerAction.includes('complete') || lowerAction.includes('done')) return 'bg-accent-green'
        if (lowerAction.includes('start') || lowerAction.includes('progress')) return 'bg-accent-saffron'
        if (lowerAction.includes('join') || lowerAction.includes('add')) return 'bg-primary-deep'
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'bg-red-500'
        return 'bg-gray-500'
    }

    // Helper function to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} Minutes Ago`
        if (diffHours < 24) return `${diffHours} Hours Ago`
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} Days Ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Transform activities from API
    const transformedActivities = activities.slice(0, 10).map((activity, index) => ({
        icon: getIconForAction(activity.action),
        color: getColorForAction(activity.action),
        user: activity.changed_by_name,
        action: activity.action,
        target: `Issue #${activity.issue_id.split('-')[0]}`,
        time: formatTime(activity.created_at),
        comment: activity.new_value && activity.new_value.length < 100 ? activity.new_value : null,
        isLast: index === Math.min(activities.length - 1, 9)
    }))

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {transformedActivities.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">No recent activity</div>
            ) : (
                <div className="flex flex-col">
                    {transformedActivities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ActivityStream
