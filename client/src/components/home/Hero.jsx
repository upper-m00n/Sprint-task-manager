import React from 'react';
import { Play } from 'lucide-react';

const Hero = () => {
    return (
        <section className="pt-40 pb-20 relative overflow-hidden bg-[#FFFBF5]" id="home">
            {/* Subtle grid background instead of Ashoka Chakra */}
            <div className="absolute inset-0 opacity-[0.04] z-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000080 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-[1280px] mx-auto px-8 flex flex-col items-center text-center relative z-10">
                <div className="bg-primary-deep/10 text-primary-deep text-[0.75rem] font-bold px-4 py-1.5 rounded-full tracking-wider mb-6">
                    ACADEMIC PROJECT — FULL-STACK ENGINEERING
                </div>

                <h1 className="text-6xl md:text-[5.5rem] font-extrabold leading-[1.1] text-primary-deep mb-6 tracking-tight">
                    Centralized Project Tracking <br />
                    <span className="text-primary-deep">Platform</span>
                </h1>

                <p className="text-xl text-slate-500 max-w-[600px] mb-10 font-normal">
                    A full-stack issue tracking system built with Express, React, and MongoDB — featuring Kanban boards, role-based access control, and project-scoped workflows.
                </p>

                <div className="flex gap-5 mb-20 flex-wrap justify-center">
                    <button className="bg-primary-deep text-white px-9 py-4 rounded-lg font-bold text-lg shadow-[0_10px_25px_-5px_rgba(0,0,128,0.3)]">
                        Get Started Free
                    </button>

                    <button className="bg-white text-primary-deep border-2 border-primary-deep px-9 py-4 rounded-lg font-bold text-lg flex items-center gap-3">
                        <Play className="w-5 h-5 fill-primary-deep" />
                        Watch Demo
                    </button>
                </div>

                {/* Kanban Board Mockup */}
                <div className="w-full max-w-[1000px] bg-white rounded-xl flex overflow-hidden border border-primary-deep/10 text-left shadow-premium">
                    <div className="w-[200px] bg-slate-50 border-r border-primary-deep/5 p-6 hidden sm:block">
                        <div className="flex gap-3 mb-8">
                            <div className="w-8 h-8 bg-primary-deep rounded flex items-center justify-center text-white font-extrabold text-sm">T</div>
                            <div className="flex flex-col">
                                <div className="text-[0.75rem] font-bold text-primary-deep leading-tight">TaskBoard Platform</div>
                                <div className="text-[0.6rem] text-slate-400">Software Project</div>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <div className="text-[0.75rem] font-semibold text-primary-deep bg-primary-deep/5 px-3 py-2 rounded-md">Kanban Board</div>
                            <div className="text-[0.75rem] font-semibold text-slate-500 px-3 py-2 rounded-md">Backlog</div>
                            <div className="text-[0.75rem] font-semibold text-slate-500 px-3 py-2 rounded-md">Reports</div>
                            <div className="text-[0.75rem] font-semibold text-slate-500 px-3 py-2 rounded-md">Settings</div>
                        </nav>
                    </div>

                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-center mb-8 border-b border-primary-deep/5 pb-4">
                            <div className="text-[0.75rem] font-semibold text-slate-500">
                                Active Sprint: <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded ml-1">QA_RELEASE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full text-white text-[0.65rem] font-bold flex items-center justify-center bg-accent-saffron">AK</div>
                                <div className="w-7 h-7 rounded-full text-white text-[0.65rem] font-bold flex items-center justify-center bg-accent-green">RV</div>
                                <div className="w-7 h-7 rounded-full text-white text-[0.65rem] font-bold flex items-center justify-center bg-primary-deep">SN</div>
                                <button className="bg-primary-deep text-white text-[0.7rem] font-bold px-3 py-1.5 rounded ml-2">Complete Sprint</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="text-[0.7rem] font-extrabold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                    To Do <span className="bg-slate-100 px-1.5 py-0.5 rounded-full text-[0.65rem] normal-case font-semibold">2</span>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-red-100 text-red-500 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block">CRITICAL</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-203</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">Fix API latency spike in production</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">⚠️</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">AM</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-blue-100 text-blue-500 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block uppercase">Medium</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-210</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">Mobile App Dark Mode Support</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">🟦</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">JD</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="text-[0.7rem] font-extrabold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                    In Progress <span className="bg-slate-100 px-1.5 py-0.5 rounded-full text-[0.65rem] normal-case font-semibold">2</span>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-blue-50 text-blue-600 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block uppercase">Feature</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-184</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">OAuth2 SSO Integration Phase 2</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">📈</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">RK</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-blue-50 text-blue-600 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block uppercase">Enhancement</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-198</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">Dashboard Analytics Module</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">🛠️</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">KN</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="text-[0.7rem] font-extrabold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                    Done <span className="bg-slate-100 px-1.5 py-0.5 rounded-full text-[0.65rem] normal-case font-semibold">11</span>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-green-50 text-green-500 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block uppercase">Task</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-164</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">Database Query Optimisation</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">✅</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">AB</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-primary-deep/5 rounded-lg p-3 shadow-sm">
                                    <div className="bg-green-50 text-green-500 text-[0.55rem] font-extrabold px-1.5 py-0.5 rounded mb-2 inline-block uppercase">Task</div>
                                    <div className="float-right text-[0.6rem] text-slate-400 font-semibold uppercase">TB-122</div>
                                    <div className="text-[0.8rem] font-semibold text-slate-900 mb-3 leading-snug">Onboarding Documentation Update</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">📄</span>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[0.5rem] font-bold flex items-center justify-center uppercase">RP</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
