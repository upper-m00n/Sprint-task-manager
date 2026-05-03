import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = () => {
    return (
        <div className="flex-1 max-w-2xl px-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-deep transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-transparent rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-deep focus:border-primary-deep sm:text-sm transition-all shadow-sm hover:bg-gray-200 focus:hover:bg-white text-gray-700"
                    placeholder="Search tasks, spaces, or people..."
                />
            </div>
        </div>
    )
}

export default SearchBar