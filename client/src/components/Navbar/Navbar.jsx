import React from 'react'
import SearchBar from './SearchBar'
import CreateBtn from './CreateBtn'
import Profile from './Profile'
import ThemeSwitcher from '../ThemeSwitcher'
import { Hexagon } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:bg-primary/90 transition-colors">
          <Hexagon className="h-5 w-5 text-white fill-white/20" />
        </div>
        <span className="font-bold text-xl tracking-tight text-primary">Sprint</span>
      </div>

      {/* Center: Search Bar */}
      <SearchBar />

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <CreateBtn />
        <Profile />
      </div>
    </nav>
  )
}

export default Navbar