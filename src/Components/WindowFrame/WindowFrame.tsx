"use client";

import React, { useRef } from 'react';
import { Button, Toolbar, Window, WindowContent, WindowHeader } from 'react95';
import styled from 'styled-components';
import Draggable from 'react-draggable';

// 1. ALWAYS DEFINE STYLED COMPONENTS AT THE TOP
const StyledWindow = styled(Window)`
  width: 400px;
  height: 500px;
  position: absolute;
  display: flex;
  flex-direction: column;

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    cursor: grab;
  }

  .window-content {
    flex: 1;
    padding: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    
    /* HIDE SCROLLBARS */
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .content-padding {
    padding: 1.5rem;
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
`;

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  pdfPath?: string; 
}

// 2. NOW DEFINE THE MAIN COMPONENT
const WindowFrame = ({ title, children, onClose, pdfPath }: WindowFrameProps) => {
  const nodeRef = useRef(null);

  const handleSave = () => {
    if (!pdfPath) return;

    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${title.split('.')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header">
      <div ref={nodeRef} style={{ position: 'absolute' }}>
        {/* StyledWindow is now defined above, so this will work */}
        <StyledWindow>
          <WindowHeader className='window-header'>
            <span>{title}</span>
            <Button onClick={onClose}>
              <span className='close-icon' />
            </Button>
          </WindowHeader>

          <Toolbar>
            <Button variant='menu' size='sm'>File</Button>
            <Button variant='menu' size='sm'>Edit</Button>
            <Button 
              variant='menu' 
              size='sm' 
              onClick={handleSave}
              disabled={!pdfPath}
            >
              Save
            </Button>
          </Toolbar>

          <WindowContent className="window-content">
            <div className="content-padding">
              {children}
            </div>
          </WindowContent>
        </StyledWindow>
      </div>
    </Draggable>
  );
};

export default WindowFrame;