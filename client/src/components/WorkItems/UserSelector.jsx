import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const UserSelector = ({ users = [], selectedUserId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedUser = users.find(u => u.id === selectedUserId);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="relative">
            <label className="block text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider mb-2">Assignee</label>
            <div
                className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg cursor-pointer hover:border-primary-deep/30 transition-all group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2.5">
                    {selectedUser ? (
                        <>
                            <div className="w-6 h-6 rounded-full bg-primary-deep flex items-center justify-center text-white text-[0.65rem] font-bold shadow-sm">
                                {getInitials(selectedUser.name)}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{selectedUser.name}</span>
                        </>
                    ) : (
                        <>
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-[0.65rem] font-bold shadow-sm">
                                ?
                            </div>
                            <span className="text-sm font-medium text-slate-400">Unassigned</span>
                        </>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-premium z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-primary-deep/5 cursor-pointer transition-colors"
                        onClick={() => {
                            onSelect(null);
                            setIsOpen(false);
                        }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-[0.65rem] font-bold shadow-sm">
                                ?
                            </div>
                            <span className="text-sm font-medium text-slate-700">Unassigned</span>
                        </div>
                        {selectedUserId === user.id && <Check className="w-3.5 h-3.5 text-primary-deep" />}
                    </div>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between px-3 py-2.5 hover:bg-primary-deep/5 cursor-pointer transition-colors"
                            onClick={() => {
                                onSelect(user);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-primary-deep flex items-center justify-center text-white text-[0.65rem] font-bold shadow-sm">
                                    {getInitials(user.name)}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                            </div>
                            {selectedUserId === user.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSelector;
