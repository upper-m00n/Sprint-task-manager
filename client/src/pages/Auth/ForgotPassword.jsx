import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="If an account exists for that email, we've sent reset instructions."
            >
                <div className="text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <p className="text-sm text-gray-600">
                        We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all"
                    >
                        Try another email
                    </button>
                    <div className="text-sm">
                        <NavLink to="/login" className="font-bold text-primary-deep hover:text-primary-deep/80">
                            Return to login
                        </NavLink>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset password"
            subtitle="Enter your email to receive a password reset link"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-deep/20 focus:border-primary-deep transition-all text-sm"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(0,0,128,0.2)] text-sm font-bold text-white bg-primary-deep hover:bg-primary-deep/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-deep transition-all disabled:opacity-50"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Send reset link'
                    )}
                </button>

                <div className="text-center">
                    <NavLink
                        to="/login"
                        className="text-sm font-bold text-primary-deep hover:text-primary-deep/80"
                    >
                        Back to login
                    </NavLink>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
