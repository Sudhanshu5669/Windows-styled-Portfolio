"use client";

import React, { useState, useRef } from 'react';
import { Window, WindowContent, WindowHeader, Button, List, ListItem, Select, Panel, Divider } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 320px; /* Slightly taller for better proportions */
  gap: 8px;      /* Gap between sidebar and content */
`;

const SidebarContainer = styled(Panel)`
  width: 130px;
  background: ${({ theme }: any) => theme.canvas};
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled(Panel)`
  flex: 1;
  padding: 16px;
  background: ${({ theme }: any) => theme.canvas};
  overflow-y: auto;
`;

interface SettingsProps {
  onClose: () => void;
  currentTheme: string;
  setTheme: (themeName: string) => void;
  theme: Record<string, any>;
}

export default function Settings({ onClose, currentTheme, setTheme, theme }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('Theme');
  const nodeRef = useRef(null);

  const tabs = ['Theme', 'Wallpapers', 'System', 'Display'];

  /* Inside Settings.tsx */

// Generate options dynamically from the keys of your themeMap
const themeOptions = Object.keys(theme).map(key => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1') 
}));

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: '500px', position: 'absolute', top: '15%', left: '20%', zIndex: 110 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>settings.exe</span>
          <Button onClick={onClose}>
            <span style={{ fontWeight: 'bold' }}>x</span>
          </Button>
        </WindowHeader>
        <WindowContent style={{ padding: '8px' }}> {/* Reduced padding for a tighter fit */}
          <SettingsWrapper>
            
            <SidebarContainer variant="well">
              <List style={{ width: '100%', border: 'none', boxShadow: 'none', background: 'transparent' }}>
                {tabs.map((tab) => (
                  <ListItem
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      backgroundColor: activeTab === tab ? '#000080' : 'transparent',
                      color: activeTab === tab ? 'white' : 'inherit',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '8px 10px'
                    }}
                  >
                    {tab}
                  </ListItem>
                ))}
              </List>
            </SidebarContainer>

            <ContentContainer variant="well">
              {activeTab === 'Theme' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontWeight: 'bold' }}>Appearance Settings</p>
                  <Divider />
                  <div>
                    <p style={{ marginBottom: '8px' }}>Select System Theme:</p>
                    <Select
                      defaultValue={currentTheme}
                      options={themeOptions}
                      onChange={(value: any) => setTheme(value.value)}
                      width="100%"
                    />
                  </div>
                  <p style={{ fontSize: '12px', marginTop: '20px', color: '#808080' }}>
                    Changes will apply immediately to all system windows.
                  </p>
                </div>
              )}

              {activeTab === 'Wallpapers' && (
                <div>
                   <p style={{ fontWeight: 'bold' }}>Desktop Background</p>
                   <Divider />
                   <p style={{ marginTop: '10px' }}>Wallpaper settings coming soon...</p>
                </div>
              )}
            </ContentContainer>

          </SettingsWrapper>
        </WindowContent>
      </Window>
    </Draggable>
  );
}