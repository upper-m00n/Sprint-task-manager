import React from 'react';
import { Layout, CheckCircle, Clock } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-24 bg-white" id="features">
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-extrabold text-primary-deep mb-4 tracking-tight">Powerful Features for Modern Teams</h2>
                    <div className="flex justify-center gap-1">
                        <span className="w-10 h-1 bg-accent-saffron rounded-full"></span>
                        <span className="w-10 h-1 bg-accent-green rounded-full"></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Smart Ticketing */}
                    <div className="bg-white rounded-xl p-10 border border-primary-deep/5 flex flex-col items-center text-center shadow-premium hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-lg bg-accent-saffron/10 flex items-center justify-center mb-6">
                            <span className="text-2xl contrast-110">📋</span>
                        </div>
                        <h3 className="text-2xl font-bold text-primary-deep mb-4">Smart Ticketing</h3>
                        <p className="text-[0.95rem] text-slate-500 leading-relaxed mb-8">
                            Prioritize issues with our Saffron-coded severity levels. From Critical to Minor, manage every bug with laser focus.
                        </p>
                        <div className="flex gap-2">
                            <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-full bg-accent-saffron text-white uppercase">CRITICAL</span>
                            <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-full bg-orange-400 text-white uppercase">MAJOR</span>
                            <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-full bg-orange-100 text-accent-saffron uppercase">LOW</span>
                        </div>
                    </div>

                    {/* Agile Boards */}
                    <div className="bg-white rounded-xl p-10 border border-primary-deep/5 flex flex-col items-center text-center shadow-premium hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-lg bg-primary-deep/5 flex items-center justify-center mb-6">
                            <Layout className="w-8 h-8 text-primary-deep" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary-deep mb-4">Agile Boards</h3>
                        <p className="text-[0.95rem] text-slate-500 leading-relaxed mb-8">
                            Fully customizable Kanban and Scrum boards. Collaborate seamlessly across distributed teams — wherever they are.
                        </p>
                        <div className="flex gap-2">
                            <div className="w-8 h-12 rounded bg-slate-200"></div>
                            <div className="w-8 h-12 rounded bg-slate-300 scale-110 -mt-2"></div>
                            <div className="w-8 h-12 rounded bg-slate-200"></div>
                        </div>
                    </div>

                    {/* SLA Monitoring */}
                    <div className="bg-white rounded-xl p-10 border border-primary-deep/5 flex flex-col items-center text-center shadow-premium hover:-translate-y-2 transition-all">
                        <div className="w-16 h-16 rounded-lg bg-accent-green/10 flex items-center justify-center mb-6">
                            <Clock className="w-8 h-8 text-accent-green" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary-deep mb-4">SLA Monitoring</h3>
                        <p className="text-[0.95rem] text-slate-500 leading-relaxed mb-8">
                            Real-time green-themed success indicators. Keep your response times within limits and ensure client satisfaction.
                        </p>
                        <div className="flex items-center gap-2 text-accent-green font-extrabold text-sm">
                            <CheckCircle className="w-5 h-5" />
                            <span>99.9% Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
