"use client";

import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// ─── Win95 Design Tokens ──────────────────────────────────────────────────────
const W = {
  gray:       '#c0c0c0',
  grayLight:  '#dfdfdf',
  grayDark:   '#808080',
  grayDarker: '#404040',
  black:      '#000000',
  white:      '#ffffff',
  navy:       '#000080',
};

const raised = `
  border-top:    1px solid #ffffff;
  border-left:   1px solid #ffffff;
  border-right:  1px solid #808080;
  border-bottom: 1px solid #808080;
  box-shadow: 1px 1px 0 0 #000000, -1px -1px 0 0 #dfdfdf;
`;
const sunken = `
  border-top:    1px solid #808080;
  border-left:   1px solid #808080;
  border-right:  1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  box-shadow: -1px -1px 0 0 #000000, 1px 1px 0 0 #dfdfdf;
`;

const GlobalStyle = createGlobalStyle`* { box-sizing: border-box; }`;

// ─── Window Shell ─────────────────────────────────────────────────────────────
const WindowShell = styled.div`
  position: absolute;
  top: 18%;
  left: 32%;
  width: 280px;
  z-index: 100;
  background: ${W.gray};
  ${raised}
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  user-select: none;
`;

// ─── Title Bar ────────────────────────────────────────────────────────────────
const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 2px 2px 6px;
  background: ${W.navy};
  color: ${W.white};
  cursor: move;
  font-weight: bold;
  font-size: 11px;
  height: 20px;
  gap: 4px;
`;

const TitleText = styled.span`
  flex: 1;
  font-size: 11px;
  white-space: nowrap;
`;

const TitleButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const TitleBtn = styled.button`
  background: ${W.gray};
  ${raised}
  border: none;
  width: 16px;
  height: 14px;
  padding: 0;
  cursor: pointer;
  font-size: 9px;
  font-weight: bold;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  color: ${W.black};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
  }
`;

// ─── Menu Bar ────────────────────────────────────────────────────────────────
const MenuBar = styled.div`
  display: flex;
  background: ${W.gray};
  padding: 1px 2px;
  border-bottom: 1px solid ${W.grayDark};
`;

const MenuItem = styled.button`
  background: transparent;
  border: none;
  padding: 2px 8px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  cursor: pointer;
  color: ${W.black};
  &:hover { background: ${W.navy}; color: ${W.white}; }
`;

// ─── Body ─────────────────────────────────────────────────────────────────────
const Body = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ─── LCD Display ─────────────────────────────────────────────────────────────
// The classic Win95 clock used a sunken inset panel with green LCD digits
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const LCDPanel = styled.div`
  ${sunken}
  background: #0a0a0a;
  padding: 12px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const LCDTime = styled.div`
  font-family: 'Courier New', 'Lucida Console', monospace;
  font-size: 2.4rem;
  font-weight: bold;
  color: #00dd00;
  text-shadow: 0 0 4px #00aa00;
  letter-spacing: 3px;
  line-height: 1;

  /* The colon blinks every second — classic clock behavior */
  .colon {
    animation: ${blink} 1s step-end infinite;
    display: inline-block;
  }
`;

const LCDDate = styled.div`
  font-family: 'Courier New', 'Lucida Console', monospace;
  font-size: 0.7rem;
  color: #009900;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const LCDAmPm = styled.div`
  font-family: 'Courier New', 'Lucida Console', monospace;
  font-size: 0.65rem;
  color: #007700;
  letter-spacing: 2px;
`;

// ─── Analog Clock ─────────────────────────────────────────────────────────────
// A genuine Win95-style analog clock face using SVG
const ClockFaceWrapper = styled.div`
  ${sunken}
  background: ${W.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;

// ─── Group Box ────────────────────────────────────────────────────────────────
// ─── Group Box ────────────────────────────────────────────────────────────────
const GroupBox = styled.fieldset`
  border-top:    1px solid ${W.grayDark};
  border-left:   1px solid ${W.grayDark};
  border-right:  1px solid ${W.white};
  border-bottom: 1px solid ${W.white};
  box-shadow: -1px -1px 0 0 ${W.black}, 1px 1px 0 0 ${W.grayLight};
  padding: 6px 8px 8px;
  margin: 0;

  legend {
    font-size: 11px;
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
    padding: 0 4px;
    color: ${W.black};
    background: ${W.gray}; /* THE FIX: Masks the line with the classic gray background */
  }
`;

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = styled.div`
  display: flex;
  padding: 1px 4px;
  gap: 4px;
  border-top: 1px solid ${W.grayDark};
`;

const StatusPanel = styled.div`
  ${sunken}
  padding: 1px 4px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  flex: 1;
`;

// ─── Analog Clock SVG ─────────────────────────────────────────────────────────
function AnalogClock({ time }: { time: Date }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 4;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours   = time.getHours() % 12;

  const deg = (val: number, max: number) => (val / max) * 360 - 90;

  const toXY = (angleDeg: number, length: number) => ({
    x: cx + length * Math.cos((angleDeg * Math.PI) / 180),
    y: cy + length * Math.sin((angleDeg * Math.PI) / 180),
  });

  const secAngle = deg(seconds, 60);
  const minAngle = deg(minutes + seconds / 60, 60);
  const hrAngle  = deg(hours + minutes / 60, 12);

  const secPos = toXY(secAngle, r - 6);
  const minPos = toXY(minAngle, r - 10);
  const hrPos  = toXY(hrAngle,  r - 20);

  // Hour tick marks
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 360 - 90;
    const inner = toXY(a, r - 6);
    const outer = toXY(a, r);
    return { inner, outer, major: true };
  });

  // Minute tick marks
  const minTicks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null; // skip hour positions
    const a = (i / 60) * 360 - 90;
    const inner = toXY(a, r - 3);
    const outer = toXY(a, r);
    return { inner, outer };
  }).filter(Boolean);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill={W.white} stroke={W.grayDark} strokeWidth="1" />

      {/* Minute ticks */}
      {minTicks.map((t, i) => (
        <line
          key={i}
          x1={t!.inner.x} y1={t!.inner.y}
          x2={t!.outer.x} y2={t!.outer.y}
          stroke={W.grayDark} strokeWidth="0.5"
        />
      ))}

      {/* Hour ticks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.inner.x} y1={t.inner.y}
          x2={t.outer.x} y2={t.outer.y}
          stroke={W.black} strokeWidth="1.5"
        />
      ))}

      {/* Hour hand */}
      <line
        x1={cx} y1={cy}
        x2={hrPos.x} y2={hrPos.y}
        stroke={W.black} strokeWidth="3" strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={cx} y1={cy}
        x2={minPos.x} y2={minPos.y}
        stroke={W.black} strokeWidth="2" strokeLinecap="round"
      />
      {/* Second hand */}
      <line
        x1={cx} y1={cy}
        x2={secPos.x} y2={secPos.y}
        stroke="#cc0000" strokeWidth="1" strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" fill={W.black} />
      <circle cx={cx} cy={cy} r="1.5" fill="#cc0000" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ClockAppProps { onClose: () => void; }

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClockApp({ onClose }: ClockAppProps) {
  const nodeRef = useRef(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hh  = String(time.getHours()).padStart(2, '0');
  const mm  = String(time.getMinutes()).padStart(2, '0');
  const ss  = String(time.getSeconds()).padStart(2, '0');

  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  }).toUpperCase();

  const tzStr = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".clock-titlebar" bounds="parent">
        <WindowShell ref={nodeRef}>

          {/* ── Title Bar ── */}
          <TitleBar className="clock-titlebar">
            <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>🕐</span>
            <TitleText>clock.exe</TitleText>
            <TitleButtons>
              <TitleBtn title="Minimize">_</TitleBtn>
              <TitleBtn title="Maximize">□</TitleBtn>
              <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
            </TitleButtons>
          </TitleBar>

          {/* ── Menu Bar ── */}
          <MenuBar>
            {['File','Edit','View','Help'].map(m => (
              <MenuItem key={m}>{m}</MenuItem>
            ))}
          </MenuBar>

          {/* ── Body ── */}
          <Body>

            {/* LCD Digital Display */}
            <GroupBox>
              <legend>Digital</legend>
              <LCDPanel>
                <LCDTime>
                  {hh}<span className="colon">:</span>{mm}<span className="colon">:</span>{ss}
                </LCDTime>
                <LCDDate>{dateStr}</LCDDate>
                <LCDAmPm>{tzStr}</LCDAmPm>
              </LCDPanel>
            </GroupBox>

            {/* Analog Clock */}
            <GroupBox>
              <legend>Analog</legend>
              <ClockFaceWrapper>
                <AnalogClock time={time} />
              </ClockFaceWrapper>
            </GroupBox>

          </Body>

          {/* ── Status Bar ── */}
          <StatusBar>
            <StatusPanel>
              {time.toLocaleTimeString([], { hour12: true })} — {tzStr}
            </StatusPanel>
          </StatusBar>

        </WindowShell>
      </Draggable>
    </>
  );
}