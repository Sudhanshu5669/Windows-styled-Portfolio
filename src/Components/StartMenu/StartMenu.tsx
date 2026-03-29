"use client";

import React, { useState } from 'react';
import { MenuList, MenuListItem, Separator } from 'react95';
import styled from 'styled-components';

// --- Styled Components ---

const StartMenuWrapper = styled.div`
  position: absolute;
  /* Changed to 100% so it perfectly aligns to the top of the taskbar */
  bottom: 100%; 
  left: 0;
  z-index: 10000;
  display: flex;
  border: 2px solid;
  border-color: #dfdfdf #000000 #000000 #dfdfdf;
  background: #c0c0c0;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  font-family: 'ms_sans_serif', sans-serif;
`;

const StartBanner = styled.div`
  background: linear-gradient(to bottom, #000080, #1084d0);
  width: 35px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  
  span {
    color: white;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 1px;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
`;

const SubMenuWrapper = styled.div`
  position: absolute;
  left: 100%;
  top: -2px;
  z-index: 10001;
`;

// A helper style to keep our list items cleanly aligned
const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 20px;
  line-height: 1; /* Prevents emojis from stretching the container height */
`;

// --- Interfaces ---

interface StartMenuProps {
  onLaunch: (appId: string) => void;
  onShutDown: () => void;
  onRestart: () => void;
}

export default function StartMenu({ onLaunch, onShutDown, onRestart }: StartMenuProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  return (
    <StartMenuWrapper>
      <StartBanner>
        <span><strong>Portfolio</strong> 95</span>
      </StartBanner>
      
      <MenuList style={{ border: 'none', boxShadow: 'none', padding: '2px', minWidth: '220px' }} onClick={(e: any) => e.stopPropagation()}>
        
        {/* --- PROGRAMS EXPANDABLE MENU --- */}
        <div 
          onMouseEnter={() => setActiveSubMenu('programs')} 
          onMouseLeave={() => setActiveSubMenu(null)}
          style={{ position: 'relative' }}
        >
          <MenuListItem onClick={(e) => e.preventDefault()}>
            <MenuItemContent>
              <MenuIcon>📁</MenuIcon>
              {/* Wrapping text in a span prevents flexbox from breaking it apart */}
              <span><u>P</u>rograms</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
            </MenuItemContent>
          </MenuListItem>
          
          {activeSubMenu === 'programs' && (
            <SubMenuWrapper>
              <MenuList style={{ border: '2px solid', borderColor: '#dfdfdf #000000 #000000 #dfdfdf', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', minWidth: '180px' }}>
                <MenuListItem onClick={() => onLaunch('internet')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>🌍</MenuIcon><span>Internet Explorer</span></MenuItemContent>
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('terminal')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>💻</MenuIcon><span>MS-DOS Prompt</span></MenuItemContent>
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('minesweeper')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>💣</MenuIcon><span>Minesweeper</span></MenuItemContent>
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('projects')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>📂</MenuIcon><span>Projects</span></MenuItemContent>
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('clock')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>🕰️</MenuIcon><span>Clock</span></MenuItemContent>
                </MenuListItem>
              </MenuList>
            </SubMenuWrapper>
          )}
        </div>

        {/* --- DOCUMENTS EXPANDABLE MENU --- */}
        <div 
          onMouseEnter={() => setActiveSubMenu('documents')} 
          onMouseLeave={() => setActiveSubMenu(null)}
          style={{ position: 'relative' }}
        >
          <MenuListItem onClick={(e) => e.preventDefault()}>
            <MenuItemContent>
              <MenuIcon>📄</MenuIcon>
              <span><u>D</u>ocuments</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
            </MenuItemContent>
          </MenuListItem>
          
          {activeSubMenu === 'documents' && (
            <SubMenuWrapper>
              <MenuList style={{ border: '2px solid', borderColor: '#dfdfdf #000000 #000000 #dfdfdf', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', minWidth: '150px' }}>
                <MenuListItem onClick={() => onLaunch('resume')}>
                  <MenuItemContent><MenuIcon style={{ fontSize: '16px', marginRight: '8px' }}>📝</MenuIcon><span>resume.pdf</span></MenuItemContent>
                </MenuListItem>
              </MenuList>
            </SubMenuWrapper>
          )}
        </div>
        
        <MenuListItem onClick={() => onLaunch('settings')}>
          <MenuItemContent>
            <MenuIcon>⚙️</MenuIcon>
            <span><u>S</u>ettings</span>
          </MenuItemContent>
        </MenuListItem>

        <Separator />

        {/* --- SYSTEM POWER CONTROLS --- */}
        <MenuListItem onClick={onRestart}>
          <MenuItemContent>
            <MenuIcon>🔄</MenuIcon>
            <span><u>R</u>estart...</span>
          </MenuItemContent>
        </MenuListItem>

        <MenuListItem onClick={onShutDown}>
          <MenuItemContent>
            <MenuIcon>🔌</MenuIcon>
            <span>Sh<u>u</u>t Down...</span>
          </MenuItemContent>
        </MenuListItem>

      </MenuList>
    </StartMenuWrapper>
  );
}