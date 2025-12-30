import React, { useState, useEffect, useRef } from 'react';

const BOARD_WIDTH = 40;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 16;

const INITIAL_SNAKE = [
  { x: 5, y: 10 },
  { x: 4, y: 10 },
  { x: 3, y: 10 },
];

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [food, setFood] = useState(getRandomFoodPosition(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(150);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => moveSnake(), speed);
    return () => clearInterval(interval);
  }, [snake, gameOver, speed, gameStarted]);

  function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    const newDirection = DIRECTIONS[key];
    if (newDirection) {
      const oppositeX = directionRef.current.x + newDirection.x === 0;
      const oppositeY = directionRef.current.y + newDirection.y === 0;
      if (!oppositeX || !oppositeY) {
        setDirection(newDirection);
      }
    }
  }

  function moveSnake() {
    const head = snake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y,
    };

    if (
      newHead.x < 0 ||
      newHead.x >= BOARD_WIDTH ||
      newHead.y < 0 ||
      newHead.y >= BOARD_HEIGHT
    ) {
      return onGameOver();
    }

    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      return onGameOver();
    }

    const newSnake = [newHead, ...snake];

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(score + 1);
      setFood(getRandomFoodPosition(newSnake));
      setSpeed((prev) => (prev > 60 ? prev - 5 : prev));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function onGameOver() {
    setGameOver(true);
  }

  function resetGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.ArrowRight);
    setFood(getRandomFoodPosition(INITIAL_SNAKE));
    setScore(0);
    setSpeed(150);
    setGameOver(false);
    setGameStarted(true);
  }

  function getRandomFoodPosition(snakeBody) {
    let newPos;
    while (true) {
      newPos = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
      if (!snakeBody.some(seg => seg.x === newPos.x && seg.y === newPos.y)) break;
    }
    return newPos;
  }

  const cells = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let bgColor = '#1e1e1e';
      if (snake.some(seg => seg.x === x && seg.y === y)) {
        bgColor = '#00ff88';
      } else if (food.x === x && food.y === y) {
        bgColor = '#ff4d4d';
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            backgroundColor: bgColor,
          }}
        ></div>
      );
    }
  }

  return (
    <div
      style={{
        
        backgroundColor: '#121212',
        color: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ marginBottom: '10px' }}> Snake Game</h1>

      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Start Game
        </button>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
              backgroundColor: '#000',
              borderRadius: '10px',
              marginTop: '10px',
            }}
            tabIndex="0"
          >
            {cells}
          </div>

          <div style={{ marginTop: '20px', fontSize: '18px' }}>
            <strong>Score:</strong> {score}
          </div>

          {gameOver && (
            <div style={{ marginTop: '10px', textAlign: 'center', color: 'red' }}>
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
        </>
      )}
    </div>
  );
};

export default SnakeGame;
