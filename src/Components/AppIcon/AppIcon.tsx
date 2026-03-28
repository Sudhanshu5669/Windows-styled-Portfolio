"use client";

import React, { useRef } from 'react';
import Draggable from 'react-draggable';

interface AppIconProps {
  title: string;
  path: string;
  onDoubleClick?: () => void;
}

const AppIcon = ({ title, path, onDoubleClick }: AppIconProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable 
      nodeRef={nodeRef} 
      bounds="parent"
      // This helps separate "clicks" from "drags"
      onMouseDown={(e) => e.stopPropagation()} 
    >
      <div 
        ref={nodeRef} 
        onDoubleClick={onDoubleClick}
        className="app-icon-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '80px',
          cursor: 'pointer',
          marginTop: '10px',
          marginLeft: '6px',
          padding: '4px',
          zIndex: 10 // Ensure icons are above the background
        }}
      >
        <img 
          src={path} 
          alt={title} 
          width={32} 
          height={32} 
          draggable={false} 
          style={{ 
            pointerEvents: 'none', // Prevents the image from stealing the click
            marginBottom: '4px' 
          }} 
        />
        <span style={{ 
          fontSize: '12px', 
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none', // Prevents the text from stealing the click
          color: 'white',
          textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
          display: 'block',
          width: '100%'
        }}>
          {title}
        </span>
      </div>
    </Draggable>
  );
};

export default AppIcon;