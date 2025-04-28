import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const funFacts = [
  "Teamwork makes the dream work!",
  "Small steps lead to big victories.",
  "Great things happen when we collaborate.",
  "Empathy is your superpower.",
  "A listening ear can open many doors.",
];

export default function LoadingScreen({ progress = 100 }) {
  const [randomFact] = useState(funFacts[Math.floor(Math.random() * funFacts.length)]);
  const [glowProgress, setGlowProgress] = useState(0);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(glowInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0a061f] to-[#1a1440] flex flex-col items-center justify-center z-50 text-white px-4"
    >
      {/* Placeholder Scenic Image */}
      <motion.img
        src="/images/Teamopia18.jpg" // Add an image to your public/images folder
        alt="Scenic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="w-full max-w-lg h-60 object-cover rounded-xl shadow-lg mb-6"
      />

      {/* Fun Fact */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-purple-200 font-medium italic text-lg max-w-xl mb-6"
      >
        “{randomFact}”
      </motion.p>

      {/* Progress Bar */}
      <div className="w-72 h-3 bg-purple-900/30 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 bg-white/20"
            style={{
              width: `${glowProgress}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </motion.div>
      </div>

      <motion.p
        className="mt-4 text-purple-300 text-sm font-light"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading....
      </motion.p>
    </motion.div>
  );
}
