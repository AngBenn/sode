import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import { FaArrowLeft, FaStar, FaGamepad } from 'react-icons/fa';



export default function ScenarioDetail() {
  const { scenarioName, levelNumber, levelName } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showScenario, setShowScenario] = useState(false);

  const scenarioDetails = {
    "Empathy Test": { description: "Test your ability to empathize with others.", image: "/images/empathy.png" },
    "Collaboration Task": { description: "Work together with others to complete a task.", image: "/images/collaboration.png" },
    "Sharing Is Caring": { description: "Practice sharing with others in this game.", image: "/images/Teamopia6.png" },
    "Communication Drill": { description: "Improve your communication skills.", image: "/images/communication.png" },
    "Resolving Conflicts": { description: "Resolve conflicts effectively in this simulation.", image: "/images/Teamopia19.png" },
    "Teamopia: The Cooperation Quest": {
      description: "Cooperate with friends to overcome this quest!",
      levels: {
        "1": "/images/Teamopia19.png",
        "2": "/images/Teamopia14.png",
        "3": "/images/Teamopia15.png",
      },
      defaultImage: "/images/Teamopia14.png"
    },
  };


  const scenario = scenarioDetails[scenarioName];
  let scenarioImage = scenario?.image;

  if (scenarioName === "Teamopia: The Cooperation Quest" && scenario?.levels) {
    scenarioImage = scenario.levels[levelNumber] || scenario.defaultImage;
  }

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

    setTimeout(() => {
      setIsLoading(false);
      if (scenarioName === "Teamopia: The Cooperation Quest") {
        if (levelNumber === "1") {
          navigate(`/Teamopia/LevelOne`);
        } else if (levelNumber === "2") {
          navigate(`/Teamopia/LevelTwo`);
        }
        else if (levelNumber === "3") {
          navigate(`/Teamopia/LevelThree`);
        } else {
          setShowScenario(true);
        }
      } else {
        setShowScenario(true);
      }
    }, 1000);

  };

  // Parallax effect for the loading page image
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-b from-[#4A3B8C] to-[#272052] text-white min-h-screen"
    >
      {/* Back Button with Star Decoration */}
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          scenarioName.includes("Teamopia")
            ? navigate(`/levels/${scenarioName}`)
            : navigate(`/dashboard`)
        }
        className="flex items-center text-purple-300 hover:text-yellow-400 mb-4 group"
      >
        <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="flex items-center">
          {scenarioName.includes("Teamopia") ? "Back to Levels" : "Back to Dashboard"}
          <FaStar className="ml-2 text-yellow-300 animate-pulse" />
        </span>
      </motion.button>

      {/* Scenario Title with Bouncy Animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2 font-[LuckiestGuy] tracking-wide text-yellow-300 drop-shadow-md">
          {scenarioName}
        </h1>
        {levelNumber && levelName && (
          <h2 className="text-2xl font-semibold text-purple-200">
            {decodeURIComponent(levelName)}
          </h2>
        )}
      </motion.div>

      {/* Scenario Details Container */}
      {scenario ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-purple-300/30 relative"
        >
          {/* Floating Decorations */}
          <div className="absolute -top-4 -left-4">
            <FaGamepad className="text-yellow-300 text-3xl animate-float" />
          </div>
          <div className="absolute -bottom-4 -right-4">
            <FaStar className="text-purple-300 text-3xl animate-float-delayed" />
          </div>

          {/* Full-width Image Container */}
          <motion.div
            className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border-4 border-white/20 relative mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={scenarioImage}
              alt={scenarioName}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>

          <p className="text-lg md:text-xl text-purple-100 mb-6 text-center font-medium leading-relaxed">
            {scenario.description}
          </p>

          {/* Animated Start Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={startLoading}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-xl font-bold text-purple-900 
                      flex items-center justify-center space-x-3 hover:shadow-glow transition-all"
          >
            <FaGamepad className="text-2xl" />
            <span>Start Adventure!</span>
          </motion.button>

          {/* Fun Facts Carousel */}
          <div className="mt-8 p-4 bg-purple-200/10 rounded-xl">
            <p className="text-center text-sm md:text-base text-purple-100 italic">
              {funFacts[Math.floor(Math.random() * funFacts.length)]}
            </p>
          </div>
        </motion.div>
      ) : (
        <p className="text-red-400 text-center">Scenario not found!</p>
      )}



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
