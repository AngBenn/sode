import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowSmRight } from 'react-icons/hi';
import AppHeader from '../components/Header'; // Your updated header component

export default function ProgressAndReports() {
    // Retrieve the stored avatar from localStorage
    const storedAvatar = localStorage.getItem('selectedAvatar');

    return (


        <div className="min-h-screen bg-[#272052] text-white">
            {/* Header outside the padded container */}
            <AppHeader storedAvatar={storedAvatar} />

            {/* Main content container with padding */}
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-8 text-center">Track your progress and view detailed performance reports.</h2>


                {/* Progress Tracking Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Progress Card 1: Social Skills Score */}
                        <div className="bg-[#3C2A73] p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Social Skills Score</h3>
                            <div className="h-2 bg-[#272052] rounded-full mb-4">
                                <div
                                    className="h-2 bg-purple-500 rounded-full"
                                    style={{ width: '75%' }} // Placeholder for progress
                                ></div>
                            </div>
                            <p className="text-sm text-gray-300">75% completed</p>
                        </div>

                        {/* Progress Card 2: Completed Scenarios */}
                        <div className="bg-[#3C2A73] p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Completed Scenarios</h3>
                            <div className="h-2 bg-[#272052] rounded-full mb-4">
                                <div
                                    className="h-2 bg-purple-500 rounded-full"
                                    style={{ width: '50%' }} // Placeholder for progress
                                ></div>
                            </div>
                            <p className="text-sm text-gray-300">12/24 scenarios completed</p>
                        </div>

                        {/* Progress Card 3: Engagement Level */}
                        <div className="bg-[#3C2A73] p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Engagement Level</h3>
                            <div className="h-2 bg-[#272052] rounded-full mb-4">
                                <div
                                    className="h-2 bg-purple-500 rounded-full"
                                    style={{ width: '90%' }} // Placeholder for progress
                                ></div>
                            </div>
                            <p className="text-sm text-gray-300">Highly Engaged</p>
                        </div>
                    </div>
                </section>

                {/* Reports Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Performance Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Report Card 1: Strengths */}
                        <div className="bg-[#3C2A73] p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Strengths</h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-300">Active Listening</li>
                                <li className="text-sm text-gray-300">Empathy</li>
                                <li className="text-sm text-gray-300">Confidence</li>
                            </ul>
                        </div>

                        {/* Report Card 2: Areas for Improvement */}
                        <div className="bg-[#3C2A73] p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Areas for Improvement</h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-300">Body Language</li>
                                <li className="text-sm text-gray-300">Conflict Resolution</li>
                                <li className="text-sm text-gray-300">Small Talk</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Call-to-Action Button */}
                <div className="mt-8 text-center">
                    <Link
                        to="/dashboard" // Replace with the desired route
                        className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        Explore More Scenarios <HiArrowSmRight className="ml-2" />
                    </Link>
                </div>
            </div>
            
        </div>
    );
}