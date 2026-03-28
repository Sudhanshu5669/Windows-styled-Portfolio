"use client";

import React, { useState, useEffect, useRef } from 'react'; // 1. Added useRef
import { Window, WindowContent, WindowHeader, Button } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const TimeDisplay = styled.div`

    @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif.woff2') format('woff2');
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif_bold.woff2') format('woff2');
    font-weight: bold;
  }

  background: #000;
  color: #00ff00;
  padding: 20px;
  font-size: 2.5rem;
  text-align: center;
  border: 2px inset #ffffff;
  text-shadow: 0 0 5px #00ff00;
`;

const DateDisplay = styled.div`
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
`;

interface ClockAppProps {
  onClose: () => void;
}

export default function ClockApp({ onClose }: ClockAppProps) {
  const [time, setTime] = useState(new Date());
  const nodeRef = useRef(null); // 2. Create the ref

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    /* 3. Pass nodeRef to Draggable */
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window 
        ref={nodeRef} // 4. Attach ref to the Window
        style={{ width: '300px', position: 'absolute', top: '20%', left: '30%', zIndex: 100 }}
      >
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>clock.exe</span>
          <Button onClick={onClose}>
            <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>x</span>
          </Button>
        </WindowHeader>
        <WindowContent>
          <TimeDisplay>
            {time.toLocaleTimeString([], { hour12: false })}
          </TimeDisplay>
          <DateDisplay>
            {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </DateDisplay>
        </WindowContent>
      </Window>
    </Draggable>
  );
}