"use client";

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// ─── Win95 Design Tokens ──────────────────────────────────────────────────────
const W = {
  gray:        '#c0c0c0',
  grayLight:   '#dfdfdf',
  grayDark:    '#808080',
  grayDarker:  '#404040',
  black:       '#000000',
  white:       '#ffffff',
  navy:        '#000080',
  teal:        '#008080',
  highlight:   '#000080', // selected item bg
  highlightFg: '#ffffff',
  desktop:     '#008080', // classic teal desktop
  titleActive: '#000080',
  titleInactive:'#808080',
  link:        '#0000ee',
  visited:     '#551a8b',
};

// ─── Authentic Win95 border mixins ────────────────────────────────────────────
// raised: top/left = white, bottom/right = dark → looks "sticking out"
// sunken: top/left = dark, bottom/right = white → looks "pushed in"
const raised = `
  border-top:    1px solid ${W.white};
  border-left:   1px solid ${W.white};
  border-right:  1px solid ${W.grayDark};
  border-bottom: 1px solid ${W.grayDark};
  box-shadow: 1px 1px 0 0 ${W.black}, -1px -1px 0 0 ${W.grayLight};
`;
const sunken = `
  border-top:    1px solid ${W.grayDark};
  border-left:   1px solid ${W.grayDark};
  border-right:  1px solid ${W.white};
  border-bottom: 1px solid ${W.white};
  box-shadow: -1px -1px 0 0 ${W.black}, 1px 1px 0 0 ${W.grayLight};
`;
const flat = `
  border: 1px solid ${W.grayDark};
`;

// ─── Global Win95 Font ────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  
  * { box-sizing: border-box; }
  
  .w95-font {
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
    font-size: 11px;
  }
`;

// ─── Window Shell ─────────────────────────────────────────────────────────────
const WindowShell = styled.div`
  position: absolute;
  top: 8%;
  left: 10%;
  width: 680px;
  z-index: 100;
  background: ${W.gray};
  ${raised}
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  user-select: none;
`;

const TitleBar = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 2px 2px 4px;
  background: ${p => p.active !== false ? W.navy : W.grayDark};
  color: ${W.white};
  cursor: move;
  font-weight: bold;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  gap: 4px;
  height: 20px;
`;

const TitleIcon = styled.span`
  font-size: 14px;
  line-height: 1;
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
  flex-shrink: 0;
`;

const Win95Btn = styled.button<{ small?: boolean; active?: boolean }>`
  background: ${W.gray};
  ${raised}
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${W.black};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p => p.small ? `
    width: 16px;
    height: 14px;
    font-size: 10px;
    font-weight: bold;
  ` : `
    height: 22px;
    padding: 2px 8px;
    min-width: 60px;
  `}

  &:active {
    border-top:    1px solid ${W.grayDark};
    border-left:   1px solid ${W.grayDark};
    border-right:  1px solid ${W.white};
    border-bottom: 1px solid ${W.white};
    box-shadow: none;
    padding-top: 3px;
    padding-left: 9px;
  }

  &:disabled {
    color: ${W.grayDark};
    text-shadow: 1px 1px 0 ${W.white};
    cursor: default;
  }
`;

// ─── Menu Bar ─────────────────────────────────────────────────────────────────
const MenuBar = styled.div`
  display: flex;
  background: ${W.gray};
  padding: 1px 2px;
  border-bottom: 1px solid ${W.grayDark};
  gap: 0;
`;

const MenuItem = styled.span`
  padding: 2px 6px;
  cursor: default;
  font-size: 11px;
  &:hover {
    background: ${W.highlight};
    color: ${W.white};
  }
`;

// ─── Toolbar ──────────────────────────────────────────────────────────────────
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 2px;
  background: ${W.gray};
  border-bottom: 1px solid ${W.grayDark};
  flex-wrap: wrap;
`;

const ToolSeparator = styled.div`
  width: 1px;
  height: 22px;
  background: ${W.grayDark};
  box-shadow: 1px 0 0 ${W.white};
  margin: 0 2px;
`;

const ToolBtn = styled.button<{ disabled?: boolean }>`
  background: ${W.gray};
  ${raised}
  border: none;
  padding: 1px 6px;
  min-width: 52px;
  height: 22px;
  cursor: ${p => p.disabled ? 'default' : 'pointer'};
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  color: ${p => p.disabled ? W.grayDark : W.black};
  text-shadow: ${p => p.disabled ? `1px 1px 0 ${W.white}` : 'none'};
  display: flex;
  align-items: center;
  gap: 3px;

  &:active:not(:disabled) {
    border-top:    1px solid ${W.grayDark};
    border-left:   1px solid ${W.grayDark};
    border-right:  1px solid ${W.white};
    border-bottom: 1px solid ${W.white};
    box-shadow: none;
  }
`;

// ─── Address Bar ─────────────────────────────────────────────────────────────
const AddressRow = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  background: ${W.gray};
  border-bottom: 1px solid ${W.grayDark};
  gap: 4px;
  font-size: 11px;
`;

const AddressLabel = styled.span`
  font-size: 11px;
  white-space: nowrap;
`;

const AddressInput = styled.input`
  flex: 1;
  height: 20px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
  padding: 1px 3px;
  background: ${W.white};
  color: ${W.black};
  ${sunken}
  outline: none;
  border: none;
`;

// ─── Content Area ─────────────────────────────────────────────────────────────
const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  height: 380px;
  overflow: hidden;
`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = styled.div`
  width: 140px;
  flex-shrink: 0;
  background: ${W.gray};
  ${sunken}
  margin: 4px 0 4px 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SidebarTitle = styled.div`
  background: ${W.navy};
  color: ${W.white};
  font-size: 11px;
  font-weight: bold;
  padding: 2px 4px;
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  cursor: pointer;
  font-size: 11px;
  background: ${p => p.active ? W.highlight : 'transparent'};
  color: ${p => p.active ? W.white : W.black};

  &:hover {
    background: ${p => p.active ? W.highlight : W.grayLight};
  }
`;

// ─── Viewport ────────────────────────────────────────────────────────────────
const Viewport = styled.div`
  flex: 1;
  background: ${W.white};
  ${sunken}
  margin: 4px 4px 4px 4px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 12px;
  font-family: 'Times New Roman', serif;
  font-size: 13px;
  color: ${W.black};
`;

// ─── Status Bar ───────────────────────────────────────────────────────────────
const StatusBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 4px;
  gap: 4px;
  border-top: 1px solid ${W.grayDark};
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
`;

const StatusPanel = styled.div`
  ${sunken}
  padding: 1px 4px;
  font-size: 11px;
  flex: 1;
`;

const StatusPanelFixed = styled(StatusPanel)`
  flex: none;
  min-width: 80px;
  text-align: center;
`;

// ─── Page Content Styles ─────────────────────────────────────────────────────
const PageContent = styled.div`
  font-family: 'Times New Roman', serif;
  font-size: 13px;
  color: ${W.black};
  line-height: 1.4;

  h1 { font-size: 20px; font-weight: bold; margin: 0 0 6px; font-family: 'Times New Roman', serif; }
  h2 { font-size: 16px; font-weight: bold; margin: 14px 0 4px; border-bottom: 2px solid ${W.black}; padding-bottom: 2px; font-family: 'Times New Roman', serif; }
  h3 { font-size: 13px; font-weight: bold; margin: 10px 0 4px; font-family: 'Times New Roman', serif; }
  p  { margin: 0 0 8px; }
  a  { color: ${W.link}; text-decoration: underline; cursor: pointer; }
  a:visited { color: ${W.visited}; }
  ul { margin: 0 0 8px 20px; list-style-type: square; }
  li { margin-bottom: 3px; }
  hr { border: none; border-top: 1px solid ${W.grayDark}; margin: 10px 0; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-family: 'Times New Roman', serif;
    font-size: 12px;
  }
  th, td {
    border: 1px solid ${W.grayDark};
    padding: 3px 6px;
    text-align: left;
  }
  th {
    background: ${W.gray};
    font-weight: bold;
    border: 1px solid ${W.black};
  }
  tr:nth-child(even) td { background: #f0f0f0; }

  .inset-box {
    ${sunken}
    padding: 8px;
    background: ${W.white};
    margin-bottom: 8px;
  }
  .section-header {
    background: ${W.navy};
    color: ${W.white};
    padding: 2px 6px;
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 4px;
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  }
`;

// ─── Marquee ─────────────────────────────────────────────────────────────────
const scroll = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(-100%); }
`;

const MarqueeBox = styled.div`
  background: ${W.navy};
  color: ${W.white};
  padding: 2px 4px;
  overflow: hidden;
  white-space: nowrap;
  margin: 8px 0;
  font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
  font-size: 11px;
`;

const MarqueeInner = styled.span`
  display: inline-block;
  animation: ${scroll} 12s linear infinite;
`;

// ─── Divider Rule ─────────────────────────────────────────────────────────────
const Win95Hr = () => (
  <div style={{ 
    borderTop: `1px solid ${W.grayDark}`,
    borderBottom: `1px solid ${W.white}`,
    margin: '8px 0'
  }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface InternetProps { onClose: () => void; }

export default function InternetExplorer({ onClose }: InternetProps) {
  const nodeRef = useRef(null);
  const [activeSite, setActiveSite] = useState('home');
  const [urlInput, setUrlInput]     = useState('file://C:/Portfolio/home.html');
  const [repos, setRepos]           = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [status, setStatus]         = useState('Done');

  const githubUsername = 'sudhanshu5669';

  const sites = [
    { id: 'home',     label: 'Homepage', icon: '🏠', url: 'file://C:/Portfolio/home.html'          },
    { id: 'github',   label: 'GitHub',   icon: '💾', url: 'https://github.com/sudhanshu5669'       },
    { id: 'linkedin', label: 'LinkedIn', icon: '📋', url: 'https://linkedin.com/in/sudhanshu-‎-1788583a7' },
    { id: 'mail',     label: 'Email Me', icon: '✉️', url: 'mailto:bhartiyasudhanshu5669@gmail.com' },
  ];

  const navigateTo = (id: string, url: string) => {
    setStatus('Opening page...');
    setActiveSite(id);
    setUrlInput(url);
    setTimeout(() => setStatus('Done'), 600);
  };

  useEffect(() => {
    if (activeSite !== 'github') return;
    setIsLoadingRepos(true);
    setStatus('Connecting to GitHub servers...');
    (async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`,
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (res.ok) setRepos(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingRepos(false);
        setStatus('Done');
      }
    })();
  }, [activeSite]);

  return (
    <>
      <GlobalStyle />
      <Draggable nodeRef={nodeRef} handle=".ie-titlebar" bounds="parent">
        <WindowShell ref={nodeRef}>

          {/* ── Title Bar ── */}
          <TitleBar className="ie-titlebar">
            <TitleIcon>🌍</TitleIcon>
            <TitleText>Internet Explorer – Portfolio Edition</TitleText>
            <TitleButtons>
              <Win95Btn small title="Minimize">_</Win95Btn>
              <Win95Btn small title="Maximize">□</Win95Btn>
              <Win95Btn small onClick={onClose} title="Close">✕</Win95Btn>
            </TitleButtons>
          </TitleBar>

          {/* ── Menu Bar ── */}
          <MenuBar>
            {['File','Edit','View','Go','Favorites','Help'].map(m => (
              <MenuItem key={m}>{m}</MenuItem>
            ))}
          </MenuBar>

          {/* ── Toolbar ── */}
          <Toolbar>
            <ToolBtn disabled>◀ Back</ToolBtn>
            <ToolBtn disabled>Forward ▶</ToolBtn>
            <ToolBtn onClick={() => navigateTo('home','file://C:/Portfolio/home.html')}>🏠 Home</ToolBtn>
            <ToolSeparator />
            <ToolBtn onClick={() => setStatus('Refreshing...')}>↻ Refresh</ToolBtn>
            <ToolBtn>⏹ Stop</ToolBtn>
            <ToolSeparator />
            <ToolBtn>⭐ Favorites</ToolBtn>
            <ToolBtn>📋 History</ToolBtn>
          </Toolbar>

          {/* ── Address Bar ── */}
          <AddressRow>
            <AddressLabel>Address</AddressLabel>
            <AddressInput
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              readOnly
            />
            <ToolBtn onClick={() => window.open(urlInput,'_blank')}>Go</ToolBtn>
          </AddressRow>

          {/* ── Content Split ── */}
          <ContentArea>

            {/* Sidebar */}
            <Sidebar>
              <SidebarTitle>Favorites</SidebarTitle>
              {sites.map(s => (
                <SidebarItem
                  key={s.id}
                  active={activeSite === s.id}
                  onClick={() => navigateTo(s.id, s.url)}
                >
                  <span style={{ fontSize: 12 }}>{s.icon}</span>
                  {s.label}
                </SidebarItem>
              ))}
            </Sidebar>

            {/* Main Viewport */}
            <Viewport>

              {/* ── HOME ── */}
              {activeSite === 'home' && (
                <PageContent>
                  <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <h1>Welcome to My World Wide Web Page!</h1>
                    <p><em>Best viewed in Internet Explorer 4.0 at 800×600 resolution.</em></p>
                    <img
                      src="https://web.archive.org/web/20091028141931/http://geocities.com/Heartland/Prairie/3616/newunder.gif"
                      alt="Under Construction"
                      style={{ imageRendering: 'pixelated', height: 40 }}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                  <Win95Hr />
                  <div className="section-header">📢 SITE NEWS</div>
                  <div className="inset-box">
                    <p>This site is <strong>under construction</strong>! Please excuse the mess while I upload my portfolio. Use the <strong>Favorites</strong> panel on the left to explore.</p>
                  </div>
                  <h2>About This Site</h2>
                  <p>
                    Welcome to my corner of the World Wide Web! This retro-styled portfolio
                    simulates a classic late-90s browser experience. Browse my GitHub repositories,
                    professional experience on LinkedIn, or drop me an electronic mail!
                  </p>
                  <h2>Navigation</h2>
                  <ul>
                    <li><strong>GitHub</strong> — View my live repositories, fetched in real-time.</li>
                    <li><strong>LinkedIn</strong> — My professional profile and tech stack.</li>
                    <li><strong>Email Me</strong> — Send an electronic mail to my inbox.</li>
                  </ul>
                </PageContent>
              )}

              {/* ── GITHUB ── */}
              {activeSite === 'github' && (
                <PageContent>
                  <div className="section-header">💾 GITHUB.COM // {githubUsername.toUpperCase()}</div>
                  <div className="inset-box">
                    <p><em>Live data fetched straight from the GitHub mainframe servers.</em></p>
                  </div>
                  <h2>Recent Public Repositories</h2>
                  {isLoadingRepos ? (
                    <p><em>📡 Dialing into GitHub servers… please stand by…</em></p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Repository Name</th>
                          <th>Language</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repos.length === 0 && (
                          <tr><td colSpan={3}>No repositories found.</td></tr>
                        )}
                        {repos.map(r => (
                          <tr key={r.id}>
                            <td>
                              <a onClick={() => window.open(r.html_url,'_blank')}>
                                {r.name}
                              </a>
                            </td>
                            <td>{r.language || 'N/A'}</td>
                            <td>
                              {r.description
                                ? r.description.substring(0,55) + (r.description.length > 55 ? '…' : '')
                                : <em>No description.</em>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <h2>Contribution Graph</h2>
                  <div className="inset-box">
                    <img
                      src={`https://ghchart.rshah.org/000080/${githubUsername}`}
                      alt="GitHub contribution chart"
                      style={{ width: '100%', maxWidth: 500, display: 'block' }}
                    />
                  </div>
                  <Win95Hr />
                  <div style={{ textAlign: 'center' }}>
                    <Win95Btn onClick={() => window.open(`https://github.com/${githubUsername}`,'_blank')}>
                      🚀 View Real GitHub Profile
                    </Win95Btn>
                  </div>
                </PageContent>
              )}

              {/* ── LINKEDIN ── */}
              {activeSite === 'linkedin' && (
                <PageContent>
                  <div className="section-header">📋 LINKEDIN — THE PROFESSIONAL NETWORK</div>
                  <MarqueeBox>
                    <MarqueeInner>
                      ★ Let's connect! ★ Open to opportunities ★ Full Stack Developer ★ Building cool stuff ★
                    </MarqueeInner>
                  </MarqueeBox>

                  <h2>Work Experience</h2>
                  <h3>Full Stack Developer Intern — Bajaj Finserv Health</h3>
                  <p style={{ fontSize: 11, fontFamily: "'MS Sans Serif', sans-serif", color: W.grayDarker }}>May 2026 – Present</p>
                  <ul>
                    <li>Contributing to highly interactive web applications using Next.js</li>
                    <li>Optimizing database queries and API endpoints for improved performance</li>
                    <li>Collaborating in agile sprints with design teams to ship quality features</li>
                  </ul>

                  <h2>Tech Stack &amp; Skills</h2>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: 110 }}>Languages</th>
                        <td>C++, Java, C, JavaScript, TypeScript, Python</td>
                      </tr>
                      <tr>
                        <th>Core Skills</th>
                        <td>DSA, SQL (PostgreSQL, MySQL), OOP, REST APIs, Git, OS, CN, DBMS</td>
                      </tr>
                      <tr>
                        <th>Frameworks</th>
                        <td>LangChain, Node.js, Next.js, Drizzle ORM, QDrant, Docker, React, React Native, Express, Flutter</td>
                      </tr>
                    </tbody>
                  </table>

                  <Win95Hr />
                  <div style={{ textAlign: 'center' }}>
                    <Win95Btn onClick={() => window.open('https://www.linkedin.com/in/sudhanshu-‎-1788583a7','_blank')}>
                      🤝 Connect on Real LinkedIn
                    </Win95Btn>
                  </div>
                </PageContent>
              )}

              {/* ── EMAIL ── */}
              {activeSite === 'mail' && (
                <PageContent>
                  <div className="section-header">✉️ ELECTRONIC MAIL — COMPOSE</div>
                  <div className="inset-box" style={{ marginTop: 8 }}>
                    <table style={{ fontSize: 12, border: 'none' }}>
                      <tbody>
                        <tr>
                          <th style={{ border: 'none', background: 'transparent', width: 70, textAlign: 'right', paddingRight: 8 }}>To:</th>
                          <td style={{ border: 'none', background: 'transparent' }}>bhartiyasudhanshu5669@gmail.com</td>
                        </tr>
                        <tr>
                          <th style={{ border: 'none', background: 'transparent', textAlign: 'right', paddingRight: 8 }}>Subject:</th>
                          <td style={{ border: 'none', background: 'transparent' }}>Portfolio Inquiry</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2>Send Me a Message</h2>
                  <p>
                    Click the button below to open a Gmail compose window, pre-addressed to my inbox.
                    This is the fastest way to reach me on the Information Superhighway!
                  </p>

                  <div style={{
                    background: W.gray,
                    border: `2px solid`,
                    borderColor: `${W.white} ${W.grayDark} ${W.grayDark} ${W.white}`,
                    padding: 12,
                    marginTop: 16,
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: 10, fontFamily: "'MS Sans Serif', sans-serif", fontSize: 11 }}>
                      📬 Ready to compose electronic mail…
                    </p>
                    <Win95Btn
                      onClick={() => window.open(
                        'https://mail.google.com/mail/?view=cm&fs=1&to=bhartiyasudhanshu5669@gmail.com&su=Portfolio Inquiry',
                        '_blank'
                      )}
                    >
                      🚀 Open in Webmail
                    </Win95Btn>
                  </div>
                </PageContent>
              )}

            </Viewport>
          </ContentArea>

          {/* ── Status Bar ── */}
          <StatusBar>
            <StatusPanel>{status}</StatusPanel>
            <StatusPanelFixed>🌐 Internet</StatusPanelFixed>
          </StatusBar>

        </WindowShell>
      </Draggable>
    </>
  );
}