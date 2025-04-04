import { JSX, useState } from "react";
import "./App.css";
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares).winner) return; // Prevent overwriting a square or playing after a winner is declared
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const table: JSX.Element[] = [];
  const { winner, winningLine } = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  for (let x = 0; x < 3; x++) {
    const row: JSX.Element[] = [];
    for (let j = 0; j < 3; j++) {
      const index = x * 3 + j; // Calculate the index for each square
      const isWinningSquare = winningLine?.includes(index); // Check if the square is part of the winning line
      row.push(
        <Square
          squareClassName={`squares square-${index} ${isWinningSquare ? "winning-square" : ""}`}
          key={`square-${index}`}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }

    table.push(
      <div key={`row-${x}`} className="board-row">
        {row}
      </div>
    );
  }

  // Return the JSX to render the status and the table
  return (
    <>
      <div className="board">
        <div className="status">{status}</div>
        {table}
      </div>
      <button className="reset-button" onClick={() => setSquares(Array(9).fill(null))}>
        Reset
      </button>
    </>
  );
}

type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
  squareClassName: string;
};

function Square({ value, onSquareClick, squareClassName }: SquareProps) {
  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] }; // Return the winner and the winning line
    }
  }
  return { winner: null, winningLine: null };
}