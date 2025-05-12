import React, { useMemo, useState } from 'react';
import ConflictCard from './ConflictCard';

const ConflictResolution = () => {
  const [feedback, setFeedback] = useState('');
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const scenarios = useMemo(() => [
    {
      title: "Who plays with the drum?",
      image: "/images/drum_conflict.jpg",
      story: "Kwame and Abena both want to play the talking drum at the same time.",
      options: [
        { text: "Take turns", isCorrect: true },
        { text: "Both cry", isCorrect: false },
      ]
    },
    {
      title: "The broken toy",
      image: "/images/toy_conflict.jpg",
      story: "Kwame broke Abena’s toy by mistake. She is upset.",
      options: [
        { text: "Say sorry and fix it", isCorrect: true },
        { text: "Run away", isCorrect: false },
      ]
    }
  ], []);

  const handleSelectOption = (option) => {
    if (option.isCorrect) {
      setFeedback("Great! That's the peaceful way!");
      setTimeout(() => {
        setScenarioIndex((prev) => Math.min(prev + 1, scenarios.length - 1));
        setFeedback('');
      }, 2000);
    } else {
      setFeedback("Hmm, let's try a kinder way.");
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen flex flex-col justify-center items-center">
      <ConflictCard
        scenario={scenarios[scenarioIndex]}
        onSelectOption={handleSelectOption}
      />
      {feedback && (
        <div className="mt-4 text-xl text-center font-semibold text-purple-600">{feedback}</div>
      )}
    </div>
  );
};

export default ConflictResolution;
