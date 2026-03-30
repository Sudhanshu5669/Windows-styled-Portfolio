"use client";

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled, { keyframes, css } from 'styled-components';

// ==========================================
// MOCK PLAYLIST DATA
// (Just drop your actual mp3s in public/music/)
// ==========================================
const PLAYLIST = [
  { id: 0, title: "Portfolio Mix - Windows 95", src: "/music/Windows-95-lofi.mp3",  duration: "3:42" },
  { id: 1, title: "Midnight Code - Portfolio 95", src: "/music/grovey-95.mp3",      duration: "4:15" },
  { id: 2, title: "Coffee Break - Morning Beats", src: "/music/bliss-lofi.mp3",     duration: "2:50" },
  { id: 3, title: "Reggaeton - SYNTHXX",          src: "/music/synthxx-reggae.mp3", duration: "3:01" },
];

// ==========================================
// STYLED COMPONENTS (Winamp Base Skin)
// ==========================================

const WinampWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  gap: 0px; /* Snaps panels together */
  font-family: 'ms_sans_serif', sans-serif;
`;

// --- MAIN PLAYER PANEL ---
const PlayerPanel = styled.div`
  width: 275px;
  background-color: #272736;
  border-top: 2px solid #cecece;
  border-left: 2px solid #cecece;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  padding: 4px 6px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  user-select: none;
`;

const TitleBar = styled.div`
  background: linear-gradient(to right, #000080, #1084d0);
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  cursor: grab;
  margin-bottom: 6px;

  &:active { cursor: grabbing; }

  span {
    color: white;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
  }
`;

const WindowControls = styled.div`
  display: flex;
  gap: 2px;
`;

const TinyButton = styled.button`
  background: #c0c0c0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  font-size: 8px;
  height: 10px;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  
  &:active {
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
`;

// --- LCD DISPLAY ---
const LCDScreen = styled.div`
  background-color: #000000;
  border-top: 2px solid #4a4a4a;
  border-left: 2px solid #4a4a4a;
  border-right: 2px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

const LCDTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimeDisplay = styled.div`
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: -1px;
`;

// CSS Visualizer Animation
const bounce1 = keyframes` 0%, 100% { height: 2px; } 50% { height: 14px; } `;
const bounce2 = keyframes` 0%, 100% { height: 5px; } 50% { height: 20px; } `;
const bounce3 = keyframes` 0%, 100% { height: 3px; } 50% { height: 12px; } `;
const bounce4 = keyframes` 0%, 100% { height: 8px; } 50% { height: 18px; } `;

const SpectrumContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 22px;
  width: 65px;
  border-bottom: 1px solid #005500;
`;

const Bar = styled.div<{ $active: boolean; $anim: ReturnType<typeof keyframes> }>`
  width: 5px;
  background: linear-gradient(to top, #00ff00, #ffff00, #ff0000);
  height: 2px;
  ${props => props.$active ? css`animation: ${props.$anim} 0.5s ease-in-out infinite alternate;` : css`animation: none;`}
`;

const scrollLeft = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background: #000;
  color: #00ff00;
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 12px;
`;

const MarqueeText = styled.div`
  display: inline-block;
  animation: ${scrollLeft} 8s linear infinite;
`;

const TechInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #00ff00;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  opacity: 0.8;
  margin-top: 2px;
`;

// --- CONTROLS ---
const ControlPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const MediaButtons = styled.div`
  display: flex;
  gap: 2px;
`;

const MediaBtn = styled.button`
  background: #3b3b4a;
  border-top: 2px solid #dfdfdf;
  border-left: 2px solid #dfdfdf;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  color: #dfdfdf;
  height: 24px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;

  &:active {
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    border-right: 2px solid #dfdfdf;
    border-bottom: 2px solid #dfdfdf;
    padding-top: 2px;
    padding-left: 2px;
  }
`;

const SlidersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #272736;
  border: 1px inset #000;
  padding: 2px 4px;
`;

const RetroSlider = styled.input`
  -webkit-appearance: none;
  width: 70px;
  background: #000;
  height: 6px;
  border: 1px solid #808080;
  border-right-color: #fff;
  border-bottom-color: #fff;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 6px;
    background: #c0c0c0;
    border: 1px solid #fff;
    border-right-color: #000;
    border-bottom-color: #000;
    cursor: pointer;
  }
`;

const ToggleBtn = styled(MediaBtn)<{ $active?: boolean }>`
  width: auto;
  padding: 0 6px;
  font-family: 'ms_sans_serif', sans-serif;
  font-weight: bold;
  color: ${props => props.$active ? '#00ff00' : '#dfdfdf'};
`;

// --- PLAYLIST PANEL ---
const PlaylistPanel = styled.div`
  width: 275px;
  background-color: #272736;
  border-top: 2px solid #cecece;
  border-left: 2px solid #cecece;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  padding: 4px 6px;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
`;

const PlaylistLCD = styled.div`
  background-color: #000000;
  border-top: 2px solid #4a4a4a;
  border-left: 2px solid #4a4a4a;
  border-right: 2px solid #e0e0e0;
  border-bottom: 2px solid #e0e0e0;
  height: 100px;
  overflow-y: auto;
  padding: 4px;
  
  /* Retro Scrollbar */
  &::-webkit-scrollbar { width: 12px; }
  &::-webkit-scrollbar-track { background: #000; border-left: 1px solid #4a4a4a; }
  &::-webkit-scrollbar-thumb { background: #3b3b4a; border: 1px solid #e0e0e0; border-bottom-color: #4a4a4a; border-right-color: #4a4a4a; }
`;

const PlaylistItem = styled.div<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? '#ffffff' : '#00ff00'};
  background-color: ${props => props.$isActive ? '#000080' : 'transparent'};
  font-family: 'ms_sans_serif', sans-serif;
  font-size: 12px;
  padding: 2px 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: ${props => props.$isActive ? '#000080' : '#003300'};
  }
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================

export default function Winamp({ onClose }: { onClose: () => void }) {
  const nodeRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showPlaylist, setShowPlaylist] = useState(true);

  // Playback Controls
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Audio error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  // Sync state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // Time formatter
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".winamp-handle" bounds="parent">
      <WinampWrapper ref={nodeRef}>
        
        {/* Hidden Audio */}
        <audio 
          ref={audioRef} 
          src={PLAYLIST[currentTrack].src} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />

        {/* --- MAIN PLAYER --- */}
        <PlayerPanel>
          <TitleBar className="winamp-handle">
            <span>WINAMP</span>
            <WindowControls>
              <TinyButton onClick={() => {}}>-</TinyButton>
              <TinyButton onClick={onClose}>x</TinyButton>
            </WindowControls>
          </TitleBar>

          <LCDScreen>
            <LCDTopRow>
              <TimeDisplay>{formatTime(progress)}</TimeDisplay>
              <SpectrumContainer>
                <Bar $active={isPlaying} $anim={bounce1} style={{ animationDelay: '0.1s' }} />
                <Bar $active={isPlaying} $anim={bounce4} style={{ animationDelay: '0.3s' }} />
                <Bar $active={isPlaying} $anim={bounce2} style={{ animationDelay: '0s' }} />
                <Bar $active={isPlaying} $anim={bounce3} style={{ animationDelay: '0.4s' }} />
                <Bar $active={isPlaying} $anim={bounce4} style={{ animationDelay: '0.2s' }} />
                <Bar $active={isPlaying} $anim={bounce1} style={{ animationDelay: '0.5s' }} />
                <Bar $active={isPlaying} $anim={bounce2} style={{ animationDelay: '0.1s' }} />
              </SpectrumContainer>
            </LCDTopRow>

            <MarqueeContainer>
              {isPlaying ? (
                <MarqueeText>{PLAYLIST[currentTrack].title} *** 192kbps Lofi Edition ***</MarqueeText>
              ) : (
                <div style={{ paddingLeft: '4px' }}>WINAMP // PAUSED</div>
              )}
            </MarqueeContainer>

            <TechInfo>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span>192 kbps</span>
                <span>44 khz</span>
              </div>
              <span>STEREO</span>
            </TechInfo>
          </LCDScreen>

          {/* Seek Bar */}
          <div style={{ marginBottom: '8px', background: '#000', padding: '1px', border: '1px solid #4a4a4a' }}>
            <RetroSlider 
              type="range" min="0" max={duration || 100} value={progress} onChange={handleSeek}
              style={{ width: '100%' }}
            />
          </div>

          <ControlPanel>
            <MediaButtons>
              <MediaBtn onClick={prevTrack}>⏮</MediaBtn>
              <MediaBtn onClick={togglePlay}>▶</MediaBtn>
              <MediaBtn onClick={togglePlay}>⏸</MediaBtn>
              <MediaBtn onClick={stopAudio}>⏹</MediaBtn>
              <MediaBtn onClick={nextTrack}>⏭</MediaBtn>
            </MediaButtons>

            <SlidersWrapper>
               <RetroSlider type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {
                 const vol = Number(e.target.value);
                 setVolume(vol);
                 if (audioRef.current) audioRef.current.volume = vol;
               }} />
            </SlidersWrapper>

            {/* Playlist Toggle Button */}
            <ToggleBtn $active={showPlaylist} onClick={() => setShowPlaylist(!showPlaylist)}>PL</ToggleBtn>
          </ControlPanel>
        </PlayerPanel>

        {/* --- ATTACHED PLAYLIST EDITOR --- */}
        {showPlaylist && (
          <PlaylistPanel>
            <TitleBar className="winamp-handle" style={{ cursor: 'grab' }}>
              <span>WINAMP PLAYLIST</span>
              <TinyButton onClick={() => setShowPlaylist(false)}>x</TinyButton>
            </TitleBar>
            
            <PlaylistLCD>
              {PLAYLIST.map((track, index) => (
                <PlaylistItem 
                  key={track.id} 
                  $isActive={currentTrack === index}
                  onDoubleClick={() => selectTrack(index)}
                >
                  <span>{track.title}</span>
                  <span>{track.duration}</span>
               </PlaylistItem>
              ))}
            </PlaylistLCD>
          </PlaylistPanel>
        )}

      </WinampWrapper>
    </Draggable>
  );
}