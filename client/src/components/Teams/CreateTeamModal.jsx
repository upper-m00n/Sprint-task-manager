import React, { useState } from 'react'
import { X, Users, Loader2 } from 'lucide-react'
import { createTeam } from '../../api'

const CreateTeamModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name.trim()) return
        setLoading(true)
        setError(null)
        try {
            const res = await createTeam(form)
            onCreated(res.data)
            onClose()
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create team')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-deep/8 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-deep" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900">Create new team</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Team name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="team-name"
                            type="text"
                            placeholder="e.g. Engineering"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep transition-all"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Description
                        </label>
                        <textarea
                            id="team-description"
                            placeholder="What does this team work on?"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep transition-all resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !form.name.trim()}
                            className="flex items-center gap-2 px-5 py-2 bg-primary-deep text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Create team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTeamModal
