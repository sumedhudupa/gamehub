import React, { useState } from 'react';
import TwentyFortyEight from './TwentyFortyEight'; // Import the 2048 Game
import SnakeGame from './SnakeGame'; // Assuming you have SnakeGame component

const App = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const startGame = (game) => {
    setSelectedGame(game);
  };

  const backToHome = () => {
    setSelectedGame(null);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#121212',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        {!selectedGame ? (
          <>
            <h1 style={{ marginBottom: '20px' }}>Welcome to the Game Hub!</h1>
            <div>
              <button
                onClick={() => startGame('2048')}
                style={{
                  fontSize: '20px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  marginRight: '30px',
                }}
              >
                Play 2048
              </button>

              <button
                onClick={() => startGame('snake')}
                style={{
                  fontSize: '20px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Play Snake Game
              </button>
            </div>
          </>
        ) : selectedGame === '2048' ? (
          <div>
            <button
              onClick={backToHome}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
            <TwentyFortyEight />
          </div>
        ) : selectedGame === 'snake' ? (
          <div>
            <button
              onClick={backToHome}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
            <SnakeGame />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
