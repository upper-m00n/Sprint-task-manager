import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Palette, Smartphone, Megaphone, Code, ChevronRight } from 'lucide-react'
import SpaceCard from '../components/Dashboard/SpaceCard'
import TaskItem from '../components/Dashboard/TaskItem'
import ActivityStream from '../components/Dashboard/ActivityStream'
import { getForYouData, completeIssue } from '../api'

const Dashboard = () => {
    const { user } = useAuth()
    const [forYouData, setForYouData] = useState({
        spaces: [],
        tasks: [],
        activity_stream: []
    })
    const [loading, setLoading] = useState(true)
    const [taskFilter, setTaskFilter] = useState('active') // 'active' | 'completed'

    // Icon mapping for different project types
    const iconMap = {
        'design': Palette,
        'mobile': Smartphone,
        'marketing': Megaphone,
        'api': Code,
        'default': Code
    }

    // Color mapping for different project types
    const colorMap = {
        'design': { iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
        'mobile': { iconColor: 'text-green-600', iconBg: 'bg-green-50' },
        'marketing': { iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
        'api': { iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
        'default': { iconColor: 'text-gray-600', iconBg: 'bg-gray-50' }
    }

    useEffect(() => {
        const fetchForYouData = async () => {
            try {
                const response = await getForYouData()
                setForYouData(response.data)
            } catch (error) {
                console.error('Error fetching For You data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchForYouData()
    }, [])

    // Helper function to get icon and colors for a space
    const getSpaceStyle = (spaceName) => {
        const lowerName = spaceName.toLowerCase()
        if (lowerName.includes('design')) return { icon: iconMap.design, ...colorMap.design }
        if (lowerName.includes('mobile') || lowerName.includes('app')) return { icon: iconMap.mobile, ...colorMap.mobile }
        if (lowerName.includes('marketing') || lowerName.includes('web')) return { icon: iconMap.marketing, ...colorMap.marketing }
        if (lowerName.includes('api') || lowerName.includes('docs')) return { icon: iconMap.api, ...colorMap.api }
        return { icon: iconMap.default, ...colorMap.default }
    }

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // Helper function to get status color
    const getStatusColor = (statusName) => {
        const lowerStatus = statusName.toLowerCase()
        if (lowerStatus.includes('progress') || lowerStatus.includes('doing')) {
            return { statusColor: 'text-orange-600', statusBg: 'bg-orange-50' }
        }
        if (lowerStatus.includes('done') || lowerStatus.includes('complete')) {
            return { statusColor: 'text-green-600', statusBg: 'bg-green-50' }
        }
        return { statusColor: 'text-gray-500', statusBg: 'bg-gray-100' }
    }

    // Transform spaces data
    const transformedSpaces = forYouData.spaces.slice(0, 4).map(space => {
        const style = getSpaceStyle(space.name)
        return {
            icon: style.icon,
            title: space.name,
            updatedAt: formatDate(space.updated_at),
            iconColor: style.iconColor,
            iconBg: style.iconBg,
            id: space.id
        }
    })

    // Whether a task is considered completed (status is done/complete)
    const isTaskCompleted = (task) => {
        const lower = (task.status?.name || '').toLowerCase()
        return lower.includes('done') || lower.includes('complete')
    }

    // Transform tasks data and split by completion (keep task id for complete action)
    const allTransformedTasks = forYouData.tasks.map(task => {
        const statusColors = getStatusColor(task.status?.name || '')
        return {
            id: task.id,
            title: task.title,
            code: `TASK-${task.id.split('-')[0].toUpperCase()}`,
            date: formatDate(task.updated_at),
            status: (task.status?.name || '').toUpperCase(),
            ...statusColors,
            tagColor: 'text-blue-600',
            tagBg: 'bg-blue-100/50',
            isOverdue: false,
            _completed: isTaskCompleted(task)
        }
    })

    const activeTasks = allTransformedTasks.filter(t => !t._completed)
    const completedTasks = allTransformedTasks.filter(t => t._completed)
    const displayedTasks = taskFilter === 'completed' ? completedTasks : activeTasks

    const handleCompleteTask = async (issueId) => {
        try {
            await completeIssue(issueId)
            const res = await getForYouData()
            setForYouData(res.data)
        } catch (err) {
            console.error('Failed to complete task', err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary tracking-tight">
                    Good morning, {user?.name || 'User'}
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Here's what's happening with your projects today.</p>
            </div>

            {/* Recent Spaces */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-primary">Recent Spaces</h2>
                    <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                        View all <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                {transformedSpaces.length === 0 ? (
                    <div className="text-gray-400 text-sm">No spaces found</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {transformedSpaces.map((space, index) => (
                            <SpaceCard key={space.id || index} {...space} />
                        ))}
                    </div>
                )}
            </section>

            {/* Main Grid: Tasks & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
                {/* My Tasks */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-primary">My Tasks</h2>
                        <div className="flex bg-border p-1 rounded-lg">
                            <button
                                onClick={() => setTaskFilter('active')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${taskFilter === 'active' ? 'bg-panel shadow-sm text-primary' : 'text-gray-500 hover:text-primary'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setTaskFilter('completed')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${taskFilter === 'completed' ? 'bg-panel shadow-sm text-primary' : 'text-gray-500 hover:text-primary'}`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                    <div className="bg-panel rounded-2xl border border-border shadow-sm overflow-hidden">
                        {displayedTasks.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                {taskFilter === 'completed' ? 'No completed tasks yet' : 'No active tasks assigned'}
                            </div>
                        ) : (
                            <>
                                <div>
                                    {displayedTasks.map((task, index) => (
                                        <TaskItem
                                            key={`${task.code}-${index}`}
                                            {...task}
                                            isCompleted={task._completed}
                                            onComplete={taskFilter === 'active' ? handleCompleteTask : undefined}
                                        />
                                    ))}
                                </div>
                                <button className="w-full py-4 text-xs font-bold text-gray-400 border-t border-border hover:bg-border transition-colors uppercase tracking-widest">
                                    Show more tasks
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Activity Stream */}
                <div>
                    <h2 className="text-lg font-bold text-primary mb-6">Activity Stream</h2>
                    <ActivityStream activities={forYouData.activity_stream} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard