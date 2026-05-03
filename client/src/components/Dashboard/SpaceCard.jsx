import React from 'react'

const SpaceCard = ({ icon: Icon, title, updatedAt, iconColor, iconBg }) => {
    return (
        <div className="bg-panel p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col gap-4">
            <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-accent-saffron/10`}>
                <Icon className={`h-6 w-6 ${iconColor} group-hover:text-accent-saffron transition-colors`} />
            </div>
            <div>
                <h3 className="font-semibold text-text">{title}</h3>
                <p className="text-xs text-gray-400 mt-1">Updated {updatedAt}</p>
            </div>
        </div>
    )
}

export default SpaceCard
