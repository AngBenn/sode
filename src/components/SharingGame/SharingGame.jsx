import React, { useState, useEffect } from 'react';
import { Award, Smile, Frown, RotateCcw, ThumbsUp, ArrowRight } from 'lucide-react';

export default function SharingGame() {
  const [gameState, setGameState] = useState({
    totalItems: 0,
    itemType: '',
    correctAnswer: 0,
    options: [],
    selectedAnswer: null,
    score: 0,
    showResult: false,
    round: 1,
    isAnswerCorrect: false,
    animateItems: false
  });

  const itemTypes = [
    {
      name: 'mangoes',
      icon: (
        <svg width="64" height="64" viewBox="0 0 48 48" className="transition-transform duration-300 hover:scale-110">
          <defs>
            <linearGradient id="mango-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="70%" stopColor="#FF8F00" />
              <stop offset="100%" stopColor="#FF6F00" />
            </linearGradient>
            <filter id="mango-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <path d="M24,8 C30,8 42,15 42,30 C42,38 36,42 24,42 C12,42 6,38 6,30 C6,15 18,8 24,8z" 
                fill="url(#mango-gradient)" filter="url(#mango-shadow)" />
          <path d="M24,8 C20,8 16,10 16,13 C16,16 21,17 24,17 C27,17 32,16 32,13 C32,10 28,8 24,8z" 
                fill="#43A047" opacity="0.9" />
          <path d="M24,8 L24,4 L26,6z" fill="#33691E" />
          <path d="M23,16 C23,14 28,14 28,18 C28,20 26,20 25,17 C25,16 21,16 23,16z" fill="#FFC107" />
        </svg>
      )
    },
    {
      name: 'pencils',
      icon: (
        <svg width="64" height="64" viewBox="0 0 48 48" className="transition-transform duration-300 hover:scale-110">
          <defs>
            <linearGradient id="pencil-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8D6E63" />
              <stop offset="50%" stopColor="#A1887F" />
              <stop offset="100%" stopColor="#8D6E63" />
            </linearGradient>
            <filter id="pencil-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <g transform="rotate(30, 24, 24)" filter="url(#pencil-shadow)">
            <polygon points="10,38 10,10 36,10 36,38" fill="url(#pencil-wood)" />
            <polygon points="10,10 36,10 36,15 10,15" fill="#FFD54F" />
            <polygon points="36,10 36,38 40,34 40,6" fill="#FF6F00" />
            <polygon points="40,6 40,10 36,10 36,6" fill="#E64A19" />
            <polygon points="10,38 14,42 40,42 36,38" fill="#5D4037" />
            <polygon points="36,38 40,34 44,38 40,42" fill="#3E2723" />
            <polygon points="23,10 23,15 13,15 13,10" fill="#FFA000" stroke="#FF6F00" strokeWidth="0.5" />
          </g>
        </svg>
      )
    },
    {
      name: 'kenkey',
      icon: (
        <svg width="64" height="64" viewBox="0 0 48 48" className="transition-transform duration-300 hover:scale-110">
          <defs>
            <radialGradient id="kenkey-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#F5F5DC" />
              <stop offset="90%" stopColor="#E6E6C3" />
              <stop offset="100%" stopColor="#CFCFB3" />
            </radialGradient>
            <filter id="kenkey-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <ellipse cx="24" cy="24" rx="16" ry="14" fill="url(#kenkey-gradient)" filter="url(#kenkey-shadow)" />
          <path d="M14,19 Q24,13 34,19" stroke="#A1887F" strokeWidth="0.8" fill="none" />
          <path d="M14,24 Q24,18 34,24" stroke="#A1887F" strokeWidth="0.8" fill="none" />
          <path d="M14,29 Q24,35 34,29" stroke="#A1887F" strokeWidth="0.8" fill="none" />
        </svg>
      )
    },
    {
      name: 'oranges',
      icon: (
        <svg width="64" height="64" viewBox="0 0 48 48" className="transition-transform duration-300 hover:scale-110">
          <defs>
            <radialGradient id="orange-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FF9800" />
              <stop offset="80%" stopColor="#F57C00" />
              <stop offset="100%" stopColor="#E65100" />
            </radialGradient>
            <filter id="orange-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
            </filter>
          </defs>
          <circle cx="24" cy="24" r="18" fill="url(#orange-gradient)" filter="url(#orange-shadow)" />
          <path d="M24,6 C22,6 20,12 20,12 L28,12 C28,12 26,6 24,6z" fill="#43A047" />
          <path d="M20,12 C18,12 16,14 16,14 L32,14 C32,14 30,12 28,12z" fill="#2E7D32" />
          <ellipse cx="24" cy="16" rx="1" ry="1" fill="#33691E" />
        </svg>
      )
    }
  ];

  const startNewRound = () => {
    const randomEven = (Math.floor(Math.random() * 5) + 2) * 2;
    const totalItems = randomEven;
    const randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const correctAnswer = totalItems / 2;
    
    let options = [correctAnswer];
    
    if (correctAnswer > 1) {
      options.push(correctAnswer - 1);
    } else {
      options.push(correctAnswer + 1);
    }
    
    if (correctAnswer > 2) {
      options.push(correctAnswer - 2);
    } else if (totalItems < 12) {
      options.push(correctAnswer + 2);
    }
    
    options = options.slice(0, 2).sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      totalItems,
      itemType: randomItemType.name,
      itemIcon: randomItemType.icon,
      correctAnswer,
      options,
      selectedAnswer: null,
      showResult: false,
      animateItems: false
    }));
  };

  const handleOptionSelect = (option) => {
    setGameState(prev => ({ ...prev, selectedAnswer: option }));
  };

  const handleAnswerSubmit = () => {
    if (gameState.selectedAnswer === null) return;
    const isCorrect = gameState.selectedAnswer === gameState.correctAnswer;
    
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showResult: true,
      isAnswerCorrect: isCorrect,
      animateItems: true
    }));
  };

  const handleNextRound = () => {
    setGameState(prev => ({ ...prev, round: prev.round + 1, showResult: false }));
    startNewRound();
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      round: 1,
      showResult: false
    }));
    startNewRound();
  };

  useEffect(() => startNewRound(), []);

  const renderItems = (count) => {
    return Array(count).fill().map((_, index) => (
      <div 
        key={index} 
        className={`inline-block mx-1 my-1 transition-all duration-500 ${
          gameState.animateItems ? 
            index < gameState.correctAnswer ? 'translate-x-12 scale-90' : '-translate-x-12 scale-90' 
            : 'hover:scale-125 hover:-translate-y-2'
        }`}
      >
        {gameState.itemIcon}
      </div>
    ));
  };

  const SimpleAvatar = ({ isGirl, happy = true }) => (
    <div className="relative">
      <svg width="100" height="100" viewBox="0 0 100 100" className="transition-transform duration-300 hover:scale-105">
        <circle cx="50" cy="50" r="40" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
        <ellipse cx="35" cy="40" rx="5" ry={happy ? "6" : "2"} fill="white" />
        <ellipse cx="65" cy="40" rx="5" ry={happy ? "6" : "2"} fill="white" />
        <circle cx="35" cy="40" r="2.5" fill="black" />
        <circle cx="65" cy="40" r="2.5" fill="black" />
        {happy ? (
          <path d="M30,60 Q50,80 70,60" stroke="white" strokeWidth="3" fill="none" />
        ) : (
          <path d="M30,70 Q50,50 70,70" stroke="white" strokeWidth="3" fill="none" />
        )}
        {isGirl && (
          <>
            <rect x="42" y="15" width="16" height="5" rx="2" fill="#FF5252" />
            <circle cx="50" cy="12" r="6" fill="#FF5252" />
          </>
        )}
      </svg>
      
    </div>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute text-3xl opacity-10" 
               style={{ 
                 left: `${Math.random() * 100}%`, 
                 top: `${Math.random() * 100}%`,
                 animation: `float ${5 + Math.random() * 5}s infinite ${Math.random() * 5}s ease-in-out`,
                 transform: `rotate(${Math.random() * 360}deg)` 
               }}>
            {i % 3 === 0 ? '🍎' : i % 3 === 1 ? '✏️' : '🍊'}
          </div>
        ))}
      </div>

      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-amber-200 max-w-7xl w-full h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="bg-amber-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
            <Award className="text-amber-600" size={24} />
            <span className="text-xl font-bold text-amber-800">Score: {gameState.score}</span>
          </div>
          
          <div className="bg-purple-100 px-4 py-2 rounded-full shadow-md">
            <span className="text-xl font-bold text-purple-800">Round {gameState.round}</span>
          </div>
          
          <button 
            onClick={resetGame}
            className="bg-red-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-red-200 transition-colors"
          >
            <RotateCcw className="text-red-600" size={20} />
            <span className="text-lg font-bold text-red-800">Reset</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {!gameState.showResult ? (
            <>
              <div className="text-center my-4">
                <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-2">
                  Share {gameState.totalItems} {gameState.itemType}!
                </h2>
                <p className="text-xl md:text-2xl text-amber-700">
                  How many will each friend get?
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center mb-4 min-h-[200px]">
                <div className="p-4 bg-amber-50 rounded-2xl border-4 border-amber-200 shadow-inner max-w-3xl w-full flex flex-wrap justify-center items-center">
                  {renderItems(gameState.totalItems)}
                </div>
              </div>

              <div className="flex justify-around items-end my-4 gap-4">
                <div className="text-center">
                  <SimpleAvatar isGirl={false} happy={true} />
                  <p className="text-xl font-bold mt-2 text-blue-600">Kofi</p>
                </div>
                <div className="text-center">
                  <SimpleAvatar isGirl={true} happy={true} />
                  <p className="text-xl font-bold mt-2 text-pink-600">Ama</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-center text-xl font-medium text-amber-700 mb-4">Select how many each friend gets:</p>
                <div className="flex justify-center gap-6 flex-wrap">
                  {gameState.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(option)}
                      className={`text-4xl w-24 h-24 rounded-xl shadow-lg transition-all ${
                        gameState.selectedAnswer === option 
                          ? 'bg-amber-400 text-white scale-110 ring-4 ring-amber-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnswerSubmit}
                disabled={gameState.selectedAnswer === null}
                className={`mt-6 py-4 text-2xl rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  gameState.selectedAnswer !== null
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <ThumbsUp size={28} /> Share Now!
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-4">
              {gameState.isAnswerCorrect ? (
                <>
                  <div className="animate-bounce">
                    <Smile size={80} className="text-amber-600 mx-auto" />
                  </div>
                  <h3 className="text-4xl font-bold text-green-700">Perfect Sharing! 🎉</h3>
                  <div className="flex justify-center items-center gap-8 my-6 flex-wrap">
                    <div className="text-center">
                      <SimpleAvatar isGirl={false} happy={true} />
                      <p className="text-xl font-bold mt-2 text-blue-600">Kofi</p>
                      <div className="mt-2 p-2 bg-blue-100 rounded-lg">
                        <p className="text-2xl text-blue-700">{gameState.correctAnswer}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <SimpleAvatar isGirl={true} happy={true} />
                      <p className="text-xl font-bold mt-2 text-pink-600">Ama</p>
                      <div className="mt-2 p-2 bg-pink-100 rounded-lg">
                        <p className="text-2xl text-pink-700">{gameState.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl text-amber-800">
                    You shared {gameState.totalItems} {gameState.itemType} equally!
                  </p>
                </>
              ) : (
                <>
                  <div className="animate-shake">
                    <Frown size={80} className="text-amber-700 mx-auto" />
                  </div>
                  <h3 className="text-4xl font-bold text-amber-800">Let's Try Again! 💪</h3>
                  <div className="flex justify-center items-center gap-8 my-6 flex-wrap">
                    <div className="text-center">
                      <SimpleAvatar isGirl={false} happy={false} />
                      <p className="text-xl font-bold mt-2 text-blue-600">Kofi</p>
                    </div>
                    <div className="text-center">
                      <SimpleAvatar isGirl={true} happy={false} />
                      <p className="text-xl font-bold mt-2 text-pink-600">Ama</p>
                    </div>
                  </div>
                  <p className="text-2xl text-amber-700">
                    The fair share is {gameState.correctAnswer} {gameState.itemType} each
                  </p>
                </>
              )}

              <button
                onClick={handleNextRound}
                className="w-full max-w-md py-4 text-2xl bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
              >
                <ArrowRight size={28} /> Continue
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .animate-float { animation: float 6s infinite; }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
    </div>
  );
}