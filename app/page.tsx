"use client";

import React from 'react';
import { AppBar, Button, styleReset, Window } from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Image from 'next/image';

import original from 'react95/dist/themes/original';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import AppIcon from '@/src/Components/AppIcon/AppIcon';
import Draggable from 'react-draggable';
import WindowFrame from '@/src/Components/WindowFrame/WindowFrame';

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
    height: 100vh;
  }
`;

// ... keep your imports and GlobalStyles the same

export default function App() {
  return (
    <ThemeProvider theme={tokyoDark}>
      <GlobalStyles />

<AppIcon title='resume.pdf' path='images/text.png'></AppIcon>

  <WindowFrame 
  title="resume.exe" 
  pdfPath="/files/resume.pdf" // This points to public/resume.pdf
>
  <iframe
    src="/files/resume.pdf#toolbar=0"
    width="100%"
    height="100%"
    style={{ border: 'none', height: '1000px' }} // Give it height to scroll
  />
</WindowFrame>


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