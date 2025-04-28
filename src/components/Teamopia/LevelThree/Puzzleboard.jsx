import React, { useState, useEffect } from 'react';
import './Puzzleboard.css';

const puzzles = [
  {
    tiles: [
      'tile_0_0', 'tile_0_1', 'tile_0_2',
      'tile_1_0', 'tile_1_1', 'tile_1_2',
      'tile_2_0', 'tile_2_1', 'tile_2_2'
    ],
    solution: [
      'tile_0_0', 'tile_0_1', 'tile_0_2',
      'tile_1_0', 'tile_1_1', 'tile_1_2',
      'tile_2_0', 'tile_2_1', 'tile_2_2'
    ],
    image: '/images/Puzzle_image.jpeg'
  },
  {
    tiles: [
      'tile_2_0_0', 'tile_2_0_1', 'tile_2_0_2',
      'tile_2_1_0', 'tile_2_1_1', 'tile_2_1_2',
      'tile_2_2_0', 'tile_2_2_1', 'tile_2_2_2'
    ],
    solution: [
      'tile_2_0_0', 'tile_2_0_1', 'tile_2_0_2',
      'tile_2_1_0', 'tile_2_1_1', 'tile_2_1_2',
      'tile_2_2_0', 'tile_2_2_1', 'tile_2_2_2'
    ],
    image: '/images/Puzzle_image2.jpeg'
  },
  {
    tiles: [
      'tile_3_0_0', 'tile_3_0_1', 'tile_3_0_2',
      'tile_3_1_0', 'tile_3_1_1', 'tile_3_1_2',
      'tile_3_2_0', 'tile_3_2_1', 'tile_3_2_2'
    ],
    solution: [
      'tile_3_0_0', 'tile_3_0_1', 'tile_3_0_2',
      'tile_3_1_0', 'tile_3_1_1', 'tile_3_1_2',
      'tile_3_2_0', 'tile_3_2_1', 'tile_3_2_2'
    ],
    image: '/images/Puzzle_image3.jpeg'
  }
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const PuzzleBoard = ({ onPuzzleComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [userTurn, setUserTurn] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    initializePuzzle();
  }, [currentLevel]);

  const initializePuzzle = () => {
    setTiles(shuffle(puzzles[currentLevel].tiles));
    setUserTurn(true);
    setCompleted(false);
    setDraggedIndex(null);
  };

  const getCorrectTileIndexes = (tiles, solution) => {
    return tiles.map((tile, i) => tile === solution[i]);
  };

  const handleDragStart = (index) => {
    if (!userTurn) {
      setShowWarning(true);
      return;
    }
    setDraggedIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (!userTurn || draggedIndex === null || completed) return;

    const newTiles = [...tiles];
    [newTiles[draggedIndex], newTiles[targetIndex]] = [newTiles[targetIndex], newTiles[draggedIndex]];
    setTiles(newTiles);
    setDraggedIndex(null);

    const isCorrectMap = getCorrectTileIndexes(newTiles, puzzles[currentLevel].solution);

    if (newTiles.join() === puzzles[currentLevel].solution.join()) {
      setCompleted(true);
      setTimeout(() => {
        if (currentLevel < puzzles.length - 1) {
          setCurrentLevel(currentLevel + 1);
        } else {
          onPuzzleComplete();
        }
      }, 1000);
      return;
    }

    setUserTurn(false);
    setTimeout(() => amyMakesAMove(newTiles, isCorrectMap), 1000);
  };

  const amyMakesAMove = (currentTiles, isCorrectMap) => {
    const incorrectIndexes = isCorrectMap
      .map((isCorrect, i) => (!isCorrect ? i : null))
      .filter((i) => i !== null);

    if (incorrectIndexes.length < 2) {
      setUserTurn(true);
      return;
    }

    const amyFrom = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
    let amyTo = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
    while (amyTo === amyFrom) {
      amyTo = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
    }

    const newTiles = [...currentTiles];
    [newTiles[amyFrom], newTiles[amyTo]] = [newTiles[amyTo], newTiles[amyFrom]];
    setTiles(newTiles);

    if (newTiles.join() === puzzles[currentLevel].solution.join()) {
      setCompleted(true);
    } else {
      setUserTurn(true);
    }
  };

  const correctMap = getCorrectTileIndexes(tiles, puzzles[currentLevel].solution);

  return (
    <div className="puzzle-container">
      <div className="puzzle-interface">
        <div className="puzzle-grid">
          {tiles.map((tile, index) => (
            <img
              key={tile}
              src={`/images/${tile}.png`}
              alt={tile}
              draggable={userTurn}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className={`puzzle-tile ${!userTurn ? 'disabled' : ''} ${correctMap[index] ? 'locked' : ''}`}
            />
          ))}
        </div>
        <div className="side-panel">
          <img src={puzzles[currentLevel].image} alt="Level hint" className="character-image" />
          <div className="tutorial-message">
            {userTurn ? "Your turn! Drag tiles to solve the puzzle." : "Amy's turn! Watch her swap!"}
          </div>
          {showWarning && (
            <div className="warning-message">
              ⚠️ Wait for your turn!
            </div>
          )}
          {completed && (
            <button className="next-button" onClick={() => setCurrentLevel(prev => prev + 1)}>
              Next Level ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleBoard;

