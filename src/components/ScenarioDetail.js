import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function ScenarioDetail() {
  const { scenarioName, levelNumber, levelName } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showScenario, setShowScenario] = useState(false);

  const scenarioDetails = {
    "Cooperation Challenge": { description: "A scenario where you need to cooperate with others.", image: "/images/cooperation.png" },
    "Empathy Test": { description: "Test your ability to empathize with others.", image: "/images/empathy.png" },
    "Collaboration Task": { description: "Work together with others to complete a task.", image: "/images/collaboration.png" },
    "Sharing Game": { description: "Practice sharing with others in this game.", image: "/images/sharing.png" },
    "Communication Drill": { description: "Improve your communication skills.", image: "/images/communication.png" },
    "Conflict Resolution Sim": { description: "Resolve conflicts effectively in this simulation.", image: "/images/conflict.png" },
    "Teamopia: The Cooperation Quest": { description: "Cooperate with friends to overcome this quest!", image: "/images/scenario7.png" },
  };

  const scenario = scenarioDetails[scenarioName];

  const funFacts = [
    "Tip: Staying calm under pressure helps you make better decisions.",
    "Confidence is key! Believe in your abilities to succeed.",
    "Focus on the goal—it helps you stay motivated and on track.",
    "Teamwork makes the dream work! Collaborate effectively to win.",
    "Listen actively to others—it builds trust and improves outcomes.",
    "Think before you act. A well-thought-out plan leads to success.",
    "Celebrate small wins—they keep you motivated for the bigger challenges.",
  ];

  // Handle Escape key to navigate back to Levels page
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        navigate(`/levels/${scenarioName}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, scenarioName]);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setShowScenario(false);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setShowScenario(true);
          }, 1000); // Delay before showing the scenario page
          return 100;
        }
        return prevProgress + 1; // Slower progress increment
      });
    }, 100); // Slower interval
  };

  // Parallax effect for the loading page image
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-[#272052] text-white min-h-screen"
    >
      {/* Back Button with Animation */}
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/levels/${scenarioName}`)}
        className="flex items-center text-purple-400 hover:text-purple-600 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Levels
      </motion.button>

      {/* Scenario Title */}
      <h1 className="text-3xl font-bold mb-4">Scenario: {scenarioName}</h1>
      {levelNumber && levelName && (
        <h2 className="text-2xl font-bold mb-4">
          {decodeURIComponent(levelName)}
        </h2>
      )}

      {/* Scenario Details */}
      {scenario ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#3C2A73] p-6 rounded-lg shadow-lg"
        >
          {/* Scenario Image with Hover Animation */}
          <motion.img
            src={scenario.image}
            alt={scenarioName}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-72 object-cover rounded-lg mb-4"
          />

          <p className="text-lg mb-4">{scenario.description}</p>

          {/* Progress Indicator */}
          <div className="mb-4">
            <p className="text-sm">Progress: {progress}%</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-green-400 h-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, bounce: 0.5 }}
                style={{ boxShadow: progress === 100 ? "0 0 10px 5px rgba(72, 187, 120, 0.8)" : "none" }}
              />
            </div>
          </div>

          {/* Start Scenario Button with Animation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startLoading}
            className="bg-purple-600 text-white py-2 px-4 rounded-full mt-4 w-full hover:bg-purple-700"
          >
            Start Scenario
          </motion.button>
        </motion.div>
      ) : (
        <p className="text-red-500">Scenario not found.</p>
      )}

      {/* Loading Page */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#272052] flex flex-col items-center justify-center p-6 animated-gradient"
          >
            <motion.img
              src={scenario.image}
              alt="Loading"
              style={{ y }}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.8, delay: 0.2 }}
              className="text-lg mb-4 text-center max-w-2xl px-4"
            >
              {funFacts[Math.floor(Math.random() * funFacts.length)]}
            </motion.p>

            <div className="w-64 bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-green-400 h-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Page Overlay */}
      <AnimatePresence>
        {showScenario && (
          <motion.div
            key="scenario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-[#272052] flex flex-col items-center justify-center p-6"
          >
            <h1 className="text-3xl font-bold mb-4">Welcome to the Scenario!</h1>
            <p className="text-lg mb-4">This is where the actual scenario content will be displayed.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
