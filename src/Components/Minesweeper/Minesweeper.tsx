"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Window, WindowContent, WindowHeader, Button } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

// --- Types & Constants ---
const ROWS = 9;
const COLS = 9;
const TOTAL_MINES = 10;

type CellData = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

// --- Styled Components ---

// The main gray background block
const GameWrapper = styled.div`
  background: #c0c0c0;
  padding: 6px;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff; /* Outset border */
  font-family: 'ms_sans_serif', sans-serif;
`;

// The sunken top panel
const TopPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  margin-bottom: 6px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080; /* Sunken border */
  background: #c0c0c0;
`;

// Classic Red/Black digital timer
const DigitalDisplay = styled.div`
  background: black;
  color: #ff0000;
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 22px;
  font-weight: bold;
  padding: 1px 2px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080; /* Sunken border */
  width: 44px;
  text-align: center;
  line-height: 1;
  letter-spacing: 1px;
`;

// The sunken container holding the grid
const GridContainer = styled.div`
  display: inline-block;
  border: 3px solid;
  border-color: #808080 #ffffff #ffffff #808080; /* Sunken border */
  background: #c0c0c0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLS}, 20px);
  grid-template-rows: repeat(${ROWS}, 20px);
`;

const Cell = styled.div<{ revealed: boolean; isMine: boolean; exploded?: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 14px; /* Classic bold number size */
  font-weight: 900;
  cursor: default;
  user-select: none;
  box-sizing: border-box;
  
  background: ${props => props.exploded ? 'red' : '#c0c0c0'};
  
  /* Classic tight borders */
  border: ${props => props.revealed ? '1px solid #808080' : '2px solid'};
  border-color: ${props => props.revealed 
    ? '#808080 #c0c0c0 #c0c0c0 #808080' 
    : '#ffffff #808080 #808080 #ffffff'};

  /* Override right/bottom borders for revealed cells to look flat */
  ${props => props.revealed && `
    border-right-color: transparent;
    border-bottom-color: transparent;
  `}
`;

// Smiley Button Override
const SmileyBtn = styled(Button)`
  width: 26px;
  height: 26px;
  padding: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Helper for classic exact number colors
const getNumberColor = (num: number) => {
  const colors = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
  return colors[num] || 'black';
};

interface MinesweeperProps {
  onClose: () => void;
}

export default function Minesweeper({ onClose }: MinesweeperProps) {
  const nodeRef = useRef(null);
  
  const [board, setBoard] = useState<CellData[][]>([]);
  const [status, setStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [minesLeft, setMinesLeft] = useState(TOTAL_MINES);
  const [time, setTime] = useState(0);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'playing') {
      timer = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // Initialize empty board
  const createEmptyBoard = useCallback(() => {
    const newBoard: CellData[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 });
      }
      newBoard.push(row);
    }
    return newBoard;
  }, []);

  // Plant mines (ensuring first click is safe)
  const initializeGame = (firstRow: number, firstCol: number, currentBoard: CellData[][]) => {
    let minesPlaced = 0;
    while (minesPlaced < TOTAL_MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!currentBoard[r][c].isMine && !(r === firstRow && c === firstCol)) {
        currentBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                if (currentBoard[r + i][c + j].isMine) count++;
              }
            }
          }
          currentBoard[r][c].neighborMines = count;
        }
      }
    }
    return currentBoard;
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setStatus('idle');
    setMinesLeft(TOTAL_MINES);
    setTime(0);
  };

  // Run once on mount
  useEffect(() => {
    resetGame();
  }, [createEmptyBoard]);

  // Handle Left Click
  const handleCellClick = (r: number, c: number) => {
    if (status === 'won' || status === 'lost' || board[r][c].isFlagged || board[r][c].isRevealed) return;

    let currentBoard = [...board.map(row => [...row])];

    if (status === 'idle') {
      setStatus('playing');
      currentBoard = initializeGame(r, c, currentBoard);
    }

    if (currentBoard[r][c].isMine) {
      // Game Over
      setStatus('lost');
      currentBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(currentBoard);
      return;
    }

    // Recursive reveal
    const revealEmpty = (row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS || currentBoard[row][col].isRevealed || currentBoard[row][col].isFlagged) return;
      
      currentBoard[row][col].isRevealed = true;
      
      if (currentBoard[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmpty(row + i, col + j);
          }
        }
      }
    };

    revealEmpty(r, c);

    // Check Win Condition
    let unrevealedSafeCells = 0;
    currentBoard.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
    }));

    if (unrevealedSafeCells === 0) {
      setStatus('won');
      setMinesLeft(0);
      currentBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isFlagged = true;
      }));
    }

    setBoard(currentBoard);
  };

  // Handle Right Click (Flagging)
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault(); 
    if (status === 'won' || status === 'lost' || board[r][c].isRevealed) return;

    const newBoard = [...board.map(row => [...row])];
    const cell = newBoard[r][c];

    if (!cell.isFlagged && minesLeft > 0) {
      cell.isFlagged = true;
      setMinesLeft(prev => prev - 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft(prev => prev + 1);
    }

    setBoard(newBoard);
  };

  const getSmiley = () => {
    if (status === 'lost') return <img src={'images/mine_dead.png'}/>;
    if (status === 'won') return <img src={'images/mine_smug.png'}/>;
    return <img src={'images/mine_smiley.png'}/>;
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: 'auto', position: 'absolute', top: '15%', left: '40%', zIndex: 100 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={'images/minesweeper.svg'} alt='Minesweeper' width={20} 
          height={20}/>
          <span>Minesweeper</span>
          <Button onClick={onClose}><span style={{ fontWeight: 'bold' }}>x</span></Button>
        </WindowHeader>
        
        <WindowContent style={{ padding: '0' }}>
          
          {/* This wrapper gives us the extra gray padding and outset border classic to Win32 apps */}
          <GameWrapper>
            <TopPanel>
              <DigitalDisplay>{minesLeft.toString().padStart(3, '0')}</DigitalDisplay>
              <SmileyBtn onClick={resetGame}>
                {getSmiley()}
              </SmileyBtn>
              <DigitalDisplay>{time.toString().padStart(3, '0')}</DigitalDisplay>
            </TopPanel>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GridContainer>
                <Grid>
                  {board.map((row, r) => 
                    row.map((cell, c) => (
                      <Cell 
                        key={`${r}-${c}`}
                        revealed={cell.isRevealed}
                        isMine={cell.isMine}
                        exploded={status === 'lost' && cell.isMine && !cell.isFlagged}
                        onClick={() => handleCellClick(r, c)}
                        onContextMenu={(e) => handleRightClick(e, r, c)}
                      >
                        {/* Note: Flags and Bombs will render based on the user's OS emoji style. */}
                        {!cell.isRevealed && cell.isFlagged && <span style={{ fontSize: '12px' }}>🚩</span>}
                        {cell.isRevealed && cell.isMine && !cell.isFlagged && <span style={{ fontSize: '12px' }}><img src={'images/minesweeper.svg'}></img></span>}
                        {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                          <span style={{ color: getNumberColor(cell.neighborMines) }}>
                            {cell.neighborMines}
                          </span>
                        )}
                      </Cell>
                    ))
                  )}
                </Grid>
              </GridContainer>
            </div>
          </GameWrapper>
          
        </WindowContent>
      </Window>
    </Draggable>
  );
}