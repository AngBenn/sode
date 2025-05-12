import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sun, ArrowRight, Award, RefreshCw } from 'lucide-react';

// Ghanaian-themed conflict resolution game for preschoolers (ages 4-6)
export default function GhanaianConflictResolutionGame() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResolution, setShowResolution] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Set up fullscreen mode
  useEffect(() => {
    // Set body and html to full height
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Clean up styles when component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.height = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
  
  // Background style with classroom placeholder image
  const backgroundStyle = {
    backgroundImage: "url('/images/classroom.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    margin: '0',
    overflow: 'hidden'
  };
  
  // Simplified conflict scenarios appropriate for 4-6 year olds with Ghanaian context
  const scenarios = useMemo(() => [
    {
      id: 1,
      title: "Sharing Toys at School",
      situation: "Kofi and Ama both want to play with the same toy drum.",
      image: "drum",
      choices: [
        { id: 'a', text: "Take turns playing with the drum", isGood: true },
        { id: 'b', text: "Find a different toy to play with", isGood: true },
        { id: 'c', text: "Grab the drum and run away", isGood: false }
      ],
      resolution: "In Ghana, we learn to share and take turns. Kofi and Ama can each play with the drum for a little while, then switch. This way, everyone gets a chance to enjoy the music!",
      lesson: "Sharing and taking turns helps everyone be happy"
    },
    {
      id: 2,
      title: "Spilled Drink",
      situation: "Kwame accidentally spilled Akua's water during lunch.",
      image: "water",
      choices: [
        { id: 'a', text: "Say sorry and help clean up", isGood: true },
        { id: 'b', text: "Pretend someone else did it", isGood: false },
        { id: 'c', text: "Get Akua more water", isGood: true }
      ],
      resolution: "In our culture, we value honesty and helping others. Kwame can say 'Mepaakyɛw' (I'm sorry) and help clean up the spill, then get Akua some more water.",
      lesson: "Saying sorry and helping fix mistakes"
    },
    {
      id: 3,
      title: "Waiting Your Turn",
      situation: "Many children are waiting to use the slide, but Yaw tries to cut in line.",
      image: "slide",
      choices: [
        { id: 'a', text: "Push Yaw away from the line", isGood: false },
        { id: 'b', text: "Tell Yaw everyone needs to wait their turn", isGood: true },
        { id: 'c', text: "Let an adult know what's happening", isGood: true }
      ],
      resolution: "In Ghana, we respect each other and wait our turn. We can remind our friends gently about taking turns and being patient. The elder (teacher) can help if needed.",
      lesson: "Patience and respecting others"
    },
    {
      id: 4,
      title: "Broken Crayon",
      situation: "Abena borrowed Kwesi's favorite crayon and it broke.",
      image: "crayon",
      choices: [
        { id: 'a', text: "Hide the broken crayon", isGood: false },
        { id: 'b', text: "Say sorry and offer to share your crayons", isGood: true },
        { id: 'c', text: "Blame someone else", isGood: false }
      ],
      resolution: "In our community, we take responsibility for our actions. Abena can apologize to Kwesi and offer to share her crayons. They might even work together to fix the broken crayon.",
      lesson: "Taking responsibility for our actions"
    }
  ], []);
  
  const currentScenarioData = useMemo(() => scenarios[currentScenario], [scenarios, currentScenario]);
  
  // Helper functions
  const handleChoiceSelect = useCallback((choiceId) => {
    setSelectedChoice(choiceId);
    setShowResolution(true);
    
    // Add to completed if not already completed
    if (!completedScenarios.includes(currentScenarioData.id)) {
      setCompletedScenarios(prev => [...prev, currentScenarioData.id]);
    }
  }, [currentScenarioData, completedScenarios]);
  
  const handleNextScenario = useCallback(() => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowCelebration(true);
    }
    setShowResolution(false);
    setSelectedChoice(null);
  }, [currentScenario, scenarios.length]);
  
  const handleReset = useCallback(() => {
    setCurrentScenario(0);
    setShowResolution(false);
    setSelectedChoice(null);
    setCompletedScenarios([]);
    setShowCelebration(false);
  }, []);
  
  const getChoiceColor = useCallback((choice) => {
    if (selectedChoice !== choice.id) return 'bg-gray-100';
    return choice.isGood ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  }, [selectedChoice]);
  
  const progressPercentage = useMemo(() => {
    return (completedScenarios.length / scenarios.length) * 100;
  }, [completedScenarios.length, scenarios.length]);
  
  // Celebration screen
  if (showCelebration) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={backgroundStyle}>
        <div className="flex flex-col items-center justify-center p-8 text-center bg-yellow-50 bg-opacity-90 rounded-lg max-w-5xl w-full mx-4 shadow-2xl">
          <div className="text-4xl font-bold mb-6 text-yellow-600">Ayekoo! (Well Done!)</div>
          <Award size={80} className="text-yellow-500 mb-6" />
          <p className="text-xl mb-8">You've learned how to solve problems with kindness and respect, just like we do in Ghana!</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white p-4 rounded-lg shadow-md text-md">
                {scenario.lesson}
              </div>
            ))}
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-blue-500 text-white py-4 px-8 rounded-full font-bold hover:bg-blue-600 text-lg"
          >
            <RefreshCw size={24} />
            Play Again
          </button>
        </div>
      </div>
    );
  }
  
  // Main game UI
  return (
    <div className="w-screen h-screen flex items-center justify-center" style={backgroundStyle}>
      <div className="flex flex-col bg-blue-50 rounded-lg overflow-hidden shadow-2xl max-w-8xl w-full mx-4">
        {/* Header with Ghanaian-inspired design */}
        <div className="bg-yellow-500 bg-opacity-90 text-center p-6 relative">
          <Sun size={32} className="absolute top-6 left-6 text-yellow-800" />
          <h1 className="text-3xl font-bold text-yellow-900">Let's Be Friends</h1>
          <p className="text-md text-yellow-800 mt-2">Learning about solving problems like we do in Ghana</p>
          
          {/* Progress bar */}
          <div className="mt-4 bg-yellow-200 rounded-full h-6 overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Scenario content */}
        <div className="p-8 bg-white bg-opacity-95 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <h2 className="text-2xl font-bold mb-4 text-blue-800">{currentScenarioData.title}</h2>
          
          {/* Scenario image placeholder */}
          <div className={`h-60 mb-6 rounded-lg flex items-center justify-center ${
            currentScenarioData.image === 'drum' ? 'bg-orange-100' :
            currentScenarioData.image === 'water' ? 'bg-blue-100' :
            currentScenarioData.image === 'slide' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {currentScenarioData.image === 'drum' && <span className="text-7xl">🥁</span>}
            {currentScenarioData.image === 'water' && <span className="text-7xl">💧</span>}
            {currentScenarioData.image === 'slide' && <span className="text-7xl">🛝</span>}
            {currentScenarioData.image === 'crayon' && <span className="text-7xl">🖍️</span>}
          </div>
          
          <p className="mb-8 text-xl">{currentScenarioData.situation}</p>
          
          {/* Question */}
          <p className="mb-4 font-medium text-xl text-blue-800">What should we do?</p>
          
          {/* Choices */}
          <div className="space-y-4 mb-8">
            {currentScenarioData.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice.id)}
                disabled={showResolution}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all text-lg ${
                  getChoiceColor(choice)
                } ${showResolution ? 'cursor-default' : 'hover:bg-blue-50'}`}
              >
                {choice.text}
                {showResolution && selectedChoice === choice.id && (
                  <span className="ml-2">
                    {choice.isGood ? '✅' : '❌'}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Resolution */}
          {showResolution && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded mb-8">
              <h3 className="font-bold text-green-800 mb-2 text-xl">Ghanaian Way:</h3>
              <p className="text-lg">{currentScenarioData.resolution}</p>
            </div>
          )}
          
          {/* Next button */}
          {showResolution && (
            <button
              onClick={handleNextScenario}
              className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-4 px-8 rounded-lg font-bold hover:bg-blue-600 text-lg"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Story' : 'Finish Game'}
              <ArrowRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}