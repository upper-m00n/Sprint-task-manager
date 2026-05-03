import React from 'react';
import { Shield, Globe } from 'lucide-react';

const Story = () => {
    return (
        <section className="py-32 bg-[#FAFAFA] bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,128,0.03)_0%,transparent_40%)]" id="about">
            <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="flex flex-col items-start">
                    <div className="bg-blue-50 text-primary-deep text-[0.75rem] font-bold px-4 py-1.5 rounded-full mb-6">ABOUT SPRINT</div>
                    <h2 className="text-5xl font-extrabold text-primary-deep leading-tight mb-8 tracking-tight">
                        A Platform Built for <br />
                        Collaborative Teams
                    </h2>
                    <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-6 font-normal">
                        Sprint is a full-stack project management platform built with modern web technologies — featuring role-based access control, Kanban workflows, sprint planning, and live issue tracking.
                    </p>
                    <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-10 font-normal">
                        Designed to handle real team collaboration at scale — from creating projects and assigning members to tracking issues across customizable workflows.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex items-center gap-2 text-primary-deep font-bold text-sm">
                            <Shield className="w-5 h-5" />
                            <span>Role-Based Access Control</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-deep font-bold text-sm">
                            <Globe className="w-5 h-5" />
                            <span>REST API + OpenAPI Docs</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-white p-10 rounded-xl border border-primary-deep/5 shadow-premium flex flex-col gap-8">
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full border-2 border-accent-saffron text-accent-saffron font-bold text-xl flex items-center justify-center shrink-0">1</div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-lg font-bold text-primary-deep">Express Backend</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">REST API with JWT auth and Mongoose models on MongoDB.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full border-2 border-primary-deep text-primary-deep font-bold text-xl flex items-center justify-center shrink-0">2</div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-lg font-bold text-primary-deep">React Frontend</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Context-based state management, React Router, and a fully responsive Kanban + backlog interface.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full border-2 border-accent-green text-accent-green font-bold text-xl flex items-center justify-center shrink-0">3</div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-lg font-bold text-primary-deep">MongoDB data layer</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Document store for projects, issues, and activity; optional seed script for local demos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Story;
