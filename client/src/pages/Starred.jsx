import React from 'react'

const Starred = () => {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-primary-deep tracking-tight">Starred</h1>
            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-accent-saffron/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold text-primary-deep">No starred items yet</h3>
                <p className="text-slate-500 max-w-xs mt-2">
                    Items you star will appear here for quick access.
                </p>
            </div>
        </div>
    )
}

export default Starred
