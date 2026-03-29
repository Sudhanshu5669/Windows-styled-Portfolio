"use client";

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import styled, { createGlobalStyle } from 'styled-components';

// ─── Win95 Design Tokens ──────────────────────────────────────────────────────
const W = {
  gray:       '#c0c0c0',
  grayLight:  '#dfdfdf',
  grayDark:   '#808080',
  grayDarker: '#404040',
  black:      '#000000',
  white:      '#ffffff',
  navy:       '#000080',
  highlight:  '#000080',
  highlightFg:'#ffffff',
};

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

const GlobalStyle = createGlobalStyle`* { box-sizing: border-box; }`;

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
  height: 20px;
  gap: 4px;
  flex-shrink: 0;
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
  flex-shrink: 0;

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
  }
`;

// ─── Menu / Toolbar ───────────────────────────────────────────────────────────
const MenuBar = styled.div`
  display: flex;
  background: ${W.gray};
  padding: 1px 2px;
  border-bottom: 1px solid ${W.grayDark};
  gap: 0;
  flex-shrink: 0;
`;

const MenuItem = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: none;
  padding: 2px 8px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  cursor: ${p => p.disabled ? 'default' : 'pointer'};
  color: ${p => p.disabled ? W.grayDark : W.black};
  text-shadow: ${p => p.disabled ? `1px 1px 0 ${W.white}` : 'none'};

  &:hover:not(:disabled) {
    background: ${W.highlight};
    color: ${W.white};
  }
`;

// --- Window Shell ---
const WindowShell = styled.div`
  position: absolute;
  width: 480px; /* Made it slightly wider for better PDF reading */
  max-height: 85vh; /* THE FIX: Stops the window from growing off the screen */
  z-index: 100;
  background: ${W.gray};
  ${raised}
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  user-select: none;
  display: flex;
  flex-direction: column;
`;

// ... keep TitleBar, TitleText, etc. exactly the same ...

// --- Scrollable Content ---
const ScrollBody = styled.div`
  flex: 1;
  min-height: 0; /* THE FIX: Forces Flexbox to respect the parent's max-height and trigger scrolling */
  overflow-y: auto;
  overflow-x: hidden;
  background: ${W.white};
  ${sunken}
  margin: 6px;

  /* Win95-style scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${W.gray} ${W.grayLight};

  &::-webkit-scrollbar       { width: 16px; }
  &::-webkit-scrollbar-track { background: ${W.grayLight}; ${sunken} }
  &::-webkit-scrollbar-thumb { background: ${W.gray}; ${raised} }
`;

const ContentPad = styled.div`
  padding: 12px 14px;
`;

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 4px;
  gap: 4px;
  border-top: 1px solid ${W.grayDark};
  flex-shrink: 0;
`;

const StatusPanel = styled.div`
  ${sunken}
  padding: 1px 4px;
  font-size: 11px;
  flex: 1;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
`;

// ─── Footer ───────────────────────────────────────────────────────────────────
const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px 6px 6px;
  gap: 4px;
  flex-shrink: 0;
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
  gap: 4px;

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
    padding-top: 3px;
    padding-left: 13px;
  }

  &:disabled {
    color: ${W.grayDark};
    text-shadow: 1px 1px 0 ${W.white};
    cursor: default;
  }
`;

// ─── Props ────────────────────────────────────────────────────────────────────
interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  pdfPath?: string;
  defaultPosition?: { top: string; left: string };
}

// ─── Component ────────────────────────────────────────────────────────────────
const WindowFrame = ({ title, children, onClose, pdfPath, defaultPosition }: WindowFrameProps) => {
  const nodeRef = useRef(null);

  const handleSave = () => {
    if (!pdfPath) return;
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${title.split('.')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".wf-titlebar" bounds="parent">
        <WindowShell
          ref={nodeRef}
          style={{
            top:  defaultPosition?.top  ?? '10%',
            left: defaultPosition?.left ?? '25%',
          }}
        >
          {/* ── Title Bar ── */}
          <TitleBar className="wf-titlebar">
            <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>📄</span>
            <TitleText>{title}</TitleText>
            <TitleButtons>
              <TitleBtn title="Minimize">_</TitleBtn>
              <TitleBtn title="Maximize">□</TitleBtn>
              <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
            </TitleButtons>
          </TitleBar>

          {/* ── Menu Bar ── */}
          <MenuBar>
            <MenuItem>File</MenuItem>
            <MenuItem>Edit</MenuItem>
            <MenuItem>View</MenuItem>
            <MenuItem onClick={handleSave} disabled={!pdfPath}>
              Save
            </MenuItem>
            <MenuItem>Help</MenuItem>
          </MenuBar>

          {/* ── Scrollable Content ── */}
          <ScrollBody>
            <ContentPad>
              {children}
            </ContentPad>
          </ScrollBody>

          {/* ── Status Bar ── */}
          <StatusBar>
            <StatusPanel>
              {pdfPath ? `📄 ${title}` : 'Ready'}
            </StatusPanel>
          </StatusBar>

          {/* ── Footer Buttons ── */}
          <FooterRow>
            {pdfPath && (
              <Win95Btn onClick={handleSave}>
                💾 Save
              </Win95Btn>
            )}
            <Win95Btn onClick={onClose}>Close</Win95Btn>
          </FooterRow>

        </WindowShell>
      </Draggable>
    </>
  );
};

export default WindowFrame;