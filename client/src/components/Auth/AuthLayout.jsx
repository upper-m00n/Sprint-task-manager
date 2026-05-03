import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-primary-deep rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-deep/20">
                        T
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-deep tracking-tight">
                    {title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {subtitle}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm ring-1 ring-gray-200 sm:rounded-2xl sm:px-10">
                    {children}
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
