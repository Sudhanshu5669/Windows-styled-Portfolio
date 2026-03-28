"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Window, WindowContent, WindowHeader, Button, List, ListItem, Select, Panel, Divider } from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 320px;
  gap: 8px;
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

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 10px;
`;

const Thumbnail = styled.div<{ active: boolean; src: string }>`
  width: 80px;
  height: 60px;
  border: 2px solid ${props => (props.active ? '#000080' : '#808080')};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  outline: ${props => (props.active ? '2px solid white' : 'none')};
  background-color: #000;
  &:hover {
    border-color: white;
  }
`;

interface SettingsProps {
  onClose: () => void;
  currentTheme: string;
  setTheme: (themeName: string) => void;
  theme: Record<string, any>;
  currentWallpaper: string;
  setWallpaper: (path: string) => void;
}

export default function Settings({ 
  onClose, currentTheme, setTheme, theme, currentWallpaper, setWallpaper 
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState('Theme');
  const [wallpapers, setWallpapers] = useState<{name: string, path: string}[]>([]);
  const nodeRef = useRef(null);

  const tabs = ['Theme', 'Wallpapers', 'System', 'Display'];

  // Automatically fetch wallpapers from the server API
  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await fetch('/api/wallpapers');
        const data = await response.json();
        setWallpapers([{ name: 'No wallpaper', path: 'path/to/windows95setup4k.jpg' }, ...data]);
      } catch (err) {
        console.error("Failed to load wallpapers", err);
        setWallpapers([
          { name: 'Classic Teal', path: '' },
          { name: 'Win 95 Setup', path: '/path/to/windows95setup4k.jpg' } // Add your default here
        ]);
      }
    };
    fetchWallpapers();
    setWallpaper('images/wallpapers/Windows95setup4K.jpg');
  }, []);

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
        <WindowContent style={{ padding: '8px' }}>
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
                </div>
              )}

              {activeTab === 'Wallpapers' && (
                <div>
                  <p style={{ fontWeight: 'bold' }}>Desktop Background</p>
                  <Divider />
                  <p style={{ marginTop: '10px', marginBottom: '10px' }}>Select a wallpaper:</p>
                  
                  <WallpaperGrid>
                    {wallpapers.map((wp) => (
                      <div key={wp.path} style={{ textAlign: 'center' }}>
                        <Thumbnail 
                          src={wp.path} 
                          active={currentWallpaper === wp.path}
                          onClick={() => setWallpaper(wp.path)}
                        />
                        <p style={{ 
                          fontSize: '10px', 
                          marginTop: '4px', 
                          maxWidth: '80px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {wp.name}
                        </p>
                      </div>
                    ))}
                  </WallpaperGrid>
                </div>
              )}
            </ContentContainer>
          </SettingsWrapper>
        </WindowContent>
      </Window>
    </Draggable>
  );
}