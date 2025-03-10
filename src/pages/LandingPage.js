import React from 'react';
import { Link } from 'react-router-dom';
import landingPageBg from '../assets/images/landingpage-bg.webp';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${landingPageBg})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-2xl text-center mx-4 max-w-4xl backdrop-blur-sm">
        {/* Main Heading */}
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Welcome to <span className="text-purple-500">Sode</span>
        </h1>

        {/* Subheading */}
        <p className="text-white text-lg md:text-2xl mb-8 animate-fade-in-up">
          The ultimate platform to <span className="text-purple-400">build</span>,{' '}
          <span className="text-purple-400">practice</span>, and{' '}
          <span className="text-purple-400">master</span> your social skills in a fun and
          immersive way.
        </p>

        {/* Call-to-Action Button */}
        <Link
          to="/register" // or "/register" if that is the desired route
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 animate-bounce-in"
        >
          Start Playing
        </Link>

       
        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white animate-fade-in-up">
          <div className="p-6 bg-[#3C2A73] bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Interactive Scenarios</h3>
            <p className="text-sm">
              Engage in realistic social scenarios designed to challenge and improve your
              communication skills.
            </p>
          </div>
          <div className="p-6 bg-[#3C2A73] bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Personalized Feedback</h3>
            <p className="text-sm">
              Receive tailored feedback to help you grow and refine your social
              interactions.
            </p>
          </div>
          <div className="p-6 bg-[#3C2A73] bg-opacity-80 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-sm">
              Join a supportive community of learners and experts to share experiences and
              tips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}