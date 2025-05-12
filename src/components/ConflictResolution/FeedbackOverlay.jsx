import React from 'react';

const FeedbackOverlay = ({ message, type }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/50`}>
      <div
        className={`text-white text-xl p-6 rounded-2xl ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default FeedbackOverlay;
