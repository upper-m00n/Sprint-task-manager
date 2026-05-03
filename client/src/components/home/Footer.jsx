import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';
import { Hexagon } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-16 pb-10 bg-white border-t border-primary-deep/5">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-10">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-9 h-9 bg-primary-deep rounded-full flex items-center justify-center relative">
                            <div className="w-[18px] h-[18px] border-[3px] border-white rounded-full border-r-transparent rotate-45"></div>
                        </div> */}
                        <div className="bg-primary-deep p-1.5 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                            <Hexagon className="h-5 w-5 text-white fill-white/20" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-primary-deep uppercase">TaskBoard</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="#" className="text-[0.7rem] font-bold text-slate-500 tracking-widest hover:text-primary-deep uppercase">Product</a>
                        <a href="#" className="text-[0.7rem] font-bold text-slate-500 tracking-widest hover:text-primary-deep uppercase">Pricing</a>
                        <a href="#" className="text-[0.7rem] font-bold text-slate-500 tracking-widest hover:text-primary-deep uppercase">Security</a>
                        <a href="#" className="text-[0.7rem] font-bold text-slate-500 tracking-widest hover:text-primary-deep uppercase">About</a>
                        <a href="#" className="text-[0.7rem] font-bold text-slate-500 tracking-widest hover:text-primary-deep uppercase">Legal</a>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="text-slate-400 hover:text-primary-deep transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-primary-deep transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="pt-6 border-t border-primary-deep/[0.03] text-center lg:text-right">
                    <p className="text-[0.7rem] font-bold text-slate-400 tracking-wider">© 2026 TaskBoard</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
