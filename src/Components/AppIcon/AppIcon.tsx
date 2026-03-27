"use client";

import React, { useRef } from 'react'; // 1. Import useRef
import Draggable from 'react-draggable';

interface AppIconProps {
  title: string;
  path: string;
}

const AppIcon = ({ title, path }: AppIconProps) => {
  // 2. Create a ref
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef} // 3. Pass the ref to Draggable
      bounds="parent"
      grid={[4, 4]}
    >
      {/* 4. Attach the ref to the outer div */}
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
        <img
          src={path}
          alt={title}
          width={32}
          height={32}
          draggable={false} // Prevent default browser image dragging
        />
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