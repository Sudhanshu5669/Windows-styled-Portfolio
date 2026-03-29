"use client";

import React, { useRef, useState } from 'react';
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

// ─── Window Shell ─────────────────────────────────────────────────────────────
const WindowShell = styled.div`
  position: absolute;
  top: 12%;
  left: 12%;
  width: 580px;
  z-index: 100;
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
  height: 20px;
  gap: 4px;
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

// ─── Menu / Toolbar ───────────────────────────────────────────────────────────
const MenuBar = styled.div`
  display: flex;
  background: ${W.gray};
  padding: 1px 2px;
  border-bottom: 1px solid ${W.grayDark};
`;

const MenuItem = styled.button`
  background: transparent;
  border: none;
  padding: 2px 8px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  cursor: pointer;
  color: ${W.black};

  &:hover {
    background: ${W.highlight};
    color: ${W.white};
  }
`;

// ─── Toolbar ─────────────────────────────────────────────────────────────────
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 2px;
  background: ${W.gray};
  border-bottom: 1px solid ${W.grayDark};
`;

const ToolSeparator = styled.div`
  width: 1px;
  height: 22px;
  background: ${W.grayDark};
  box-shadow: 1px 0 0 ${W.white};
  margin: 0 2px;
`;

const ToolBtn = styled.button`
  background: ${W.gray};
  ${raised}
  border: none;
  height: 22px;
  padding: 1px 8px;
  cursor: pointer;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  display: flex;
  align-items: center;
  gap: 3px;

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
  }
`;

// ─── Path Bar ────────────────────────────────────────────────────────────────
const PathBar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  background: ${W.gray};
  border-bottom: 1px solid ${W.grayDark};
  gap: 4px;
  font-size: 11px;
`;

const PathInput = styled.div`
  ${sunken}
  flex: 1;
  height: 20px;
  background: ${W.white};
  padding: 1px 4px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  display: flex;
  align-items: center;
`;

// ─── Content ─────────────────────────────────────────────────────────────────
const ContentArea = styled.div`
  padding: 6px;
  background: ${W.gray};
`;

// ─── Win95 Table ─────────────────────────────────────────────────────────────
const TableWrapper = styled.div`
  ${sunken}
  background: ${W.white};
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
`;

const THead = styled.thead``;

const THeadRow = styled.tr`
  background: ${W.gray};
`;

const TH = styled.th`
  ${raised}
  padding: 3px 8px;
  text-align: left;
  font-weight: bold;
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;

  &:hover {
    background: ${W.grayLight};
  }

  &:active {
    border-top:    1px solid #808080;
    border-left:   1px solid #808080;
    border-right:  1px solid #ffffff;
    border-bottom: 1px solid #ffffff;
    box-shadow: none;
  }
`;

const TBody = styled.tbody``;

const TR = styled.tr<{ selected?: boolean }>`
  background: ${p => p.selected ? W.highlight : W.white};
  color:      ${p => p.selected ? W.white     : W.black};

  &:hover {
    background: ${p => p.selected ? W.highlight : '#e0e8ff'};
  }
`;

const TD = styled.td`
  padding: 3px 8px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  vertical-align: middle;
`;

// ─── Tech Badge ──────────────────────────────────────────────────────────────
const TechBadge = styled.span`
  display: inline-block;
  padding: 1px 5px;
  margin: 1px 2px 1px 0;
  font-size: 10px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-weight: bold;
  background: ${W.gray};
  border-top:    1px solid #808080;
  border-left:   1px solid #808080;
  border-right:  1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  color: ${W.black};
`;

// ─── Open Link ───────────────────────────────────────────────────────────────
const LinkBtn = styled.button`
  background: transparent;
  border: none;
  color: #0000ee;
  text-decoration: underline;
  cursor: pointer;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  padding: 0;

  &:hover { color: #551a8b; }
`;

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 4px;
  gap: 4px;
  border-top: 1px solid ${W.grayDark};
`;

const StatusPanel = styled.div`
  ${sunken}
  padding: 1px 4px;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  flex: 1;
`;

const StatusPanelFixed = styled(StatusPanel)`
  flex: none;
  min-width: 100px;
  text-align: center;
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const projectsData = [
  {
    name: 'DocChat RAG',
    stack: ['Langchain', 'Express.js', 'React'],
    url: 'https://docqna.sudhanshucodes.me/',
    icon: '📄',
    type: 'Web App',
  },
  {
    name: 'Termi-Chat',
    stack: ['Socket.io'],
    url: 'https://github.com/Sudhanshu5669/Termi-Chat',
    icon: '👾',
    type: 'CLI Tool',
  },
  {
    name: 'Mind Space',
    stack: ['Node', 'Docker', 'Python'],
    url: 'https://github.com/Sudhanshu5669/Mind-Space',
    icon: '🧠',
    type: 'Application',
  },
  {
    name: 'Windows Portfolio',
    stack: ['Next.js', 'React', 'TypeScript'],
    url: 'https://github.com/Sudhanshu5669/Windows-styled-Portfolio',
    icon: '🪟',
    type: 'Portfolio',
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProjectsProps { onClose: () => void; }

// ─── Component ────────────────────────────────────────────────────────────────
const Projects = ({ onClose }: ProjectsProps) => {
  const nodeRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [status, setStatus]           = useState(`${projectsData.length} object(s)`);

  const handleRowClick = (name: string, url: string) => {
    setSelectedRow(name);
    setStatus(url);
  };

  const handleRowDblClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".proj-titlebar" bounds="parent">
        <WindowShell ref={nodeRef}>

          {/* ── Title Bar ── */}
          <TitleBar className="proj-titlebar">
            <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>📁</span>
            <TitleText>My_Projects.exe — File Manager</TitleText>
            <TitleButtons>
              <TitleBtn title="Minimize">_</TitleBtn>
              <TitleBtn title="Maximize">□</TitleBtn>
              <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
            </TitleButtons>
          </TitleBar>

          {/* ── Menu Bar ── */}
          <MenuBar>
            {['File','Edit','View','Sort','Help'].map(m => (
              <MenuItem key={m}>{m}</MenuItem>
            ))}
          </MenuBar>

          {/* ── Toolbar ── */}
          <Toolbar>
            <ToolBtn>◀ Back</ToolBtn>
            <ToolBtn>Forward ▶</ToolBtn>
            <ToolBtn>↑ Up</ToolBtn>
            <ToolSeparator />
            <ToolBtn onClick={() => window.open('https://github.com/Sudhanshu5669','_blank')}>
              🌐 GitHub Profile
            </ToolBtn>
            <ToolSeparator />
            <ToolBtn>📋 Details</ToolBtn>
            <ToolBtn>🔲 Icons</ToolBtn>
          </Toolbar>

          {/* ── Path / Address Bar ── */}
          <PathBar>
            <span>Address</span>
            <PathInput>C:\Users\Sudhanshu\Projects</PathInput>
            <ToolBtn>Go</ToolBtn>
          </PathBar>

          {/* ── Table ── */}
          <ContentArea>
            <TableWrapper>
              <StyledTable>
                <THead>
                  <THeadRow>
                    <TH style={{ width: 36 }}>  </TH>
                    <TH>Name</TH>
                    <TH>Type</TH>
                    <TH>Dependencies</TH>
                    <TH style={{ width: 60 }}>Link</TH>
                  </THeadRow>
                </THead>
                <TBody>
                  {projectsData.map(p => (
                    <TR
                      key={p.name}
                      selected={selectedRow === p.name}
                      onClick={() => handleRowClick(p.name, p.url)}
                      onDoubleClick={() => handleRowDblClick(p.url)}
                    >
                      <TD style={{ textAlign: 'center', fontSize: 16 }}>{p.icon}</TD>
                      <TD style={{ fontWeight: 'bold' }}>{p.name}</TD>
                      <TD style={{ color: selectedRow === p.name ? W.white : W.grayDarker }}>{p.type}</TD>
                      <TD>
                        {p.stack.map(s => (
                          <TechBadge key={s}
                            style={selectedRow === p.name
                              ? { background: '#1a1a80', color: W.white, borderColor: '#3333aa' }
                              : {}
                            }
                          >{s}</TechBadge>
                        ))}
                      </TD>
                      <TD>
                        <LinkBtn
                          onClick={e => { e.stopPropagation(); window.open(p.url,'_blank'); }}
                          style={selectedRow === p.name ? { color: '#aaccff' } : {}}
                        >
                          Open ↗
                        </LinkBtn>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </StyledTable>
            </TableWrapper>
          </ContentArea>

          {/* ── Status Bar ── */}
          <StatusBar>
            <StatusPanel>{status}</StatusPanel>
            <StatusPanelFixed>{projectsData.length} object(s)</StatusPanelFixed>
          </StatusBar>

        </WindowShell>
      </Draggable>
    </>
  );
};

export default Projects;