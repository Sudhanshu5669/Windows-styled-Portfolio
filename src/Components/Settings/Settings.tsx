"use client";

import React, { useState, useRef } from 'react';
import { Window, WindowContent, WindowHeader, Button, List, ListItem, Divider, Select } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 300px;
`;

const Sidebar = styled.div`
  width: 120px;
  margin-right: 10px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 10px;
  background: ${({ theme }: any) => theme.canvas};
  border: 2px inset ${({ theme }: any) => theme.borderLightest};
`;

interface SettingsProps {
  onClose: () => void;
  currentTheme: string;
  setTheme: (themeName: string) => void;
}

export default function Settings({ onClose, currentTheme, setTheme }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('Theme');
  const nodeRef = useRef(null);

  // Add more tabs here in the future
  const tabs = ['Theme', 'Wallpapers', 'System', 'Display'];

  const themeOptions = [
    { value: 'original', label: 'Windows 95' },
    { value: 'tokyoDark', label: 'Tokyo Dark' },
    { value: 'matrix', label: 'The Matrix' },
    { value: 'rainyDay', label: 'Rainy Day' }
  ];

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: '450px', position: 'absolute', top: '15%', left: '20%', zIndex: 110 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>settings.exe</span>
          <Button onClick={onClose}>
            <span style={{ fontWeight: 'bold' }}>x</span>
          </Button>
        </WindowHeader>
        <WindowContent>
          <SettingsWrapper>
            <Sidebar>
              <List style={{ width: '100%', height: '100%' }}>
  {tabs.map((tab) => (
    <ListItem
      key={tab}
      onClick={() => setActiveTab(tab)}
      style={{
        /* Manually apply the selection highlight */
        backgroundColor: activeTab === tab ? '#000080' : 'transparent',
        color: activeTab === tab ? 'white' : 'inherit',
        cursor: 'pointer'
      }}
    >
      {tab}
    </ListItem>
  ))}
</List>
            </Sidebar>

            <MainContent>
              {activeTab === 'Theme' && (
                <div>
                  <p style={{ marginBottom: '10px' }}>Select System Theme:</p>
                  <Select
                    defaultValue={currentTheme}
                    options={themeOptions}
                    onChange={(value: any) => setTheme(value.value)}
                    width="100%"
                  />
                </div>
              )}

              {activeTab === 'Wallpapers' && (
                <div>
                  <p>Wallpaper settings coming soon...</p>
                </div>
              )}
              
              {/* Future tabs go here */}
            </MainContent>
          </SettingsWrapper>
        </WindowContent>
      </Window>
    </Draggable>
  );
}