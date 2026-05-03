import React from 'react';
import { NavLink } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full h-20 flex items-center z-[1000] border-b border-primary-deep/5 glass">
            <div className="max-w-[1280px] mx-auto px-8 w-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* <div className="w-9 h-9 bg-primary-deep rounded-full flex items-center justify-center relative">
                        <div className="w-[18px] h-[18px] border-[3px] border-white rounded-full border-r-transparent rotate-45"></div>
                    </div> */}
                    <div className="bg-primary-deep p-1.5 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                        <Hexagon className="h-5 w-5 text-white fill-white/20" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-primary-deep uppercase">Sprint</span>
                </div>

                <div className="hidden md:flex gap-8">
                    <a href="#home" className="font-medium text-sm text-slate-500 hover:text-primary-deep transition-colors">Home</a>
                    <a href="#features" className="font-medium text-sm text-slate-500 hover:text-primary-deep transition-colors">Features</a>
                    <a href="#about" className="font-medium text-sm text-slate-500 hover:text-primary-deep transition-colors">About Us</a>
                </div>

                <div className="flex items-center gap-4">
                    <NavLink to="/login" className="font-semibold text-[0.95rem] text-primary-deep">Log In</NavLink>
                    <NavLink to="/register" className="bg-primary-deep text-white px-6 py-2.5 rounded-lg font-semibold text-[0.95rem] shadow-[0_4px_14px_0_rgba(0,0,128,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_0_rgba(0,0,128,0.25)] transition-all">Sign Up</NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
