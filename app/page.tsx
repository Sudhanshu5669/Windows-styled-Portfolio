"use client";

import React, { useState } from 'react';
import { AppBar, Button, styleReset, Window } from 'react95';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Image from 'next/image';

import original from 'react95/dist/themes/original';
import ash from 'react95/dist/themes/ash';
import candy from 'react95/dist/themes/candy';
import cherry from 'react95/dist/themes/cherry';
import coldGray from 'react95/dist/themes/coldGray';
import lilac from 'react95/dist/themes/lilac';
import maple from 'react95/dist/themes/maple';
import marine from 'react95/dist/themes/marine';
import matrix from 'react95/dist/themes/matrix';
import modernDark from 'react95/dist/themes/modernDark';
import molecule from 'react95/dist/themes/molecule';
import ninjaTurtles from 'react95/dist/themes/ninjaTurtles';
import olive from 'react95/dist/themes/olive';
import plum from 'react95/dist/themes/plum';
import polarized from 'react95/dist/themes/polarized';
import powerShell from 'react95/dist/themes/powerShell';
import rainyDay from 'react95/dist/themes/rainyDay';
import raspberry from 'react95/dist/themes/raspberry';
import rose from 'react95/dist/themes/rose';
import slate from 'react95/dist/themes/slate';
import solarizedDark from 'react95/dist/themes/solarizedDark';
import solarizedLight from 'react95/dist/themes/solarizedLight';
import spruce from 'react95/dist/themes/spruce';
import tokyoDark from 'react95/dist/themes/tokyoDark';
import travel from 'react95/dist/themes/travel';
import vaporTeal from 'react95/dist/themes/vaporTeal';
import vermillion from 'react95/dist/themes/vermillion';
import violetDark from 'react95/dist/themes/violetDark';
import water from 'react95/dist/themes/water';

import AppIcon from '@/src/Components/AppIcon/AppIcon';
import Draggable from 'react-draggable';
import WindowFrame from '@/src/Components/WindowFrame/WindowFrame';
import Projects from '@/src/Components/Projects/Projects';
import Clock from '@/src/Components/Clock/Clock';
import ClockApp from '@/src/Components/ClockApp/ClockApp';
import Settings from '@/src/Components/Settings/Settings';
import Contacts from '@/src/Components/Contacts/Contacts';
import Minesweeper from '@/src/Components/Minesweeper/Minesweeper';

const GlobalStyles = createGlobalStyle<{ wallpaper: string }>`
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
    /* This makes the wallpaper dynamic */
    background-image: url(${props => props.wallpaper});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100vw;
    transition: background-image 0.2s ease-in-out;
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
  original, ash, candy,
  cherry, coldGray,
  lilac, maple, marine, matrix, modernDark, molecule,
  ninjaTurtles, olive, plum, polarized, powerShell, rainyDay,
  raspberry, rose, slate, solarizedDark, solarizedLight, spruce,
  tokyoDark, travel, vaporTeal, vermillion, violetDark, water
};


export default function App() {
  const [themeName, setThemeName] = useState('tokyoDark');
  const [wallpaper, setWallpaper] = useState('/images/wallpapers/Windows95setup4K.jpg');

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const [isMineOpen, setIsMineOpen] = useState(false)

  const toggleResume = () => setIsResumeOpen(!isResumeOpen);
  const closeResume = () => setIsResumeOpen(false);
  const toggleclock = () => setIsClockOpen(!isClockOpen)
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)
  const toggleContacts = () => setIsContactsOpen(!isContactsOpen)
  const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);
  const toggleMine = () => setIsMineOpen(!isMineOpen)
  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <GlobalStyles wallpaper={wallpaper} />
      {/* ICONS GO HERE */}
      <AppIcon
        title='resume.pdf'
        path='/images/text.png'
        onDoubleClick={toggleResume}
      />

      {/* You can add more icons easily now; they will auto-align */}
      <AppIcon title='Projects' path='/images/projects.png' onDoubleClick={toggleProjects} />
      <AppIcon title='Clock' path='/images/clock.png' onDoubleClick={toggleclock} />
      <AppIcon title='Settings' path='/images/settings.png' onDoubleClick={toggleSettings}></AppIcon>
      <AppIcon title='Contacts' path='/images/contact.png' onDoubleClick={toggleContacts}></AppIcon>
      <AppIcon title='Minesweeper' path='images/minesweeper.svg' onDoubleClick={toggleMine}></AppIcon>



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

      {isClockOpen && <ClockApp onClose={() => setIsClockOpen(false)}></ClockApp>}
      {isSettingsOpen && <Settings
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={themeName}
        setTheme={setThemeName}
        theme={themeMap}
        currentWallpaper={wallpaper}
        setWallpaper={setWallpaper}
        ></Settings>}
        {isContactsOpen && <Contacts onClose={() => setIsContactsOpen(false)}></Contacts>

        }
        {isMineOpen && <Minesweeper onClose={toggleMine}></Minesweeper>}
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
        <Clock />
      </AppBar>
    </ThemeProvider>
  );
}