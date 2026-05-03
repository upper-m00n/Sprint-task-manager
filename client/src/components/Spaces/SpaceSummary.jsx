import React from 'react'
import { Rocket, Code, MessageSquare, UserPlus, Play } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StatusOverview, PriorityCard, UpcomingMilestones } from './StatCards'
import ProjectDetailsSidebar from './ProjectDetailsSidebar'
import ActivityItem from './ActivityItem'

const RefreshCcw = ({ className }) => <Play className={`${className} rotate-90`} />

const SpaceSummary = ({ projectData, loading }) => {
    const { user } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-gray-400">Loading project data...</div>
            </div>
        )
    }

    if (!projectData) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-gray-400">Project not found</div>
            </div>
        )
    }

    // Helper function to get icon for activity action
    const getActivityIcon = (action) => {
        const lowerAction = action.toLowerCase()
        if (lowerAction.includes('comment')) return MessageSquare
        if (lowerAction.includes('assigned') || lowerAction.includes('added')) return UserPlus
        if (lowerAction.includes('status')) return RefreshCcw
        return Code
    }

    // Helper function to get color for activity
    const getActivityColor = (action) => {
        const lowerAction = action.toLowerCase()
        if (lowerAction.includes('comment')) return 'bg-orange-300'
        if (lowerAction.includes('assigned') || lowerAction.includes('added')) return 'bg-orange-400'
        if (lowerAction.includes('status') && lowerAction.includes('done')) return 'bg-green-500'
        if (lowerAction.includes('status')) return 'bg-blue-500'
        return 'bg-blue-500'
    }

    // Helper function to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffHours < 1) return `${Math.floor(diffMs / 60000)} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays === 1) return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Transform activity data
    const activities = projectData.recent_activity.slice(0, 8).map((activity, index, arr) => {
        let actionDesc = activity.action
        if (activity.action === 'Status Changed') {
            actionDesc = `changed status to ${activity.new_value}`
        } else if (activity.action === 'Priority Changed') {
            actionDesc = `changed priority to ${activity.new_value}`
        } else if (activity.action === 'Assigned') {
            actionDesc = `assigned to ${activity.new_value}`
        }

        return {
            icon: getActivityIcon(activity.action),
            color: getActivityColor(activity.action),
            user: activity.changed_by_name,
            action: actionDesc,
            target: `Issue #${activity.issue_id.split('-')[0]}`,
            time: formatTime(activity.created_at),
            comment: activity.new_value && activity.action === 'Commented' ? activity.new_value : null,
            isLast: index === arr.length - 1
        }
    })

    // Placeholder upcoming milestones (future scope)
    const upcomingPlaceholder = [
        { label: 'Platform Alpha Release', date: 'Next Week' },
        { label: 'Internal Security Audit', date: 'In 2 Weeks' }
    ]

    // Transform members for sidebar
    const lead = projectData.members.length > 0 ? {
        name: projectData.members[0].name,
        role: projectData.members[0].role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${projectData.members[0].name}`
    } : {
        name: projectData.creator_name,
        role: 'Creator',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${projectData.creator_name}`
    }

    // Placeholder milestones (future scope)
    const milestonesPlaceholder = [
        { label: 'Milestone tracking', status: 'pending', statusText: 'Coming soon' }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 flex flex-col gap-8">
                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusOverview stats={projectData.stats} />
                    <PriorityCard priorities={projectData.stats.issues_by_priority} />
                    <UpcomingMilestones items={upcomingPlaceholder} />
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Recent Activity</h2>
                        <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="p-8 pb-4">
                        {activities.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">No recent activity</div>
                        ) : (
                            activities.map((activity, index) => (
                                <ActivityItem key={index} {...activity} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-1">
                <ProjectDetailsSidebar
                    description={projectData.description || 'No description provided'}
                    lead={lead}
                    milestones={milestonesPlaceholder}
                    canManage={projectData.currentUserRole === 'manager' || user?.roles?.includes('admin')}
                />
            </div>
        </div>
    )
}

export default SpaceSummary
