import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Star, LayoutGrid, Users, ChevronDown, ChevronRight, Shield, FolderKanban } from 'lucide-react'
import { getMySpaces } from '../../api'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
    const { isAdmin } = useAuth()
    const [spaces, setSpaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSpacesOpen, setIsSpacesOpen] = useState(false)
    const location = useLocation()

    const navItems = [
        { icon: Home, label: 'For You', path: '/dashboard' },
        { icon: Star, label: 'Starred', path: '/starred' },
    ]

    const otherNavItems = [
        { icon: Users, label: 'Teams', path: '/teams' },
    ]

    // Color palette for space indicators
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-yellow-500',
        'bg-indigo-500',
        'bg-red-500',
        'bg-teal-500',
    ]

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await getMySpaces()
                const spacesData = response.data.map((space, index) => ({
                    id: space.id,
                    label: space.name,
                    color: colors[index % colors.length],
                    path: `/spaces/${space.id}`
                }))
                setSpaces(spacesData)

                // Keep dropdown open if we are currently on a space page
                if (location.pathname.startsWith('/spaces/')) {
                    setIsSpacesOpen(true)
                }
            } catch (error) {
                console.error('Error fetching spaces:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSpaces()
    }, [])

    const toggleSpaces = () => setIsSpacesOpen(!isSpacesOpen)

    return (
        <aside className="w-64 h-[calc(100vh-64px)] bg-panel border-r border-border flex flex-col p-4 sticky top-16 overflow-y-auto transition-colors duration-300">
            {/* Navigation Items */}
            <div className="space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:bg-border hover:text-text'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Spaces Dropdown Toggle */}
                <button
                    onClick={toggleSpaces}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isSpacesOpen || location.pathname.startsWith('/spaces/')
                        ? 'bg-border text-text'
                        : 'text-gray-500 hover:bg-border hover:text-text'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <LayoutGrid className={`h-4.5 w-4.5 ${isSpacesOpen || location.pathname.startsWith('/spaces/') ? 'text-primary' : 'text-gray-400'}`} />
                        <span>Spaces</span>
                    </div>
                    {isSpacesOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                </button>

                {/* Dropdown Content */}
                {isSpacesOpen && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-gray-100 pl-3 transition-all duration-300">
                        {loading ? (
                            <div className="px-3 py-2 text-xs text-gray-400">Loading...</div>
                        ) : spaces.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-400">No spaces found</div>
                        ) : (
                            spaces.map((space) => (
                                <NavLink
                                    key={space.id}
                                    to={space.path}
                                    className={({ isActive }) =>
                                        `w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors group rounded-lg ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-gray-500 hover:bg-border'
                                        }`
                                    }
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${space.color} group-hover:scale-125 transition-transform`} />
                                    <span className="truncate">{space.label}</span>
                                </NavLink>
                            ))
                        )}
                    </div>
                )}

                {otherNavItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-primary/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:bg-border hover:text-text'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}

                {isAdmin && (
                    <>
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <p className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</p>
                        </div>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-gray-500 hover:bg-border hover:text-text'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Shield className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                    Dashboard
                                </>
                            )}
                        </NavLink>
                        <NavLink
                            to="/admin/projects"
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-gray-500 hover:bg-border hover:text-text'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <FolderKanban className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                    Projects
                                </>
                            )}
                        </NavLink>
                    </>
                )}
            </div>
        </aside>
    )
}

export default Sidebar
