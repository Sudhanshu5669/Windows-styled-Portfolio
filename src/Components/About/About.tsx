"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Window, WindowContent, WindowHeader, Button } from 'react95';
import Draggable from 'react-draggable';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ─────────────────────────────────────────
// FONT
// ─────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
`;

// ─────────────────────────────────────────
// CONTENT — edit freely
// ─────────────────────────────────────────
const PARAGRAPHS = [
  {
    heading: "Hey, I'm Sudhanshu.",
    body: `I'm a full-stack developer who genuinely enjoys
     the craft, not just shipping features, 
but understanding why something works and making it work better. I built this portfolio because I 
wanted a space that felt like me: a little retro, a little obsessive about detail, and impossible 
to mistake for a template.`,
  },
  {
    heading: "Beyond the IDE.",
    body: `I make music in my free time, mostly lo-fi, Trap and Drill under the alias SYNTHXX. I also write novels when i am bored; long-form fiction 
    where I get to unfold my imagination. My latest novel is "The Shadow Of Elysium" with over 3K views across it's platform. Though ofcourse, my favourite
    part of the day is always creating something out of lines of code.`,
  },
  {
    heading: "Why this portfolio exists.",
    body: `This isn't actually the first portfolio i ever made. I tried a lot of times before this, looked at so many people's portfolios and didn't want
    mine to just be a replica of everyone else's. I wanted to make something unique, something that lets me be creative. So, this is what my current portfolio
    looks like. Who knows, i might just change this to something else in the future again.`,
  },
];

// ─────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─────────────────────────────────────────
// WIN95 NOTEPAD CHROME
// ─────────────────────────────────────────

// Toolbar — identical bevel to the DOS terminal toolbar
const Toolbar = styled.div`
  background: #c0c0c0;
  border-bottom: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 6px;
  user-select: none;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  font-size: 11px;
`;

const ToolMenu = styled.button`
  background: transparent;
  border: none;
  padding: 2px 6px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  cursor: pointer;
  color: #000;

  &:hover {
    background: #000080;
    color: #fff;
  }
  &:focus { outline: 1px dotted #000; }
`;

// Status bar at bottom
const StatusBar = styled.div`
  background: #c0c0c0;
  border-top: 1px solid #808080;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 3px;
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
// PAPER AREA — mimics Notepad's white text area
// ─────────────────────────────────────────
const PaperWrap = styled.div`
  /* Inset bevel — classic sunken well */
  border-top:    2px solid #808080;
  border-left:   2px solid #808080;
  border-right:  2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  background: #ffffff;
  overflow-y: auto;
  /* Lined paper effect */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 23px,
    #dbe9f9 23px,
    #dbe9f9 24px
  );
  /* Line height must match the stripe height */
  padding: 8px 14px 12px 52px; /* left pad for the red margin line */
  position: relative;
  height: 360px;
  cursor: text;

  /* Retro scrollbar */
  &::-webkit-scrollbar { width: 16px; }
  &::-webkit-scrollbar-track {
    background: #dfdfdf;
    border-left: 1px solid #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px solid #000;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
  }

  /* Red margin rule */
  &::before {
    content: '';
    position: absolute;
    left: 42px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #ff9999;
    pointer-events: none;
  }
`;

// Line numbers in the left gutter
const LineNumbers = styled.div`
  position: absolute;
  left: 0;
  top: 8px;
  width: 38px;
  text-align: right;
  padding-right: 6px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #b0b0b0;
  line-height: 24px;
  user-select: none;
  pointer-events: none;
`;

// ─────────────────────────────────────────
// TEXT CONTENT
// ─────────────────────────────────────────
const Section = styled.div<{ $delay: number }>`
  margin-bottom: 20px;
  animation: ${fadeSlide} 0.4s ease both;
  animation-delay: ${p => p.$delay}ms;
`;

const Heading = styled.h2`
  font-family: 'Special Elite', 'Courier New', monospace;
  font-size: 15px;
  font-weight: bold;
  color: #000080;
  margin: 0 0 6px;
  letter-spacing: 0.3px;
  line-height: 24px; /* match ruled line height */
  /* Underline that sits on a ruled line */
  border-bottom: 1px solid #000080;
  padding-bottom: 0;
  display: inline-block;
`;

const Paragraph = styled.p`
  font-family: 'Special Elite', 'Courier New', monospace;
  font-size: 13px;
  color: #1a1a1a;
  line-height: 24px; /* exactly one ruled line */
  margin: 0;
  white-space: pre-line;
`;

// Blinking cursor after the last word
const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #000;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: ${blink} 1s step-end infinite;
`;

// ─────────────────────────────────────────
// DECORATIVE STICKY NOTE in the margin
// ─────────────────────────────────────────
const StickyNote = styled.div`
  position: absolute;
  right: 24px;
  top: 18px;
  width: 88px;
  background: #ffff99;
  border: 1px solid #c8c800;
  box-shadow: 2px 2px 0 #b0b000;
  padding: 5px 6px;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  color: #444;
  line-height: 1.5;
  transform: rotate(2.5deg);
  z-index: 2;
  user-select: none;
`;

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
interface AboutProps { onClose: () => void; }

export default function About({ onClose }: AboutProps) {
  const nodeRef  = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Compute word / line count from content
  useEffect(() => {
    const allText = PARAGRAPHS.map(p => `${p.heading} ${p.body}`).join(' ');
    const words   = allText.trim().split(/\s+/).length;
    setWordCount(words);

    // Rough line count: each paragraph body split by newlines + heading
    const lines = PARAGRAPHS.reduce((acc, p) => {
      return acc + p.body.split('\n').length + 2; // +2 for heading + gap
    }, 0);
    setLineCount(lines);
  }, []);

  // Generate line numbers up to some max
  const MAX_LINES = 40;

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".about-drag" bounds="parent">
        <Window
          ref={nodeRef}
          style={{
            width: 580,
            position: 'absolute',
            top: '6%',
            left: '10%',
            zIndex: 108,
          }}
        >
          {/* ── TITLE BAR ── */}
          <WindowHeader
            className="about-drag"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: 14 }}>📝</span>
            <span style={{ flex: 1, fontSize: 12, fontFamily: 'MS Sans Serif, Tahoma, sans-serif' }}>
              readme.txt — Notepad
            </span>
            <Button size="sm" style={{ minWidth: 18, height: 18, fontSize: 11, fontWeight: 'bold', padding: 0 }}>_</Button>
            <Button size="sm" style={{ minWidth: 18, height: 18, fontSize: 10, padding: 0 }}>□</Button>
            <Button size="sm" onClick={onClose} style={{ minWidth: 18, height: 18, fontSize: 11, fontWeight: 'bold', padding: 0 }}>✕</Button>
          </WindowHeader>

          <WindowContent style={{ padding: 0 }}>

            {/* ── MENU BAR (non-functional, cosmetic) ── */}
            <Toolbar>
              {['File', 'Edit', 'Search', 'Help'].map(label => (
                <ToolMenu key={label}>{label}</ToolMenu>
              ))}
            </Toolbar>

            {/* ── PAPER ── */}
            <div style={{ position: 'relative' }}>
              <PaperWrap ref={paperRef}>

                {/* Line numbers in gutter */}
                <LineNumbers>
                  {Array.from({ length: MAX_LINES }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </LineNumbers>

                {/* Sticky note */}
                <StickyNote>
                  ★ tip:<br />
                  scroll down<br />
                  for more!
                </StickyNote>

                {/* Content */}
                {PARAGRAPHS.map((section, i) => (
                  <Section key={i} $delay={i * 120}>
                    <Heading>{section.heading}</Heading>
                    <Paragraph>
                      {section.body}
                      {/* Blinking cursor only after the very last paragraph */}
                      {i === PARAGRAPHS.length - 1 && <Cursor />}
                    </Paragraph>
                  </Section>
                ))}

              </PaperWrap>
            </div>

            {/* ── STATUS BAR ── */}
            <StatusBar>
              <StatusCell style={{ flex: 1 }}>readme.txt</StatusCell>
              <StatusCell>{wordCount} words</StatusCell>
              <StatusCell>Ln {lineCount}</StatusCell>
              <StatusCell>ANSI</StatusCell>
            </StatusBar>

          </WindowContent>
        </Window>
      </Draggable>
    </>
  );
}