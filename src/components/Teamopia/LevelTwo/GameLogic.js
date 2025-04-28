import { useState } from 'react';

export default function useGameLogic() {
  const [avatarPosition, setAvatarPosition] = useState([0, 0, 0]);
  const [amyPosition, setAmyPosition] = useState([2, 0, -3]);
  const [stage, setStage] = useState("goToAmy"); // 'goToAmy', 'findDoor', 'failed'
  const [amyAction, setAmyAction] = useState(null);

  return {
    avatarPosition,
    setAvatarPosition,
    amyPosition,
    setAmyPosition,
    stage,
    setStage,
    amyAction, setAmyAction // <-- important
  };
}
