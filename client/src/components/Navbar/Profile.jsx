import { Bell, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

    return (
        <div className="flex items-center gap-4 ml-4 border-l pl-4 border-gray-200">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent-saffron rounded-full border-2 border-white"></span>
            </button>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors font-medium">
                <Settings className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pl-1">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                        {user?.name || "User"}
                    </p>
                    <p className="text-[11px] font-bold text-accent-saffron uppercase tracking-tighter">
                        Standard Plan
                    </p>
                </div>
                <div className="h-9 w-9 bg-primary-deep rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-deep/10">
                    {initials}
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Log out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

export default Profile
