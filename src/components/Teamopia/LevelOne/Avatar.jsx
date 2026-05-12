import { useGLTF, useAnimations, Text, Html } from '@react-three/drei';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const AnimatedText = animated(Text);

const Avatar = forwardRef(function Avatar({
  roleName = 'Map Keeper',
  position = [0, 1, 0],
  scale = [1, 1, 1],
  isPlayerControlled = false,
  isSpecialAction = false,
  movement = {},
  cameraRef,
  obstacles = [],
  updateGameLogicPosition = () => { },
  onStartGame = () => { },
  action = null
}, ref) {
  const modelPath = roleName === 'Map Keeper' ? '/models/Kofi.glb' : '/models/Amy.glb';
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, scene);
  const groupRef = useRef();
  const internalRef = useRef();

  // Jump and slide states
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  
  // Movement momentum reference
  const momentum = useRef({
    direction: new THREE.Vector3(),
    speed: 0
  });

  // Key press tracking
  const keysPressed = useRef({
    jump: false,
    slide: false
  });

  // Sync refs
  useEffect(() => {
    if (ref) ref.current = groupRef.current;
    internalRef.current = groupRef.current;
  }, [ref]);

  const [hovered, setHovered] = useState(false);
  const isMapKeeper = roleName.includes('Map');

  const speed = 0.07;
  const rotateSpeed = 0.04;
  const direction = new THREE.Vector3();

  const { glowIntensity } = useSpring({
    glowIntensity: hovered ? 1 : 0,
    config: { tension: 300, friction: 20 }
  });

  // Add keyboard event listeners for jump and slide
  useEffect(() => {
    if (!isPlayerControlled) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isGrounded.current) {
        keysPressed.current.jump = true;
        setIsJumping(true);
        
        // Apply jump force with forward momentum
        velocity.current.y = 0.15;
        
        // Always apply forward momentum during jump, similar to slide
        const jumpDirection = new THREE.Vector3(0, 0, 1)
          .applyEuler(groupRef.current.rotation)
          .normalize();
        
        // Apply stronger forward momentum (2.5x like slide)
        velocity.current.x = jumpDirection.x * speed * 2.5;
        velocity.current.z = jumpDirection.z * speed * 2.5;
      } else if (e.code === 'ArrowDown') {
        keysPressed.current.slide = true;
        setIsSliding(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        keysPressed.current.jump = false;
      } else if (e.code === 'ArrowDown') {
        keysPressed.current.slide = false;
        setIsSliding(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayerControlled]);

  // Update animation config with jump and slide
  const animationConfig = useMemo(() => ({
    idle: 'idle',
    move: isMapKeeper ? 'running' : 'walking',
    special: isMapKeeper ? 'finding' : 'unlockingKey',
    celebrate: 'excited',
    talking: 'talking',
    running: 'running',
    walking: 'walking',
    jump: 'jump',
    slide: 'slide'
  }), [isMapKeeper]);

  const currentActionRef = useRef(null);

 
  useEffect(() => {
    if (!actions || !animationConfig) return;

    const handleAnimationFinish = () => {
      if (isJumping) setIsJumping(false);
      if (isSliding) setIsSliding(false);
    };

    let nextAction;
    let actionName;

    if (action) {
      actionName = animationConfig[action] || action;
      nextAction = actions[actionName] || actions['idle'];
    } else {
      const isMoving = movement.left || movement.right || movement.forward || movement.backward;
      
      if (isJumping && actions[animationConfig.jump]) {
        actionName = animationConfig.jump;
      } else if (isSliding && actions[animationConfig.slide]) {
        actionName = animationConfig.slide;
      } else {
        actionName = isSpecialAction
          ? animationConfig.special || animationConfig.celebrate
          : isMoving
          ? animationConfig.move
          : animationConfig.idle;
      }
      nextAction = actions[actionName];
    }

    if (!nextAction) return;

    if (currentActionRef.current !== nextAction) {
      const oldAction = currentActionRef.current;
      
      if (oldAction) {
        oldAction.fadeOut(0.2);
        mixer.removeEventListener('finished', handleAnimationFinish);
      }

      nextAction.reset();
      
      if (actionName === animationConfig.jump || actionName === animationConfig.slide) {
        nextAction.setLoop(THREE.LoopOnce);
        nextAction.clampWhenFinished = true;
        mixer.addEventListener('finished', handleAnimationFinish);
      } else {
        nextAction.setLoop(THREE.LoopRepeat);
      }

      nextAction
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.15)
        .play();

      currentActionRef.current = nextAction;
    }
  }, [action, actions, movement, isSpecialAction, animationConfig, isJumping, isSliding, mixer]);

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
    minY: 0, // Ground level
    maxY: 100,
  };

  const lastPosition = useRef(new THREE.Vector3());
  
  // Modified frame update with improved jump and slide physics
  useFrame((_, delta) => {
    if (!internalRef.current || !isPlayerControlled) return;

    // Use delta for frame-rate independent movement
    const frameSpeed = speed * delta * 60;
    const frameRotateSpeed = rotateSpeed * delta * 60;

    const group = internalRef.current;

    // Apply gravity when not grounded
    if (!isGrounded.current || group.position.y > bounds.minY) {
      velocity.current.y -= 0.01 * delta * 60;
    }
    
    // Apply vertical velocity
    group.position.y += velocity.current.y;

    // Ground check
    if (group.position.y <= bounds.minY) {
      group.position.y = bounds.minY;
      velocity.current.y = 0;
      isGrounded.current = true;
      
      // Only stop horizontal momentum if not sliding or jumping
      if (!isJumping && !isSliding) {
        velocity.current.x *= 0.9; // Friction
        velocity.current.z *= 0.9; // Friction
      }
    } else {
      isGrounded.current = false;
      
      // Apply jump momentum during air time
      group.position.x += velocity.current.x;
      group.position.z += velocity.current.z;
    }

    // Handle rotation
    if (movement.left) group.rotation.y += frameRotateSpeed;
    if (movement.right) group.rotation.y -= frameRotateSpeed;

    // Calculate movement direction
    direction.set(0, 0, 0);
    if (movement.forward) direction.z += 1;
    if (movement.backward) direction.z -= 1;

    // Update momentum reference for jumps
    if (direction.length() > 0) {
      const worldDir = direction.clone()
        .applyEuler(group.rotation)
        .normalize();
      
      momentum.current.direction.copy(worldDir);
      momentum.current.speed = frameSpeed;
      
      // Only move if on ground and not jumping (jump movement is handled by velocity)
      if (isGrounded.current && !isJumping) {
        if (!checkCollision(worldDir)) {
          const moveVec = worldDir.clone().multiplyScalar(frameSpeed);
          group.position.add(moveVec);
        }
      }
    } else {
      // Gradually reduce momentum when not actively moving
      momentum.current.speed *= 0.95;
    }
    
    // Apply slide momentum - enhanced forward movement during slide
    if (isSliding && isGrounded.current) {
      const slideDirection = new THREE.Vector3(0, 0, 1)
        .applyEuler(group.rotation)
        .normalize()
        .multiplyScalar(frameSpeed * 2.5); // Increased slide speed
      
      if (!checkCollision(slideDirection)) {
        group.position.add(slideDirection);
      }
    }
    
    // Keep jump momentum consistent during entire jump duration
    if (isJumping && !isGrounded.current) {
      // Add a little extra forward momentum during the jump arc
      const jumpBoost = new THREE.Vector3(
        velocity.current.x,
        0,
        velocity.current.z
      ).normalize().multiplyScalar(frameSpeed * 0.5);
      
      if (!checkCollision(jumpBoost)) {
        group.position.add(jumpBoost);
      }
    }

    // Apply horizontal air momentum (for jumps)
    if (!isGrounded.current) {
      // Reduced air resistance to maintain momentum better during jumps
      velocity.current.x *= 0.995;
      velocity.current.z *= 0.995;
    }

    // Enforce bounds
    group.position.x = THREE.MathUtils.clamp(
      group.position.x,
      bounds.minX,
      bounds.maxX
    );

    group.position.z = THREE.MathUtils.clamp(
      group.position.z,
      bounds.minZ,
      bounds.maxZ
    );

    // Update game logic position
    updateGameLogicPosition([group.position.x, group.position.y, group.position.z]);

    // Camera follow logic
    if (cameraRef?.current) {
      const cam = cameraRef.current;
      const offset = gameStarted
        ? new THREE.Vector3(1, 4, -9).applyEuler(group.rotation)
        : new THREE.Vector3(0, 5, -10);
      const targetPos = group.position.clone().add(offset);
      targetPos.y = gameStarted ? 5.0 : 4;

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

useGLTF.preload('/models/Kofi.glb');
useGLTF.preload('/models/Amy.glb');

export default Avatar;