import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Users, UserPlus, Trash2, Crown, Loader2,
    FolderKanban, Shield, AlertCircle, Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
    getTeam, addTeamMember, removeTeamMember, updateTeamMemberRole,
    assignTeamToProject, searchUsers, getMySpaces
} from '../api'

// ─── Sub-components ───────────────────────────────────────────────────────────

const RoleBadge = ({ role }) => (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${role === 'manager'
        ? 'bg-amber-50 text-amber-600 border border-amber-200'
        : 'bg-gray-100 text-gray-500'
        }`}>
        {role === 'manager' ? (
            <span className="flex items-center gap-1"><Crown className="h-2.5 w-2.5" /> Manager</span>
        ) : 'Member'}
    </span>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TeamDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isAdmin } = useAuth()

    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Add member state
    const [memberSearch, setMemberSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [addingUser, setAddingUser] = useState(null)

    // Assign project state
    const [mySpaces, setMySpaces] = useState([])
    const [selectedProject, setSelectedProject] = useState('')
    const [assigning, setAssigning] = useState(false)

    // Permissions
    const myMembership = team?.members?.find((m) => m.user_id === user?.id)
    const canManage = isAdmin || myMembership?.role === 'manager'

    useEffect(() => {
        fetchTeam()
        fetchSpaces()
    }, [id])

    const fetchTeam = async () => {
        try {
            const res = await getTeam(id)
            setTeam(res.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load team')
        } finally {
            setLoading(false)
        }
    }

    const fetchSpaces = async () => {
        try {
            const res = await getMySpaces()
            setMySpaces(res.data)
        } catch { /* non-critical */ }
    }

    // ─── Member Search ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!memberSearch.trim()) { setSearchResults([]); return }
        const t = setTimeout(async () => {
            setSearching(true)
            try {
                const res = await searchUsers(memberSearch)
                const existingIds = new Set(team?.members?.map((m) => m.user_id))
                setSearchResults(res.data.filter((u) => !existingIds.has(u.id)))
            } catch { setSearchResults([]) }
            finally { setSearching(false) }
        }, 300)
        return () => clearTimeout(t)
    }, [memberSearch, team])

    const handleAddMember = async (targetUser) => {
        setAddingUser(targetUser.id)
        try {
            await addTeamMember(id, { user_id: targetUser.id, role: 'member' })
            await fetchTeam()
            setMemberSearch('')
            setSearchResults([])
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to add member')
        } finally {
            setAddingUser(null)
        }
    }

    const handleRemoveMember = async (userId) => {
        if (!confirm('Remove this member from the team?')) return
        try {
            await removeTeamMember(id, userId)
            setTeam((prev) => ({
                ...prev,
                members: prev.members.filter((m) => m.user_id !== userId),
            }))
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to remove member')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateTeamMemberRole(id, { user_id: userId, role: newRole })
            setTeam((prev) => ({
                ...prev,
                members: prev.members.map((m) =>
                    m.user_id === userId ? { ...m, role: newRole } : m
                ),
            }))
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to update role')
        }
    }

    const handleAssignToProject = async () => {
        if (!selectedProject) return
        setAssigning(true)
        try {
            const res = await assignTeamToProject(selectedProject, id)
            alert(res.data.message)
            setSelectedProject('')
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to assign team to project')
        } finally {
            setAssigning(false)
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-primary-deep animate-spin" />
        </div>
    )

    if (error) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <h3 className="font-bold text-gray-700">Error loading team</h3>
            <p className="text-sm text-gray-400">{error}</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/teams')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </button>
                <div className="w-11 h-11 bg-primary-deep/8 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-deep" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                    {team.description && (
                        <p className="text-sm text-gray-400 mt-0.5">{team.description}</p>
                    )}
                </div>
                {myMembership && <RoleBadge role={myMembership.role} />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Members Panel */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                            Members · {team.members.length}
                        </h2>
                    </div>

                    {/* Add member (manager only) */}
                    {canManage && (
                        <div className="px-6 py-4 border-b border-gray-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    id="add-member-search"
                                    type="text"
                                    placeholder="Search users to add..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep transition-all"
                                />
                            </div>

                            {/* Search results */}
                            {(searching || searchResults.length > 0) && (
                                <div className="mt-2 bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
                                    {searching ? (
                                        <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-gray-400">No users found</div>
                                    ) : (
                                        searchResults.map((u) => (
                                            <div key={u.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddMember(u)}
                                                    disabled={addingUser === u.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-deep text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                                                >
                                                    {addingUser === u.id
                                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                                        : <UserPlus className="h-3 w-3" />
                                                    }
                                                    Add
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Member list */}
                    <div className="divide-y divide-gray-50">
                        {team.members.map((member) => (
                            <div key={member.user_id} className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                            alt={member.name}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                                        <p className="text-xs text-gray-400">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {canManage ? (
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                                            className="text-xs font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-deep/20 cursor-pointer"
                                        >
                                            <option value="member">Member</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    ) : (
                                        <RoleBadge role={member.role} />
                                    )}
                                    {canManage && member.user_id !== user?.id && (
                                        <button
                                            onClick={() => handleRemoveMember(member.user_id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors"
                                            title="Remove member"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Projects */}
                <div className="flex flex-col gap-6">
                    {/* Assigned Projects */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50">
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                                Projects · {team.projects?.length ?? 0}
                            </h2>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            {team.projects?.length === 0 ? (
                                <p className="text-xs text-gray-400 px-2 py-3">No projects assigned yet.</p>
                            ) : (
                                team.projects?.map((p) => (
                                    <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50">
                                        <FolderKanban className="h-4 w-4 text-primary-deep" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-400">{p.key}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Assign to project (manager only) */}
                    {canManage && mySpaces.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                                Assign to project
                            </h3>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep"
                            >
                                <option value="">Select a project...</option>
                                {mySpaces.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAssignToProject}
                                disabled={!selectedProject || assigning}
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-deep text-white text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                Assign team
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeamDetails
