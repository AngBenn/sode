import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ColorSquare from './ColorSquare';
import ChallengeHUD from './ChallengeHUD';
import { useFrame } from '@react-three/fiber';
import Avatar from './Avatar';
import { Physics } from '@react-three/rapier';
import { useNavigate } from 'react-router-dom';

// Define challenge constants
const PLAYER_TURNS = 3;
const AMY_TURNS = 3;
const TOTAL_ROUNDS = PLAYER_TURNS + AMY_TURNS;
const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
const COLOR_NAMES = {
    '#FF0000': 'RED',
    '#00FF00': 'GREEN',
    '#0000FF': 'BLUE',
    '#FFFF00': 'YELLOW',
    '#FF00FF': 'PURPLE'
};

const successStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif'
    },
    content: {
        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 0 25px rgba(0, 255, 0, 0.4)',
        textAlign: 'center',
        color: '#00ff00',
        border: '2px solid #00ff00',
        maxWidth: '500px'
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        textShadow: '0 0 10px #00ff00'
    },
    button: {
        padding: '12px 30px',
        fontSize: '1.2rem',
        background: 'none',
        border: '2px solid #00ff00',
        borderRadius: '5px',
        color: '#00ff00',
        cursor: 'pointer',
        marginTop: '1.5rem',
        transition: 'all 0.3s ease',
        textShadow: '0 0 5px #00ff00',
        ':hover': {
            background: '#00ff00',
            color: '#000'
        }
    }
};

const ColorChallengeManager = ({
    playerPosition,
    amyPosition,
    setAmyPosition,
    onFail,
    onComplete,
    soundOn,
    setTutorialStep,
    setCurrentColor,
    setLives,
    lives
}) => {
    const [squares, setSquares] = useState([]);
    const [correctColor, setCorrectColor] = useState('');
    const [currentRound, setCurrentRound] = useState(0);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [amyTarget, setAmyTarget] = useState(null);
    const [showMessage, setShowMessage] = useState('');
    const [coins, setCoins] = useState(0);
    const [showKey, setShowKey] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const navigate = useNavigate();

    const amyRef = useRef();
    const amyPosRef = useRef(new THREE.Vector3(...amyPosition));
    const TOTAL_ROUNDS = 4;

    // Generate the colored squares grid with center restriction for Amy
    const generateSquares = (isAmyTurn = false) => {
        const newSquares = [];
        const gridSize = 2;
        const spacing = 4.2;

        for (let x = -gridSize; x <= gridSize; x++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                newSquares.push({
                    position: new THREE.Vector3(x * spacing, 0, z * spacing),
                    color,
                    key: `${x}-${z}`
                });
            }
        }

        let correct;
        if (isAmyTurn) {
            // Filter center squares (positions within -4.2 to 4.2 on x and z)
            const centerSquares = newSquares.filter(s => {
                const xPos = s.position.x;
                const zPos = s.position.z;
                return Math.abs(xPos) <= 4.2 && Math.abs(zPos) <= 4.2;
            });
            // Select correct color from center squares
            correct = centerSquares[Math.floor(Math.random() * centerSquares.length)].color;
        } else {
            // Select correct color from all squares
            correct = newSquares[Math.floor(Math.random() * newSquares.length)].color;
        }

        return { newSquares, correct };
    };

    // Initialize the challenge
    useEffect(() => {
        if (currentRound === 0) {
            setTutorialStep(1);
            setTimeout(() => {
                startNextRound(true);
            }, 2000);
        }
    }, []);

    useEffect(() => {
        if (showKey && !levelCompleted) {
            const successTimer = setTimeout(() => {
                setShowSuccess(true);
                setLevelCompleted(true);
            }, 5000);
            return () => clearTimeout(successTimer);
        }
    }, [showKey, levelCompleted]);

    // Start a new round with specified turn
    const startNextRound = (isPlayerTurn) => {
        const { newSquares, correct } = generateSquares(!isPlayerTurn);
        setSquares(newSquares);
        setCorrectColor(correct);

        const colorName = COLOR_NAMES[correct] || 'COLORED';
        setCurrentColor(colorName);

        if (isPlayerTurn) {
            setTutorialStep(2);
        } else {
            setTutorialStep(4);
            // Set Amy's target to the center (0,0,0)
            setAmyTarget(new THREE.Vector3(0, 0.1, -20));
        }
    };

    useFrame((_, delta) => {
        if (!amyRef.current || playerTurn || !amyTarget) return;

        const amyPos = amyRef.current.position;
        const targetPos = new THREE.Vector3(amyTarget.x, 0, amyTarget.z);
        const direction = targetPos.clone().sub(amyPos).normalize();
        const speed = 4 * delta;

        // Calculate distance to target
        const distanceToTarget = amyPos.distanceTo(targetPos);

        if (distanceToTarget > 0.5) {
            // Move Amy toward the target
            const newPos = amyPos.clone().add(direction.multiplyScalar(speed));
            
            // Ensure Amy stays at a proper height
            newPos.y = 0;
            
            // Update Amy's position
            amyRef.current.position.copy(newPos);
            amyPosRef.current.copy(newPos);
            setAmyPosition([newPos.x, newPos.y, newPos.z]);
            
            // Make Amy face toward the target
            if (amyRef.current.rotation) {
                const angle = Math.atan2(direction.x, direction.z);
                amyRef.current.rotation.y = angle;
            }
        } else {
            // Amy has reached the center
            setAmyTarget(null);
            setTutorialStep(5);
            setPlayerTurn(true);
            
            // Make sure Amy is positioned exactly at center for visual clarity
            const centerPos = new THREE.Vector3(0, 0, 0);
            amyRef.current.position.copy(centerPos);
            amyPosRef.current.copy(centerPos);
            setAmyPosition([0, 0, 0]);
            
            setTimeout(() => {
                setCurrentRound((c) => {
                    const newRound = c + 1;
                    if (newRound < TOTAL_ROUNDS) {
                        
                        startNextRound(true);
                    } else {
                        setTutorialStep(6);
                        setTimeout(() => {
                            onComplete();
                            setShowKey(true);
                        }, 1000);
                    }
                    return newRound;
                });
            }, 2500);
        }
    });

    const handleSquareClick = (squareColor) => {
        if (!playerTurn) return;

        if (squareColor === correctColor) {
            setTutorialStep(3);
            setTimeout(() => {
                setCurrentRound((c) => {
                    const newRound = c + 1;
                    if (newRound < TOTAL_ROUNDS) {
                        setPlayerTurn(false);
                        startNextRound(false);
                    }
                    return newRound;
                });
            }, 2500);
        } else {
            setLives(l => {
                const newLives = l - 1;
                setTutorialStep(7);
                setTimeout(() => {
                    if (newLives <= 0) {
                        onFail();
                    } else {
                        const { newSquares, correct } = generateSquares();
                        setSquares(newSquares);
                        setCorrectColor(correct);
                        setCurrentColor(COLOR_NAMES[correct]);
                        setTutorialStep(2);
                    }
                }, 2500);
                return newLives;
            });
        }
    };

    return (
        <group>
            <Physics>
                {squares.map(square => (
                    <ColorSquare
                        key={square.key}
                        position={square.position}
                        color={square.color}
                        onClick={() => handleSquareClick(square.color)}
                    />
                ))}
            </Physics>

            <ChallengeHUD
                lives={lives}
                message={showMessage}
                currentRound={currentRound}
                totalRounds={TOTAL_ROUNDS}
                correctColor={correctColor}
                playerTurn={playerTurn}
                coins={coins}
                showKey={showKey}
            />

            <Avatar
                ref={amyRef}
                roleName="Amy"
                position={amyPosRef.current.toArray()}
                scale={[2.5, 2.5, 2.5]}
                isPlayerControlled={false}
                movement={{}}
                action={playerTurn ? 'idle' : 'running'}
            />
            {showSuccess && (
                <div style={successStyles.overlay}>
                    <div style={successStyles.content}>
                        <h1 style={successStyles.title}>LEVEL COMPLETE! ⭐⭐⭐⭐⭐</h1>
                        <button
                            style={successStyles.button}
                            onClick={() => navigate('/dashboard')}
                            onMouseOver={(e) => e.target.style.background = '#00ff00'}
                            onMouseOut={(e) => e.target.style.background = 'none'}
                        >
                            RETURN TO DASHBOARD
                        </button>
                    </div>
                </div>
            )}
        </group>
    );
};

export default ColorChallengeManager;