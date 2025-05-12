import React, { useState } from 'react';
import { HiUserCircle, HiChevronDown } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import Menu from './menu';

export default function AppHeader({ storedAvatar }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    // Add your logout logic here
    alert('Logging out...');
  };

  return (
    <div className="bg-[#272052] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#3C2A73]">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Menu />
          <img
            src={require('../assets/images/SODE logo.png')}
            alt="Logo"
            style={{ width: '75px', height: '55px' }}
          />
        </div>

       

        {/* Right: Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none hover:bg-[#272052] p-2 rounded-lg transition-colors"
          >
            {storedAvatar ? (
              <img
                src={storedAvatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <HiUserCircle size={40} />
            )}
            <HiChevronDown size={20} />
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#3C2A73] rounded-lg shadow-lg z-50">
              <button
                onClick={handleEditProfile}
                className="w-full px-4 py-2 text-left hover:bg-[#272052] transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-[#272052] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
}
