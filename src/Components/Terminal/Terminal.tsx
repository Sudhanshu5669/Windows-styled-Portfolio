"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Window, WindowContent, WindowHeader, Button, Panel } from 'react95';
import Draggable from 'react-draggable';
import styled, { keyframes } from 'styled-components';

// --- Command Configuration ---
// Easily define your commands and responses here. 
// Use an array of strings for multi-line responses.
const COMMANDS: Record<string, string | string[]> = {
  help: [
    "Available commands:",
    "  whoami   - Display operator information",
    "  skills   - List technical skills and proficiencies",
    "  features - List current portfolio features",
    "  cls      - Clear the terminal screen",
    "  exit     - Close the terminal session"
  ],
  whoami: [
    "Name: Sudhanshu Bhartiya",
    "Role: Full Stack Developer Intern @ Bajaj Finserv Health",
    "Objective: Building robust web applications and keeping the 90s alive."
  ],
  skills: [
    "Languages: C++, Java, C, JavaScript, TypeScript, Python",
    "Frontend:  React, Next.js, React Native, Tailwind CSS",
    "Backend:   Node.js, Express, PostgreSQL, MongoDB, Drizzle ORM",
    "Tools:     Git, Docker, Vercel, LangChain"
  ],
  features: [
    "1. Interactive MS-DOS Terminal (You are here)",
    "2. Fully functional Minesweeper clone",
    "3. Web Browser with live GitHub API integration",
    "4. Draggable, themeable Window Manager"
  ]
};

const DEFAULT_ERROR = (cmd: string) => `Bad command or file name: "${cmd}". Type "help" for a list of commands.`;

// --- Styled Components ---

const TerminalWrapper = styled(Panel)`
  background-color: #000;
  color: #c0c0c0; /* Classic MS-DOS light gray */
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  padding: 8px;
  height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
  /* Sunken border effect */
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* Vintage Scrollbar */
  &::-webkit-scrollbar { width: 16px; }
  &::-webkit-scrollbar-track { background: #dfdfdf; border-left: 1px solid #fff; }
  &::-webkit-scrollbar-thumb { 
    background: #c0c0c0; 
    border: 1px solid #000; 
    border-top-color: #fff; 
    border-left-color: #fff; 
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  position: relative;
`;

const PromptText = styled.span`
  margin-right: 8px;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 18px;
  background-color: #c0c0c0;
  animation: ${blink} 1s step-end infinite;
  vertical-align: bottom;
  margin-left: 2px;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: text;
  background: transparent;
  color: transparent;
  border: none;
  outline: none;
`;

const TextLine = styled.div`
  min-height: 20px;
  white-space: pre-wrap; /* Preserve spaces for formatting */
`;

// --- Interfaces ---
interface TerminalProps {
  onClose: () => void;
}

type HistoryEntry = {
  id: number;
  type: 'input' | 'output';
  text: string;
};

// --- Main Component ---
export default function Terminal({ onClose }: TerminalProps) {
  const nodeRef = useRef(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: 1, type: 'output', text: 'MS-DOS Prompt [Version 7.00]' },
    { id: 2, type: 'output', text: '(C) Copyright 1981-1995 Microsoft Corp.' },
    { id: 3, type: 'output', text: ' ' },
    { id: 4, type: 'output', text: 'Type "help" to see available commands.' },
    { id: 5, type: 'output', text: ' ' }
  ]);

  // Keep scrolled to bottom when history updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedInput = input.trim();
      const lowerCmd = trimmedInput.toLowerCase();
      
      // 1. Add user input to history
      const newHistory: HistoryEntry[] = [
        ...history, 
        { id: Date.now(), type: 'input', text: `C:\\WINDOWS> ${input}` }
      ];

      if (lowerCmd) {
        // 2. Process Command
        if (lowerCmd === 'cls' || lowerCmd === 'clear') {
          setHistory([]);
          setInput('');
          return;
        }

        if (lowerCmd === 'exit') {
          onClose();
          return;
        }

        const response = COMMANDS[lowerCmd];

        if (response) {
          if (Array.isArray(response)) {
            response.forEach((line, index) => {
              newHistory.push({ id: Date.now() + index + 1, type: 'output', text: line });
            });
          } else {
            newHistory.push({ id: Date.now() + 1, type: 'output', text: response });
          }
        } else {
          newHistory.push({ id: Date.now() + 1, type: 'output', text: DEFAULT_ERROR(trimmedInput) });
        }
      }

      // Add a blank line for spacing after output
      newHistory.push({ id: Date.now() + 99, type: 'output', text: ' ' });

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: '700px', position: 'absolute', top: '10%', left: '20%', zIndex: 110 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💻 MS-DOS Prompt</span>
          <Button onClick={onClose}><span style={{ fontWeight: 'bold' }}>x</span></Button>
        </WindowHeader>
        
        <WindowContent style={{ padding: '0' }}>
          <TerminalWrapper onClick={handleTerminalClick}>
            <OutputArea ref={outputRef}>
              {history.map((entry) => (
                <TextLine key={entry.id}>{entry.text}</TextLine>
              ))}
              
              {/* Active Input Line */}
              <InputContainer>
                <PromptText>C:\WINDOWS&gt;</PromptText>
                <span>{input}</span>
                <Cursor />
                <HiddenInput 
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </InputContainer>
            </OutputArea>
          </TerminalWrapper>
        </WindowContent>
      </Window>
    </Draggable>
  );
}