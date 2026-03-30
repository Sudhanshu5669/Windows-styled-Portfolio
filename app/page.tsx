"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import Terminal from '@/src/Components/Terminal/Terminal';

// Import the Start Menu Component!
import StartMenu from '@/src/Components/StartMenu/StartMenu';
import Winamp from '@/src/Components/Winamp/Winamp';
import LeetCode from '@/src/Components/Leetcode/Leetcode';
import About from '@/src/Components/About/About';

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
    overflow: hidden; 
    width: 100vw;
    height: 100vh;
    position: fixed; 
  }

  body {
    font-family: 'ms_sans_serif';
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
  grid-template-columns: repeat(auto-fill, 75px);
  grid-template-rows: repeat(auto-fill, 75px);
  grid-auto-flow: column; 
  gap: 5px; 
  padding: 20px;
  height: calc(100vh - 45px); 
  width: 100vw;
  
  /* THE FIX: Pin this to the background so it doesn't push windows down */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0; 
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
  const [themeName, setThemeName] = useState('original');
  const [wallpaper, setWallpaper] = useState('/images/wallpapers/Windows95setup4K.jpg');

  // App States
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isMineOpen, setIsMineOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAmpOpen, setIsAmpOpen] = useState(false)
  const [isLeetOpen, setIsLeetOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  // System States
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  
  const startMenuRef = useRef<HTMLDivElement>(null);

  // Close Start Menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setIsStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Universal launch handler for the Start Menu
  const handleLaunch = (appId: string) => {
    if (appId === 'internet' || appId === 'contacts') setIsContactsOpen(true);
    if (appId === 'terminal') setIsTerminalOpen(true);
    if (appId === 'minesweeper') setIsMineOpen(true);
    if (appId === 'projects') setIsProjectsOpen(true);
    if (appId === 'clock') setIsClockOpen(true);
    if (appId === 'resume') setIsResumeOpen(true);
    if (appId === 'settings') setIsSettingsOpen(true);
    
    setIsStartMenuOpen(false); 
  };

  const handleRestart = () => {
    window.location.reload();
  };

  // Icon Click Handlers
  const closeResume = () => setIsResumeOpen(false);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleContacts = () => setIsContactsOpen(!isContactsOpen);
  const toggleProjects = () => setIsProjectsOpen(!isProjectsOpen);
  const toggleMine = () => setIsMineOpen(!isMineOpen);
  const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen);
  const toggleclock = () => setIsClockOpen(!isClockOpen);
  const toggleResume = () => setIsResumeOpen(!isResumeOpen);
  const toggleAmp = () => setIsAmpOpen(!isAmpOpen)
  const toggleLeet = () => setIsLeetOpen(!isLeetOpen)
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen)
  // THE SHUTDOWN SCREEN
  if (isShutDown) {
    return (
      <ThemeProvider theme={themeMap[themeName]}>
        <GlobalStyles wallpaper="" />
        <div style={{ 
          height: '100vh', width: '100vw', backgroundColor: 'black', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#ff8c00', fontFamily: "'ms_sans_serif', sans-serif", cursor: 'none' 
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>It is now safe to turn off your computer.</h1>
          <p style={{ color: '#ff8c00', opacity: 0.5, cursor: 'pointer', fontSize: '12px' }} onClick={handleRestart}>
            (Click here to reboot)
          </p>
        </div>
      </ThemeProvider>
    );
  }

  // NORMAL DESKTOP
  return (
    <ThemeProvider theme={themeMap[themeName]}>
      <GlobalStyles wallpaper={wallpaper} />
      
      <Desktop onClick={() => setIsStartMenuOpen(false)}>
        {/* ICONS GO HERE */}
        <AppIcon title='resume.pdf' path='/images/Notepad95.svg' onDoubleClick={toggleResume} />
        <AppIcon title='Projects' path='/images/projects.png' onDoubleClick={toggleProjects} />
        <AppIcon title='Clock' path='/images/clock.png' onDoubleClick={toggleclock} />
        <AppIcon title='Settings' path='/images/settings.png' onDoubleClick={toggleSettings} />
        <AppIcon title='Contacts' path='/images/contact.png' onDoubleClick={toggleContacts} />
        <AppIcon title='Minesweeper' path='images/minesweeper.svg' onDoubleClick={toggleMine} />
        <AppIcon title='cmd' path='images/cmd2.png' onDoubleClick={toggleTerminal} />
        <AppIcon title='Winamp' path='images/winamp.png' onDoubleClick={toggleAmp}></AppIcon>
        <AppIcon title='Leetcode' path='images/leetcode.png' onDoubleClick={toggleLeet}></AppIcon>
        <AppIcon title='About.txt' path='images/Notepad95.svg' onDoubleClick={toggleAbout}></AppIcon>
      </Desktop>

      {/* RENDER WINDOWS */}
      {isResumeOpen && (
        <WindowFrame title="resume.exe" pdfPath="/files/resume.pdf" onClose={closeResume}>
          <iframe 
            src="/files/resume.pdf#toolbar=0" 
            width="100%" 
            height="100%" 
            style={{ border: 'none', height: '1000px' }} 
          />
        </WindowFrame>
      )}

      {isProjectsOpen && <Projects onClose={() => setIsProjectsOpen(false)} />}
      {isClockOpen && <ClockApp onClose={() => setIsClockOpen(false)} />}
      {isContactsOpen && <Contacts onClose={() => setIsContactsOpen(false)} />}
      {isMineOpen && <Minesweeper onClose={toggleMine} />}
      {isTerminalOpen && <Terminal onClose={toggleTerminal} />}
      {isAmpOpen && <Winamp onClose={toggleAmp}></Winamp>}
      {isLeetOpen && <LeetCode onClose={toggleLeet}></LeetCode>}
      {isAboutOpen && <About onClose={toggleAbout}></About>}
      
      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          currentTheme={themeName}
          setTheme={setThemeName}
          theme={themeMap}
          currentWallpaper={wallpaper}
          setWallpaper={setWallpaper}
        />
      )}
      
      {/* TASKBAR */}
      <AppBar style={{ position: 'fixed', top: 'auto', bottom: 0, left: 0, padding: '1px', display: 'flex', flexDirection: 'row', width: '100%', zIndex: 9999 }}>
        
        {/* Added display: flex and relative positioning here so the menu anchors correctly */}
        <div ref={startMenuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {isStartMenuOpen && (
            <StartMenu 
              onLaunch={handleLaunch} 
              onShutDown={() => setIsShutDown(true)} 
              onRestart={handleRestart} 
            />
          )}

          <Button
            variant="default"
            size="sm"
            active={isStartMenuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
            style={{ width: '100px', margin: '2px', display: 'flex', gap: '6px', fontWeight: isStartMenuOpen ? 'bold' : 'normal' }}
          >
            <img src="/images/windows95.png" alt="start" width={20} height={20} />
            Start
          </Button>
        </div>

        <div style={{ marginLeft: 'auto' }} />
        <Clock />
      </AppBar>
    </ThemeProvider>
  );
}