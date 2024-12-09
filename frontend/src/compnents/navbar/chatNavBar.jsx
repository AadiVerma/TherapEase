import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav className="fixed border-b border-zinc-900 top-0 w-full backdrop-blur-md bg-background-light/75 dark:bg-background-dark/75 text-text-light dark:text-text-dark p-2 border-accent-light/20 dark:border-accent-dark/20 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl text-zinc-200 font-extrabold">
                            TherapEase
                        </Link>

                        <div className="ml-8 flex space-x-4">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                Mood Tracker
                            </Link>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                AI Therapist
                            </Link>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                Quiz
                            </Link>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                Anonymous Sharing
                            </Link>
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                            >
                                About Us
                            </Link>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md"
                        >
                            Login
                        </Link>
                        <Link
                            to="/"
                            className="bg-[#5e41def3] text-white px-3 py-2 rounded-xl hover:bg-[#3a318a]"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
