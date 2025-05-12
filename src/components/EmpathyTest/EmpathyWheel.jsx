import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Users } from 'lucide-react';

// Sample empathy prompts - replace with your actual data
const empathyPrompts = [
  "Tell about a time you helped your brother or sister at home.",
    "Describe how you feel when a friend shares food with you.",
    "Talk about greeting elders with respect. Why is it important?",
    "Share a time you helped carry something heavy for someone.",
    "Imagine a friend has no snack at break time. What would you do?",
    "Describe when you played ampe or football with your friends.",
    "How can you show kindness during family gatherings?",
    "Talk about helping someone during morning assembly.",
];

const EmpathyWheel = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState("You");
  const [bounceAnimation, setBounceAnimation] = useState(false);
  const audioRef = useRef(null);
  const tickRef = useRef(null);
  const wheelRef = useRef(null);
  const [lastSpinTime, setLastSpinTime] = useState(0);

  // Setup wheel segments
  const wheelSegments = empathyPrompts;
  const segmentAngle = 360 / wheelSegments.length;
  
  // Create audio elements
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = "data:audio/wav;base64,UklGRl9vT19TAUlORk9JQ09QWXJpZ2h0A"; // Replace with actual spinning sound
    audioRef.current.loop = true;
    
    tickRef.current = new Audio();
    tickRef.current.src = "data:audio/wav;base64,UklGRl9vT19TAUlORk9JQ09QWXJpZ2h0A"; // Replace with actual tick sound
    
    return () => {
      audioRef.current.pause();
      tickRef.current.pause();
    };
  }, []);

  // Start character bounce animation every few seconds
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounceAnimation(true);
      setTimeout(() => setBounceAnimation(false), 800);
    }, 5000);
    
    return () => clearInterval(bounceInterval);
  }, []);

  const handleSpin = () => {
    // Prevent double-clicks and too frequent spins
    const now = Date.now();
    if (isSpinning || now - lastSpinTime < 300) return;
    
    setLastSpinTime(now);
    
    // Play spinning sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    setIsSpinning(true);
    setShowInstructions(false);
    
    // Calculate spin details
    const minSpins = 3;
    const maxSpins = 5;
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomIndex = Math.floor(Math.random() * wheelSegments.length);
    const randomOffset = Math.random() * segmentAngle;
    const targetRotation = (360 * randomSpins) + (segmentAngle * randomIndex) + randomOffset;
    
    // Set new rotation
    setRotation(prev => prev + targetRotation);
    
    // Stop spinning after animation
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPrompt(wheelSegments[randomIndex]);
      if (soundEnabled && audioRef.current && tickRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        tickRef.current.play().catch(e => console.log("Tick sound failed:", e));
      }
    }, 5000);
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === "You" ? "Parent" : "You");
  };

  // Multi-colored wheel with purple emphasis
  const wheelColors = [
    '#8A2BE2', // Purple (primary)
    '#FF8C00', // Dark Orange
    '#6A0DAD', // Purple
    '#FFD700', // Gold
    '#9370DB', // Medium Purple
    '#228B22', // Forest Green
    '#9932CC', // Dark Orchid
    '#F08080'  // Light Coral
  ];

  // SVG for the character
  const CharacterSVG = () => (
    <svg 
      className={`w-48 h-48 ${bounceAnimation ? 'animate-bounce' : ''}`} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair */}
      <path d="M100 30C130 30 145 50 145 75C145 90 140 105 130 110C125 80 115 70 100 70C85 70 75 80 70 110C60 105 55 90 55 75C55 50 70 30 100 30Z" fill="#1A1A1A" />
      
      {/* Face */}
      <ellipse cx="100" cy="95" rx="30" ry="35" fill="#8D5524" />
      
      {/* Eyes */}
      <ellipse cx="90" cy="90" rx="5" ry="3" fill="#1A1A1A" />
      <ellipse cx="110" cy="90" rx="5" ry="3" fill="#1A1A1A" />
      
      {/* Smile */}
      <path d="M90 105C95 110 105 110 110 105" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      
      {/* Dress with pattern */}
      <path d="M70 110V150H130V110C120 120 80 120 70 110Z" fill="#8A2BE2" />
      <path d="M70 125H130" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M70 135H130" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      
      {/* Arms */}
      <path d="M70 115C60 120 55 130 50 140" stroke="#8D5524" strokeWidth="8" strokeLinecap="round" />
      <path d="M130 115C140 120 145 130 150 140" stroke="#8D5524" strokeWidth="8" strokeLinecap="round" />
      
      {/* Earrings */}
      <circle cx="75" cy="95" r="3" fill="#FFD700" />
      <circle cx="125" cy="95" r="3" fill="#FFD700" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-700 to-indigo-900 p-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full opacity-10">
          {Array.from({length: 20}).map((_, i) => (
            <div 
              key={`circle-${i}`} 
              className="absolute rounded-full bg-white" 
              style={{
                width: `${20 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.2,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl w-full">
        <div className="flex items-center justify-between w-full mb-4 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-200">
            Empathy Wheel
          </h1>
          
          <div className="flex gap-3">
            <button 
              onClick={toggleSound} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="text-white" /> : <VolumeX className="text-white" />}
            </button>
            
            <button 
              onClick={switchPlayer} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Switch player"
            >
              <Users className="text-white" />
            </button>
          </div>
        </div>
        
        {/* Player indicator */}
        <div className="mb-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-bold text-lg">
          <span className="text-purple-200 mr-2">Current Turn:</span> {currentPlayer}
        </div>
        
        {showInstructions && (
          <div className="mb-4 text-center px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white max-w-md">
            <p>Spin the wheel to receive an empathy prompt for reflection or discussion</p>
          </div>
        )}
        
        <div className="relative flex items-center justify-center w-full">
          {/* Layout container */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-16">
            {/* Wheel section */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 order-2 md:order-1">
              {/* Glow effect behind wheel */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse blur-xl opacity-50"></div>
              
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-300/30 transform scale-110"></div>
              
              {/* Main wheel */}
              <div 
                ref={wheelRef}
                className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border border-purple-300/20"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: `transform ${isSpinning ? 5 : 0}s cubic-bezier(0.2, 0.8, 0.2, 1.0)`,
                  boxShadow: '0 0 30px rgba(138, 43, 226, 0.5)'
                }}
              >
                {/* Segments */}
                {wheelSegments.map((_, index) => (
                  <div
                    key={index}
                    className="absolute origin-bottom-center"
                    style={{
                      top: 0,
                      left: '50%',
                      height: '50%',
                      transformOrigin: 'bottom center',
                      transform: `translateX(-50%) rotate(${index * segmentAngle}deg)`,
                      width: '2px',
                    }}
                  >
                    <div 
                      className="h-full w-[64rem] md:w-[80rem]"
                      style={{
                        backgroundColor: wheelColors[index % wheelColors.length],
                        transform: 'translateX(-50%) rotate(0deg)',
                        clipPath: `polygon(0 0, 50% 100%, ${50 + (50 * Math.tan((Math.PI/180) * (segmentAngle/2)))}% 0)`,
                      }}
                    />
                    
                    {/* Pattern overlay on each segment */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: index % 2 === 0 
                          ? `repeating-linear-gradient(${90 + index * segmentAngle}deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)`
                          : `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
                        backgroundSize: index % 2 === 0 ? '20px 20px' : '10px 10px',
                        clipPath: `polygon(0 0, 50% 100%, ${50 + (50 * Math.tan((Math.PI/180) * (segmentAngle/2)))}% 0)`,
                      }}
                    />
                    
                    {/* Number indicators */}
                    <div
                      className="absolute text-white font-bold text-lg"
                      style={{
                        top: '20%',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${segmentAngle/2}deg) translateY(-50%)`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-20 overflow-hidden flex items-center justify-center w-16 h-16 border-4 border-white/30">
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-20">
                <div className="w-10 h-16 flex flex-col items-center">
                  <div className="w-4 h-4 bg-purple-300 rounded-full z-10 mb-1 animate-pulse"></div>
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-purple-500 filter drop-shadow-lg"></div>
                </div>
              </div>
            </div>
            
            {/* Character section - moved to the side */}
            <div className="relative order-1 md:order-2">
              {/* Character */}
              <div className="relative z-20">
                <CharacterSVG />
              </div>
              
              {/* Speech bubble button */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 md:top-auto md:bottom-32 md:left-0 md:-translate-x-3/4 z-10">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`
                    relative px-6 py-3 text-base font-bold rounded-2xl
                    ${isSpinning 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    }
                    text-white transform transition-all duration-300
                    ${isSpinning ? '' : 'hover:scale-105 active:scale-95'}
                    shadow-lg
                  `}
                >
                  {isSpinning ? 'Spinning...' : `Spin for ${currentPlayer}!`}
                  {/* Speech bubble tail - adjusts position based on screen size */}
                  <div className="absolute md:-right-2 md:bottom-4 -bottom-2 left-9/2 -translate-x-1/2 md:translate-x-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-indigo-600 transform rotate-45"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Result bubble */}
        {selectedPrompt && (
          <div className="relative mt-8 p-6 bg-purple-900/80 backdrop-blur-md rounded-xl shadow-xl w-full max-w-md text-center border border-purple-300/30 animate-fadeIn transform transition-all duration-500">
            {/* Character icon in bubble */}
            <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-purple-700 border-2 border-purple-300 overflow-hidden flex items-center justify-center">
              <CharacterSVG />
            </div>
            
            <h2 className="text-xl font-bold text-purple-200 mb-4 mt-2">{currentPlayer}: Time To Reflect!</h2>
            <p className="text-white text-lg">{selectedPrompt}</p>
            
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 left-12 w-6 h-6 bg-purple-900/80 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpathyWheel;