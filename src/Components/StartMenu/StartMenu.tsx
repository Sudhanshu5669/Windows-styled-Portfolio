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
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ marginRight: '12px', fontSize: '20px' }}>📁</span>
              <u>P</u>rograms
              <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
            </div>
          </MenuListItem>
          
          {activeSubMenu === 'programs' && (
            <SubMenuWrapper>
              <MenuList style={{ border: '2px solid', borderColor: '#dfdfdf #000000 #000000 #dfdfdf', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', minWidth: '180px' }}>
                <MenuListItem onClick={() => onLaunch('internet')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>🌍</span> Internet Explorer
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('terminal')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>💻</span> MS-DOS Prompt
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('minesweeper')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>💣</span> Minesweeper
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('projects')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>📂</span> Projects
                </MenuListItem>
                <MenuListItem onClick={() => onLaunch('clock')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>🕰️</span> Clock
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
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ marginRight: '12px', fontSize: '20px' }}>📄</span>
              <u>D</u>ocuments
              <span style={{ marginLeft: 'auto', fontSize: '10px' }}>▶</span>
            </div>
          </MenuListItem>
          
          {activeSubMenu === 'documents' && (
            <SubMenuWrapper>
              <MenuList style={{ border: '2px solid', borderColor: '#dfdfdf #000000 #000000 #dfdfdf', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)', minWidth: '150px' }}>
                <MenuListItem onClick={() => onLaunch('resume')}>
                  <span style={{ marginRight: '8px', fontSize: '16px' }}>📝</span> resume.pdf
                </MenuListItem>
              </MenuList>
            </SubMenuWrapper>
          )}
        </div>
        
        <MenuListItem onClick={() => onLaunch('settings')}>
          <span style={{ marginRight: '12px', fontSize: '20px' }}>⚙️</span>
          <u>S</u>ettings
        </MenuListItem>

        <Separator />

        {/* --- SYSTEM POWER CONTROLS --- */}
        <MenuListItem onClick={onRestart}>
          <span style={{ marginRight: '12px', fontSize: '20px' }}>🔄</span>
          <u>R</u>estart...
        </MenuListItem>

        <MenuListItem onClick={onShutDown}>
          <span style={{ marginRight: '12px', fontSize: '20px' }}>🔌</span>
          Sh<u>u</u>t Down...
        </MenuListItem>

      </MenuList>
    </StartMenuWrapper>
  );
}