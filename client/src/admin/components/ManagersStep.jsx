// HMR Trigger
import React, { useState, useEffect } from 'react';
import { Search, Shield, User as UserIcon, X, Check, Loader2 } from 'lucide-react';
import api from '../../api';

const ManagersStep = ({ data, updateData }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const members = data.members || [];

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/users?q=${searchQuery}`);
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const toggleMember = (user, role) => {
        const exists = members.find(m => m.user_id === user.id);
        if (exists) {
            if (exists.role === role) {
                // Remove if same role
                updateData({ members: members.filter(m => m.user_id !== user.id) });
            } else {
                // Change role
                updateData({ members: members.map(m => m.user_id === user.id ? { ...m, role } : m) });
            }
        } else {
            // Add new
            updateData({ members: [...members, { user_id: user.id, name: user.name, role }] });
        }
    };

    const isMember = (userId, role) => {
        return members.find(m => m.user_id === userId && m.role === role);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-primary text-center">Manage Leadership</h2>
                <p className="text-sm text-slate-500 text-center">Assign at least one Manager to lead this space.</p>
            </div>

            <div className="flex flex-col gap-6">
                {/* Selected Summary */}
                {members.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-primary-deep/5 rounded-2xl border border-primary-deep/10">
                        {members.map(member => (
                            <div key={member.user_id} className="flex items-center gap-2 bg-panel px-3 py-1.5 rounded-full border border-primary/10 shadow-sm animate-in zoom-in-90">
                                <div className="w-5 h-5 rounded-full bg-primary-deep flex items-center justify-center text-[8px] font-bold text-white">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-[10px] font-bold text-primary">{member.name}</span>
                                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-border px-1.5 py-0.5 rounded italic">
                                    {member.role.replace('_', ' ')}
                                </span>
                                <button onClick={() => toggleMember({ id: member.user_id }, member.role)} className="hover:text-red-500 transition-colors">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search Box */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users to assign..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-border border border-border rounded-xl py-3 pl-12 pr-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        </div>
                    )}
                </div>

                {/* Results List */}
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-border transition-all border border-transparent hover:border-border group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary">{user.name}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => toggleMember(user, 'manager')}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${isMember(user.id, 'manager') ? 'bg-primary text-white' : 'bg-panel text-slate-500 border border-border hover:bg-primary/5 hover:text-primary'}`}
                                >
                                    {isMember(user.id, 'manager') && <Check className="h-3 w-3" />}
                                    Manager
                                </button>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && !loading && searchQuery && (
                        <div className="text-center py-10">
                            <p className="text-xs font-bold text-slate-300">No matching users found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagersStep;
