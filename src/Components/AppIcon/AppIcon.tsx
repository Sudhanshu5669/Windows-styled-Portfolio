"use client";

import React, { useRef } from 'react'; // 1. Import useRef
import Draggable from 'react-draggable';

interface AppIconProps {
  title: string;
  path: string;
}

// Inside AppIcon.tsx
const AppIcon = ({ title, path, onDoubleClick }: AppIconProps & { onDoubleClick?: () => void }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}>
      <div 
        ref={nodeRef} 
        className="container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '80px',
          cursor: 'pointer' 
        }}
      >
        <img src={path} alt={title} width={32} height={32} draggable={false} />
        <span style={{ 
          fontSize: '12px', 
          marginTop: '4px', 
          textAlign: 'center',
          userSelect: 'none' // Prevents text highlighting while dragging
        }}>
          {title}
        </span>
      </div>
    </Draggable>
  );
};

export default AppIcon;