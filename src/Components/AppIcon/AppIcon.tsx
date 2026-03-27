"use client";

import React from 'react';

interface AppIconProps {
  title: string;
  path: string; // The image source path
}

const AppIcon = ({ title, path }: AppIconProps) => {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
      <img
        src={path}      // Use the 'path' prop here
        alt={title}     // Use the 'title' prop for accessibility
        width={32}
        height={32}
      />
      <span style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
        {title}         {/* Use the 'title' prop here */}
      </span>
    </div>
  );
};

export default AppIcon;