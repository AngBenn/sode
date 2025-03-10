import React, { useState, useEffect } from 'react';
import { HiMenu, HiChevronDown } from 'react-icons/hi';
import avatar1 from '../assets/images/avatar1.jpg';
import avatar2 from '../assets/images/avatar2.jpg';
import avatar3 from '../assets/images/avatar3.jpg';
import avatar4 from '../assets/images/avatar4.jpg';
import avatar5 from '../assets/images/avatar5.jpg';
import avatar6 from '../assets/images/avatar6.jpg';
import AppHeader from '../components/Header'; // Your updated header component

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Load stored data on mount
    useEffect(() => {
        const storedAvatar = localStorage.getItem('selectedAvatar');
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        const storedPhone = localStorage.getItem('phone');

        if (storedAvatar) setSelectedAvatar(storedAvatar);
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
    }, []);

    // Handle avatar selection
    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        localStorage.setItem('selectedAvatar', avatar);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        alert('Profile updated successfully!');
    };


    // Retrieve the stored avatar from localStorage
    const storedAvatar = localStorage.getItem('selectedAvatar');


    return (
        <div className="min-h-screen bg-[#272052] text-white">
            {/* Header: Using the AppHeader component */}
            <AppHeader storedAvatar={storedAvatar} />



            {/* Profile Content */}
            <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Edit Your Profile</h2>

                {/* Avatar Selection */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Choose Your Avatar</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {avatars.map((avatar, index) => (
                            <div
                                key={index}
                                className={`w-24 h-24 cursor-pointer border-4 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 ${selectedAvatar === avatar ? 'border-purple-600 scale-105' : 'border-transparent'
                                    }`}
                                onClick={() => handleAvatarSelect(avatar)}
                            >
                                <img
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-[#3C2A73] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-[#3C2A73] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 bg-[#3C2A73] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-[#3C2A73] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Enter a new password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
