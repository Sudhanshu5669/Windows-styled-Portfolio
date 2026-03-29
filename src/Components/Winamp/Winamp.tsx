"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';

// ─────────────────────────────────────────
// PLAYLIST
// ─────────────────────────────────────────
const PLAYLIST = [
  { id: 0, title: "Portfolio Mix - Windows 95", src: "/music/Windows-95-lofi.mp3",  duration: "3:42" },
  { id: 1, title: "Midnight Code - Portfolio 95", src: "/music/grovey-95.mp3",      duration: "4:15" },
  { id: 2, title: "Coffee Break - Morning Beats", src: "/music/bliss-lofi.mp3",     duration: "2:50" },
  { id: 3, title: "Reggaeton - SYNTHXX",          src: "/music/synthxx-reggae.mp3", duration: "3:01" },
];

// ─────────────────────────────────────────
// FONT IMPORT — DS-Digital for the LCD clock
// ─────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
`;

// ─────────────────────────────────────────
// AUTHENTIC WINAMP 2.x COLOR PALETTE
// ─────────────────────────────────────────
const W = {
  body:        '#232323',     // classic Winamp body
  bodyHi:      '#383838',     // lighter ridge
  bodyLo:      '#111111',     // darker ridge
  btnFace:     '#2f2f2f',
  btnHi:       '#484848',     // bevel light edge
  btnShadow:   '#141414',     // bevel dark edge
  lcdBg:       '#000000',
  lcdGreen:    '#14DF14',     // phosphor green
  lcdDimGreen: '#0A5C0A',     // dim / inactive green
  lcdPeak:     '#FFFF00',     // spectrum peak dots
  lcdRed:      '#FF2020',     // top of spectrum bars
  lcdYellow:   '#E8E800',     // mid spectrum
  titleActive: 'linear-gradient(90deg, #00008B 0%, #1965B8 100%)',
  titleText:   '#FFFFFF',
  plBg:        '#000000',
  plText:      '#00E000',
  plSelected:  '#000064',
  plSelText:   '#FFFFFF',
  plAlt:       '#0A0A0A',
};

// ─────────────────────────────────────────
// SPECTRUM ANIMATIONS (18 bars, each unique)
// ─────────────────────────────────────────
const mkBounce = (min: number, max: number) => keyframes`
  0%   { height: ${min}px; }
  50%  { height: ${max}px; }
  100% { height: ${min}px; }
`;

const BARS = [
  { min: 2,  max: 18, delay: 0.00 },
  { min: 4,  max: 24, delay: 0.07 },
  { min: 1,  max: 14, delay: 0.14 },
  { min: 6,  max: 28, delay: 0.21 },
  { min: 2,  max: 20, delay: 0.08 },
  { min: 5,  max: 30, delay: 0.30 },
  { min: 3,  max: 22, delay: 0.17 },
  { min: 7,  max: 26, delay: 0.04 },
  { min: 2,  max: 16, delay: 0.25 },
  { min: 4,  max: 28, delay: 0.12 },
  { min: 1,  max: 20, delay: 0.33 },
  { min: 6,  max: 24, delay: 0.09 },
  { min: 3,  max: 18, delay: 0.22 },
  { min: 5,  max: 30, delay: 0.16 },
  { min: 2,  max: 22, delay: 0.28 },
  { min: 4,  max: 16, delay: 0.05 },
  { min: 1,  max: 26, delay: 0.19 },
  { min: 3,  max: 20, delay: 0.35 },
];

// ─────────────────────────────────────────
// SHARED BEVEL MIXINS
// ─────────────────────────────────────────
const bevelOut = css`
  border-top:    2px solid ${W.btnHi};
  border-left:   2px solid ${W.btnHi};
  border-right:  2px solid ${W.btnShadow};
  border-bottom: 2px solid ${W.btnShadow};
`;

const bevelIn = css`
  border-top:    2px solid ${W.btnShadow};
  border-left:   2px solid ${W.btnShadow};
  border-right:  2px solid ${W.btnHi};
  border-bottom: 2px solid ${W.btnHi};
`;

const lcdBevel = css`
  border-top:    2px solid #080808;
  border-left:   2px solid #080808;
  border-right:  2px solid #505050;
  border-bottom: 2px solid #505050;
`;

// ─────────────────────────────────────────
// WINAMP WRAPPER — drag handle is the title bar
// ─────────────────────────────────────────
const WinampRoot = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  width: 275px;
  /* subtle body texture */
  filter: drop-shadow(3px 3px 8px rgba(0,0,0,0.7));
`;

// ─────────────────────────────────────────
// MAIN PLAYER PANEL
// ─────────────────────────────────────────
const MainPanel = styled.div`
  width: 275px;
  background-color: ${W.body};
  ${bevelOut}
  padding: 3px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

// Title bar
const TitleBar = styled.div`
  background: ${W.titleActive};
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3px;
  cursor: grab;
  user-select: none;
  flex-shrink: 0;

  &:active { cursor: grabbing; }
`;

const TitleText = styled.span`
  color: ${W.titleText};
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 1.5px;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
`;

const TitleButtons = styled.div`
  display: flex;
  gap: 1px;
`;

// Tiny title-bar buttons (O, A, ×)
const TitleBtn = styled.button<{ $close?: boolean }>`
  background: ${W.btnFace};
  ${bevelOut}
  color: ${p => p.$close ? '#C0C0C0' : '#A0A0A0'};
  font-size: 7px;
  line-height: 1;
  padding: 0;
  height: 9px;
  width: ${p => p.$close ? '9px' : '14px'};
  cursor: pointer;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active { ${bevelIn} padding-top: 1px; padding-left: 1px; }
`;

// ─────────────────────────────────────────
// LCD SCREEN
// ─────────────────────────────────────────
const LCD = styled.div`
  ${lcdBevel}
  background: ${W.lcdBg};
  padding: 4px 6px 3px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
`;

const LCDTopRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

// Big digital time
const TimeDisplay = styled.div`
  color: ${W.lcdGreen};
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -1px;
  text-shadow: 0 0 6px ${W.lcdGreen}80;
`;

// Track number pill (top-left tiny)
const TrackNum = styled.div`
  position: absolute;
  top: 4px;
  left: 6px;
  color: ${W.lcdDimGreen};
  font-size: 9px;
  font-family: 'Courier New', monospace;
`;

// ─────────────────────────────────────────
// SPECTRUM ANALYSER
// ─────────────────────────────────────────
const SpectrumWrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 32px;
  width: 76px;
  position: relative;
`;

// Each spectrum bar (gradient green→yellow→red)
const SpecBar = styled.div<{ $active: boolean; $min: number; $max: number; $delay: number }>`
  width: 3px;
  border-radius: 0;
  height: ${p => p.$min}px;
  background: linear-gradient(
    to top,
    ${W.lcdGreen}  0%,
    ${W.lcdYellow} 60%,
    ${W.lcdRed}    100%
  );
  ${p => p.$active ? css`
    animation: ${mkBounce(p.$min, p.$max)} ${0.4 + Math.random() * 0.3}s ease-in-out infinite;
    animation-delay: ${p.$delay}s;
  ` : ''}
`;

// ─────────────────────────────────────────
// MARQUEE / TRACK INFO
// ─────────────────────────────────────────
const scrollLeft = keyframes`
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const MarqueeWrap = styled.div`
  overflow: hidden;
  white-space: nowrap;
  height: 14px;
  display: flex;
  align-items: center;
`;

const MarqueeText = styled.span<{ $playing: boolean }>`
  color: ${W.lcdGreen};
  font-size: 11px;
  font-family: 'Courier New', monospace;
  display: inline-block;
  text-shadow: 0 0 4px ${W.lcdGreen}60;
  ${p => p.$playing ? css`animation: ${scrollLeft} 10s linear infinite;` : ''}
`;

// Bottom LCD row: kbps | khz | stereo
const LCDBitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 1px;
`;

const LCDBit = styled.span`
  color: ${W.lcdDimGreen};
  font-size: 9px;
  font-family: 'Courier New', monospace;
`;

const LCDBitActive = styled.span`
  color: ${W.lcdGreen};
  font-size: 9px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
`;

const LCDStereo = styled.div<{ $stereo: boolean }>`
  margin-left: auto;
  display: flex;
  gap: 3px;
`;

const StereoBlock = styled.div<{ $active: boolean }>`
  font-size: 8px;
  font-family: 'Courier New', monospace;
  color: ${p => p.$active ? W.lcdGreen : W.lcdDimGreen};
  letter-spacing: 1px;
  text-shadow: ${p => p.$active ? `0 0 4px ${W.lcdGreen}` : 'none'};
`;

// ─────────────────────────────────────────
// SEEK BAR
// ─────────────────────────────────────────
const SeekWrap = styled.div`
  ${lcdBevel}
  background: ${W.lcdBg};
  height: 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

const SeekFill = styled.div<{ $pct: number }>`
  position: absolute;
  inset: 0;
  width: ${p => p.$pct}%;
  background: repeating-linear-gradient(
    90deg,
    ${W.lcdGreen}     0px,
    ${W.lcdGreen}     4px,
    ${W.lcdDimGreen}  4px,
    ${W.lcdDimGreen}  6px
  );
  transition: width 0.2s linear;
`;

const SeekThumb = styled.div<{ $pct: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  left: calc(${p => p.$pct}% - 3px);
  background: #C0C0C0;
  ${bevelOut}
`;

// ─────────────────────────────────────────
// MEDIA BUTTONS
// ─────────────────────────────────────────
const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const MBtn = styled.button`
  background: ${W.btnFace};
  ${bevelOut}
  color: #C0C0C0;
  height: 22px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  flex-shrink: 0;
  padding: 0;

  &:active { ${bevelIn} padding-top: 2px; padding-left: 2px; }
  &:hover  { background: ${W.bodyHi}; }
`;

// Wider play/pause
const MBtnWide = styled(MBtn)`
  width: 30px;
`;

// ─────────────────────────────────────────
// SLIDERS (Volume + Balance)
// ─────────────────────────────────────────
const SlidersArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-left: 4px;
  flex: 1;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const SliderLabel = styled.span`
  color: ${W.lcdDimGreen};
  font-size: 8px;
  font-family: 'Courier New', monospace;
  width: 10px;
  text-align: center;
  flex-shrink: 0;
`;

const RetroSlider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  flex: 1;
  height: 4px;
  background: ${W.lcdBg};
  border-top:    1px solid #080808;
  border-left:   1px solid #080808;
  border-right:  1px solid #404040;
  border-bottom: 1px solid #404040;
  cursor: pointer;
  min-width: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 14px;
    width: 8px;
    background: ${W.btnFace};
    border-top:    1px solid ${W.btnHi};
    border-left:   1px solid ${W.btnHi};
    border-right:  1px solid ${W.btnShadow};
    border-bottom: 1px solid ${W.btnShadow};
    cursor: pointer;
  }
  &::-moz-range-thumb {
    height: 14px;
    width: 8px;
    background: ${W.btnFace};
    border-top:    1px solid ${W.btnHi};
    border-left:   1px solid ${W.btnHi};
    border-right:  1px solid ${W.btnShadow};
    border-bottom: 1px solid ${W.btnShadow};
    cursor: pointer;
    border-radius: 0;
  }
`;

// ─────────────────────────────────────────
// TOGGLE BUTTONS (EQ, PL, SHF, REP)
// ─────────────────────────────────────────
const ToggleRow = styled.div`
  display: flex;
  gap: 2px;
  justify-content: flex-end;
`;

const ToggleBtn = styled.button<{ $on: boolean }>`
  background: ${p => p.$on ? W.lcdGreen : W.btnFace};
  ${bevelOut}
  color: ${p => p.$on ? '#000000' : '#909090'};
  font-size: 8px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.5px;
  height: 13px;
  padding: 0 5px;
  cursor: pointer;
  white-space: nowrap;

  &:active { ${bevelIn} }
`;

// Divider
const BodyDivider = styled.div`
  height: 1px;
  background: ${W.btnShadow};
  box-shadow: 0 1px 0 ${W.btnHi};
  margin: 0;
`;

// ─────────────────────────────────────────
// PLAYLIST PANEL
// ─────────────────────────────────────────
const PlaylistPanel = styled.div`
  width: 275px;
  background: ${W.body};
  ${bevelOut}
  border-top: none; /* snaps flush to player */
  padding: 3px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PlaylistBody = styled.div`
  background: ${W.plBg};
  ${lcdBevel}
  height: 108px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar { width: 12px; }
  &::-webkit-scrollbar-track { background: #111; border-left: 1px solid #080808; }
  &::-webkit-scrollbar-thumb {
    background: ${W.btnFace};
    ${bevelOut}
  }
`;

const PLItem = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 6px;
  background: ${p => p.$active ? W.plSelected : 'transparent'};
  color: ${p => p.$active ? W.plSelText : W.plText};
  font-size: 11px;
  font-family: 'Courier New', monospace;
  cursor: default;
  user-select: none;

  &:hover { background: ${p => p.$active ? W.plSelected : '#001800'}; }
  &:nth-child(even) { background: ${p => p.$active ? W.plSelected : W.plAlt}; }

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 8px;
  }
  span:last-child {
    color: ${p => p.$active ? '#A0A0FF' : W.lcdDimGreen};
    font-size: 10px;
    flex-shrink: 0;
  }
`;

const PLFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1px;
`;

const PLInfo = styled.span`
  color: ${W.lcdDimGreen};
  font-size: 9px;
  font-family: 'Courier New', monospace;
`;

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function Winamp({ onClose }: { onClose: () => void }) {
  const nodeRef  = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing,      setPlaying]      = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(0.8);
  const [balance,      setBalance]      = useState(0);    // –1 … 0 … +1
  const [showEQ,       setShowEQ]       = useState(false);
  const [showPL,       setShowPL]       = useState(true);
  const [shuffle,      setShuffle]      = useState(false);
  const [repeat,       setRepeat]       = useState(false);

  // ── balance panning via Web Audio (optional, degrades gracefully)
  // Simple implementation: just adjust left/right via stereo panner if available
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const pannerRef     = useRef<StereoPannerNode | null>(null);
  const sourceRef     = useRef<MediaElementAudioSourceNode | null>(null);

  const initAudioCtx = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const ctx    = new AudioContext();
      const panner = ctx.createStereoPanner();
      const src    = ctx.createMediaElementSource(audioRef.current);
      src.connect(panner).connect(ctx.destination);
      audioCtxRef.current = ctx;
      pannerRef.current   = panner;
      sourceRef.current   = src;
    } catch { /* not supported, ignore */ }
  }, []);

  // ── Playback helpers
  const play = useCallback(() => {
    initAudioCtx();
    audioRef.current?.play().catch(() => setPlaying(false));
    setPlaying(true);
  }, [initAudioCtx]);

  const pause = () => { audioRef.current?.pause(); setPlaying(false); };

  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setPlaying(false); setProgress(0);
  };

  const goTrack = useCallback((idx: number, autoPlay = true) => {
    setCurrentTrack(idx);
    setProgress(0);
    if (autoPlay) { setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true); }, 30); }
  }, []);

  const nextTrack = useCallback(() => {
    const next = shuffle
      ? Math.floor(Math.random() * PLAYLIST.length)
      : (currentTrack + 1) % PLAYLIST.length;
    goTrack(next);
  }, [currentTrack, shuffle, goTrack]);

  const prevTrack = () => {
    if (progress > 3) { if (audioRef.current) audioRef.current.currentTime = 0; return; }
    goTrack(currentTrack === 0 ? PLAYLIST.length - 1 : currentTrack - 1);
  };

  // ── Sync audio src on track change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // ── Volume / balance
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (pannerRef.current) pannerRef.current.pan.value = balance; }, [balance]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleEnded = () => {
    if (repeat) { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); } }
    else nextTrack();
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
    setProgress(audioRef.current.currentTime);
  };

  // ── Helpers
  const fmt = (s: number) => {
    if (isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  const seekPct   = duration ? (progress / duration) * 100 : 0;
  const totalTime = PLAYLIST.reduce((a, t) => {
    const [m, s] = t.duration.split(':').map(Number);
    return a + m * 60 + s;
  }, 0);
  const totalFmt  = `${Math.floor(totalTime / 60)}:${String(totalTime % 60).padStart(2, '0')}`;
  const track     = PLAYLIST[currentTrack];

  return (
    <>
      <GlobalStyle />

      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <Draggable nodeRef={nodeRef} handle=".winamp-drag" bounds="parent">
        <WinampRoot ref={nodeRef}>

          {/* ══════════════════════════════
              MAIN PLAYER PANEL
          ══════════════════════════════ */}
          <MainPanel>

            {/* Title bar */}
            <TitleBar className="winamp-drag">
              <TitleText>WINAMP</TitleText>
              <TitleButtons>
                <TitleBtn title="Options">O</TitleBtn>
                <TitleBtn title="Always on Top">A</TitleBtn>
                <TitleBtn $close onClick={onClose} title="Close">×</TitleBtn>
              </TitleButtons>
            </TitleBar>

            {/* LCD Screen */}
            <LCD>
              {/* Track number (top-left overlay) */}
              <TrackNum>#{String(currentTrack + 1).padStart(2, '0')}</TrackNum>

              <LCDTopRow>
                {/* Big time display */}
                <TimeDisplay>{fmt(progress)}</TimeDisplay>

                {/* Spectrum analyser */}
                <SpectrumWrap>
                  {BARS.map((b, i) => (
                    <SpecBar
                      key={i}
                      $active={playing}
                      $min={b.min}
                      $max={b.max}
                      $delay={b.delay}
                    />
                  ))}
                </SpectrumWrap>
              </LCDTopRow>

              {/* Scrolling track title */}
              <MarqueeWrap>
                <MarqueeText $playing={playing}>
                  {playing
                    ? `${currentTrack + 1}. ${track.title}  ●  ${track.duration}  ★ ★ ★`
                    : `${currentTrack + 1}. ${track.title}`}
                </MarqueeText>
              </MarqueeWrap>

              {/* Bit-rate row */}
              <LCDBitRow>
                <LCDBitActive>192</LCDBitActive>
                <LCDBit>kbps</LCDBit>
                <LCDBitActive>44</LCDBitActive>
                <LCDBit>kHz</LCDBit>
                <LCDStereo $stereo>
                  <StereoBlock $active>STEREO</StereoBlock>
                </LCDStereo>
              </LCDBitRow>
            </LCD>

            {/* Seek bar */}
            <SeekWrap onClick={handleSeekClick} title={`${fmt(progress)} / ${fmt(duration)}`}>
              <SeekFill $pct={seekPct} />
              <SeekThumb $pct={seekPct} />
            </SeekWrap>

            <BodyDivider />

            {/* Media controls + sliders */}
            <ControlsRow>
              <MBtn onClick={prevTrack}      title="Previous">⏮</MBtn>
              <MBtnWide onClick={playing ? pause : play} title={playing ? 'Pause' : 'Play'}>
                {playing ? '⏸' : '▶'}
              </MBtnWide>
              <MBtn onClick={stop}           title="Stop">⏹</MBtn>
              <MBtn onClick={nextTrack}      title="Next">⏭</MBtn>
              <MBtn title="Eject" style={{ marginLeft: 2 }}>⏏</MBtn>

              {/* Volume + Balance */}
              <SlidersArea>
                <SliderRow>
                  <SliderLabel>V</SliderLabel>
                  <RetroSlider
                    type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    title={`Volume: ${Math.round(volume * 100)}%`}
                  />
                </SliderRow>
                <SliderRow>
                  <SliderLabel>B</SliderLabel>
                  <RetroSlider
                    type="range" min={-1} max={1} step={0.01} value={balance}
                    onChange={e => setBalance(Number(e.target.value))}
                    title={`Balance: ${balance > 0 ? '+' : ''}${Math.round(balance * 100)}`}
                  />
                </SliderRow>
              </SlidersArea>
            </ControlsRow>

            <BodyDivider />

            {/* EQ / PL / SHF / REP */}
            <ToggleRow>
              <ToggleBtn $on={showEQ} onClick={() => setShowEQ(!showEQ)} title="Equalizer">EQ</ToggleBtn>
              <ToggleBtn $on={showPL} onClick={() => setShowPL(!showPL)} title="Playlist">PL</ToggleBtn>
              <div style={{ flex: 1 }} />
              <ToggleBtn $on={shuffle} onClick={() => setShuffle(!shuffle)} title="Shuffle">SHF</ToggleBtn>
              <ToggleBtn $on={repeat}  onClick={() => setRepeat(!repeat)}  title="Repeat">REP</ToggleBtn>
            </ToggleRow>

          </MainPanel>

          {/* ══════════════════════════════
              PLAYLIST PANEL
          ══════════════════════════════ */}
          {showPL && (
            <PlaylistPanel>
              <TitleBar className="winamp-drag" style={{ cursor: 'inherit' }}>
                <TitleText>WINAMP PLAYLIST</TitleText>
                <TinyButton onClick={() => setShowPL(false)}>×</TinyButton>
              </TitleBar>

              <PlaylistBody>
                {PLAYLIST.map((t, i) => (
                  <PLItem
                    key={t.id}
                    $active={currentTrack === i}
                    onDoubleClick={() => goTrack(i)}
                    title={`Double-click to play: ${t.title}`}
                  >
                    <span>{i + 1}. {t.title}</span>
                    <span>{t.duration}</span>
                  </PLItem>
                ))}
              </PlaylistBody>

              <PLFooter>
                <PLInfo>{PLAYLIST.length} tracks | {totalFmt} total</PLInfo>
                <PLInfo>
                  {shuffle ? 'SHF ' : ''}{repeat ? 'REP' : ''}
                  {!shuffle && !repeat ? 'NORMAL' : ''}
                </PLInfo>
              </PLFooter>
            </PlaylistPanel>
          )}

        </WinampRoot>
      </Draggable>
    </>
  );
}

// Tiny button reused in playlist title bar (matches TitleBtn style)
const TinyButton = styled.button`
  background: #2f2f2f;
  border-top:    1px solid #484848;
  border-left:   1px solid #484848;
  border-right:  1px solid #141414;
  border-bottom: 1px solid #141414;
  color: #C0C0C0;
  font-size: 8px;
  height: 9px;
  width: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-family: 'Arial', sans-serif;
  &:active {
    border-top:    1px solid #141414;
    border-left:   1px solid #141414;
    border-right:  1px solid #484848;
    border-bottom: 1px solid #484848;
  }
`;