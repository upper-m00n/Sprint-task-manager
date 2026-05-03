import React, { useState, useEffect } from 'react'
import { Plus, Search, Users, Loader2 } from 'lucide-react'
import TeamCard from '../components/Teams/TeamCard'
import CreateTeamModal from '../components/Teams/CreateTeamModal'
import { getTeams } from '../api'

const Teams = () => {
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchTeams()
    }, [])

    const fetchTeams = async () => {
        try {
            const res = await getTeams()
            setTeams(res.data)
        } catch (err) {
            console.error('Failed to load teams:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleTeamCreated = (newTeam) => {
        setTeams((prev) => [newTeam, ...prev])
    }

    const filteredTeams = teams.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Teams</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Manage and collaborate with your teams.
                    </p>
                </div>
                <button
                    id="create-team-btn"
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Create team
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-panel text-text border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-text">
                            {search ? 'No teams found' : 'No teams yet'}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {search ? 'Try a different search term' : 'Create your first team to get started'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {filteredTeams.map((team) => (
                        <TeamCard key={team.id} {...team} />
                    ))}
                </div>
            )}

            {showModal && (
                <CreateTeamModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleTeamCreated}
                />
            )}
        </div>
    )
}

export default Teams
