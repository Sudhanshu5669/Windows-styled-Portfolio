"use client";

import React, { useRef } from 'react';
import { Button, Frame, Toolbar, Window, WindowContent, WindowHeader } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const StyledWindow = styled(Window)`
  width: 400px;
  min-height: 200px;
  position: absolute;

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
  }

  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    transform: rotateZ(45deg);
    position: relative;
    &:before, &:after {
      content: '';
      position: absolute;
      background: ${({ theme }: { theme: any }) => theme.materialText};
    }
    &:before { height: 100%; width: 3px; left: 50%; transform: translateX(-50%); }
    &:after { height: 3px; width: 100%; left: 0px; top: 50%; transform: translateY(-50%); }
  }

  .footer {
    display: block;
    margin: 0.25rem;
    height: 31px;
    line-height: 31px;
    padding-left: 0.25rem;
  }
`;

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  footerText?: string;
  onClose?: () => void;
}

const WindowFrame = ({ title, children, footerText, onClose }: WindowFrameProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header">
      <StyledWindow ref={nodeRef} resizable>
        {/* 1. The Blue Title Bar */}
        <WindowHeader className='window-header'>
          <span>{title}</span>
          <Button onClick={onClose}>
            <span className='close-icon' />
          </Button>
        </WindowHeader>

        {/* 2. The Menu Bar */}
        <Toolbar>
          <Button variant='menu' size='sm'>File</Button>
          <Button variant='menu' size='sm'>Edit</Button>
          <Button variant='menu' size='sm' disabled>Save</Button>
        </Toolbar>

        {/* 3. The Main Content Area */}
        <WindowContent style={{ padding: '1.5rem' }}>
          {children}
        </WindowContent>
      </StyledWindow>
    </Draggable>
  );
};

export default WindowFrame;