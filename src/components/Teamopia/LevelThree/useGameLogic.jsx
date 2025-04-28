// useGameLogic.js (basic version)
import { useState, useEffect } from 'react';

export default function useGameLogic() {
  const [selectedRole, setSelectedRole] = useState('Map Keeper');
  const [avatarPosition, setAvatarPosition] = useState([0, 0, 0]);
  const [amyPosition, setAmyPosition] = useState([2, 1, -3]);
  const [isSpecialAction, setIsSpecialAction] = useState(false);

  return {
    selectedRole,
    avatarPosition,
    amyPosition,
    setAmyPosition,
    isSpecialAction,
    setSelectedRole,
    setAvatarPosition,
    setIsSpecialAction
  };
}