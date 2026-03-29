"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Window, WindowContent, WindowHeader, Button } from 'react95';
import Draggable from 'react-draggable';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ─────────────────────────────────────────
// COMMANDS
// ─────────────────────────────────────────
const COMMANDS: Record<string, Array<{ text: string; color?: string }>> = {
  help: [
    { text: 'Available commands:', color: '#ffff55' },
    { text: '' },
    { text: '  whoami    Display operator information',     color: '#55ffff' },
    { text: '  skills    List technical skills',            color: '#55ffff' },
    { text: '  features  List portfolio features',          color: '#55ffff' },
    { text: '  cls       Clear the terminal screen',        color: '#55ffff' },
    { text: '  exit      Close the terminal session',       color: '#55ffff' },
    { text: '' },
    { text: 'Press ↑ / ↓ to cycle command history.', color: '#aaaaaa' },
  ],
  whoami: [
    { text: '┌─────────────────────────────────────┐', color: '#55ff55' },
    { text: '│         OPERATOR PROFILE             │', color: '#55ff55' },
    { text: '└─────────────────────────────────────┘', color: '#55ff55' },
    { text: '' },
    { text: '  Name   : Sudhanshu Bhartiya',          color: '#ffffff' },
    { text: '  Role   : Full Stack Developer Intern', color: '#ffffff' },
    { text: '  At     : Bajaj Finserv Health',         color: '#ffffff' },
    { text: '  Goal   : Building robust web apps',    color: '#ffffff' },
    { text: '           & keeping the 90s alive.',    color: '#ffffff' },
  ],
  skills: [
    { text: '┌─────────────────────────────────────┐', color: '#55ffff' },
    { text: '│         TECHNICAL SKILLS             │', color: '#55ffff' },
    { text: '└─────────────────────────────────────┘', color: '#55ffff' },
    { text: '' },
    { text: '  Languages : C++  Java  C  JS  TS  Py', color: '#ffffff' },
    { text: '  Frontend  : React  Next.js  Tailwind', color: '#ffffff' },
    { text: '  Mobile    : React Native',              color: '#ffffff' },
    { text: '  Backend   : Node  Express  PostgreSQL', color: '#ffffff' },
    { text: '             MongoDB  Drizzle ORM',       color: '#ffffff' },
    { text: '  Toolchain : Git  Docker  Vercel',       color: '#ffffff' },
    { text: '             LangChain',                  color: '#ffffff' },
  ],
  features: [
    { text: '┌─────────────────────────────────────┐', color: '#ff55ff' },
    { text: '│         PORTFOLIO MODULES            │', color: '#ff55ff' },
    { text: '└─────────────────────────────────────┘', color: '#ff55ff' },
    { text: '' },
    { text: '  [1] Interactive MS-DOS Terminal  ← YOU ARE HERE', color: '#ffff55' },
    { text: '  [2] Fully functional Minesweeper',               color: '#ffffff' },
    { text: '  [3] Browser w/ live GitHub API',                 color: '#ffffff' },
    { text: '  [4] Draggable Win95 Window Manager',             color: '#ffffff' },
  ],
};

const BOOT_LINES = [
  { text: 'HIMEM is testing extended memory...done.',  color: '#aaaaaa' },
  { text: 'MS-DOS is verifying your disk...',          color: '#aaaaaa' },
  { text: 'Microsoft MS-DOS Version 7.00',             color: '#ffff55' },
  { text: '(C) Copyright 1981-1995 Microsoft Corp.',  color: '#aaaaaa' },
  { text: '' },
  { text: 'Type "help" for available commands.',       color: '#55ff55' },
  { text: '' },
];

// ─────────────────────────────────────────
// FONT
// ─────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
`;

// ─────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const scanMove = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
`;

const flicker = keyframes`
  0%, 95%, 100% { opacity: 1; }
  96%           { opacity: 0.94; }
  97%           { opacity: 1; }
  98%           { opacity: 0.97; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─────────────────────────────────────────
// WIN95 TOOLBAR (icon-only, beveled buttons)
// ─────────────────────────────────────────
const Toolbar = styled.div`
  background: #c0c0c0;
  border-bottom: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 1px;
  user-select: none;
`;

const ToolSep = styled.div`
  width: 1px;
  height: 20px;
  background: #808080;
  box-shadow: 1px 0 0 #ffffff;
  margin: 0 4px;
`;

const ToolBtn = styled.button<{ $pressed?: boolean }>`
  width: 26px;
  height: 24px;
  background: #c0c0c0;
  border-top:    2px solid ${p => p.$pressed ? '#808080' : '#ffffff'};
  border-left:   2px solid ${p => p.$pressed ? '#808080' : '#ffffff'};
  border-right:  2px solid ${p => p.$pressed ? '#ffffff' : '#808080'};
  border-bottom: 2px solid ${p => p.$pressed ? '#ffffff' : '#808080'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 13px;
  line-height: 1;
  flex-shrink: 0;
  color: #000;

  &:active {
    border-top:    2px solid #808080;
    border-left:   2px solid #808080;
    border-right:  2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
  }
  &:hover:not(:active) { background: #d0d0d0; }
`;

// ─────────────────────────────────────────
// CRT SCREEN COMPONENTS
// ─────────────────────────────────────────

const CRTOuter = styled.div`
  position: relative;
  background: #000;
  overflow: hidden;
  box-shadow:
    inset 2px  2px 16px rgba(0,0,0,0.95),
    inset -2px -2px 16px rgba(0,0,0,0.95);
  animation: ${flicker} 12s ease-in-out infinite;
  cursor: text;
`;

/* Fine horizontal scanlines — static */
const Scanlines = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.09) 0px,
    rgba(0,0,0,0.09) 1px,
    transparent     1px,
    transparent     3px
  );
`;

/* Single moving glow sweep */
const Sweep = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0; right: 0;
  top: -100px;
  height: 100px;
  z-index: 6;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 220, 0, 0.016) 50%,
    transparent 100%
  );
  animation: ${scanMove} 9s linear infinite;
`;

/* Phosphor vignette — darker at edges */
const Vignette = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 4;
  background: radial-gradient(
    ellipse at 50% 50%,
    transparent 45%,
    rgba(0, 0, 0, 0.5) 100%
  );
`;

const TerminalScreen = styled.div`
  position: relative;
  z-index: 3;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 19px;
  line-height: 1.42;
  height: 420px;
  display: flex;
  flex-direction: column;
  padding: 10px 14px 8px;
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #050505; }
  &::-webkit-scrollbar-thumb { background: #162216; border: 1px solid #0a0a0a; }
`;

const Line = styled.div<{ $color?: string; $delay?: number }>`
  color: ${p => p.$color || '#c0c0c0'};
  min-height: 1.42em;
  white-space: pre-wrap;
  word-break: break-all;
  text-shadow: 0 0 5px ${p => p.$color || '#c0c0c0'}65;
  opacity: 0;
  animation: ${fadeIn} 0.04s ease forwards;
  animation-delay: ${p => p.$delay ?? 0}ms;
  animation-fill-mode: forwards;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Prompt = styled.span`
  color: #c0c0c0;
  text-shadow: 0 0 5px #c0c0c055;
  white-space: nowrap;
  user-select: none;
`;

const InputText = styled.span`
  color: #c0c0c0;
  text-shadow: 0 0 5px #c0c0c055;
`;

const CursorBlock = styled.span`
  display: inline-block;
  width: 10px;
  height: 0.9em;
  background: #c0c0c0;
  box-shadow: 0 0 5px #c0c0c070;
  animation: ${blink} 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 0;
`;

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: text;
  border: none;
  outline: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font-size: 1px;
`;

// ─────────────────────────────────────────
// WIN95 STATUS BAR
// ─────────────────────────────────────────
const StatusBar = styled.div`
  background: #c0c0c0;
  border-top: 1px solid #808080;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 3px 2px;
`;

const StatusCell = styled.div`
  border-top:    1px solid #808080;
  border-left:   1px solid #808080;
  border-right:  1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  padding: 1px 8px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  color: #000;
  white-space: nowrap;
`;

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
interface TerminalProps { onClose: () => void; }
type Entry = { id: number; text: string; color?: string; delay?: number; };

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function Terminal({ onClose }: TerminalProps) {
  const nodeRef   = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const [input,      setInput]      = useState('');
  const [history,    setHistory]    = useState<Entry[]>([]);
  const [cmdHist,    setCmdHist]    = useState<string[]>([]);
  const [histIdx,    setHistIdx]    = useState(-1);
  const [booted,     setBooted]     = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Boot sequence
  useEffect(() => {
    let delay = 0;
    const entries: Entry[] = BOOT_LINES.map((line, i) => {
      delay += i === 0 ? 60 : 160;
      return { id: i, text: line.text, color: line.color, delay };
    });
    setHistory(entries);
    setTimeout(() => setBooted(true), delay + 120);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history]);

  const focus = () => inputRef.current?.focus();

  const scrollBottom = () => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHist.length - 1);
      setHistIdx(next); setInput(cmdHist[next] ?? ''); return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next); setInput(next < 0 ? '' : cmdHist[next] ?? ''); return;
    }
    if (e.key !== 'Enter') return;

    const raw   = input.trim();
    const lower = raw.toLowerCase();
    const now   = Date.now();

    const next: Entry[] = [
      ...history,
      { id: now, text: `C:\\WINDOWS> ${raw}`, color: '#c0c0c0', delay: 0 },
    ];

    if (raw) {
      setCmdHist(prev => [raw, ...prev]);
      setHistIdx(-1);

      if (lower === 'cls' || lower === 'clear') { setHistory([]); setInput(''); return; }
      if (lower === 'exit') { onClose(); return; }

      const resp = COMMANDS[lower];
      if (resp) {
        resp.forEach((line, i) =>
          next.push({ id: now + i + 1, text: line.text, color: line.color, delay: i * 22 })
        );
      } else {
        next.push({
          id: now + 1,
          text: `Bad command or file name: '${raw}'`,
          color: '#ff5555',
          delay: 0,
        });
      }
    }

    next.push({ id: now + 9999, text: '', delay: 0 });
    setHistory(next);
    setInput('');
  };

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".dos-drag" bounds="parent">
        <Window
          ref={nodeRef}
          style={{
            width:    fullscreen ? '100%' : 680,
            position: 'absolute',
            top:      fullscreen ? 0 : '8%',
            left:     fullscreen ? 0 : '12%',
            zIndex:   110,
          }}
        >
          {/* ── TITLE BAR ── */}
          <WindowHeader
            className="dos-drag"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>🖥</span>
            <span style={{ flex: 1, fontSize: 12, fontFamily: 'MS Sans Serif, Tahoma, sans-serif' }}>
              MS-DOS Prompt
            </span>
            <Button size="sm" style={{ minWidth: 18, height: 18, fontSize: 11, fontWeight: 'bold', padding: 0 }}>
              _
            </Button>
            <Button
              size="sm"
              onClick={() => setFullscreen(f => !f)}
              style={{ minWidth: 18, height: 18, fontSize: 10, padding: 0 }}
            >
              {fullscreen ? '❐' : '□'}
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              style={{ minWidth: 18, height: 18, fontSize: 11, fontWeight: 'bold', padding: 0 }}
            >
              ✕
            </Button>
          </WindowHeader>

          <WindowContent style={{ padding: 0 }}>

            {/* ── ICON TOOLBAR (no text labels — pure Win95 icon strip) ── */}
            <Toolbar>
              <ToolBtn title="Mark text">✎</ToolBtn>
              <ToolBtn title="Copy"     >⎘</ToolBtn>
              <ToolBtn title="Paste"    >⏍</ToolBtn>
              <ToolSep />
              <ToolBtn
                title="Clear screen"
                onClick={() => { setHistory([]); focus(); }}
              >⌫</ToolBtn>
              <ToolBtn
                title="Scroll to bottom"
                onClick={() => { scrollBottom(); focus(); }}
              >↓</ToolBtn>
              <ToolSep />
              <ToolBtn
                title="Toggle fullscreen"
                $pressed={fullscreen}
                onClick={() => setFullscreen(f => !f)}
              >⛶</ToolBtn>
              {/* Spacer pushes rest right */}
              <div style={{ flex: 1 }} />
              {/* Columns × rows label — purely cosmetic, just like real Win95 */}
              <span style={{
                fontSize: 11,
                fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
                color: '#444',
                paddingRight: 2,
                userSelect: 'none',
              }}>
                80 × 25
              </span>
            </Toolbar>

            {/* ── CRT ── */}
            <CRTOuter onClick={focus}>
              <Scanlines />
              <Sweep />
              <Vignette />

              <TerminalScreen>
                <OutputArea ref={outputRef}>
                  {history.map(entry => (
                    <Line key={entry.id} $color={entry.color} $delay={entry.delay}>
                      {entry.text || '\u00A0'}
                    </Line>
                  ))}
                </OutputArea>

                {booted && (
                  <InputRow>
                    <Prompt>C:\WINDOWS&gt;&nbsp;</Prompt>
                    <InputText>{input}</InputText>
                    <CursorBlock />
                    <HiddenInput
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </InputRow>
                )}
              </TerminalScreen>
            </CRTOuter>

            {/* ── STATUS BAR ── */}
            <StatusBar>
              <StatusCell style={{ flex: 1 }}>{booted ? 'READY' : 'LOADING…'}</StatusCell>
              <StatusCell>↑↓ history</StatusCell>
              <StatusCell>80 × 25</StatusCell>
              <StatusCell>NUM</StatusCell>
            </StatusBar>

          </WindowContent>
        </Window>
      </Draggable>
    </>
  );
}