import React from 'react';

const DialogueBox = ({ story, options, onSelect }) => (
  <div className="bg-white p-4 rounded-xl shadow-md max-w-xl text-center space-y-3">
    <p className="text-lg font-semibold">{story}</p>
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt)}
          className="p-3 bg-yellow-300 hover:bg-yellow-400 rounded-lg text-lg"
        >
          {opt.text}
        </button>
      ))}
    </div>
  </div>
);

export default DialogueBox;
