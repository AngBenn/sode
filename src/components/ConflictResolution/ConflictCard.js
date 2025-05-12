import React from 'react';

const ConflictCard = React.memo(({ scenario, onSelectOption }) => {
  return (
    <div className="rounded-2xl shadow-md bg-white p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{scenario.title}</h2>
      <img src={scenario.image} alt="Scene" className="w-full h-48 object-cover rounded-md mb-4" />
      <p className="mb-4 text-base">{scenario.story}</p>
      <div className="space-y-2">
        {scenario.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(option)}
            className="w-full p-2 bg-yellow-300 hover:bg-yellow-400 rounded-xl text-lg"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
});

export default ConflictCard;
