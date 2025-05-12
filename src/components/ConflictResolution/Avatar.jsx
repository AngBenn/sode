import React from 'react';
import './Avatar.css'; // For animations

const Avatar = ({ avatar, emotion, name }) => {
  return (
    <div className={`avatar avatar-${emotion}`}>
      <img src={avatar} alt={name} className="w-32 h-32 object-contain" />
      <p className="text-center font-bold mt-2">{name}</p>
    </div>
  );
};

export default Avatar;
