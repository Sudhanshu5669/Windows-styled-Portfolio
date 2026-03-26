"use client";

import React from 'react';
import { AppBar, Button, MenuList, MenuListItem, Separator, styleReset } from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import original from 'react95/dist/themes/original';
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
    background-image: url('/images/background.jpg');
    background-size: cover;        /* fills screen */
    background-position: center;   /* centers image */
    background-repeat: no-repeat;  /* no tiling */
    height: 100vh;
  }
`;

export default function App() {
  return (
    <ThemeProvider theme={tokyoDark}>
      <GlobalStyles />
      <AppBar>
        <Button primary size='sm' style={{ width: '100px' }}>Start</Button>
      </AppBar>
    </ThemeProvider>
  );
}