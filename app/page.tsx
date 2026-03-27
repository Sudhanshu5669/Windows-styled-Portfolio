"use client";

import React from 'react';
import { AppBar, Button, styleReset } from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Image from 'next/image';

import tokyoDark from 'react95/dist/themes/tokyoDark';

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

export default function App() {
  return (
    <ThemeProvider theme={tokyoDark}>
      <GlobalStyles />
      <AppBar style={{
    padding: '1px',
    display: 'flex',
    flexDirection: 'row',
  }}>
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
    style={{ width: '100px',
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