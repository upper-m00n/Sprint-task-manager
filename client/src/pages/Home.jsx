import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Story from '../components/home/Story';
import Footer from '../components/home/Footer';

/**
 * Home page for TaskBoard
 * Implements a premium, modular landing page design.
 */
const Home = () => {
    const { user, loading } = useAuth();

    // Prevent direct access if user is already logged in
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className="home-page">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Story />
            </main>
            <Footer />
        </div>
    );
};

export default Home;

