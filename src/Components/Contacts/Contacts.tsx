"use client";

import React, { useState, useRef, useEffect } from 'react';
import { keyframes } from 'styled-components';
import { 
  Window, WindowContent, WindowHeader, Button, 
  Panel, TextInput, List, ListItem, Divider, ScrollView, 
  styleReset
} from 'react95';
import Draggable from 'react-draggable';
import styled from 'styled-components';

// --- Styled Components ---
const BrowserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 450px;
  gap: 4px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ContentSplit = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 8px;
  height: 100%;
  overflow: hidden;
`;

const Sidebar = styled(Panel)`
  width: 140px;
  background: white;
  display: flex;
  flex-direction: column;
`;

const Viewport = styled(Panel)`
  flex: 1;
  background: white;
  padding: 16px;
  overflow-y: auto;
`;

const MockPage = styled.div`
  font-family: 'ms_sans_serif', sans-serif; /* Changed from Times New Roman */
  color: black;
  padding: 8px;
  
  h1 { font-size: 24px; margin-bottom: 8px; font-weight: bold; }
  h2 { font-size: 18px; margin-top: 16px; margin-bottom: 8px; border-bottom: 2px solid #000; }
  h3 { font-size: 16px; margin-top: 12px; font-weight: bold; }
  p { margin-bottom: 12px; line-height: 1.4; }
  a { color: #0000ee; text-decoration: underline; cursor: pointer; }
  ul { margin-left: 24px; margin-bottom: 12px; list-style-type: square; }
  li { margin-bottom: 4px; }
  
  /* 90s Table Styling */
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; background: white; }
  th, td { border: 1px solid #808080; padding: 6px; text-align: left; }
  th { background: #c0c0c0; font-weight: bold; }
`;

const scrollLeft = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const MarqueeContainer = styled.div`
  width: 80%;
  background: #000080;
  color: white;
  padding: 4px;
  margin-bottom: 16px;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
`;

const MarqueeText = styled.div`
  display: inline-block;
  animation: ${scrollLeft} 10s linear infinite;
  font-family: 'ms_sans_serif', sans-serif; /* Changed from Times New Roman */
`;

// --- Interfaces ---
interface InternetProps {
  onClose: () => void;
}

// --- Main Component ---
export default function Contacts({ onClose }: InternetProps) {
  const nodeRef = useRef(null);
  
  // State to track which "site" we are currently viewing
  const [activeSite, setActiveSite] = useState('home');
  const [urlInput, setUrlInput] = useState('file://C:/Portfolio/home.html');
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  
  // Replace this with your actual GitHub username!
  const githubUsername = 'sudhanshu5669';

  // Our "Bookmarks"
  const sites = [
    { id: 'home', name: 'Homepage', url: 'file://C:/Portfolio/home.html' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/sudhanshu5669' },
    { id: 'linkedin', name: 'LinkedIn', url: 'www.linkedin.com/in/sudhanshu-‎-1788583a7' },
    { id: 'mail', name: 'Email Me', url: 'mailto:bhartiyasudhanshu5669@gmail.com' }, 
  ];

  const navigateTo = (siteId: string, siteUrl: string) => {
    setActiveSite(siteId);
    setUrlInput(siteUrl);
  };

  useEffect(() => {
    if (activeSite === 'github') {
      const fetchRepos = async () => {
        setIsLoadingRepos(true);
        try {
          const token = process.env.GITHUB_TOKEN; 

          const headers: HeadersInit = {
            "Accept": "application/vnd.github.v3+json",
          };

          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=10`, 
            { headers }
          );
          
          if (response.ok) {
            const data = await response.json();
            setRepos(data);
          } else {
            console.error("GitHub API Error:", response.status);
          }
        } catch (error) {
          console.error("Network failed to fetch repos", error);
        } finally {
          setIsLoadingRepos(false);
        }
      };

      fetchRepos();
    }
  }, [activeSite, githubUsername]);

  return (
    <Draggable nodeRef={nodeRef} handle=".window-header" bounds="parent">
      <Window ref={nodeRef} style={{ width: '650px', position: 'absolute', top: '10%', left: '15%', zIndex: 100 }}>
        <WindowHeader className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🌍 Internet Explorer - Portfolio Edition</span>
          <Button onClick={onClose}><span style={{ fontWeight: 'bold' }}>x</span></Button>
        </WindowHeader>
        
        <WindowContent style={{ padding: '8px' }}>
          <BrowserWrapper>
            
            {/* Browser Toolbar & Address Bar */}
            <Toolbar>
              <Button disabled variant="menu">Back</Button>
              <Button disabled variant="menu">Forward</Button>
              <Button onClick={() => navigateTo('home', 'file://C:/Portfolio/home.html')} variant="menu">Home</Button>
              <Divider orientation="vertical" size={24} />
              <AddressBar>
                <span>Address:</span>
                <TextInput 
                  value={urlInput} 
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ flex: 1 }} 
                  readOnly 
                />
                <Button onClick={() => window.open(urlInput, '_blank')}>Go</Button>
              </AddressBar>
            </Toolbar>

            <ContentSplit>
              {/* Sidebar / Bookmarks */}
              <Sidebar variant="well">
                <div style={{ padding: '4px', background: '#000080', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                  Favorites
                </div>
                <List style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
                  {sites.map((site) => (
                    <ListItem 
                      key={site.id} 
                      onClick={() => navigateTo(site.id, site.url)}
                      style={{ cursor: 'pointer', backgroundColor: activeSite === site.id ? '#e0e0e0' : 'transparent' }}
                    >
                      <span style={{ fontSize: '14px' }}>📁 {site.name}</span>
                    </ListItem>
                  ))}
                </List>
              </Sidebar>

              {/* Main Viewport */}
              <Viewport variant="well">
                <ScrollView style={{ width: '100%', height: '100%' }}>
                  
                  {activeSite === 'home' && (
                    <MockPage>
                      <center>
                        <h1>Welcome to My World Wide Web Page</h1>
                        <p><i>Best viewed in Netscape Navigator at 800x600 resolution.</i></p>
                        <img src="https://gifcities.org/assets/under-construction.gif" alt="Under Construction" width="150" />
                      </center>
                      <h2>About This App</h2>
                      <p>Select a link from the Favorites menu on the left to browse my professional profiles.</p>
                    </MockPage>
                  )}

                  {/* --- DYNAMIC RETRO GITHUB --- */}
                  {activeSite === 'github' && (
                    <MockPage style={{ background: '#f5f5dc', minHeight: '100%', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <img 
                          src="/images/retrogithub.png" 
                          alt="GitHub" 
                          width="64" 
                          style={{ imageRendering: 'pixelated' }} 
                        />
                        <div>
                          <h1>GitHub // {githubUsername}</h1>
                          <p><i>"Live data fetched straight from the World Wide Web."</i></p>
                        </div>
                      </div>

                      <h2>Recent Public Repositories</h2>
                      {isLoadingRepos ? (
                        <p><i>Dialing into GitHub servers... (Loading)</i></p>
                      ) : (
                        <table>
                          <thead>
                            <tr>
                              <th>Repository</th>
                              <th>Language</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {repos.map((repo) => (
                              <tr key={repo.id}>
                                <td><a onClick={() => window.open(repo.html_url, '_blank')}>{repo.name}</a></td>
                                <td>{repo.language || 'N/A'}</td>
                                <td>{repo.description ? repo.description.substring(0, 50) + '...' : 'No description provided.'}</td>
                              </tr>
                            ))}
                            {repos.length === 0 && (
                              <tr>
                                <td colSpan={3}>No repositories found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}

                      <h2>Contribution Activity</h2>
                      <div style={{ background: 'white', padding: '4px', border: '1px solid #808080', display: 'inline-block' }}>
                        <img 
                          src={`https://ghchart.rshah.org/000080/${githubUsername}`} 
                          alt={`${githubUsername}'s Github chart`} 
                          style={{ width: '100%', maxWidth: '600px' }}
                        />
                      </div>
                      <p><i>Tracking my mainframe commits over the last year.</i></p>
                      
                      <br/>
                      <Divider />
                      <br/>
                      <center>
                        <Button onClick={() => window.open(`https://github.com/${githubUsername}`, '_blank')} size="lg">
                          View Real GitHub Profile 🚀
                        </Button>
                      </center>
                    </MockPage>
                  )}

                  {/* --- RETRO LINKEDIN --- */}
                  {activeSite === 'linkedin' && (
                    <MockPage style={{ background: '#f5f5dc', minHeight: '100%', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <img 
                          src="/images/retro-linkedin.png" 
                          alt="LinkedIn Retro Logo" 
                          style={{ 
                            height: '50px',       
                            width: 'auto',        
                            objectFit: 'contain', 
                            imageRendering: 'pixelated' 
                          }} 
                        />
                        <div>
                          <h1>The Professional Network</h1>
                          <p><i>"Connecting professionals since the turn of the century."</i></p>
                        </div>
                      </div>

                      <center>
                        <MarqueeContainer>
                          <MarqueeText>
                            *** Let's connect! ***
                          </MarqueeText>
                        </MarqueeContainer>
                      </center>

                      <h2>Experience</h2>
                      <h3>Full Stack Developer Intern @ Bajaj Finserv Health</h3>
                      <p><i>May 2026 - Present</i></p>
                      <ul>
                        <li>Contributing to the development of highly interactive web applications using Next.js</li>
                        <li>Assisting in optimizing database queries and API endpoints for improved performance.</li>
                        <li>Participating in agile sprints and collaborating with design teams to translate UI/UX wireframes into functional code.</li>
                      </ul>

                      <h2>Tech Stack & Skills</h2>
                      <table style={{ background: 'transparent', border: 'none' }}>
                        <tbody>
                          <tr>
                            <td style={{ border: 'none', width: '140px', verticalAlign: 'top' }}><b>Languages:</b></td>
                            <td style={{ border: 'none', paddingBottom: '12px' }}>C++, Java, C, JavaScript, TypeScript, Python</td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none', verticalAlign: 'top' }}><b>Core Skills:</b></td>
                            <td style={{ border: 'none', paddingBottom: '12px' }}>Data Structures & Algorithms (DSA), SQL (PostgreSQL, MySQL), Object-Oriented Programming (OOP), RESTful APIs, Git Version Control, Operating Systems, Computer Networks (CN), Database Management Systems (DBMS)</td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none', verticalAlign: 'top' }}><b>Frameworks & Tech:</b></td>
                            <td style={{ border: 'none' }}>LangChain, Node.js, Drizzle ORM, QDrant, Docker, React, React Native, Express, Flutter</td>
                          </tr>
                        </tbody>
                      </table>

                      <br/>
                      <Divider />
                      <br/>
                      <center>
                        <Button onClick={() => window.open('https://www.linkedin.com/in/sudhanshu-‎-1788583a7', '_blank')} size="lg">
                          Connect on the Real LinkedIn 🤝
                        </Button>
                      </center>
                    </MockPage>
                  )}

                  {/* --- RETRO WEBMAIL --- */}
                  {activeSite === 'mail' && (
                    <MockPage style={{ background: '#ffffff', minHeight: '100%', padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '48px' }}>✉️</span>
                        <div>
                          <h1>Electronic Mail</h1>
                          <p><i>"Fast, reliable, and paperless."</i></p>
                        </div>
                      </div>

                      <h2>Contact Me</h2>
                      <p>Send an electronic mail directly to my inbox! Click the button below to open your Gmail compose window, pre-filled with my address.</p>

                      <div style={{ 
                        background: '#c0c0c0', 
                        padding: '16px', 
                        border: '2px solid', 
                        borderColor: '#ffffff #808080 #808080 #ffffff', /* 90s inset button look */
                        marginTop: '24px' 
                      }}>
                        <p style={{ margin: '0 0 8px 0' }}><b>To:</b> bhartiyasudhanshu5669@gmail.com</p>
                        <p style={{ margin: '0 0 16px 0' }}><b>Subject:</b> Portfolio Inquiry</p>
                        
                        <center>
                          <Button 
                            onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=bhartiyasudhanshu5669@gmail.com&su=Portfolio Inquiry', '_blank')} 
                            size="lg"
                          >
                            Compose in Webmail 🚀
                          </Button>
                        </center>
                      </div>
                    </MockPage>
                  )}

                </ScrollView>
              </Viewport>
            </ContentSplit>

          </BrowserWrapper>
        </WindowContent>
      </Window>
    </Draggable>
  );
}