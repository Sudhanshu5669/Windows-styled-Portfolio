"use client";

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled, { createGlobalStyle } from 'styled-components';

// ─── Win95 Design Tokens ──────────────────────────────────────────────────────
const W = {
  gray:        '#c0c0c0',
  grayLight:   '#dfdfdf',
  grayDark:    '#808080',
  grayDarker:  '#404040',
  black:       '#000000',
  white:       '#ffffff',
  navy:        '#000080',
  highlight:   '#000080',
  highlightFg: '#ffffff',
};

// ─── Border Mixins ────────────────────────────────────────────────────────────
const raised = `
  border-top:    1px solid #ffffff;
  border-left:   1px solid #ffffff;
  border-right:  1px solid #808080;
  border-bottom: 1px solid #808080;
  box-shadow: 1px 1px 0 0 #000000, -1px -1px 0 0 #dfdfdf;
`;
const sunken = `
  border-top:    1px solid #808080;
  border-left:   1px solid #808080;
  border-right:  1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  box-shadow: -1px -1px 0 0 #000000, 1px 1px 0 0 #dfdfdf;
`;

// ─── Global Font ──────────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
`;

// ─── Window Shell ─────────────────────────────────────────────────────────────
const WindowShell = styled.div`
  position: absolute;
  top: 12%;
  left: 18%;
  width: 520px;
  z-index: 110;
  background: ${W.gray};
  ${raised}
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  user-select: none;
`;

// ─── Title Bar ────────────────────────────────────────────────────────────────
const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 2px 2px 6px;
  background: ${W.navy};
  color: ${W.white};
  cursor: move;
  font-weight: bold;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  gap: 4px;
  height: 20px;
`;

const TitleText = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
`;

const TitleButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const TitleBtn = styled.button`
  background: ${W.gray};
  ${raised}
  border: none;
  width: 16px;
  height: 14px;
  padding: 0;
  cursor: pointer;
  font-size: 9px;
  font-weight: bold;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  color: ${W.black};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
  }
`;

// ─── Window Body ──────────────────────────────────────────────────────────────
const WindowBody = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ─── Content Row ─────────────────────────────────────────────────────────────
const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  height: 340px;
`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = styled.div`
  width: 128px;
  flex-shrink: 0;
  ${sunken}
  background: ${W.white};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  background: ${p => p.active ? W.highlight : 'transparent'};
  color: ${p => p.active ? W.white : W.black};
  white-space: nowrap;

  &:hover {
    background: ${p => p.active ? W.highlight : W.grayLight};
  }
`;

// ─── Content Panel ────────────────────────────────────────────────────────────
const ContentPanel = styled.div`
  flex: 1;
  ${sunken}
  background: ${W.white};
  overflow-y: auto;
  padding: 10px 12px;
`;

// ─── Section Heading ─────────────────────────────────────────────────────────
const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 11px;
  margin-bottom: 6px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
`;

const Win95Hr = () => (
  <div style={{
    borderTop:    `1px solid ${W.grayDark}`,
    borderBottom: `1px solid ${W.white}`,
    margin: '6px 0',
  }} />
);

// ─── Group Box ────────────────────────────────────────────────────────────────
// Classic Win95 "group box" with a label embedded in the top border
// ─── Group Box ────────────────────────────────────────────────────────────────
// Classic Win95 "group box" with a label embedded in the top border
const GroupBox = styled.fieldset`
  border-top:    1px solid ${W.grayDark};
  border-left:   1px solid ${W.grayDark};
  border-right:  1px solid ${W.white};
  border-bottom: 1px solid ${W.white};
  box-shadow: -1px -1px 0 0 ${W.black}, 1px 1px 0 0 ${W.grayLight};
  padding: 8px 10px 10px;
  margin: 10px 0 0;

  legend {
    font-size: 11px;
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
    padding: 0 4px;
    color: ${W.black};
    background: ${W.white}; /* THE FIX: Masks the border/shadow line behind the text */
  }
`;

// ─── Win95 Select ─────────────────────────────────────────────────────────────
const Win95Select = styled.select`
  height: 21px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  padding: 1px 2px;
  background: ${W.white};
  color: ${W.black};
  ${sunken}
  border: none;
  width: 100%;
  outline: none;
  cursor: pointer;
  appearance: auto;
`;

// ─── Wallpaper Thumbnail ──────────────────────────────────────────────────────
const Thumbnail = styled.div<{ active: boolean; src: string }>`
  width: 76px;
  height: 56px;
  background-image: ${p => p.src ? `url(${p.src})` : 'none'};
  background-color: ${W.grayDark};
  background-size: cover;
  background-position: center;
  cursor: pointer;
  outline: none;

  /* Active: navy border with white inner ring = classic Win95 selection */
  border: ${p => p.active
    ? `2px solid ${W.navy}`
    : `1px solid ${W.grayDark}`};
  box-shadow: ${p => p.active ? `0 0 0 1px ${W.white} inset` : 'none'};

  &:hover {
    border: 2px solid ${W.black};
  }
`;

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 8px;
`;

const WallpaperLabel = styled.p`
  font-size: 10px;
  margin: 3px 0 0;
  max-width: 76px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  color: ${W.black};
`;

// ─── Footer Button Row ────────────────────────────────────────────────────────
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding-top: 2px;
`;

const Win95Btn = styled.button`
  background: ${W.gray};
  ${raised}
  border: none;
  height: 22px;
  padding: 1px 12px;
  min-width: 70px;
  cursor: pointer;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    border-top:    1px solid ${W.grayDark};
    border-left:   1px solid ${W.grayDark};
    border-right:  1px solid ${W.white};
    border-bottom: 1px solid ${W.white};
    box-shadow: none;
    padding-top: 3px;
    padding-left: 13px;
  }
`;

// ─── Radio / Checkbox row ─────────────────────────────────────────────────────
const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  cursor: pointer;
  margin-bottom: 6px;

  input[type="radio"],
  input[type="checkbox"] {
    accent-color: ${W.navy};
    cursor: pointer;
  }
`;

// ─── "Inset" display preview box ─────────────────────────────────────────────
const PreviewBox = styled.div`
  ${sunken}
  background: ${W.navy};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${W.white};
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SettingsProps {
  onClose: () => void;
  currentTheme: string;
  setTheme: (t: string) => void;
  theme: Record<string, any>;
  currentWallpaper: string;
  setWallpaper: (p: string) => void;
}

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'Theme',      icon: '🎨', label: 'Theme'      },
  { id: 'Wallpapers', icon: '🖼️', label: 'Wallpapers' },
  { id: 'System',     icon: '⚙️', label: 'System'     },
  { id: 'Display',    icon: '🖥️', label: 'Display'    },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings({
  onClose, currentTheme, setTheme, theme, currentWallpaper, setWallpaper,
}: SettingsProps) {
  const nodeRef = useRef(null);
  const [activeTab, setActiveTab]     = useState('Theme');
  const [wallpapers, setWallpapers]   = useState<{ name: string; path: string }[]>([]);
  const [resolution, setResolution]   = useState('800x600');
  const [colorDepth, setColorDepth]   = useState('256 Colors');
  const [soundOn, setSoundOn]         = useState(true);
  const [animationsOn, setAnimations] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const res = await fetch('/api/wallpapers');
        const data = await res.json();
        setWallpapers([{ name: 'No Wallpaper', path: '' }, ...data]);
      } catch {
        setWallpapers([
          { name: 'No Wallpaper',   path: '' },
          { name: 'Classic Teal',   path: 'images/wallpapers/Windows95setup4K.jpg' },
        ]);
      }
    };
    fetchWallpapers();
    setWallpaper('images/wallpapers/Windows95setup4K.jpg');
  }, []);

  const themeOptions = Object.keys(theme);

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".settings-titlebar" bounds="parent">
        <WindowShell ref={nodeRef}>

          {/* ── Title Bar ── */}
          <TitleBar className="settings-titlebar">
            <span style={{ fontSize: 13, lineHeight: 1 }}>⚙️</span>
            <TitleText>Display Properties</TitleText>
            <TitleButtons>
              <TitleBtn title="Minimize">_</TitleBtn>
              <TitleBtn title="Maximize">□</TitleBtn>
              <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
            </TitleButtons>
          </TitleBar>

          {/* ── Window Body ── */}
          <WindowBody>

            <ContentRow>

              {/* ── Sidebar ── */}
              <Sidebar>
                {TABS.map(t => (
                  <SidebarItem
                    key={t.id}
                    active={activeTab === t.id}
                    onClick={() => setActiveTab(t.id)}
                  >
                    <span style={{ fontSize: 12 }}>{t.icon}</span>
                    {t.label}
                  </SidebarItem>
                ))}
              </Sidebar>

              {/* ── Content Panel ── */}
              <ContentPanel>

                {/* ══ THEME TAB ══ */}
                {activeTab === 'Theme' && (
                  <div>
                    <SectionTitle>Appearance Settings</SectionTitle>
                    <Win95Hr />

                    <GroupBox>
                      <legend>Color Scheme</legend>
                      <p style={{ fontSize: 11, marginBottom: 6, fontFamily: "'MS Sans Serif', sans-serif" }}>
                        Select a system theme:
                      </p>
                      <Win95Select
                        value={currentTheme}
                        onChange={e => setTheme(e.target.value)}
                      >
                        {themeOptions.map(k => (
                          <option key={k} value={k}>
                            {k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')}
                          </option>
                        ))}
                      </Win95Select>
                    </GroupBox>

                    <GroupBox style={{ marginTop: 10 }}>
                      <legend>Preview</legend>
                      <PreviewBox>
                        <div style={{
                          background: W.gray,
                          border: `2px solid ${W.white}`,
                          padding: '4px 10px',
                          fontSize: 11,
                          fontFamily: "'MS Sans Serif', sans-serif",
                          color: W.black,
                          boxShadow: `1px 1px 0 ${W.black}`,
                        }}>
                          Sample Window
                        </div>
                      </PreviewBox>
                    </GroupBox>
                  </div>
                )}

                {/* ══ WALLPAPERS TAB ══ */}
                {activeTab === 'Wallpapers' && (
                  <div>
                    <SectionTitle>Desktop Background</SectionTitle>
                    <Win95Hr />
                    <p style={{ fontSize: 11, marginTop: 4, fontFamily: "'MS Sans Serif', sans-serif" }}>
                      Select a wallpaper:
                    </p>
                    <WallpaperGrid>
                      {wallpapers.map(wp => (
                        <div key={wp.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Thumbnail
                            src={wp.path}
                            active={currentWallpaper === wp.path}
                            onClick={() => setWallpaper(wp.path)}
                          />
                          <WallpaperLabel title={wp.name}>{wp.name}</WallpaperLabel>
                        </div>
                      ))}
                    </WallpaperGrid>
                  </div>
                )}

                {/* ══ SYSTEM TAB ══ */}
                {activeTab === 'System' && (
                  <div>
                    <SectionTitle>System Preferences</SectionTitle>
                    <Win95Hr />

                    <GroupBox>
                      <legend>Sounds</legend>
                      <OptionRow>
                        <input
                          type="checkbox"
                          checked={soundOn}
                          onChange={e => setSoundOn(e.target.checked)}
                        />
                        Enable system sounds
                      </OptionRow>
                      <OptionRow>
                        <input
                          type="checkbox"
                          checked={animationsOn}
                          onChange={e => setAnimations(e.target.checked)}
                        />
                        Enable window animations
                      </OptionRow>
                    </GroupBox>

                    <GroupBox style={{ marginTop: 10 }}>
                      <legend>System Info</legend>
                      <table style={{
                        width: '100%',
                        fontSize: 11,
                        fontFamily: "'MS Sans Serif', sans-serif",
                        borderCollapse: 'collapse',
                      }}>
                        <tbody>
                          {[
                            ['OS',       'Windows 95 (Portfolio Ed.)'],
                            ['Version',  '4.00.950'],
                            ['Memory',   '16 MB RAM'],
                            ['Processor','Intel 486 DX2'],
                          ].map(([label, val]) => (
                            <tr key={label}>
                              <td style={{ padding: '2px 0', color: W.grayDarker, width: 80 }}>{label}:</td>
                              <td style={{ padding: '2px 0' }}>{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </GroupBox>
                  </div>
                )}

                {/* ══ DISPLAY TAB ══ */}
                {activeTab === 'Display' && (
                  <div>
                    <SectionTitle>Display Settings</SectionTitle>
                    <Win95Hr />

                    <GroupBox>
                      <legend>Screen Resolution</legend>
                      {['640x480','800x600','1024x768','1280x1024'].map(r => (
                        <OptionRow key={r}>
                          <input
                            type="radio"
                            name="resolution"
                            checked={resolution === r}
                            onChange={() => setResolution(r)}
                          />
                          {r}
                        </OptionRow>
                      ))}
                    </GroupBox>

                    <GroupBox style={{ marginTop: 10 }}>
                      <legend>Color Palette</legend>
                      <Win95Select
                        value={colorDepth}
                        onChange={e => setColorDepth(e.target.value)}
                      >
                        {['16 Colors','256 Colors','High Color (16-bit)','True Color (32-bit)'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Win95Select>
                    </GroupBox>
                  </div>
                )}

              </ContentPanel>
            </ContentRow>

            {/* ── Footer Buttons ── */}
            <ButtonRow>
              <Win95Btn onClick={onClose}>OK</Win95Btn>
              <Win95Btn onClick={onClose}>Cancel</Win95Btn>
              <Win95Btn>Apply</Win95Btn>
            </ButtonRow>

          </WindowBody>
        </WindowShell>
      </Draggable>
    </>
  );
}