"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Panel } from 'react95';

const StyledClock = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 28px;
  margin: 2px;
  font-size: 0.9rem;
  font-weight: bold;
  min-width: 80px;
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // Updates every second, though usually displayed as HH:mm

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toUpperCase();
  };

  return (
    <StyledClock variant='well'>
      {formatTime(time)}
    </StyledClock>
  );
};

export default Clock;