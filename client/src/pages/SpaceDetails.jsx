import React, { useState, useEffect } from 'react'
import { useParams, Routes, Route } from 'react-router-dom'
import { Rocket, AlertCircle } from 'lucide-react'
import SpaceHeader from '../components/Spaces/SpaceHeader'
import { getProjectDetails } from '../api'
import Board from '../components/Board/Board'
import SpaceSummary from '../components/Spaces/SpaceSummary'
import SpaceBacklog from '../components/Spaces/SpaceBacklog'

const SpaceDetails = () => {
    const { id } = useParams()
    const [projectData, setProjectData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setLoading(true)
                const response = await getProjectDetails(id)
                setProjectData(response.data)
            } catch (err) {
                console.error('Error fetching project details:', err)
                setError(err.response?.data?.detail || 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProjectData()
        }
    }, [id])

    // Default icon for projects
    const projectIcon = Rocket
    const iconColor = 'text-primary-deep'
    const iconBg = 'bg-primary-deep/5'

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Project</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <SpaceHeader
                title={loading ? 'Loading...' : projectData?.name || 'Project'}
                role={projectData?.currentUserRole}
                icon={projectIcon}
                iconBg={iconBg}
                iconColor={iconColor}
            />

            <Routes>
                <Route index element={<SpaceSummary projectData={projectData} loading={loading} />} />
                <Route path="backlog" element={<SpaceBacklog />} />
                <Route path="board" element={<Board />} />
            </Routes>
        </div>
    )
}

export default SpaceDetails
