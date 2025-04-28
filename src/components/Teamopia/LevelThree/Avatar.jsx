import { useGLTF, useAnimations, Text, Html } from '@react-three/drei';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const AnimatedText = animated(Text);

const Avatar = forwardRef(function Avatar({
  roleName = 'Map Keeper',
  position = [0, 2, 0],
  scale = [1, 1, 1],
  isPlayerControlled = false,
  isSpecialAction = false,
  movement = {},
  cameraRef,
  obstacles = [],
  updateGameLogicPosition = () => {},
  onStartGame = () => {},
  action = null
}, ref) {
  const modelPath = roleName === 'Map Keeper' ? '/models/Kofi.glb' : '/models/Amy.glb';
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef();
  const internalRef = useRef();

  // Sync refs
  useEffect(() => {
    if (ref) ref.current = groupRef.current;
    internalRef.current = groupRef.current;
  }, [ref]);



  const [hovered, setHovered] = useState(false);
  const isMapKeeper = roleName.includes('Map');

  const speed =  0.05;
  const rotateSpeed = 0.04;
  const direction = new THREE.Vector3();

  const { glowIntensity } = useSpring({
    glowIntensity: hovered ? 1 : 0,
    config: { tension: 300, friction: 20 }
  });

  const animationConfig = useMemo(() => ({
    idle: 'idle',
    move: isMapKeeper ? 'running' : 'walking',
    special: isMapKeeper ? 'finding' : 'unlockingKey',
    celebrate: 'excited',
    talking: 'talking',
    running: 'running',
    walking: 'walking',
  }), [isMapKeeper]);

  const currentActionRef = useRef(null);

  useEffect(() => {
    // Only set initial position once when the component mounts
    // and don't update it from props after that for non-player controlled avatars
    if (internalRef.current && !isPlayerControlled) {
      // Only set position from props on initial mount
      if (!internalRef.current.positionInitialized) {
        internalRef.current.position.set(...position);
        internalRef.current.positionInitialized = true;
      }
    }
  }, []);
  
 // In Avatar.js, UPDATE the animation useEffect:
useEffect(() => {
  if (!actions || !animationConfig) return;

  let nextAction;
  let actionName;

  if (action) {
    actionName = animationConfig[action] || action;
    nextAction = actions[actionName] || actions['idle'];
  } else {
    const isMoving = movement.left || movement.right || movement.forward || movement.backward;
    actionName = isSpecialAction
      ? animationConfig.special || animationConfig.celebrate
      : isMoving
      ? animationConfig.move
      : animationConfig.idle;
    nextAction = actions[actionName];
  }

  if (currentActionRef.current !== nextAction && nextAction) {
    const oldAction = currentActionRef.current;
    if (oldAction) {
      // Store the current time before fading out
      const storedTime = oldAction.time;
      oldAction.fadeOut(0.2).stop();
      // If switching back to the same action later, resume time
      nextAction.time = storedTime;
    }
    
    nextAction
      .reset() // Only reset if it's a different action
      .setEffectiveTimeScale(1)
      .fadeIn(0.2)
      .play();
    
    currentActionRef.current = nextAction;
  } else if (nextAction && !nextAction.isRunning()) {
    // If same action but paused, resume from current time
    nextAction.play();
  }

  if (actionName === 'running' || actionName === 'walking') {
    nextAction.loop = THREE.LoopRepeat;
    nextAction.clampWhenFinished = false;
    // Remove any custom loop blending logic to rely on Three.js's built-in loop
  }
}, [action, actions, movement, isSpecialAction, animationConfig]);
          
       
  const checkCollision = (dir) => {
    const raycaster = new THREE.Raycaster(groupRef.current.position, dir.clone().normalize());
    const intersects = raycaster.intersectObjects(obstacles, true);
    return intersects.length > 0;
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
    onStartGame();
  };




  useEffect(() => {
    const timer = setTimeout(() => setShowStartButton(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const bounds = {
    minX: -5,
    maxX: 5,
    minZ: -200,
    maxZ: 0,
    minY: 1,
    maxY: 100,
  };

  const lastPosition = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    if (!internalRef.current || !isPlayerControlled) return;

    // Use delta for frame-rate independent movement
    const frameSpeed = speed * delta * 60;
    const frameRotateSpeed = rotateSpeed * delta * 60;

    const group = internalRef.current;

    if (movement.left) group.rotation.y += frameRotateSpeed;
    if (movement.right) group.rotation.y -= frameRotateSpeed;

    direction.set(0, 0, 0);
    if (movement.forward) direction.z += 1;
    if (movement.backward) direction.z -= 1;

    if (direction.length() > 0) {
      const worldDir = direction.clone()
        .applyEuler(group.rotation)
        .normalize()
        .multiplyScalar(frameSpeed);
      
      if (!checkCollision(worldDir)) {
        group.position.add(worldDir);
      }
    }

    // Smooth position updates
    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      Math.max(bounds.minX, Math.min(bounds.maxX, group.position.x)),
      0.1
    );
    
    group.position.z = THREE.MathUtils.lerp(
      group.position.z,
      Math.max(bounds.minZ, Math.min(bounds.maxZ, group.position.z)),
      0.1
    );

    updateGameLogicPosition([group.position.x, group.position.y, group.position.z]);

      if (cameraRef?.current) {
        const cam = cameraRef.current;
        const offset = gameStarted
          ? new THREE.Vector3(1, 4, -9).applyEuler(group.rotation)
          : new THREE.Vector3(0, 5, -10);
        const targetPos = group.position.clone().add(offset);
        targetPos.y = gameStarted ? 5.5 : 4;

        lastPosition.current.lerp(targetPos, 0.1);
        cam.position.copy(lastPosition.current);
        cam.lookAt(group.position);
      }
   
  });

  return (
    <>
      <group
        ref={groupRef}
        position={position}
        rotation={[0, Math.PI, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} scale={scale} />
        <AnimatedText
          position={[0, 2.5, 0]}
          fontSize={0.4}
          color={isMapKeeper ? "#4A90E2" : "#FFD700"}
          outlineColor={glowIntensity.to(v => `rgba(255,255,255,${v * 0.5})`)}
          outlineWidth={glowIntensity.to(v => 0.05 + v * 0.1)}
          anchorX="center"
          anchorY="middle"
        >
          {roleName}
        </AnimatedText>
      </group>

      {showStartButton && !gameStarted && isPlayerControlled && (
        <Html center>
          <button
            onClick={handleStartGame}
            style={{
              position: 'absolute',
              top: '10px',
              left: '-130px',
              minWidth: '280px',
              padding: '20px 40px',
              background: 'linear-gradient(160deg, #7C3AED 0%, #4F46E5 100%)',
              color: 'white',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '15px',
              fontSize: '24px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: `
                0 6px 30px rgba(124, 58, 237, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.1)
              `,
              transition: 'all 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
              transform: 'scale(1)'
            }}
          >
            Start Game
          </button>
        </Html>
      )}
    </>
  );
});

useGLTF.preload('/models/map_keeper.glb');
useGLTF.preload('/models/keyholder.glb');

export default Avatar;
