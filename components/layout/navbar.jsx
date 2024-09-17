"use client"

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';  // Import your Supabase client
import logoutIcon from '@/public/assets/logout-icon.svg'
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const [user, setUser] = useState(null);

    // Fetch session on component mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getUser();
    }, []);

    const handleGoogleAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) {
            console.error('Error during Google authentication:', error.message);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error.message);
        setUser(null); // Reset user state on logout
    };

    return (
        <header>
            <nav className="flex items-center justify-between bg-nav-color px-4 sm:px-20 backdrop-blur-md h-12">
                <div className="text-3xl font-bold">
                    <h1><Link href="/">Cerebro</Link></h1>
                </div>
                <div>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex justify-around px-4 py-1 border-0 font-bold text-sm rounded-lg navbar-btn-red"
                        >
                            <Image src={logoutIcon} alt="logout" />
                            <span className="hidden sm:block">&nbsp;Log Out</span>
                        </button>
                    ) : (
                        <button
                            className="flex justify-around px-4 py-1 border-0 font-bold text-sm rounded-lg navbar-btn-green"
                            onClick={handleGoogleAuth}
                        >
                            <Image src={logoutIcon} alt="logout" />
                            <span className="hidden sm:block">Log In</span>
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
