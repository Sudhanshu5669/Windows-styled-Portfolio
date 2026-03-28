"use client";

import React, { useState } from 'react';
import { AppBar, Button, styleReset, Window } from 'react95';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Image from 'next/image';

import original from 'react95/dist/themes/original';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import matrix from 'react95/dist/themes/matrix';
import rainyDay from 'react95/dist/themes/rainyDay';

import AppIcon from '@/src/Components/AppIcon/AppIcon';
import Draggable from 'react-draggable';
import WindowFrame from '@/src/Components/WindowFrame/WindowFrame';
import Projects from '@/src/Components/Projects/Projects';
import Clock from '@/src/Components/Clock/Clock';
import ClockApp from '@/src/Components/ClockApp/ClockApp';
import Settings from '@/src/Components/Settings/Settings';

const GlobalStyles = createGlobalStyle`
  ${styleReset}

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif.woff2') format('woff2');
  }

  @font-face {
    font-family: 'ms_sans_serif';
    src: url('/fonts/ms_sans_serif_bold.woff2') format('woff2');
    font-weight: bold;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Prevents scrolling on the whole page */
    width: 100vw;
    height: 100vh;
    position: fixed; /* Extra insurance against mobile rubber-banding */
  }

  body {
    font-family: 'ms_sans_serif';
    background-color: rgb(3,129,128);
    /* Use a fixed height to ensure it fits the viewport exactly */
    height: 100vh;
    width: 100vw;
  }
`;

const Desktop = styled.div`
  display: grid;
  /* Adjust 100px to fit your AppIcon size preference */
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(auto-fill, 100px);
  
  /* The "Secret Sauce": stacks items top-to-bottom first */
  grid-auto-flow: column; 
  
  gap: 10px;
  padding: 20px;
  
  /* Ensure it doesn't go behind the fixed AppBar */
  height: calc(100vh - 45px); 
  width: 100vw;

  position: relative;
  z-index: -1;
`;

const themeMap: Record<string, any> = {
  original,
  tokyoDark,
  matrix,
  rainyDay
};

// ... keep your imports and GlobalStyles the same

export default function App() {
  const [themeName, setThemeName] = useState('tokyoDark');

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const toggleResume = () => setIsResumeOpen(!isResumeOpen);
  const closeResume = () => setIsResumeOpen(false);
  const toggleclock = () => setIsClockOpen(!isClockOpen)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)

  const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);
  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <GlobalStyles />
        {/* ICONS GO HERE */}
        <AppIcon 
          title='resume.pdf' 
          path='/images/text.png' 
          onDoubleClick={toggleResume} 
        />
        
        {/* You can add more icons easily now; they will auto-align */}
        <AppIcon title='Projects' path='/images/projects.png' onDoubleClick={toggleProjects} />
        <AppIcon title='Clock' path='/images/clock.png' onDoubleClick={toggleclock}/>
        <AppIcon title='Settings' path='/images/settings.png' onDoubleClick={toggleSettings}></AppIcon>
        


      {/* 4. Only show WindowFrame if isResumeOpen is true */}
      {isResumeOpen && (
        <WindowFrame 
          title="resume.exe" 
          pdfPath="/files/resume.pdf"
          onClose={closeResume} // 5. Pass the close function
        >
          <iframe
            src="/files/resume.pdf#toolbar=0"
            width="100%"
            height="100%"
            style={{ border: 'none', height: '1000px' }} 
          />
        </WindowFrame>
      )}


{isProjectsOpen && <Projects onClose={() => setIsProjectsOpen(false)} />}

  {isClockOpen && <ClockApp onClose={()=> setIsClockOpen(false)}></ClockApp>}
{isSettingsOpen && <Settings 
onClose={()=> setIsSettingsOpen(false)}
currentTheme={themeName}
          setTheme={setThemeName}></Settings>}
      <AppBar 
        style={{
          position: 'fixed',
          top: 'auto',
          bottom: 0,
          left: 0,
          // ----------------------------
          padding: '1px',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Button
          variant="default"
          size="sm"
          style={{
            width: '100px',
            margin: '2px',
            display: 'flex',
            gap: '6px'
          }}
        >
          <img
            src="/images/windows95.png"
            alt="start"
            width={32}
            height={32}
          />
          Start
        </Button>

        <div style={{ marginLeft: 'auto' }} />
        <Clock/>
      </AppBar>
    </ThemeProvider>
  );
}