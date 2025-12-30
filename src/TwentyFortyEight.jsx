import React, { useState, useEffect } from 'react';

const GRID_SIZE = 4;

const getEmptyGrid = () => Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

const getRandomEmptyCell = (grid) => {
  const emptyCells = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push({ i, j });
    });
  });
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const cloneGrid = (grid) => grid.map(row => [...row]);

const addNewTile = (grid) => {
  const newGrid = cloneGrid(grid);
  const pos = getRandomEmptyCell(newGrid);
  if (pos) newGrid[pos.i][pos.j] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const moveRowLeft = (row) => {
  const filtered = row.filter(n => n !== 0);
  const merged = [];
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  return [...merged, ...Array(row.length - merged.length).fill(0)];
};

const rotateGrid = (grid, clockwise = true) => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (clockwise) newGrid[j][GRID_SIZE - 1 - i] = grid[i][j];
      else newGrid[GRID_SIZE - 1 - j][i] = grid[i][j];
    }
  }
  return newGrid;
};

const getTileColor = (value) => {
  const colors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#3c3a32';
};

const TwentyFortyEight = () => {
  const [grid, setGrid] = useState(addNewTile(addNewTile(getEmptyGrid())));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const move = (direction) => {
    let newGrid = cloneGrid(grid);
    let moved = false;

    const moveLeft = () => {
      for (let i = 0; i < GRID_SIZE; i++) {
        const newRow = moveRowLeft(newGrid[i]);
        if (newRow.join() !== newGrid[i].join()) moved = true;
        newGrid[i] = newRow;
      }
    };

    switch (direction) {
      case 'left':
        moveLeft();
        break;
      case 'right':
        newGrid = rotateGrid(newGrid, true);
        newGrid = rotateGrid(newGrid, true);
        moveLeft();
        newGrid = rotateGrid(newGrid, true);
        newGrid = rotateGrid(newGrid, true);
        break;
      case 'up':
        newGrid = rotateGrid(newGrid, false);
        moveLeft();
        newGrid = rotateGrid(newGrid, true);
        break;
      case 'down':
        newGrid = rotateGrid(newGrid, true);
        moveLeft();
        newGrid = rotateGrid(newGrid, false);
        break;
      default:
        break;
    }

    if (moved) {
      const withTile = addNewTile(newGrid);
      setGrid(withTile);
      updateScore(withTile);
      if (checkGameOver(withTile)) setGameOver(true);
    }
  };

  const updateScore = (newGrid) => {
    let total = 0;
    newGrid.forEach(row => row.forEach(val => total += val));
    setScore(total);
  };

  const checkGameOver = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return false;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
      }
    }
    return true;
  };

  const handleKeyDown = (e) => {
    if (gameOver) return;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) move('up');
    else if (['ArrowDown', 's', 'S'].includes(e.key)) move('down');
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('left');
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) move('right');
  };

  const resetGame = () => {
    const freshGrid = addNewTile(addNewTile(getEmptyGrid()));
    setGrid(freshGrid);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      style={{
       
        backgroundColor: '#121212',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>2048 Game</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
          gridGap: '8px',
          backgroundColor: '#1e1e1e',
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        {grid.flat().map((val, idx) => (
          <div
            key={idx}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: val === 0 ? '#2d2d2d' : getTileColor(val),
              color: val > 4 ? '#f9f6f2' : '#776e65',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
              borderRadius: '8px',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            {val !== 0 ? val : ''}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', fontSize: '18px' }}>
        <strong>Score:</strong> {score}
      </div>
      {gameOver && (
        <div style={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>
          <div><strong>Game Over!</strong></div>
          <button
            onClick={resetGame}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              border: 'none',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default TwentyFortyEight;
