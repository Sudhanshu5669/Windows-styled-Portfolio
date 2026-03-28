"use client";

import React, { useState } from 'react';
import { AppBar, Button, styleReset, Window } from 'react95';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Image from 'next/image';

import original from 'react95/dist/themes/original';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import AppIcon from '@/src/Components/AppIcon/AppIcon';
import Draggable from 'react-draggable';
import WindowFrame from '@/src/Components/WindowFrame/WindowFrame';
import Projects from '@/src/Components/Projects/Projects';

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

  body {
    font-family: 'ms_sans_serif';
    background-color: rgb(3,129,128);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100vh;
    height: 100vh;
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

// ... keep your imports and GlobalStyles the same

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const toggleResume = () => setIsResumeOpen(!isResumeOpen);
  const closeResume = () => setIsResumeOpen(false);

  const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);
  return (
    <ThemeProvider theme={tokyoDark}>
      <GlobalStyles />
        {/* ICONS GO HERE */}
        <AppIcon 
          title='resume.pdf' 
          path='/images/text.png' 
          onDoubleClick={toggleResume} 
        />
        
        {/* You can add more icons easily now; they will auto-align */}
        <AppIcon title='Projects' path='/images/projects.png' onDoubleClick={toggleProjects} />
        <AppIcon title='Clock' path='/images/clock.png' />
        <AppIcon title='Settings' path='/images/settings.png'></AppIcon>


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

        <Button
          variant="flat"
          size="sm"
          style={{ 
            width: '100px',
            margin: '2px',
            display: 'flex',
            paddingTop: '2px'
          }}
        >
          7:00 PM
        </Button>
      </AppBar>
    </ThemeProvider>
  );
}